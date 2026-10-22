import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { auditFile, getChangedFiles } from './check-pr-review.mjs';

/**
 * A real-world large base64 data URI can contain a coincidental "AKIA..." or
 * "secret=..." shaped substring by chance alone - measured on
 * public/ops/index.html:739 (a 404,704-character embedded image line, flagged
 * as a HIGH security finding on job 108260534879, traced to a chance
 * "akiAZLgbLDZsKM4ZJy12" 20-character run inside the base64 payload). This
 * pins the fix both ways: the data URI must not fire, and a real secret
 * shape - including one sitting right next to a data URI on the same line -
 * still must.
 */

let dir: string;

function writeAndAudit(content: string) {
  // NOT "...-test-": isTestFile() excludes any path containing "-test", which
  // would silently short-circuit every fixture here to [] regardless of
  // content - caught by this test suite itself on the first run.
  dir = mkdtempSync(path.join(tmpdir(), 'check-pr-review-fixtures-'));
  const file = path.join(dir, 'fixture.ts');
  writeFileSync(file, content);
  return auditFile(file);
}

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
});

describe('auditFile - base64 data URI false positive', () => {
  it('does not flag a base64 PNG data URI containing a coincidental AKIA-shaped run', () => {
    // The exact fragment from public/ops/index.html:739 that triggered the
    // false positive - real base64 output, not synthesized - so this test
    // would have failed under the pre-fix regex (verified: it does) rather
    // than asserting something that was never at risk.
    const blob = 'L7r+Nkgk/EzgZ9x3SCbLakiAZLgbLDZsKM4ZJy124123KKM1xpz7fbFmLXCq';
    const line = `var IMG = {"badge":"data:image/png;base64,${blob}"};`;
    expect(writeAndAudit(line)).toEqual([]);
  });

  it('still flags a real hardcoded secret shape', () => {
    // A generic assignment shape (api_key = "...20+ chars...") rather than a
    // real vendor prefix like sk_live_ - GitHub's own push protection blocks
    // a commit containing a Stripe-key-shaped string outright, secret or not,
    // which caught an earlier draft of this fixture before it ever reached CI.
    const line = `const apiKey = "${'z'.repeat(24)}";`;
    const findings = writeAndAudit(line);
    expect(findings).toHaveLength(1);
    expect(findings[0].category).toBe('security');
  });

  it('still flags a real secret on the same line as an unrelated data URI', () => {
    const blob = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAAEsCAIAAAByvKklAAAA'.repeat(500);
    const line = `var x = "data:image/png;base64,${blob}"; const secret = "${'a'.repeat(24)}";`;
    const findings = writeAndAudit(line);
    expect(findings).toHaveLength(1);
    expect(findings[0].category).toBe('security');
  });

  it('still flags a NEXT_PUBLIC secret assignment next to a data URI', () => {
    const blob = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAAEsCAIAAAByvKklAAAA'.repeat(500);
    const line = `var x = "data:image/png;base64,${blob}"; NEXT_PUBLIC_API_SECRET="${'b'.repeat(24)}"`;
    const findings = writeAndAudit(line);
    expect(findings.some((f) => f.msg.includes('NEXT_PUBLIC'))).toBe(true);
  });
});

/**
 * The raw-SQL rule. Until 2026-10-12 its method list held `$queryRaw` and
 * `$executeRawUnsafe` only, so `$queryRawUnsafe(` and `$executeRaw(` passed.
 * PR 431 found the first gap; its fix dropped `$queryRaw(` in exchange, which
 * is why every spelling is pinned here, the old ones included.
 */
