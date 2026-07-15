import { NextResponse } from 'next/server';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';

export async function GET() {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('events')
    .select('id, name, slug, place, event_date, status, description')
    .order('event_date');

  if (error) return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  return NextResponse.json({ events: data });
}
