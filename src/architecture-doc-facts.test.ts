import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// docs/ARCHITECTURE.md and docs/BRAND-MIGRATION.md quote counts of the code.
// Every expected value here is computed from the tree, never pinned, so adding
// a page or a file does not turn this red. It fails only when a document states
// a figure that no longer matches the tree it describes.

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (rel: string) => readFileSync(join(ROOT, rel), 'utf8');
const ARCH = read('docs/ARCHITECTURE.md');
const BRAND = read('docs/BRAND-MIGRATION.md');
const CI = read('.github/workflows/ci.yml');
const SCRIPTS = Object.keys(JSON.parse(read('package.json')).scripts ?? {});

const under = (dir: string): string[] =>
  (readdirSync(join(ROOT, dir), { recursive: true }) as string[]).map((f) => `${dir}/${f}`.replace(/\\/g, '/'));
const readTree = (f: string) => readFileSync(join(ROOT, f), 'utf8');

const tsx = under('src').filter((f) => f.endsWith('.tsx'));
const appTsx = under('src/app').filter((f) => f.endsWith('.tsx'));
const teamTsx = tsx.filter((f) => f.startsWith('src/app/team/'));
const publicTsx = appTsx.filter((f) => !f.startsWith('src/app/team/'));
const pages = under('src/app').filter((f) => f.endsWith('/page.tsx') && !f.includes('/api/'));
const nonTeamPages = pages.filter((f) => !f.startsWith('src/app/team/')).length;
const handlers = under('src/app/api').filter((f) => f.endsWith('/route.ts')).length;

const TOKEN_USE = /(bg|text|border|ring|fill|stroke|from|to|via|shadow|outline|decoration|divide|accent|caret|placeholder)-(paper|ink|red|gold|denim|olive)(-[0-9]+)?\b/;
const ANY_HEX = /\[#[0-9a-fA-F]{3,8}\]/g;
const hexFiles = (fs: string[]) => fs.filter((f) => /\[#[0-9a-fA-F]{3,8}\]/.test(readTree(f))).length;
const hexTotal = (fs: string[]) => fs.reduce((n, f) => n + (readTree(f).match(ANY_HEX) ?? []).length, 0);
const tokenFiles = tsx.filter((f) => TOKEN_USE.test(readTree(f))).length;

// Jobs under `jobs:` only, so top-level `on:` triggers are not counted.
const ciJobs = CI.slice(CI.indexOf('\njobs:')).match(/^ {2}[\w-]+:\s*$/gm)?.length ?? 0;
const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const num = (s: string) => Number(s.replace(/,/g, ''));
const all = (re: RegExp, s: string) => [...s.matchAll(re)];

describe('measured from the tree', () => {
  it('has a tree to measure', () => {
    expect(tsx.length).toBeGreaterThan(0);
    expect(nonTeamPages).toBeGreaterThan(0);
    expect(handlers).toBeGreaterThan(0);
    expect(ciJobs).toBeGreaterThan(0);
  });
});

describe('docs/ARCHITECTURE.md agrees with the tree', () => {
  it('states the non-team page count everywhere it appears', () => {
    const said = all(/(\d+) non-team pages/g, ARCH).map((m) => num(m[1]));
    expect(said.length).toBeGreaterThan(0);
    for (const n of said) expect(n).toBe(nonTeamPages);
  });

  it('states the route handler count', () => {
    const said = all(/(\d+) route handlers/g, ARCH).map((m) => num(m[1]));
    expect(said.length).toBeGreaterThan(0);
    for (const n of said) expect(n).toBe(handlers);
  });

  it('states the token-usage split and the hex split', () => {
    const usage = all(/(\d+) of (\d+) `\.tsx` files use them/g, ARCH);
    expect(usage.length).toBeGreaterThan(0);
    for (const m of usage) {
      expect(num(m[1])).toBe(tokenFiles);
      expect(num(m[2])).toBe(tsx.length);
    }
    const hex = all(/([\d,]+) of them across (\d+) of (\d+) `\.tsx` files/g, ARCH);
    expect(hex.length).toBeGreaterThan(0);
    for (const m of hex) {
      expect(num(m[1])).toBe(hexTotal(tsx));
      expect(num(m[2])).toBe(hexFiles(tsx));
      expect(num(m[3])).toBe(tsx.length);
    }
  });

  it('states the CI job count the workflow actually runs', () => {
    const said = all(/as (\w+) jobs/g, ARCH).map((m) => WORDS[m[1].toLowerCase()]);
    expect(said.length).toBeGreaterThan(0);
    for (const n of said) expect(n).toBe(ciJobs);
  });

  it('documents only npm scripts that exist', () => {
    for (const doc of [ARCH, BRAND]) {
      for (const m of all(/npm run ([\w:-]+)/g, doc)) {
        expect(SCRIPTS, `"npm run ${m[1]}" is documented but not in package.json`).toContain(m[1]);
      }
    }
  });
});

describe('docs/BRAND-MIGRATION.md agrees with the tree', () => {
  it('measured-now table', () => {
    const tsxRow = BRAND.match(/`\.tsx` files in `src\/` \| \d+ \| \**([\d,]+)\**/);
    expect(tsxRow && num(tsxRow[1])).toBe(tsx.length);
    const brandRow = BRAND.match(/Files carrying brand colour \| [^|]*\| \*\*(\d+) of (\d+)\*\*/);
    expect(brandRow && [Number(brandRow[1]), Number(brandRow[2])]).toEqual([hexFiles(tsx), tsx.length]);
    const hexRow = BRAND.match(/Hardcoded brand hexes \| [^|]*\| \*\*([\d,]+)\*\*/);
    expect(hexRow && num(hexRow[1])).toBe(hexTotal(tsx));
  });

  it('surface table', () => {
    const pub = BRAND.match(/\*\*Public site\*\*[^|]*\| (\d+) \|/);
    expect(pub && Number(pub[1])).toBe(publicTsx.length);
    const team = BRAND.match(/\*\*Team dashboard[^|]*\| (\d+) \|/);
    expect(team && Number(team[1])).toBe(teamTsx.length);
  });

  it('says how many dashboard files carry hexes, not how many exist', () => {
    const said = all(/([\d,]+) hexes across (\d+) (?:dashboard )?files/g, BRAND);
    expect(said.length).toBeGreaterThan(0);
    for (const m of said) {
      expect(num(m[1])).toBe(hexTotal(teamTsx));
      expect(num(m[2])).toBe(hexFiles(teamTsx));
    }
  });

  it('keeps the public site at zero hardcoded hexes', () => {
    expect(hexTotal(publicTsx)).toBe(0);
  });
});

describe('house style', () => {
  it('uses hyphens, not em dashes, in both documents', () => {
    const EM_DASH = '\u2014';
    expect(ARCH).not.toContain(EM_DASH);
    expect(BRAND).not.toContain(EM_DASH);
  });
});
