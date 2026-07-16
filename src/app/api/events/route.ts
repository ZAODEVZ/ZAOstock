import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';

// Public counterpart to /api/team/events - same table, but no auth and a
// narrower field set (no internal-only fields, though there currently
// aren't any beyond what's already shown here). Powers the ZAO Festivals
// mobile app's public home screen, which lists all festivals - past and
// upcoming - before anyone signs in.
export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('events')
    .select('id, name, slug, place, event_date, status, description')
    .order('event_date');

  if (error) return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  return NextResponse.json({ events: data });
}
