import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ARCH = readFileSync(join(ROOT, 'docs/ARCHITECTURE.md'), 'utf8');

/**
 * docs/ARCHITECTURE.md quotes five numbers about the codebase: how many public
 * routes there are, how many API handlers, how long globals.css is, and how many
 * hardcoded brand hexes remain. All five were stale when this test was written.
 *
 *   claimed  24 public routes      actual 39
 *   claimed  41 route handlers     actual 43
 *   claimed  globals.css 9 lines   actual 501 lines, 97 tokens
 *   claimed  1,067 hexes in 77 of 96 .tsx
 *            actual 420 in 34 of 106
 *
 * The file itself says it was "written by reading the code on 2026-08-22", so
 * the drift is just time passing - but a stale architecture document is worse
 * than a missing one, because a reader treats its numbers as current. The
 * document cannot check itself, which is what this does.
 *
 * The token-gap claim is the one worth reading twice. It is not merely out of
 * date: it asserts that exactly one file uses the CSS variables, and that the
 * hardcoded hexes are "the single biggest source of friction in the app". A
 * migration has since landed - globals.css went from 9 lines to 501 with 97
 * tokens defined, and the hex count fell by 61%. The number shrank; the verdict
 * written around it did not.
 *
 * These assertions read the filesystem, not a fixture. If the codebase moves,
 * the number here moves with it, and the failure names both sides.
 */

function walk(dir: string, match: (f: string) => boolean, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, match, acc);
    else if (match(full)) acc.push(full);
  }
  return acc;
}

const appDir = join(ROOT, 'src/app');
const publicPages = walk(appDir, (f) => f.endsWith('page.tsx') && !f.includes(`${join('app', 'api')}`)).length;
const apiHandlers = walk(join(appDir, 'api'), (f) => f.endsWith('route.ts')).length;

const css = readFileSync(join(appDir, 'globals.css'), 'utf8');
const cssLines = css.split('\n').length - (css.endsWith('\n') ? 1 : 0);
const cssTokens = (css.match(/^\s*--[a-zA-Z0-9-]+\s*:/gm) ?? []).length;

