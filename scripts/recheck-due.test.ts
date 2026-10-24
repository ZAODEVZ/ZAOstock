import { describe, it, expect } from 'vitest';
import { addDays, dueWithin, markers, today } from './recheck-due.mjs';

/**
 * The weekly listing (card 10545) must agree with src/content/recheck.test.ts
 * about which markers exist, and must sort a marker into past, due soon, or
 * neither by the same New York date the test uses.
 */
const m = (date: string) => ({ file: 'docs/X.md', line: 1, date });

describe('recheck-due', () => {
  it('finds the repo markers the build test reads', () => {
    expect(markers().length).toBeGreaterThan(0);
  });

  it('splits markers into past, due within the window, and later', () => {
    const r = dueWithin([m('2026-10-20'), m('2026-10-22'), m('2026-10-29'), m('2026-10-30')], '2026-10-22', 7);
    expect(r.until).toBe('2026-10-29');
    expect(r.past.map((x: { date: string }) => x.date)).toEqual(['2026-10-20']);
    expect(r.soon.map((x: { date: string }) => x.date)).toEqual(['2026-10-22', '2026-10-29']);
  });

  it('lists soonest first', () => {
    const r = dueWithin([m('2026-10-28'), m('2026-10-23')], '2026-10-22', 7);
    expect(r.soon.map((x: { date: string }) => x.date)).toEqual(['2026-10-23', '2026-10-28']);
  });

  it('adds days across a month end', () => {
    expect(addDays('2026-10-29', 7)).toBe('2026-11-05');
  });

  it("reads today in New York, not UTC: 03:00Z on the 23rd is still the 22nd", () => {
    expect(today(new Date('2026-10-23T03:00:00Z'))).toBe('2026-10-22');
  });
});
