#!/usr/bin/env node
/**
 * check-pr-review.mjs - Standing PR gate for security-reviewer and database-reviewer.
 *
 * WHY THIS EXISTS
 * AGENTS.md Rule 9 requires an adversarial red control on every PR review; Rule 7c
 * requires an approval to carry a pinned head SHA. In zaostock, live artist claim
 * tokens, backstage authentication endpoints, Supabase Row Level Security, and
 * Stripe payment sessions are sensitive to drift. Leaving reviews to manual memory
 * creates regressions.
 *
 * WHAT IT CHECKS
 * - Security: secrets and credentials in source files or NEXT_PUBLIC_* variables,
 *   server secrets in client components, sensitive credential logging
 * - Database: SQL injection via raw template strings, service-role key usage
 *   in client components, unindexed foreign keys in SQL migrations
 *
 * HOW IT RUNS
 * 1. If zao-review-gate is available on PATH or in ~/bin, delegates to it for the
 *    full cross-repo audit and pinned verdict output.
 * 2. Otherwise (e.g. on clean CI runners), runs the built-in Node security and
 *    database pattern audit against changed files or working tree.
 */

import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const RE_HARDCODED_SECRET = /(?:sk_live_[0-9a-zA-Z]{16,}|ghp_[0-9a-zA-Z]{20,}|AKIA[0-9A-Z]{16}|(?:api_key|apikey|secret|private_key|auth_token)\s*[:=]\s*["'][0-9a-zA-Z_\-]{20,}["'])/i;
// A base64 data URI is a known false-positive class for the patterns above: a
// large enough random-looking blob (an embedded image easily runs past
// 100,000 characters) will contain a coincidental "AKIA..." or "secret=..."
// shaped substring by chance alone. Strip the payload before either secret
// check runs, so the blob itself is never what a match is found inside.
const RE_DATA_URI_BASE64 = /data:[^;,'"]+;base64,[A-Za-z0-9+/=]+/g;
const PAT_PUBLIC_SECRET = /(?<![A-Za-z0-9_])NEXT_PUBLIC_(?:[A-Za-z0-9_]*(?:SECRET|PRIVATE_KEY|TOKEN)|GEMINI_API_KEY|PINATA_JWT)\s*=\s*["'][^"']+/;
// A value interpolated into a template string that is then passed, in
// parentheses, to a raw query call. Both Prisma spellings of each method are
// listed: with only `$queryRaw` in the list, `$queryRawUnsafe(` matched the
// prefix and then failed on the leftover "Unsafe", so the method most likely
// to carry an injection was the one the rule could not see. `$executeRaw(` was
// missing the same way round.
//
// The opening parenthesis stays required on purpose. The tagged-template form,
// db.$queryRaw`... ${id}` with no parenthesis, is the parameterised one: the
// driver receives the values separately. Flagging it would push people from
// the safe spelling to the unsafe one.
const RE_RAW_SQL = /\.(?:query|execute|\$queryRaw(?:Unsafe)?|\$executeRaw(?:Unsafe)?)\s*\(\s*`[^`]*\$\{/;
// The rule above reads one line, so a query string built in a variable and then
// passed to the call is invisible to it (card 10407). The unsafe-by-name calls,
// Prisma's $queryRawUnsafe / $executeRawUnsafe and postgres.js's sql.unsafe,
// take the SQL as a plain string, so any first argument that is not ONE plain
// literal is flagged: a variable, a concatenation ("select " + x), or a
// template with ${...} (evaluator-b2 on #480, comment 6332987525, found the
// first version missed the last two). A lone literal with no interpolation,
// followed by "," or ")", is left alone. For .query() and .execute() a
// variable argument is the normal parameterised form (sql plus a values
// array), so it is not flagged; the gate prints that limit instead.
const RE_UNSAFE_CALL = /(?:\.\$(?:queryRaw|executeRaw)Unsafe|\bsql\.unsafe)\s*\(/;
const RE_UNSAFE_LITERAL_ONLY =
  /(?:\.\$(?:queryRaw|executeRaw)Unsafe|\bsql\.unsafe)\s*\(\s*(?:'[^']*'|"[^"]*"|`[^`$]*`)\s*[,)]/;
export const RAW_SQL_LIMIT =
  "the raw-SQL rule reads one line at a time: a query built in a variable and passed to .query() or .execute() is not traced ($queryRawUnsafe, $executeRawUnsafe and sql.unsafe are flagged for anything but one plain literal)";
const RE_SERVICE_ROLE_CLIENT = /(?:SUPABASE_SERVICE_ROLE_KEY|createAdminClient)/;
const RE_SENSITIVE_LOG = /console\.(?:log|debug|info|warn|error)\s*\([^)]*\b(?:password|secret|privateKey|secretKey|claimToken|adminKey)\b[^)]*\)/;

function isTestFile(path) {
  const p = path.toLowerCase();
  return (
    p.includes("/__tests__/") ||
    p.endsWith(".test.ts") ||
    p.endsWith(".test.js") ||
    p.endsWith(".spec.ts") ||
    p.endsWith(".spec.js") ||
    p.includes("/tests/") ||
    p.includes("-test")
  );
}

function findZaoReviewGate() {
  const homeBin = join(homedir(), "bin", "zao-review-gate");
  if (existsSync(homeBin)) return homeBin;

  const which = spawnSync("which", ["zao-review-gate"], { encoding: "utf8" });
  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim();
  }
  return null;
}

// The diff is read with -z (card 10407): without it git quotes a path holding a
// space-adjacent oddity, a non-ASCII byte or a quote ("caf\303\251.ts"), and the
// quoted string names no file on disk, so existsSync() failed and the file was
// skipped as if clean. NUL-separated output is the path exactly as stored.
function splitFiles(stdout) {
  return stdout.split("\0").filter((f) => f.length > 0);
}

// Returns { files, determinable }. determinable=false means the range could
// not be computed (e.g. a shallow clone with no origin/main ref) - the caller
// must treat that as UNKNOWN, never as "zero changed files". `cwd` defaults
// to the real process cwd in production; a test passes a scratch repo's path
// so this can run against a constructed git history instead of this repo.
export function getChangedFiles(cwd = process.cwd()) {
  const git = (args) => spawnSync("git", args, { encoding: "utf8", cwd });

  const rDirty = git(["diff", "-z", "--name-only", "HEAD"]);
  if (rDirty.status === 0 && rDirty.stdout.length > 0) {
    return { files: splitFiles(rDirty.stdout), determinable: true };
  }

  let hasMainRef = git(["rev-parse", "--verify", "-q", "origin/main"]).status === 0;
  if (!hasMainRef) {
    git(["fetch", "origin", "main", "--depth=1"]);
    hasMainRef = git(["rev-parse", "--verify", "-q", "origin/main"]).status === 0;
  }
  if (!hasMainRef) {
    return { files: null, determinable: false };
  }

  // Two-dot form: a direct tree comparison between origin/main and HEAD, not
  // merge-base arithmetic - it needs both commits present, not shared
  // ancestry, so it still works when either side is a shallow, depth=1 fetch.
  const rRange = git(["diff", "-z", "--name-only", "origin/main", "HEAD"]);
  if (rRange.status !== 0) {
    return { files: null, determinable: false };
  }
  return { files: splitFiles(rRange.stdout), determinable: true };
}

function getHeadSha() {
  const r = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : "UNKNOWN_HEAD";
}

// True when relPath is a symlink whose target resolves outside root. Such a link
// is never read: following it would audit, and print lines from, a file that is
// not part of the change (card 10407). A link inside the tree is audited as the
// file it points at.
export function symlinkOutside(relPath, root = process.cwd()) {
  try {
    if (!lstatSync(relPath).isSymbolicLink()) return false;
    const target = realpathSync(relPath);
    const rel = relative(realpathSync(root), target);
    return rel.startsWith("..") || isAbsolute(rel);
  } catch {
    return false;
  }
}

export function auditFile(relPath, root = process.cwd()) {
  // The gate's own files hold its patterns and its deliberate secret-shaped
  // fixtures, so they are exempt by exact name, and nothing else is.
  if (relPath.endsWith("check-pr-review.mjs") || relPath.endsWith("check-pr-review.test.ts") ||
      relPath.endsWith("zao-review-gate")) {
    return [];
  }
  // A test-named file used to be skipped outright, so a real key pasted into a
  // fixture went through unread (card 10407). It is now scanned for secrets;
  // only the database and client rules, which fire on test code by design, are
  // left out for it.
  const testNamed = isTestFile(relPath);
  const findings = [];
  if (!existsSync(relPath)) return findings;
  if (symlinkOutside(relPath, root)) return findings;

  let content = "";
  try {
    content = readFileSync(relPath, "utf8");
  } catch {
    return findings;
  }

  const isClient = content.slice(0, 500).includes('"use client"') || content.slice(0, 500).includes("'use client'");
  const isScanner = relPath.endsWith("check-pr-review.mjs") || relPath.endsWith("zao-review-gate");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (isScanner && (line.includes("const ") || line.includes("PAT_") || line.includes("RE_"))) {
      continue;
    }

    const lineForSecretCheck = line.replace(RE_DATA_URI_BASE64, "data:<omitted>;base64,<omitted>");

    if (PAT_PUBLIC_SECRET.test(lineForSecretCheck)) {
      findings.push({ category: "security", line: lineNum, msg: "Secret assigned to NEXT_PUBLIC variable" });
    }
    const secMatch = lineForSecretCheck.match(RE_HARDCODED_SECRET);
    if (secMatch) {
      const token = secMatch[0].toLowerCase();
      if (!["dummy", "fake", "example", "xxx", "placeholder", "test"].some((ign) => token.includes(ign))) {
        findings.push({ category: "security", line: lineNum, msg: "Potential hardcoded secret or API key" });
      }
    }
    if (testNamed) continue;

    if (RE_SENSITIVE_LOG.test(line)) {
      findings.push({ category: "security", line: lineNum, msg: "Sensitive credential logged to console" });
    }

    if (RE_RAW_SQL.test(line)) {
      findings.push({ category: "database", line: lineNum, msg: "SQL injection risk via raw template interpolation" });
    } else if (RE_UNSAFE_CALL.test(line) && !RE_UNSAFE_LITERAL_ONLY.test(line)) {
      findings.push({ category: "database", line: lineNum, msg: "Unsafe raw query called with a non-literal argument; check how it is built" });
    }

    if (isClient && RE_SERVICE_ROLE_CLIENT.test(line)) {
      findings.push({ category: "database", line: lineNum, msg: "Service role key referenced in client component" });
    }
  }

  return findings;
}

function main() {
  const gateBin = findZaoReviewGate();
  if (gateBin) {
    const res = spawnSync(gateBin, process.argv.slice(2), { stdio: "inherit" });
    process.exit(res.status ?? 0);
  }

  const headSha = getHeadSha();
  const { files: changedFiles, determinable } = getChangedFiles();

  console.log(`[check-pr-review] target @ HEAD ${headSha}`);

  if (!determinable) {
    console.log("  UNKNOWN: could not determine the changed-file range (origin/main unreachable, even after a fetch)");
    console.log("\nOVERALL VERDICT: UNKNOWN");
    process.exit(2);
  }

  if (changedFiles.length === 0) {
    console.log("  no changed files versus origin/main - working tree matches base");
    console.log("  OVERALL VERDICT: PASS");
    process.exit(0);
  }

  console.log(`Auditing ${changedFiles.length} file(s) for security and database patterns:`);
  let hasFailures = false;

  console.log(`  LIMIT: ${RAW_SQL_LIMIT}`);
  for (const f of changedFiles) {
    if (symlinkOutside(f)) {
      console.log(`  NOTE: ${f} is a symlink to a path outside the repository; not followed`);
      continue;
    }
    const issues = auditFile(f);
    if (issues.length > 0) {
      hasFailures = true;
      for (const issue of issues) {
        console.log(`  FAIL [${issue.category.toUpperCase()}] ${f}:${issue.line} - ${issue.msg}`);
      }
    }
  }

  if (hasFailures) {
    console.log("\nOVERALL VERDICT: FAIL");
    console.log("REFUSED: security or database issues detected. Resolve before merge.");
    process.exit(1);
  } else {
    console.log("  Security Review: PASS (clean)");
    console.log("  Database Review: PASS (clean)");
    console.log("\nOVERALL VERDICT: PASS");
    process.exit(0);
  }
}

// Guarded so a test can `import { auditFile } from "./check-pr-review.mjs"`
// without running the whole gate (git calls, process.exit) as an import side
// effect - main() only fires when this file is the process entrypoint.
// Both sides go through realpath (card 10407). With resolve() alone, running the
// gate through a symlinked path compared the link's path with the real one, they
// differed, main() never ran, and node exited 0 having checked nothing.
export function isEntrypoint(moduleUrl, argv1) {
  if (!argv1) return false;
  const real = (p) => {
    try {
      return realpathSync(p);
    } catch {
      return resolve(p);
    }
  };
  return real(fileURLToPath(moduleUrl)) === real(argv1);
}

if (isEntrypoint(import.meta.url, process.argv[1])) {
  main();
}
