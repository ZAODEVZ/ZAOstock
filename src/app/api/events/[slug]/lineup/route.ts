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
// NO EDGE CACHING. There used to be one (s-maxage=60/30, stale-while-revalidate
// for the fallback path) - removed 2026-09-28. Measured directly against
// production that day: `curl -D- https://zaostock.com/api/events/zaostock/lineup`
// returned `cache-control: public` with every s-maxage/stale-while-revalidate
// directive stripped off the wire, and `x-vercel-cache: MISS` with `age: 0` on
// every single request, including back to back ones. So the edge cache was
// never actually caching anything - the only live effect of the header was a
// bare `public` reaching browsers with no max-age, which is exactly the shape
// that invites heuristic client-side caching (RFC 7234 4.2.2) and is the
// mechanism a day-of artist-record fix failed to reach a plain request while a
// cache-busted one saw it immediately (Vault lane, 2026-09-28). Nobody calls
// this route in volume - Zaal's own ruling that day: "it should be right or
// removed." A cache that was never caching, promising freshness it did not
// keep, was neither - `no-store` is what was actually true the whole time.
const NO_CACHE = 'no-store';

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
      { headers: { 'Cache-Control': NO_CACHE } },
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
      { headers: { 'Cache-Control': NO_CACHE } },
    );
  }

  return NextResponse.json(
    { artists: result.artists, source: 'live' as const, published: true, pending: result.pending },
    { headers: { 'Cache-Control': NO_CACHE } },
  );
}
