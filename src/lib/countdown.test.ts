import { describe, expect, it } from 'vitest';
import { DOORS_MS, STREET_CLEARS_MS, countdownState } from './countdown';

const at = (iso: string) => Date.parse(iso);

describe('countdownState', () => {
  it('counts to the doors at noon Eastern on 3 October', () => {
    expect(new Date(DOORS_MS).toISOString()).toBe('2026-10-03T16:00:00.000Z');
    expect(new Date(STREET_CLEARS_MS).toISOString()).toBe('2026-10-03T22:00:00.000Z');
  });

  it('breaks the time left into days, hours and minutes', () => {
    // 10 Sep, 09:30 Eastern -> 23 days 2 hours 30 minutes to noon on 3 Oct.
    expect(countdownState(at('2026-09-10T09:30:00-04:00'))).toEqual({ phase: 'before', days: 23, hours: 2, minutes: 30 });
  });

  it('rounds up, so it never reads zero while there is time left', () => {
    expect(countdownState(DOORS_MS - 1)).toEqual({ phase: 'before', days: 0, hours: 0, minutes: 1 });
    expect(countdownState(DOORS_MS - 59_000)).toEqual({ phase: 'before', days: 0, hours: 0, minutes: 1 });
  });

  it('is live from the doors until the street clears at six', () => {
    expect(countdownState(DOORS_MS)).toEqual({ phase: 'live' });
    expect(countdownState(at('2026-10-03T15:30:00-04:00'))).toEqual({ phase: 'live' });
    expect(countdownState(STREET_CLEARS_MS - 1)).toEqual({ phase: 'live' });
  });

  // The failure this exists to stop: Candy's original clamps at zero and would
  // sit on 00 00 00 00, or a naive one would count up, forever after the day.
  it('goes quiet after the street clears, and never counts up', () => {
    for (const t of [STREET_CLEARS_MS, at('2026-10-04T09:00:00-04:00'), at('2027-06-01T00:00:00Z')]) {
      expect(countdownState(t)).toEqual({ phase: 'after' });
    }
  });
});
