import { NextResponse } from 'next/server';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';

// page.tsx fetches rsvps directly server-side for the web dashboard, but
// that path doesn't exist for the mobile client - it needs a real endpoint
// the same way every other module already has one.
export async function GET() {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('rsvps')
    .select('id, name, email, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to load rsvps' }, { status: 500 });
  return NextResponse.json({ rsvps: data });
}
