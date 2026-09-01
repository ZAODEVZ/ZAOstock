import { describe, it, expect } from 'vitest';
import { lineupIsPublic } from './lineup-reveal';
import { getFallbackLineup } from './lineup-fallback';

// The public /artist/<slug> pages and the public lineup must not exist before
// the 7 September reveal, and the fallback lineup must answer to the slug the
// events table actually uses ('zaostock') as well as the one the mobile app
// calls ('zaostock-2026'). Both were wrong on 2026-08-28 (Iman's audit, items
// 05 and 06).

describe('lineup reveal gate', () => {
  it('is closed before 7 September 2026 and open from that day', () => {
    expect(lineupIsPublic(new Date('2026-08-31T23:59:59Z'))).toBe(false);
    expect(lineupIsPublic(new Date('2026-09-01T00:00:00Z'))).toBe(false);
    expect(lineupIsPublic(new Date('2026-09-06T23:59:59Z'))).toBe(false);
    // The bug this guards: midnight UTC on the 7th is 8 PM on the 6th in
    // Ellsworth. The gate must still be SHUT.
    expect(lineupIsPublic(new Date('2026-09-07T00:00:00Z'))).toBe(false);
    expect(lineupIsPublic(new Date('2026-09-07T03:59:59Z'))).toBe(false);
    // 04:00Z is midnight in Ellsworth on the 7th. Open.
    expect(lineupIsPublic(new Date('2026-09-07T04:00:00Z'))).toBe(true);
    expect(lineupIsPublic(new Date('2026-10-03T16:00:00Z'))).toBe(true);
  });
});

describe('fallback lineup slugs', () => {
  it('answers to both the events-table slug and the mobile app slug', () => {
    expect(getFallbackLineup('zaostock')).toEqual(getFallbackLineup('zaostock-2026'));
    expect(getFallbackLineup('nope')).toEqual([]);
  });
});
