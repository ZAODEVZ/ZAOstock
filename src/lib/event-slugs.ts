// Which slug names which event.
//
// WHY THIS EXISTS
//
// The events table uses `zaostock`. The ZAO Festivals mobile app calls
// `/api/events/zaostock-2026/lineup`, and can send `eventSlug: 'zaostock-2026'`
// to the RSVP route. That slug has never existed in the table.
//
// For a week this did not show. Supabase was unreachable, the lineup route
// degraded to the committed fallback, and the fallback was keyed by both
// names, so both answered. When production was repointed at the real project
// on the morning of 2026-08-31 the event lookup started succeeding, which
// meant it now ran to completion first: `zaostock-2026` became a hard 404 on
// the lineup, and an RSVP carrying it was written with `event_id: null`,
// silently detached from the festival. Fixing the database is what broke the
// client, which is the shape of bug that only appears when the thing above you
// gets better.
//
// So the alias is resolved before the lookup rather than after the failure.
//
// Add a line here rather than a row to the events table: a second event row
// would split RSVPs and lineup writes across two ids, which is the same
// problem one layer down and much harder to see.
const EVENT_SLUG_ALIASES: Record<string, string> = {
  'zaostock-2026': 'zaostock',
};

/**
 * The slug the events table actually uses, for any slug a client might send.
 * Unknown slugs pass through unchanged, so a genuinely wrong one still 404s.
 */
export function canonicalEventSlug(slug: string): string {
  return EVENT_SLUG_ALIASES[slug] ?? slug;
}
