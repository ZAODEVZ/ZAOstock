import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { ENV } from '@/lib/env';

const INACTIVITY_WINDOW_DAYS = 3;

// Vercel Cron calls this on schedule (see vercel.json) with a bearer token
// matching CRON_SECRET. Locks out any active team member who hasn't logged
// in within the window - falls back to created_at for members who have
// never logged in, so new hires get a grace period instead of an instant
// lockout.
export async function GET(request: NextRequest) {
  let cronSecret: string;
  try {
    cronSecret = ENV.CRON_SECRET;
  } catch (err) {
    console.error('[cron/deactivate-inactive] CRON_SECRET not set', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - INACTIVITY_WINDOW_DAYS * 24 * 60 * 60_000).toISOString();
  const supabase = getSupabaseAdmin();

  const { data: candidates, error: selectError } = await supabase
    .from('team_members')
    .select('id, name, last_login_at, created_at')
    .eq('active', true);

  if (selectError) {
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }

  const toDeactivate = (candidates ?? []).filter((m) => (m.last_login_at ?? m.created_at) < cutoff);

  if (toDeactivate.length === 0) {
    return NextResponse.json({ deactivated: [] });
  }

  const { error: updateError } = await supabase
    .from('team_members')
    .update({ active: false, deactivated_at: new Date().toISOString() })
    .in('id', toDeactivate.map((m) => m.id));

  if (updateError) {
    return NextResponse.json({ error: 'Deactivation failed' }, { status: 500 });
  }

  return NextResponse.json({ deactivated: toDeactivate.map((m) => ({ id: m.id, name: m.name })) });
}
