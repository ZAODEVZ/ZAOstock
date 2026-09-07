import { describe, it, expect } from 'vitest';
import { lineupIsPublic } from './lineup-reveal';
import { getFallbackLineup } from './lineup-fallback';
import { PUBLIC_LINEUP } from '@/content/site';

// The public /artist/<slug> pages and the public lineup must not exist before
// the 18 September reveal, and the fallback lineup must answer to the slug the
// events table actually uses ('zaostock') as well as the one the mobile app
// calls ('zaostock-2026'). Both were wrong on 2026-08-28 (Iman's audit, items
// 05 and 06).

describe('lineup reveal gate', () => {
  it('is closed before 18 September 2026 and open from that day', () => {
    expect(lineupIsPublic(new Date('2026-08-31T23:59:59Z'))).toBe(false);
    expect(lineupIsPublic(new Date('2026-09-01T00:00:00Z'))).toBe(false);
    // The date this gate used to open on. It must now be SHUT, or the move of
    // the reveal did not actually take.
    expect(lineupIsPublic(new Date('2026-09-07T04:00:00Z'))).toBe(false);
    expect(lineupIsPublic(new Date('2026-09-17T23:59:59Z'))).toBe(false);
    // The bug this guards: midnight UTC on the 18th is 8 PM on the 17th in
    // Ellsworth. The gate must still be SHUT.
    expect(lineupIsPublic(new Date('2026-09-18T00:00:00Z'))).toBe(false);
    expect(lineupIsPublic(new Date('2026-09-18T03:59:59Z'))).toBe(false);
    // 04:00Z is midnight in Ellsworth on the 18th - EDT, UTC-4, and DST does
    // not end until 1 November, so the offset is the same as it was. Open.
    expect(lineupIsPublic(new Date('2026-09-18T04:00:00Z'))).toBe(true);
    expect(lineupIsPublic(new Date('2026-10-03T16:00:00Z'))).toBe(true);
  });
});

describe('fallback lineup slugs', () => {
  it('answers to both the events-table slug and the mobile app slug', () => {
    expect(getFallbackLineup('zaostock')).toEqual(getFallbackLineup('zaostock-2026'));
    expect(getFallbackLineup('nope')).toEqual([]);
  });
});

// The site and the app answer "who is playing" from two different places, and on
// 2026-09-01 they disagree. Measured: the live endpoint returns
// {"artists":[],"source":"live"} - Supabase is UP and the artists table is simply
// empty, so this is not the degraded path. Meanwhile the website serves Lyons Den
// from PUBLIC_LINEUP, which is hardcoded in the bundle.
//
// At the reveal the website would announce a confirmed act while the mobile app
// and every /artist/<slug> page showed an empty bill. Found by Iman, 2026-08-31.
//
// The fallback is deliberately NOT populated to paper over this: lineup-fallback.ts
// says entries are copied from the real roster and never invented, and nobody here
// holds Lyons Den's genre, city, bio or photo. Writing blanks to silence a test
// would be exactly the fabrication that file exists to prevent.
//
// So this pins the disagreement instead of hiding it. It fails the moment anyone
// changes one side without the other, which forces the decision Zaal owes:
// either Lyons Den goes into the artists table as confirmed and linked to the
// event, or it is said out loud that the app is not a reveal surface this year.
describe('the site and the app must not disagree silently about the lineup', () => {
  it('pins the known gap so changing one side trips the other', () => {
    expect(PUBLIC_LINEUP).toEqual(['Lyons Den']);
    expect(getFallbackLineup('zaostock')).toEqual([]);
    expect(getFallbackLineup('zaostock-2026')).toEqual([]);
  });
});