describe('auditFile - raw SQL with an interpolated value', () => {
  const sqlFindings = (line: string) =>
    writeAndAudit(line + '\n').filter((f: { category: string }) => f.category === 'database');

  const flagged = [
    'db.query(`select * from artists where id = ${id}`)',
    'db.execute(`delete from artists where id = ${id}`)',
    'prisma.$queryRaw(`select * from artists where id = ${id}`)',
    'prisma.$queryRawUnsafe(`select * from artists where id = ${id}`)',
    'prisma.$executeRaw(`delete from artists where id = ${id}`)',
    'prisma.$executeRawUnsafe(`delete from artists where id = ${id}`)',
  ];
  for (const line of flagged) {
    it(`flags ${line.slice(0, line.indexOf('('))}( with a value in the template`, () => {
      expect(sqlFindings(line)).toHaveLength(1);
    });
  }

  it('leaves a static query alone', () => {
    expect(sqlFindings('db.query(`select * from artists`)')).toEqual([]);
  });

  it('leaves a placeholder query alone', () => {
    expect(sqlFindings('db.query(`select * from artists where id = $1`, [id])')).toEqual([]);
  });

  it('leaves the parameterised tagged-template form alone', () => {
    expect(sqlFindings('prisma.$queryRaw`select * from artists where id = ${id}`')).toEqual([]);
  });
});

/**
 * getChangedFiles() range coverage.
 *
 * This is the fix from PR #311 (silent PASS on a shallow clone, and only the
 * last commit of a multi-commit PR audited), shipped with zero test coverage
 * of its own - the suite above only exercises auditFile's secret patterns.
 * Flagged by Dotfiles (#313 review) with a mutation check: neutralise every
 * UNKNOWN path back to silent PASS, and swap origin/main back to HEAD~1 - if
 * the suite doesn't move, it's decoration. These three cases are built to
 * move under both mutations, against real constructed git repositories
 * rather than mocks, because the bug lived in git's own shallow-fetch and
 * revision-range behaviour, not in this script's control flow.
 */

let gitDirs: string[] = [];

function git(cwd: string, args: string[]) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) {
    throw new Error(`git ${args.join(' ')} in ${cwd} failed: ${r.stderr}`);
  }
  return r.stdout;
}

function gitInitCommit(cwd: string, files: Record<string, string>, message: string) {
  for (const [rel, content] of Object.entries(files)) {
    writeFileSync(path.join(cwd, rel), content);
  }
  git(cwd, ['add', '-A']);
  // Not an email-shaped string on purpose - this file is in a public repo,
  // and decision 0006's guard (src/content/no-emails.test.ts) flags any
  // literal that matches one, fixture or not.
  git(cwd, ['-c', 'user.email=cpr-test-committer', '-c', 'user.name=t', 'commit', '-q', '-m', message]);
}

/** A real "origin" repo plus a full clone of it, so origin/main exists locally. */
function makeOriginAndClone() {
  const origin = mkdtempSync(path.join(tmpdir(), 'cpr-origin-'));
  const clone = mkdtempSync(path.join(tmpdir(), 'cpr-clone-'));
  gitDirs.push(origin, clone);
  git(origin, ['init', '-q', '-b', 'main']);
  gitInitCommit(origin, { 'base.txt': 'base\n' }, 'initial');
  git(clone, ['clone', '-q', origin, '.']);
  return { origin, clone };
}

afterEach(() => {
  for (const d of gitDirs) rmSync(d, { recursive: true, force: true });
  gitDirs = [];
});

