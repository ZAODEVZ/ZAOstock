import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { AS_OF, getFallbackLineup, type FallbackArtist } from '@/lib/lineup-fallback';
import { canonicalEventSlug } from '@/lib/event-slugs';
import { isPublishable } from '@/lib/lineup-reveal';

// Public - confirmed lineup only, and only public-safe fields (no fee,
// rider, notes, contact info, or anything else internal to the artists
// table). Powers the ZAO Festivals mobile app's festival detail screen.
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
// must not be CACHED like a settled one. See EMPTY_LIVE_CACHE.

interface LineupArtist {
  id: string;
  name: string;
  genre: string | null;
  city: string | null;
  bio: string | null;
  photo_url: string | null;
  socials: string | null;
  set_order: number | null;
}

/**
 * Supabase answered AND there is a roster: cache at the edge, so the cache can
 * carry us through a later outage.
 */
const LIVE_CACHE = 'public, s-maxage=300, stale-while-revalidate=86400';

/**
 * Supabase answered and the roster is EMPTY.
 *
 * Still 200 and still `source: 'live'`, because the answer is known and "nobody
 * is confirmed yet" is a true thing to say. But it is the most perishable
 * answer this route has: the reveal is the exact moment it stops being true.
 *
 * Under LIVE_CACHE an empty list stays fresh for five minutes and is then served
 * STALE for another 24 hours while it revalidates. Measured on production
 * 2026-09-01: /api/events/zaostock/lineup returns {"artists":[],"source":"live"}
 * and the edge is already answering it X-Vercel-Cache: HIT. So on the 7
 * September reveal the mobile app could show an empty bill for a day after the
 * lineup landed, with nothing failing, nothing logged and nothing to look at.
 *
 * The long stale window exists to carry a REAL lineup through an outage. An
 * empty list carries nothing through anything, so holding it buys nothing and
 * costs the reveal.
 */
const EMPTY_LIVE_CACHE = 'public, s-maxage=30';

/** Serving the committed fallback: cache briefly, so we retry Supabase often. */
const FALLBACK_CACHE = 'public, s-maxage=60';

function live(artists: LineupArtist[], pending: number) {
  return NextResponse.json(
    { artists, source: 'live' as const, published: true, pending },
    { headers: { 'Cache-Control': LIVE_CACHE } },
  );
}

/**
 * Nobody is publishable yet.
 *
 * There is no reveal date any more (Zaal, 2026-09-10): an act goes public when
 * its own row is complete - confirmed, with a bio and a photo (isPublishable).
 * So an empty list is a normal state until the first act is complete, not an
 * alarm on a date. It still must not look like every other empty answer, which
 * is the 2026-09-07 lesson: `published: false` plus a `withheld` reason a
 * monitor can read, and `pending` counts acts that ARE confirmed but are still
 * missing a bio or photo, so "nobody confirmed" and "confirmed, photo not in
 * yet" are different answers.
 *
 * `reveal_date` is gone from every response, because the date it named no
 * longer exists. A client that read it now gets undefined, never a stale date.
 */
function noneYet(pending: number) {
  return NextResponse.json(
    {
      artists: [],
      source: 'live' as const,
      published: false,
      withheld: pending > 0 ? ('awaiting-bio-or-photo' as const) : ('no-confirmed-acts' as const),
      pending,
    },
    { headers: { 'Cache-Control': EMPTY_LIVE_CACHE } },
  );
}

/**
 * Supabase failed. Serve the committed lineup if there is one, otherwise say so
 * honestly with a 503 - never an empty 200.
 */
function degraded(slug: string, reason: string) {
  const fallback: FallbackArtist[] = getFallbackLineup(slug);

  if (fallback.length > 0) {
    return NextResponse.json(
      { artists: fallback, source: 'fallback' as const, as_of: AS_OF, degraded: true },
      { headers: { 'Cache-Control': FALLBACK_CACHE } },
    );
  }

  return NextResponse.json(
    { error: 'Lineup temporarily unavailable', reason, degraded: true, retry: true },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // The mobile app calls 'zaostock-2026'; the events table says 'zaostock'.
  // Resolved before the lookup, not after it fails, or the alias only works
  // while the database is down (src/lib/event-slugs.ts).
  const eventSlug = canonicalEventSlug(slug);

  let supabase: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabase = getSupabaseAdmin();
  } catch (error: unknown) {
    // Absent or misconfigured credentials. From the caller's point of view this
    // is still the data source being unavailable, so it degrades the same way.
    console.error('[api/events/[slug]/lineup] supabase client unavailable', error);
    return degraded(slug, 'upstream-unavailable');
  }

  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', eventSlug)
      .maybeSingle();

    if (eventError) {
      console.error('[api/events/[slug]/lineup] event lookup failed', eventError);
      return degraded(slug, 'upstream-error');
    }

    // A missing event is a real 404, not a degradation - the answer is known.
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const { data, error } = await supabase
      .from('artists')
      .select('id, name, genre, city, bio, photo_url, socials, set_order, status')
      .eq('event_id', event.id)
      .eq('status', 'confirmed')
      .order('set_order', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('[api/events/[slug]/lineup] artists query failed', error);
      return degraded(slug, 'upstream-error');
    }

    const rows = (data ?? []) as Array<LineupArtist & { status?: string | null }>;

    // THE GATE. Confirmed alone is not enough: an act is public only with its
    // bio and photo in the row. Incomplete rows are counted, never serialised.
    const artists: LineupArtist[] = rows
      .filter(isPublishable)
      .map(({ status: _status, ...publicFields }) => publicFields);
    // `pending` is acts that ARE confirmed but still missing a bio or photo -
    // never the whole roster. Counted from status explicitly rather than from
    // what the query happened to return, so it cannot drift if the query does.
    const pending = rows.filter((r) => r.status === 'confirmed' && !isPublishable(r)).length;

    if (artists.length === 0) return noneYet(pending);

    return live(artists, pending);
  } catch (error: unknown) {
    // A thrown fetch/network error lands here rather than in an `error` field.
    console.error('[api/events/[slug]/lineup] unexpected failure', error);
    return degraded(slug, 'upstream-unavailable');
  }
}
