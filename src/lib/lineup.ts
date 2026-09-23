import { getSupabaseAdmin } from '@/lib/db/supabase';
import { AS_OF, getFallbackLineup, type FallbackArtist } from '@/lib/lineup-fallback';
import { canonicalEventSlug } from '@/lib/event-slugs';
import { isPublishable } from '@/lib/lineup-reveal';

// Shared with src/app/api/events/[slug]/lineup/route.ts, which is the public
// HTTP surface for the mobile app. This is the same query and the same gate,
// factored out so a server component (e.g. /live) can read the published
// lineup directly, without an internal HTTP round-trip to its own API route.

export interface LineupArtist {
  id: string;
  name: string;
  genre: string | null;
  city: string | null;
  bio: string | null;
  photo_url: string | null;
  socials: string | null;
  set_order: number | null;
}

export type LineupResult =
  | { source: 'live'; published: true; artists: LineupArtist[]; pending: number }
  | { source: 'live'; published: false; withheld: 'awaiting-bio-or-photo' | 'no-confirmed-acts'; pending: number; artists: [] }
  | { source: 'fallback'; artists: FallbackArtist[]; as_of: string; degraded: true }
  | { source: 'unavailable'; artists: []; degraded: true }
  // The event slug itself doesn't exist. A real, known answer (404), not a
  // degradation - do not route this through the fallback like a failure.
  | { source: 'not-found'; artists: [] };

export async function getPublicLineup(slug: string): Promise<LineupResult> {
  const eventSlug = canonicalEventSlug(slug);

  let supabase: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabase = getSupabaseAdmin();
  } catch (error: unknown) {
    console.error('[lineup] supabase client unavailable', error);
    return degraded(slug);
  }

  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', eventSlug)
      .maybeSingle();

    if (eventError) {
      console.error('[lineup] event lookup failed', eventError);
      return degraded(slug);
    }
    if (!event) return { source: 'not-found', artists: [] };

    const { data, error } = await supabase
      .from('artists')
      .select('id, name, genre, city, bio, photo_url, socials, set_order, status')
      .eq('event_id', event.id)
      .eq('status', 'confirmed')
      .order('set_order', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('[lineup] artists query failed', error);
      return degraded(slug);
    }

    const rows = (data ?? []) as Array<LineupArtist & { status?: string | null }>;
    const artists: LineupArtist[] = rows.filter(isPublishable).map((row) => {
      const { status, ...publicFields } = row;
      void status; // read only to strip it from the public payload, never serialised
      return publicFields;
    });
    const pending = rows.filter((r) => r.status === 'confirmed' && !isPublishable(r)).length;

    if (artists.length === 0) {
      return {
        source: 'live',
        published: false,
        withheld: pending > 0 ? 'awaiting-bio-or-photo' : 'no-confirmed-acts',
        pending,
        artists: [],
      };
    }

    return { source: 'live', published: true, artists, pending };
  } catch (error: unknown) {
    console.error('[lineup] unexpected failure', error);
    return degraded(slug);
  }
}

function degraded(slug: string): LineupResult {
  const fallback = getFallbackLineup(slug);
  if (fallback.length > 0) return { source: 'fallback', artists: fallback, as_of: AS_OF, degraded: true };
  return { source: 'unavailable', artists: [], degraded: true };
}
