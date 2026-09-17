import { describe, it, expect, vi, afterEach } from 'vitest';
import { daysUntil } from './days-until';

// THE 2026-09-17 BUG: this stat read "17 days to go" on 17 September for a
// 3 October event, when the calendar difference is 16. The old
// implementation was Math.ceil((target - now) / 86400000) on raw
// milliseconds - any partial day remaining (i.e. any time before the
// festival's own noon start on the day it would otherwise tick over) rounds
// UP, overcounting by one for roughly half of every day. Comparing whole
// calendar dates in America/New_York instead fixes this and ticks over
// exactly once per real day, at midnight.

describe('daysUntil - calendar days, not a raw millisecond ceil', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('the exact case that was wrong: 17 September morning to 3 October noon is 16, not 17', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-17T09:26:00-04:00'));
    expect(daysUntil('2026-10-03T12:00:00-04:00')).toBe(16);
  });

  it('does not depend on the time of day on either end', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-17T23:59:00-04:00'));
    expect(daysUntil('2026-10-03T00:00:01-04:00')).toBe(16);
  });

  it('reads 0 on the day itself, never negative', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-03T08:00:00-04:00'));
    expect(daysUntil('2026-10-03T12:00:00-04:00')).toBe(0);
  });

  it('reads 0, not negative, after the event has passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-04T08:00:00-04:00'));
    expect(daysUntil('2026-10-03T12:00:00-04:00')).toBe(0);
  });
});
