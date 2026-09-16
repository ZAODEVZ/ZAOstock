import { cache } from 'react';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { randomBytes } from 'crypto';

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
  setOrder: number;
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

type BillCandidate = { set_order: number | null; status: string };

// THE EIGHT-ACT SCOPE, as its own testable predicate rather than buried in a
// query chain. `set_order IS NOT NULL AND status != 'declined'`, not
// `status != 'declined'` alone. The artists table also holds cypher/open-mic
// interest rows (AttaBotty, Clejan, Duo Do Musica, Joseph Goats, "Steve Peer
// network" - measured 2026-09-15) that were never part of the eight-act
// bill; `set_order` is populated only for the acts actually on it (1-9 -
// Hurricane held 6 before he was declined, 2026-09-10), so it is the same
// column the run of show already uses. Before 2026-08-29 the query filtered
// on status != 'declined' alone, which would have given every cypher
// applicant a live page - the exact bug this predicate avoids reintroducing
// (Iman's audit, items 05 and the reveal rule). Filtered in JS rather than
// the query chain so it is a function with a name, not a clause nobody can
// unit test without a live database.
export function isOnBill(row: BillCandidate): boolean {
  return row.set_order !== null && row.status !== 'declined';
}

// THE EIGHT-ACT ROSTER, not the confirmed-and-complete subset.
//
// RULING 2026-09-15 (grill 22:1x, relayed by the seat): "every act's page
// renders, blanks where nothing exists - no 404s." His words: "just add
// everything, leave missing things blank." Before this, /artist/<slug> used
// isPublishable (confirmed + bio + photo) as its gate, same as the lineup
// API - six of eight acts 404'd because only DCoop and LyonsDen were
// confirmed, and the #194 fellenz->tom-fellenz redirect landed on one of
// those 404s.
//
// isPublishable and the lineup API (src/app/api/events/[slug]/lineup) are
// UNCHANGED and still gate strictly - that surface is the reveal the ZAO
// Festivals app reads, and Zaal's ruling was about this site's own artist
// pages, not the reveal. The two surfaces now deliberately differ: the app
// only ever sees fully-confirmed acts; the website shows every act on the
// bill with real fields where they exist and blanks where they do not.
//
// Wrapped in react cache() so generateMetadata and the page share one query
// per request.
export const getRosterArtists = cache(async function getRosterArtists(): Promise<PublicArtist[]> {
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
    .select('id, name, genre, city, status, socials, bio, photo_url, logo_url, cypher_interested, cypher_role, points_earned, volunteer_eligible, set_order')
    .eq('event_id', event.id)
    .order('set_order');

  if (error || !data) return [];

  return data.filter(isOnBill).map((a) => ({
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
    setOrder: a.set_order,
  }));
});

export async function getArtistBySlug(slug: string): Promise<PublicArtist | null> {
  const all = await getRosterArtists();
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
