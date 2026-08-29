import { cache } from 'react';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { slugify, type PublicMember } from '@/lib/members-shared';

// Re-export the client-safe helpers/types so existing server import sites
// (`@/lib/members`) keep working unchanged. Client components should import
// these directly from '@/lib/members-shared' to avoid pulling in Supabase.
export { slugify, parseLinks } from '@/lib/members-shared';
export type { PublicMember, ParsedLink } from '@/lib/members-shared';

export interface StockCounts {
  volunteers: number;
  rsvps: number;
  sponsorsCommitted: number;
  sponsorsCommittedAmount: number;
}

export async function getStockCounts(): Promise<StockCounts> {
  const supabase = getSupabaseAdmin();

  const [vRes, rRes, sRes] = await Promise.allSettled([
    supabase.from('volunteers').select('id', { count: 'exact', head: true }),
    supabase
      .from('rsvps')
      .select('id', { count: 'exact', head: true }),
    supabase
      .from('sponsors')
      .select('amount_committed, status')
      .in('status', ['committed', 'paid']),
  ]);

  const volunteers = vRes.status === 'fulfilled' ? vRes.value.count || 0 : 0;
  const rsvps = rRes.status === 'fulfilled' ? rRes.value.count || 0 : 0;

  let sponsorsCommitted = 0;
  let sponsorsCommittedAmount = 0;
  if (sRes.status === 'fulfilled' && sRes.value.data) {
    sponsorsCommitted = sRes.value.data.length;
    sponsorsCommittedAmount = sRes.value.data.reduce(
      (sum, s) => sum + Number(s.amount_committed || 0),
      0,
    );
  }

  return { volunteers, rsvps, sponsorsCommitted, sponsorsCommittedAmount };
}

// react cache(): generateMetadata, the page and its "more of the crew" list
// share one team_members read per request instead of three (Iman's audit, 10).
export const getPublicMembers = cache(async function getPublicMembers(): Promise<PublicMember[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, scope, secondary_scope, bio, links, photo_url, status_text, skills, active')
    .neq('active', false)
    .order('created_at');

  if (error || !data) {
    if (error) console.error('[getPublicMembers] query failed (check Supabase project + schema):', error.message);
    return [];
  }

  return data.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role || 'member',
    scope: m.scope || 'ops',
    secondary_scope: m.secondary_scope || '',
    bio: m.bio || '',
    links: m.links || '',
    photo_url: m.photo_url || '',
    status_text: m.status_text || '',
    skills: m.skills || '',
    slug: slugify(m.name),
  }));
});

export async function getMemberBySlug(slug: string): Promise<PublicMember | null> {
  const all = await getPublicMembers();
  return all.find((m) => m.slug === slug) || null;
}
