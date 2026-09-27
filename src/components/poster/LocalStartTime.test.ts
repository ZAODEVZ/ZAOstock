import { describe, it, expect } from 'vitest';
import { localStartTimeText } from './LocalStartTime';

// THE 2026-09-26 REDUNDANT-LINE BUG: the previous zone check used
// zone.includes('New_York') || zone.includes('Eastern'), which matches only
// America/New_York and US/Eastern - missing every other IANA zone that is
// also Eastern time (Toronto, Detroit, Louisville, Indianapolis), so those
// viewers saw the redundant "That's 12 PM EDT in your time zone." line the
// component exists to suppress.

describe('localStartTimeText', () => {
  const easternZones = [
    'America/New_York',
    'US/Eastern',
    'America/Toronto',
    'America/Detroit',
    'America/Kentucky/Louisville',
    'America/Indiana/Indianapolis',
  ];

  it.each(easternZones)('suppresses the redundant line for %s', (zone) => {
    expect(localStartTimeText(zone)).toBeNull();
  });

  it('still shows a converted time for Europe/London', () => {
    expect(localStartTimeText('Europe/London')).not.toBeNull();
  });

  it('still shows a converted time for Asia/Kolkata', () => {
    expect(localStartTimeText('Asia/Kolkata')).not.toBeNull();
  });
});
