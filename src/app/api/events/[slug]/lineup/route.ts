import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { AS_OF, getFallbackLineup, type FallbackArtist } from '@/lib/lineup-fallback';
import { canonicalEventSlug } from '@/lib/event-slugs';
import { lineupIsPublic } from '@/lib/lineup-reveal';
import { SITE } from '@/content/site';

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

/**
 * The lineup reveal has not happened yet.
 *
 * `getPublicArtists()` in src/lib/artists.ts has enforced this since
 * 2026-08-29 - "CONFIRMED artists only, and none before the reveal" - so the
 * website's /artist/<slug> pages are dark until 7 September. This route, which
 * is the OTHER public reader of the same table and the one the ZAO Festivals
 * mobile app calls, never got the rule. The day anyone marks an act confirmed
 * for planning, the app publishes the lineup, whatever the site promises.
 *
 * Nobody noticed because the artists table is empty, so both surfaces happen to
 * agree on nothing. The gate is missing all the same, and it stops being
 * theoretical the first time a row is set to confirmed.
 *
 * Additive, not a new shape: `artists: []` is exactly what the app already
 * receives today, so nothing downstream has to change. `published` and
 * `reveal_date` are there so a client can tell "not yet" from "nobody", which
 * is the same distinction this route already draws for failures.
 */
function beforeReveal() {
  return NextResponse.json(
    {
      artists: [],
      source: 'live' as const,
      published: false,
      reveal_date: SITE.lineupRevealDate,
    },
    { headers: { 'Cache-Control': EMPTY_LIVE_CACHE } },
  );
}

function live(artists: LineupArtist[]) {
  return NextResponse.json(
    { artists, source: 'live' as const },
    { headers: { 'Cache-Control': artists.length > 0 ? LIVE_CACHE : EMPTY_LIVE_CACHE } },
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

    // After the 404, so an unknown slug is still an honest 404 before the
    // reveal, and before the artists query, so no unpublished row is read at
    // all rather than read and then filtered.
    if (!lineupIsPublic()) return beforeReveal();

    const { data, error } = await supabase
      .from('artists')
      .select('id, name, genre, city, bio, photo_url, socials, set_order')
      .eq('event_id', event.id)
      .eq('status', 'confirmed')
      .order('set_order', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('[api/events/[slug]/lineup] artists query failed', error);
      return degraded(slug, 'upstream-error');
    }

    return live((data ?? []) as LineupArtist[]);
  } catch (error: unknown) {
    // A thrown fetch/network error lands here rather than in an `error` field.
    console.error('[api/events/[slug]/lineup] unexpected failure', error);
    return degraded(slug, 'upstream-unavailable');
  }
}
