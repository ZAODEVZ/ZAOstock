// Calendar-day difference, not a raw millisecond ceil. 2026-09-17, Zaal: the
// /onepagers/overview stat read "17 days to go" when 17 September to
// 3 October is 16 - the prior Math.ceil((target - now) / 86400000) rounds
// any partial day remaining UP, overcounting by one for roughly half of
// every day. Comparing whole dates in America/New_York (the festival's own
// timezone) instead ticks over exactly once per real calendar day, at
// midnight, not at a fixed hour determined by the target's own time-of-day.
export function daysUntil(iso: string): number {
  const tz = 'America/New_York';
  const ymd = (d: Date) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const today = new Date(`${ymd(new Date())}T00:00:00Z`);
  const target = new Date(`${ymd(new Date(iso))}T00:00:00Z`);
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}
