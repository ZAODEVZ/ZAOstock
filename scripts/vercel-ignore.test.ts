// @vitest-environment node
// Tests for scripts/vercel-ignore.sh. The harness (throwaway git repos, the
// real script run with spawnSync) is adapted from bettercallzaal/zao-app
// scripts/__tests__/vercel-ignore.test.ts (MIT, Zaal Panthaki / The ZAO).
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/vercel-ignore.sh');
// Isolate from the machine's git config and hooks so the test is deterministic.
// NODE_ENV is set because this repo's types make it required in a spawn env.
const GIT_ENV = { GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', NODE_ENV: 'test' as const };

function git(cwd: string, ...args: string[]): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: { PATH: process.env.PATH ?? '', ...GIT_ENV },
  }).trim();
}

function write(cwd: string, path: string, body: string): void {
  mkdirSync(dirname(join(cwd, path)), { recursive: true });
  writeFileSync(join(cwd, path), body);
}

/**
 * A repo shaped like this one: app source, a docs file the app reads at
 * runtime (as src/lib/press-kit.ts does), and a docs file nothing reads.
 * One base commit, then one commit touching `paths`.
 */
function repoWithChange(paths: string[]): { cwd: string; base: string } {
  const cwd = mkdtempSync(join(tmpdir(), 'vercel-ignore-zaostock-'));
  git(cwd, 'init', '-q');
  git(cwd, 'config', 'user.email', 'test@example.invalid');
  git(cwd, 'config', 'user.name', 'test');
  write(cwd, 'src/app/page.tsx', 'export default 1;\n');
  write(
    cwd,
    'src/lib/press-kit.ts',
    "export const P = path.join(process.cwd(), 'docs', 'marketing', 'press-kit.md');\n",
  );
  write(cwd, 'src/lib/press-kit.test.ts', "const X = 'docs/plans/run-sheet.md';\n");
  write(cwd, 'docs/marketing/press-kit.md', '# kit\n');
  write(cwd, 'docs/plans/run-sheet.md', '# sheet\n');
  write(cwd, 'README.md', '# app\n');
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-qm', 'base');
  const base = git(cwd, 'rev-parse', 'HEAD');
  for (const p of paths) write(cwd, p, `changed ${p}\n`);
  git(cwd, 'add', '-A');
  git(cwd, 'commit', '-qm', 'change');
  return { cwd, base };
}

/** Runs the real script; exit 0 = SKIP, 1 = BUILD. */
function decide(cwd: string, env: Record<string, string>): { code: number | null; log: string } {
  const r = spawnSync('bash', [SCRIPT], {
    cwd,
    encoding: 'utf8',
    env: { PATH: process.env.PATH ?? '', ...GIT_ENV, ...env },
  });
  return { code: r.status, log: `${r.stdout}${r.stderr}` };
}

describe('scripts/vercel-ignore.sh', { timeout: 30_000 }, () => {
  it.each([
    ['docs only', ['README.md', 'docs/plans/run-sheet.md']],
    ['agent notes', ['.handoffs/x/README.md', '.agents/notes.txt', 'agents/brief.txt']],
    ['a test file, even one naming a docs path', ['src/lib/press-kit.test.ts']],
    ['a co-located __tests__ file', ['src/app/api/x/__tests__/route.ts']],
    ['e2e and test configs', ['e2e/home.spec.ts', 'playwright.config.ts', 'vitest.config.mts']],
    ['CI config', ['.github/workflows/ci.yml']],
  ])('%s -> SKIP', (_label, paths) => {
    const { cwd, base } = repoWithChange(paths);
    const r = decide(cwd, { VERCEL_GIT_PREVIOUS_SHA: base });
    expect(r.code, r.log).toBe(0);
    expect(r.log).toContain('-> SKIP');
  });

  it.each([
    ['app source', ['src/app/page.tsx']],
    ['source plus docs', ['src/app/page.tsx', 'docs/plans/run-sheet.md']],
    ['dependencies', ['package.json']],
    ['public assets', ['public/logo.svg']],
    ['vercel.json', ['vercel.json']],
    ['the script itself', ['scripts/vercel-ignore.sh']],
    ['a docs file the app reads at runtime', ['docs/marketing/press-kit.md']],
  ])('%s -> BUILD', (_label, paths) => {
    const { cwd, base } = repoWithChange(paths);
    const r = decide(cwd, { VERCEL_GIT_PREVIOUS_SHA: base });
    expect(r.code, r.log).toBe(1);
    expect(r.log).toContain('-> BUILD');
  });

  it('names the runtime-read docs file in its log', () => {
    const { cwd, base } = repoWithChange(['docs/marketing/press-kit.md']);
    expect(decide(cwd, { VERCEL_GIT_PREVIOUS_SHA: base }).log).toContain('read by the app at runtime');
  });

  it('does not skip preview deploys for a source change (PR review uses the preview)', () => {
    const { cwd, base } = repoWithChange(['src/app/page.tsx']);
    expect(decide(cwd, { VERCEL_ENV: 'preview', VERCEL_GIT_PREVIOUS_SHA: base }).code).toBe(1);
  });

  it('falls back to the parent commit when the previous SHA is unknown', () => {
    const { cwd } = repoWithChange(['docs/plans/run-sheet.md']);
    const r = decide(cwd, { VERCEL_GIT_PREVIOUS_SHA: 'f'.repeat(40) });
    expect(r.code, r.log).toBe(0);
  });

  it('builds when there is no diff base at all', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'vercel-ignore-zaostock-'));
    git(cwd, 'init', '-q');
    git(cwd, 'config', 'user.email', 'test@example.invalid');
    git(cwd, 'config', 'user.name', 'test');
    write(cwd, 'README.md', '# first\n');
    git(cwd, 'add', '-A');
    git(cwd, 'commit', '-qm', 'only commit');
    const r = decide(cwd, {});
    expect(r.code, r.log).toBe(1);
    expect(r.log).toContain('no diff base');
  });
});

/** Every docs path that non-test code under src/ reads via path.join(process.cwd(), 'docs', ...). */
function docsReadBySrc(): string[] {
  const found = new Set<string>();
  const walk = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) {
        if (name !== '__tests__' && name !== 'node_modules') walk(p);
      } else if (/\.(ts|tsx|mjs)$/.test(name) && !/\.(test|spec)\./.test(name)) {
        const src = readFileSync(p, 'utf8');
        for (const m of src.matchAll(/path\.join\(\s*process\.cwd\(\)\s*,\s*'docs'((?:\s*,\s*'[^']+')+)\s*\)/g)) {
          found.add(['docs', ...[...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])].join('/'));
        }
      }
    }
  };
  walk(join(process.cwd(), 'src'));
  return [...found].sort();
}

describe('RUNTIME_DOCS in scripts/vercel-ignore.sh', () => {
  it('names every docs file that src/ reads at runtime, so editing one still deploys', () => {
    const script = readFileSync(SCRIPT, 'utf8');
    const listed = (script.match(/RUNTIME_DOCS=\(([^)]*)\)/)?.[1] ?? '').split(/\s+/).filter(Boolean);
    const read = docsReadBySrc();
    expect(read.length).toBeGreaterThan(0);
    for (const p of read) expect(listed, `${p} is read by src/ but missing from RUNTIME_DOCS`).toContain(p);
  });
});
