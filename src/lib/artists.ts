import { cache } from 'react';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { randomBytes } from 'crypto';
import { lineupIsPublic } from '@/lib/lineup-reveal';

export interface PublicArtist {
  id: string;
  name: string;
  slug: string;
  genre: string;
  city: string;
  status: 'wishlist' | 'contacted' | 'interested' | 'confirmed' | 'declined' | 'travel_booked';
  socials: string;
  bio: string;
  photo_url: string;
  logo_url: string;
  cypher_interested: boolean;
  cypher_role: string;
  points_earned: number;
  volunteer_eligible: boolean;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function generateClaimToken(): string {
  return randomBytes(8).toString('hex');
}

// Public pages: CONFIRMED artists only, and none before the reveal. Before
// 2026-08-29 this filtered on status != 'declined', which would have given
// every cypher applicant a live /artist/<name> page before anyone confirmed
// them, and every confirmed act a page before 7 September (Iman's audit,
// items 05 and the reveal rule). Wrapped in react cache() so generateMetadata
// and the page share one query per request.
export const getPublicArtists = cache(async function getPublicArtists(): Promise<PublicArtist[]> {
  if (!lineupIsPublic()) return [];
  const supabase = getSupabaseAdmin();

  // SCOPED TO THIS FESTIVAL. The artists table holds rows for every ZAO event -
  // zao-palooza, zao-chella, zaoville and zaostock all exist in `events`. This
  // query had no event filter, so any row anywhere marked 'confirmed' would have
  // appeared on ZAOstock's public pages. Measured 2026-09-08: only zaostock has
  // artist rows and none is confirmed, so it could not fire - but Hurricane and
  // DCoop played past ZAO festivals, and backfilling those rosters would have
  // put another festival's line-up on this one's site. Same missing scope as
  // /api/admin/confirm-artist, fixed there in the same week; this is the public
  // half, which is the half a stranger sees.
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('slug', 'zaostock')
    .maybeSingle();

  // No event, no lineup. Failing to an empty list is right here: the caller
  // renders "not yet", which is the same thing it shows before the reveal.
  if (!event) return [];

  const { data, error } = await supabase
    .from('artists')
    .select('id, name, genre, city, status, socials, bio, photo_url, logo_url, cypher_interested, cypher_role, points_earned, volunteer_eligible')
    .eq('event_id', event.id)
    .eq('status', 'confirmed')
    .order('status')
    .order('name');

  if (error || !data) return [];

  return data.map((a) => ({
    id: a.id,
    name: a.name,
    slug: slugify(a.name),
    genre: a.genre || '',
    city: a.city || '',
    status: a.status,
    socials: a.socials || '',
    bio: a.bio || '',
    photo_url: a.photo_url || '',
    logo_url: a.logo_url || '',
    cypher_interested: Boolean(a.cypher_interested),
    cypher_role: a.cypher_role || '',
    points_earned: a.points_earned || 0,
    volunteer_eligible: Boolean(a.volunteer_eligible),
  }));
});

export async function getArtistBySlug(slug: string): Promise<PublicArtist | null> {
  const all = await getPublicArtists();
  return all.find((a) => a.slug === slug) || null;
}

export async function verifyClaimToken(slug: string, token: string): Promise<string | null> {
  if (!token || token.length < 4) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('artists')
    .select('id, name, claim_token')
    .eq('claim_token', token)
    .maybeSingle();
  if (error || !data) return null;
  if (slugify(data.name) !== slug) return null;
  return data.id;
}
