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

  if (error) {
    console.error('[api/events] Supabase query failed', error);
    // TEMP diagnostic - real error text in the response so it's visible
    // without Vercel log access. Reverting to a plain message once the
    // 2026-07-16 production 500 is diagnosed.
    let resolvedHost = 'unset';
    try {
      resolvedHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname;
    } catch {
      resolvedHost = 'invalid-url';
    }
    return NextResponse.json({ error: 'Failed to load events', debug: error.message, code: error.code, resolvedHost }, { status: 500 });
  }
  return NextResponse.json({ events: data });
}
