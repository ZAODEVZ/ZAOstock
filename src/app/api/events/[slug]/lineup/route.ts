import { NextRequest, NextResponse } from 'next/server';
import { getPublicLineup } from '@/lib/lineup';

// Public - confirmed lineup only, and only public-safe fields (no fee,
// rider, notes, contact info, or anything else internal to the artists
// table). Powers the ZAO Festivals mobile app's festival detail screen.
//
// The query + gate logic lives in src/lib/lineup.ts, shared with the /live
// page (2026-09-23) so a server component can read the same published
// lineup without an internal HTTP round-trip to this route.
//
// DEGRADATION (see src/lib/lineup-fallback.ts for the full why)
// Supabase is the source of truth. When it is unreachable - as on 2026-08-22,
// when the org hit its egress quota and REST began returning 402, which does
// not refill until 2026-09-21 - this route falls back to the lineup committed
// in the bundle rather than going dark.
//
// The one rule: an EMPTY fallback is not a lineup. We never answer 200 with
// `{"artists": []}` sourced from a failure, because "no confirmed artists" and
// "we could not find out" are different claims, and conflating them is how a
// broken surface reads as a working one.
//
// The same rule has a second edge, on the LIVE path rather than the failure
// path: an empty list that Supabase really did return is a true answer, but it
// must not be CACHED like a settled one. See EMPTY_LIVE_CACHE below.

/**
 * Supabase answered AND there is a roster: cache at the edge, so the cache can
 * carry us through a later outage.
 */
const LIVE_CACHE = 'public, s-maxage=300, stale-while-revalidate=86400';

/**
 * Supabase answered and the roster is EMPTY. Still 200 and still
 * `source: 'live'`, but the most perishable answer this route can give - see
 * git history on this file for the 2026-09-01 incident this guards against.
 */
const EMPTY_LIVE_CACHE = 'public, s-maxage=30';

/** Serving the committed fallback: cache briefly, so we retry Supabase often. */
const FALLBACK_CACHE = 'public, s-maxage=60';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicLineup(slug);

  // A missing event is a real 404, not a degradation - the answer is known.
  if (result.source === 'not-found') {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  if (result.source === 'unavailable') {
    return NextResponse.json(
      { error: 'Lineup temporarily unavailable', reason: 'upstream-unavailable', degraded: true, retry: true },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (result.source === 'fallback') {
    return NextResponse.json(
      { artists: result.artists, source: 'fallback' as const, as_of: result.as_of, degraded: true },
      { headers: { 'Cache-Control': FALLBACK_CACHE } },
    );
  }

  if (!result.published) {
    return NextResponse.json(
      {
        artists: [],
        source: 'live' as const,
        published: false,
        withheld: result.withheld,
        pending: result.pending,
      },
      { headers: { 'Cache-Control': EMPTY_LIVE_CACHE } },
    );
  }

  return NextResponse.json(
    { artists: result.artists, source: 'live' as const, published: true, pending: result.pending },
    { headers: { 'Cache-Control': LIVE_CACHE } },
  );
}
