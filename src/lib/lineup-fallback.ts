// Build-time lineup fallback.
//
// WHY THIS EXISTS
// The public lineup endpoint reads the `artists` table at request time. On
// 2026-08-22 the Supabase org hit its egress quota, REST began returning 402,
// and `/api/events/zaostock-2026/lineup` returned 500 for every caller. The
// quota does not refill until 2026-09-21, which is twelve days before the
// event. A festival lineup should not go blank because a database is
// rate-limited, so the endpoint degrades to this file instead.
//
// WHAT IT IS
// The last known-good confirmed lineup, committed to the repo and therefore
// baked into the bundle at build time. Supabase remains the source of truth
// and enriches at runtime whenever it is reachable; this is only the floor.
//
// THE ONE RULE
// An EMPTY fallback is not a lineup. If this array is empty the endpoint
// returns 503, never `{"artists": []}` with a 200 - because "no confirmed
// artists" and "we could not find out" are different claims, and serving the
// second as the first is the false-green shape this estate keeps getting bitten
// by. Degradation must never become fabrication.
//
// HOW TO POPULATE IT
// Add one entry per CONFIRMED artist, copied from the `artists` table (or from
// whoever holds the roster) - never invented, never inferred from a chat
// message. Update `AS_OF` in the same edit so consumers can see the age.
// Anything not confirmed does not belong here.

export interface FallbackArtist {
  id: string;
  name: string;
  genre: string;
  city: string;
  bio: string;
  photo_url: string;
  socials: string;
  set_order: number | null;
}

/** ISO date the entries below were last reconciled against the real roster. */
export const AS_OF = '2026-08-22';

/**
 * Confirmed artists, by event slug.
 *
 * Deliberately empty. The roster was not reachable when this shipped (Supabase
 * 402), and nobody should hand-write a name here from memory or from a meeting
 * transcript. Populate from the real roster, then the endpoint serves this on
 * failure instead of a 503.
 */
export const LINEUP_FALLBACK: Record<string, FallbackArtist[]> = {
  'zaostock-2026': [],
};

export function getFallbackLineup(slug: string): FallbackArtist[] {
  return LINEUP_FALLBACK[slug] ?? [];
}