const tsxFiles = walk(join(ROOT, 'src'), (f) => f.endsWith('.tsx'));
let hexTotal = 0;
let filesWithHex = 0;
for (const f of tsxFiles) {
  const n = (readFileSync(f, 'utf8').match(/\[#[0-9a-fA-F]{3,8}\]/g) ?? []).length;
  if (n > 0) {
    filesWithHex += 1;
    hexTotal += n;
  }
}

describe('docs/ARCHITECTURE.md quotes live numbers', () => {
  // Every occurrence, not the first one.
  //
  // These figures appear more than once - "39 public routes" is in both the
  // ASCII diagram and the directory map, "43 route handlers" twice over. A
  // check that reads only the first match passes while the second sits wrong,
  // which is exactly the shape of a gate that looks armed. So every number
  // appearing in the document has to agree with the filesystem, except where
  // the sentence explicitly marks it as historical ("was 1,067 ... None of that
  // is true now"), and those are tested separately below.
  const allOf = (re: RegExp): number[] => [...ARCH.matchAll(re)].map((m) => Number(m[1].replace(/,/g, '')));

  it('agrees with src/app about the public route count', () => {
    expect(publicPages).toBeGreaterThan(0);
    const said = allOf(/([\d,]+)\s+public routes/g);
    expect(said.length).toBeGreaterThan(0);
    for (const n of said) expect(n).toBe(publicPages);
  });

  it('agrees with src/app/api about the handler count', () => {
    expect(apiHandlers).toBeGreaterThan(0);
    const said = allOf(/([\d,]+)\s+route handlers/g);
    expect(said.length).toBeGreaterThan(0);
    for (const n of said) expect(n).toBe(apiHandlers);
  });

  it('agrees with globals.css about its own length', () => {
    // Matched loosely: the file says "9 lines", "nine lines", or "501 lines".
    const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    const numeric = ARCH.match(/globals\.css`?\s+is\s+([\d,]+)\s+lines?/i);
    const worded = ARCH.match(/globals\.css`?\s+is\s+(one|two|three|four|five|six|seven|eight|nine|ten)\s+lines?/i);
    const stated = numeric
      ? Number(numeric[1].replace(/,/g, ''))
      : worded
        ? words[worded[1].toLowerCase()]
        : null;
    expect(stated).not.toBeNull();
    expect(cssLines).toBe(stated);
  });

  it('agrees with src about how many hardcoded hexes remain', () => {
    expect(hexTotal).toBeGreaterThan(0);
    // Last match, not first. This section deliberately quotes the old figures
    // in order to say they are old ("was 1,067 ... None of that is true now"),
    // so the current figure is the one attached to "remain". Reading the first
    // match asserted 1067 against a real 420 and made a correct document look
    // broken.
    const all = [...ARCH.matchAll(/([\d,]+)\s+hardcoded hexes/g)].map((m) => Number(m[1].replace(/,/g, '')));
    expect(all.length).toBeGreaterThan(0);
    expect(all[all.length - 1]).toBe(hexTotal);
  });

  it('agrees with src about how many .tsx files carry a hardcoded hex', () => {
    // "420 hardcoded hexes remain across 34 of 106" is the present-tense
    // claim; the "1,067 ... sat across 77 of 96" earlier in the section is the
    // historical one. Last match again.
    //
    // The gap between "hexes" and "across" is not fixed width - one version
    // reads "hexes sat across", the other "hexes remain across" - so the
    // middle is `[^.]*?` rather than a literal. A literal `sat ` here matched
    // only the historical sentence and asserted 77 against a real 34, which
    // is the third time in this file that a too-tight pattern made correct
    // code look broken.
    const all = [...ARCH.matchAll(/([\d,]+)\s+hardcoded hexes[^.]*?across\s+([\d,]+)\s+of\s+([\d,]+)\s+`?\.tsx/g)];
    expect(all.length).toBeGreaterThan(0);
    const last = all[all.length - 1];
    expect(Number(last[2].replace(/,/g, ''))).toBe(filesWithHex);
    expect(Number(last[3].replace(/,/g, ''))).toBe(tsxFiles.length);
  });

  it('does not claim the token layer is unused once 97 tokens exist', () => {
    // The claim that survives is the one that is still true. This is the
    // guard on the sentence around the numbers, because that is the part a
    // reader acts on: "exactly one file uses them" and "the single biggest
    // source of friction" were both true on 2026-08-22 and neither is now.
    //
    // Both phrases survive here only inside an explicit denial ("Not the single
    // biggest source of friction"), so the guard looks for an assertion, not
    // for the words. A bare "This is not the single biggest source of friction"
    // is a correction; "It is the single biggest source of friction" is the
    // stale claim, and only the latter must fail.
    const tokensDefined = cssTokens;
    expect(tokensDefined).toBeGreaterThan(10);
    const assertsOneFileUser = /(?:^|[^*])\*\*exactly one file\b/i.test(ARCH) && !/said\b[\s\S]{0,120}exactly one file/i.test(ARCH);
    const assertsBiggestFriction = /\bis the single biggest source of friction\b/i.test(ARCH);
    if (assertsOneFileUser) {
      expect(tokensDefined).toBeLessThan(10);
    }
    if (assertsBiggestFriction) {
      expect(hexTotal).toBeGreaterThan(tsxFiles.length * 5);
    }
  });

  it('documents no npm script that does not exist', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    // Object.keys, not the object itself: pkg.scripts is a map, and
    // toContain on a map is always false, so the first version of this test
    // failed on `npm run dev` - a script that does exist. A RED that fires on
    // correct code is the failure mode this repository keeps producing, and it
    // starts by believing the first number it sees.
    const scripts = Object.keys(pkg.scripts ?? {});
    const mentioned = [...ARCH.matchAll(/npm run ([a-z0-9:_-]+)/g)].map((m) => m[1]);
    expect(mentioned.length).toBeGreaterThan(0);
    for (const name of mentioned) {
      // A documented command that runs nothing is the exact failure this whole
      // PR set is about: something that looks available and is not.
      expect(scripts, `docs/ARCHITECTURE.md documents "npm run ${name}", which is not in package.json`).toContain(
        name
      );
    }
  });
});