describe('getChangedFiles - range computation', () => {
  it('reports UNKNOWN (determinable: false), never a silent empty PASS, when origin/main cannot be reached even after a fetch', () => {
    const { clone } = makeOriginAndClone();
    // Simulate a shallow clone whose origin/main ref was never fetched, with
    // the remote itself unreachable - the exact shape that used to fall
    // through to an empty file list and print PASS.
    git(clone, ['update-ref', '-d', 'refs/remotes/origin/main']);
    git(clone, ['remote', 'set-url', 'origin', '/nonexistent-path-does-not-exist']);

    const result = getChangedFiles(clone);
    expect(result.determinable).toBe(false);
    expect(result.files).toBeNull();
  });

  it('audits every commit on a multi-commit branch, not just the last', () => {
    const { clone } = makeOriginAndClone();
    git(clone, ['checkout', '-q', '-b', 'feature']);
    gitInitCommit(clone, { 'first.ts': 'first\n' }, 'commit 1');
    gitInitCommit(clone, { 'second.ts': 'second\n' }, 'commit 2');

    const result = getChangedFiles(clone);
    expect(result.determinable).toBe(true);
    expect(result.files?.sort()).toEqual(['first.ts', 'second.ts']);
  });

  it('still surfaces a file whose only change is in the EARLIEST commit of a branch - the exact case the old HEAD~1 range missed', () => {
    const { clone } = makeOriginAndClone();
    git(clone, ['checkout', '-q', '-b', 'feature']);
    // The secret-carrying file lands in the FIRST commit; a second, unrelated
    // commit follows on top of it. The pre-#311 range (HEAD~1...HEAD, or just
    // HEAD~1 on a shallow clone) only ever compared the last commit against
    // its immediate parent, so planted.ts here would never have appeared.
    gitInitCommit(clone, { 'planted.ts': `const apiKey = "${'z'.repeat(24)}";\n` }, 'commit 1: the planted secret');
    gitInitCommit(clone, { 'unrelated.ts': 'unrelated\n' }, 'commit 2: unrelated, on top');

    const result = getChangedFiles(clone);
    expect(result.determinable).toBe(true);
    expect(result.files).toContain('planted.ts');

    // And the file that reaches the audit is still flagged - closing the
    // loop from "the range found it" to "the gate would have failed on it".
    const findings = auditFile(path.join(clone, 'planted.ts'));
    expect(findings).toHaveLength(1);
  });

  it('self-heals via fetch when origin/main is missing locally but the remote is reachable', () => {
    const { origin, clone } = makeOriginAndClone();
    git(clone, ['update-ref', '-d', 'refs/remotes/origin/main']);
    // origin/main is gone locally, but the remote URL (a real local path) is
    // still reachable, so the fetch this function attempts should succeed.
    void origin;

    const result = getChangedFiles(clone);
    expect(result.determinable).toBe(true);
    expect(result.files).toEqual([]);
  });
});

/**
 * Card 10407: three gaps in the review gate, one block per class. Each case
 * fails against main's copy of check-pr-review.mjs (run it with that file in
 * place to see the red side).
 */
describe('card 10407 - a query built in a variable', () => {
  const dbFindings = (src: string) =>
    writeAndAudit(src + '\n').filter((f: { category: string }) => f.category === 'database');

  it('flags $queryRawUnsafe called with a variable', () => {
    expect(dbFindings('const sql = `SELECT * FROM t WHERE id = ${id}`;\nawait db.$queryRawUnsafe(sql);')).toHaveLength(1);
  });

  it('flags $executeRawUnsafe called with a variable', () => {
    expect(dbFindings('await db.$executeRawUnsafe(stmt, id);')).toHaveLength(1);
  });

  it('leaves $queryRawUnsafe with a plain string literal alone', () => {
    expect(dbFindings("await db.$queryRawUnsafe('SELECT 1');")).toEqual([]);
  });

  // evaluator-b2 on #480 (comment 6332987525): the first version missed these.
  it('flags $queryRawUnsafe called with a concatenation', () => {
    expect(dbFindings('await db.$queryRawUnsafe("select " + x);')).toHaveLength(1);
  });

  it('flags sql.unsafe with an interpolated template', () => {
    expect(dbFindings('await sql.unsafe(`select * from t where id = ${x}`);')).toHaveLength(1);
  });

  it('flags sql.unsafe with a variable', () => {
    expect(dbFindings('await sql.unsafe(q);')).toHaveLength(1);
  });

  it('leaves sql.unsafe with a plain literal alone, and a literal with params', () => {
    expect(dbFindings("await sql.unsafe('select 1');")).toEqual([]);
    expect(dbFindings("await db.$queryRawUnsafe('SELECT * FROM t WHERE id = $1', id);")).toEqual([]);
  });

  it('leaves the parameterised .query(sql, values) form alone, and names that limit', async () => {
    expect(dbFindings('await pool.query(sql, [id]);')).toEqual([]);
    const mod = await import('./check-pr-review.mjs');
    expect(String((mod as { RAW_SQL_LIMIT?: string }).RAW_SQL_LIMIT ?? '')).toMatch(/variable/);
  });
});

