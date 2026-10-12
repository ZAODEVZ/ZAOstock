import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
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

/**
 * Two different hex counts exist in this repository's documentation, and they
 * are not the same measurement.
 *
 * `docs/BRAND-MIGRATION.md` documents its own method, and it is not "every
 * arbitrary hex value". It is the four legacy brand colours:
 *
 *     grepping src/ for the four legacy brand hexes
 *     (0a1628, f5a623, 0d1b2a, ffd700)
 *
 * Counting every `[#hex]` instead gives a different number, because components
 * that are already on the token layer still carry unrelated literals - `#fbbf24`
 * appears in three files under src/app/team/ and is a fifth colour that
 * postdates the document.
 *
 * Measured 2026-10-02:
 *     four legacy brand hexes   414, in 34 of 106 .tsx
 *     every [#hex]              420, in 34 of 106 .tsx
 *
 * The gap is those six. Checking "420" against a document that means "414"
 * passes while both are wrong about the same subject, which is how the first
 * version of this test came to assert a figure the documentation never made.
 *
 * Both are computed, and the document's own metric is the one the assertions
 * use - so if the brand set ever changes, the count and the document have to
 * move together and the difference is visible rather than silent.
 */
const LEGACY_BRAND_HEXES = ['0a1628', 'f5a623', '0d1b2a', 'ffd700'];

let hexTotal = 0;
let filesWithHex = 0;
let anyHexTotal = 0;
for (const f of tsxFiles) {
  const source = readFileSync(f, 'utf8');
  const legacy = LEGACY_BRAND_HEXES.reduce(
    (sum, h) => sum + (source.match(new RegExp(`\\[#${h}\\]`, 'gi')) ?? []).length,
    0
  );
  if (legacy > 0) {
    filesWithHex += 1;
    hexTotal += legacy;
  }
  anyHexTotal += (source.match(/\[#[0-9a-fA-F]{3,8}\]/g) ?? []).length;
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
    // Both places that state a length, not the first one. The directory map
    // says "globals.css 501 lines, 97 tokens" and the token-gap section says
    // "globals.css is 501 lines"; a pattern that only matched the second left
    // the first unchecked, which is what the RED run showed.
    const claimed: number[] = [];
    for (const m of ARCH.matchAll(/globals\.css`?\s+(?:is\s+|is\s+now\s+)?([\d,]+|one|two|three|four|five|six|seven|eight|nine|ten)\s+lines?/gi)) {
      claimed.push(m[1].toLowerCase() in words ? words[m[1].toLowerCase()] : Number(m[1].replace(/,/g, '')));
    }
    expect(claimed.length).toBeGreaterThan(0);
    for (const n of claimed) expect(n).toBe(cssLines);

    // The stale figure may still appear, but only as history, and the sentence
    // has to say so. "globals.css is 501 lines ... was nine lines" is fine;
    // a bare "globals.css is nine lines" is the bug, and it is covered above.
    const stale = ARCH.match(/globals\.css`?\s+(?:is\s+)(one|two|three|four|five|six|seven|eight|nine|ten)\s+lines?/i);
    if (stale) {
      const at = ARCH.indexOf(stale[0]);
      const context = ARCH.slice(Math.max(0, at - 220), at + 60);
      expect(context, `"${stale[0]}" stands as current, not as history`).toMatch(
        /was nine lines|half closed|None of that is true now|said\b[\s\S]{0,120}nine lines/i
      );
    }
  });

  it('agrees with src about how many hardcoded hexes remain', () => {
    expect(hexTotal).toBeGreaterThan(0);
    // Last match, not first. This section deliberately quotes the old figures
    // in order to say they are old ("was 1,067 ... None of that is true now"),
    // so the current figure is the one attached to "remain". Reading the first
    // match asserted 1067 against a real 420 and made a correct document look
    // broken.
    //
    // Every occurrence, and the historical one is recognised by the sentence it
    // sits in rather than by position. Two present-tense sentences both quote
    // the count ("414 ... remain across 34 of 106" and "414 ... are still
    // Tailwind arbitrary values"), so reading only the last match left the
    // first one unchecked - verified by reverting it alone and watching the
    // suite stay green.
    const every = [...ARCH.matchAll(/.{0,160}?([\d,]+)\s+hardcoded hexes.{0,160}/gs)];
    expect(every.length).toBeGreaterThan(0);
    for (const m of every) {
      const said = Number(m[1].replace(/,/g, ''));
      const sentence = m[0];
      const historical = /\bwas\b|\bwere\b|sat across|None of that is true/i.test(sentence);
      if (historical) continue; // the 2026-08-22 figure, kept as history
      expect(said, `present-tense claim of ${said} hexes contradicts src (${hexTotal})`).toBe(hexTotal);
    }
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
describe('docs/BRAND-MIGRATION.md states which figures are historical', () => {
  const BRAND = readFileSync(join(ROOT, 'docs/BRAND-MIGRATION.md'), 'utf8');

  it('no longer claims nothing has been migrated', () => {
    // The document said "**Status: a plan and a cost estimate. Nothing has been
    // migrated.**" while `globals.css` had 97 tokens, the public site had zero
    // hardcoded hexes, and 760 token references. Phases 0 and 2 are done.
    expect(BRAND).not.toMatch(/Nothing has been migrated/i);
    expect(BRAND).toMatch(/Phase 0 and Phase 2 are done/i);
  });

  it('marks the 2026-08-22 baseline figures as a baseline', () => {
    // These numbers are the record of what the plan cost when it was written.
    // They are worth keeping - what is not acceptable is a reader taking them
    // for the state of the code, which is what happened for six weeks.
    for (const n of ['1,067', '77 of 96', '605', '462']) {
      expect(BRAND, `BRAND-MIGRATION.md quotes ${n} with no marker`).toMatch(
        new RegExp(`${n.replace(',', ',?')}[^\n]*\(baseline|2026-08-22|were on|are all under)`, 'i')
      );
    }
  });

  it('agrees with src about the legacy hexes still in the dashboard', () => {
    // The one present-tense figure it carries: 414 across 34 files, all in
    // src/app/team/. Counted by the document's own method - the four legacy
    // brand hexes - because counting every [#hex] gives 420 and that is a
    // different measurement.
    expect(BRAND).toMatch(/414 (?:hexes )?across 34/);
    expect(hexTotal).toBe(414);
    expect(filesWithHex).toBe(34);
    expect(tsxFiles.length).toBe(106);
  });

  it('keeps the public site at zero hardcoded hexes', () => {
    // Phase 2 was the bulk of the work and it is finished: 64 public .tsx
    // files, not one arbitrary hex among them. If this ever rises, a page has
    // been styled the old way and the migration has silently reopened.
    const publicFiles = tsxFiles.filter((f) => !f.replace(/\\/g, '/').includes('/src/app/team/'));
    let publicHex = 0;
    for (const f of publicFiles) {
      publicHex += (readFileSync(f, 'utf8').match(/\[#[0-9a-fA-F]{3,8}\]/g) ?? []).length;
    }
    expect(publicFiles.length).toBe(64);
    expect(publicHex).toBe(0);
  });

  it('separates the two hex counts it could be confused for', () => {
    // 414 legacy brand hexes, 420 of every arbitrary hex. The six between them
    // are #fbbf24 in the team dashboard - a fifth colour the document predates.
    expect(anyHexTotal).toBeGreaterThan(hexTotal);
    expect(anyHexTotal - hexTotal).toBe(6);
  });
});
