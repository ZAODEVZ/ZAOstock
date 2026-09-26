import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
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
