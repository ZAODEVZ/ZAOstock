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
// for the fallback path) - removed 2026-09-28.
//
// THE EDGE CACHE WAS WORKING, AND THAT WAS THE PROBLEM, NOT THE FIX FOR IT. An
// earlier version of this comment said the opposite - that x-vercel-cache
// stayed MISS on every request, so the cache was never actually caching. That
// reading was taken once, right after a deploy, which resets the edge entry -
// every request in that window is a legitimate MISS, and it does not
// generalise. Measured properly the same day (Vault lane, cross-checked
// independently right after): a plain request came back `x-vercel-cache: HIT`
// with `age` climbing request over request (14, then later 55, 56, 57 -
// seconds since the entry was written), and one sample caught `age: 338` -
// Vercel's edge was holding a copy nearly six minutes old and serving it. A
// day-of artist-record fix failing to reach a plain request while a
// cache-busted one saw it immediately (the original incident this fix answers)
// is exactly what that HIT/age evidence explains: Vercel's edge, not browser
// heuristic caching, was the layer serving stale.
//
// What both readings agree on, and what is still true: the Cache-Control that
// actually reaches the wire is a bare `public`, with every s-maxage/
// stale-while-revalidate directive from the code stripped off it before it
// gets there. So the number in the code was never the number being served -
// there was no reliable way to tune it from here, only to remove it.
//
// Nobody calls this route in volume. Zaal's own ruling: "it should be right or
// removed." Against a cache that turned out to be working fine and holding a
// stale artist roster for minutes at a time, `no-store` is the fix - not
// because nothing was cacheable, but because what was being served could not
// be trusted to match what the code asked for.
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
