import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';

// Every module route accepts ?event_id= so the mobile app's event switcher
// can scope its queries. When it's omitted (every existing web-dashboard
// call, and any older mobile build), this falls back to the ZAOstock event
// - the team dashboard has only ever operated as "ZAOstock Team Dashboard,"
// so that's the behavior-preserving default, not an arbitrary pick.
export async function resolveEventId(request: NextRequest): Promise<string | null> {
  const requested = request.nextUrl.searchParams.get('event_id');
  if (requested) return requested;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from('events').select('id').eq('slug', 'zaostock').maybeSingle();
  return data?.id ?? null;
}