describe('card 10407 - the gate run through a symlinked path', () => {
  it('counts a symlink to the script as the entrypoint', async () => {
    const mod = await import('./check-pr-review.mjs');
    const isEntrypoint = (mod as { isEntrypoint?: (u: string, a: string) => boolean }).isEntrypoint;
    expect(typeof isEntrypoint).toBe('function');
    dir = mkdtempSync(path.join(tmpdir(), 'check-pr-review-fixtures-'));
    const real = path.resolve('scripts/check-pr-review.mjs');
    const link = path.join(dir, 'gate.mjs');
    symlinkSync(real, link);
    expect(isEntrypoint!(pathToFileURL(real).href, link)).toBe(true);
    expect(isEntrypoint!(pathToFileURL(real).href, path.join(dir, 'other.mjs'))).toBe(false);
  });

  it('exits non-zero on a planted secret when run through a symlink, not 0 having checked nothing', () => {
    const { clone } = makeOriginAndClone();
    git(clone, ['checkout', '-q', '-b', 'feature']);
    gitInitCommit(clone, { 'planted.ts': `const apiKey = "${'z'.repeat(24)}";\n` }, 'plant');
    const link = path.join(clone, 'gate-link.mjs');
    symlinkSync(path.resolve('scripts/check-pr-review.mjs'), link);
    const r = spawnSync(process.execPath, [link], {
      cwd: clone,
      encoding: 'utf8',
      env: { ...process.env, HOME: clone, PATH: path.dirname(process.execPath) + ':/usr/bin:/bin' },
    });
    expect(r.stdout).toMatch(/OVERALL VERDICT: FAIL/);
    expect(r.status).toBe(1);
  });
});

describe('card 10407 - files the gate used to skip', () => {
  it('scans a test-named file for secrets', () => {
    dir = mkdtempSync(path.join(tmpdir(), 'check-pr-review-fixtures-'));
    const f = path.join(dir, 'leak.test.ts');
    writeFileSync(f, `const apiKey = "${'q'.repeat(24)}";\n`);
    const found = auditFile(f);
    expect(found).toHaveLength(1);
    expect(found[0].category).toBe('security');
  });

  it('does not run the database rule on a test-named file', () => {
    dir = mkdtempSync(path.join(tmpdir(), 'check-pr-review-fixtures-'));
    const f = path.join(dir, 'sql.test.ts');
    writeFileSync(f, 'await db.query(`SELECT ${id}`);\n');
    expect(auditFile(f)).toEqual([]);
  });

  it('returns a changed path with an unusual name exactly as stored, so it is audited', () => {
    const { clone } = makeOriginAndClone();
    git(clone, ['checkout', '-q', '-b', 'feature']);
    const odd = 'café "q".ts';
    gitInitCommit(clone, { [odd]: `const apiKey = "${'w'.repeat(24)}";\n` }, 'odd name');
    const result = getChangedFiles(clone);
    expect(result.files).toContain(odd);
  });

  it('does not follow a symlink out of the tree', async () => {
    const mod = await import('./check-pr-review.mjs');
    const symlinkOutside = (mod as { symlinkOutside?: (p: string, r: string) => boolean }).symlinkOutside;
    expect(typeof symlinkOutside).toBe('function');
    const outside = mkdtempSync(path.join(tmpdir(), 'check-pr-review-fixtures-'));
    writeFileSync(path.join(outside, 'elsewhere.ts'), `const apiKey = "${'v'.repeat(24)}";\n`);
    dir = mkdtempSync(path.join(tmpdir(), 'check-pr-review-fixtures-'));
    const link = path.join(dir, 'link.ts');
    symlinkSync(path.join(outside, 'elsewhere.ts'), link);
    expect(symlinkOutside!(link, dir)).toBe(true);
    expect(auditFile(link, dir)).toEqual([]);
    const inside = path.join(dir, 'inside.ts');
    writeFileSync(inside, `const apiKey = "${'u'.repeat(24)}";\n`);
    const link2 = path.join(dir, 'link2.ts');
    symlinkSync(inside, link2);
    expect(symlinkOutside!(link2, dir)).toBe(false);
    expect(auditFile(link2, dir)).toHaveLength(1);
    rmSync(outside, { recursive: true, force: true });
  });
});
