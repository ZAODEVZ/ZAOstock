import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { AS_OF, getFallbackLineup, type FallbackArtist } from '@/lib/lineup-fallback';

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

/** Supabase is live: cache at the edge, so the cache can carry us through a later outage. */
const LIVE_CACHE = 'public, s-maxage=300, stale-while-revalidate=86400';
/** Serving the committed fallback: cache briefly, so we retry Supabase often. */
const FALLBACK_CACHE = 'public, s-maxage=60';

function live(artists: LineupArtist[]) {
  return NextResponse.json(
    { artists, source: 'live' as const },
    { headers: { 'Cache-Control': LIVE_CACHE } },
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
      .eq('slug', slug)
      .maybeSingle();

    if (eventError) {
      console.error('[api/events/[slug]/lineup] event lookup failed', eventError);
      return degraded(slug, 'upstream-error');
    }

    // A missing event is a real 404, not a degradation - the answer is known.
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

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
