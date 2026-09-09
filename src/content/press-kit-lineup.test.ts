import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { LINEUP_NAMES } from './site';

/**
 * THE PRESS KIT CANNOT DRIFT FROM THE LINEUP.
 *
 * WHY THIS EXISTS
 * `docs/marketing/press-kit.md` is what `/press` renders, and it is static
 * markdown - it CANNOT import `SITE`. That is not a style choice, it is the
 * structural reason it drifted in public twice: it announced a reveal date that
 * had already passed, called an act confirmed when none was, and carried
 * WaveWarZ in five places after WaveWarZ came off the programme. Every other
 * surface moved with the source; this one could not, so it did not.
 *
 * Existing guards cover the reveal DATE and the word "confirmed". Nothing
 * covered the ACT NAMES - so an act added, renamed or dropped from
 * `LINEUP_NAMES` would leave this file quietly wrong, on the one surface a
 * journalist reads.
 *
 * This closes that: the running order printed for the press must BE the running
 * order, name for name and in sequence.
 */

const KIT = path.join(process.cwd(), 'docs/marketing/press-kit.md');
const text = () => readFileSync(KIT, 'utf8');

/** The acts as the press kit prints them, from the "In running order:" line. */
function printedOrder(md: string): string[] {
  // The list wraps across lines, so collapse whitespace before matching.
  const flat = md.replace(/\s+/g, ' ');
  const m = flat.match(/In running order:\s*(.+?)\./);
  if (!m) return [];
  return m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

describe('press kit lineup', () => {
  it('prints the running order, in the same sequence as the site', () => {
    const printed = printedOrder(text());

    // Compared as ordered arrays on purpose. A set comparison would pass while
    // the press release told journalists the day runs in the wrong sequence.
    expect(printed).toEqual([...LINEUP_NAMES]);
  });

  it('names every act, so one cannot be quietly dropped', () => {
    const md = text();
    const missing = LINEUP_NAMES.filter((n) => !md.includes(n));
    expect(
      missing,
      missing.length
        ? `\nThese acts are in LINEUP_NAMES but appear nowhere in the press kit:\n` +
            missing.map((n) => `  - ${n}`).join('\n') +
            `\nAdd them, or take them off the bill in src/content/site.ts. Do not\n` +
            `leave the two disagreeing - /press is what a journalist reads.\n`
        : '',
    ).toEqual([]);
  });

  it('keeps WaveWarZ marked as not on the programme wherever it appears', () => {
    const md = text();
    if (!md.includes('WaveWarZ')) return; // fine - it may be removed entirely

    // WaveWarZ is a real, confirmed PARTNER and its history is true. What must
    // never happen again is it reading as part of the 3 October bill.
    expect(
      md.includes('not on the 3 October programme'),
      'The press kit names WaveWarZ but never says it is not on the 3 October ' +
        'programme. It came off the bill on 2026-09-07 and survived in five ' +
        'places last time. Keep the disclaimer or remove the mentions.',
    ).toBe(true);
  });

  it('names no act that came off the bill', () => {
    const md = text();
    // Acts that were once on the run of show and are not any more. Werb is not
    // here: it appears once, in the sources table, explicitly flagged as "not
    // fully confirmed... not repeated here", which is provenance, not a claim.
    const removed = ['Stilo World', 'Stilo'];
    const found = removed.filter((n) => md.includes(n));
    expect(
      found,
      found.length
        ? `\nThe press kit names ${found.join(', ')}, who came off the bill.\n` +
            `Stilo is not coming and the artists row is 'declined'.\n`
        : '',
    ).toEqual([]);
  });
});
