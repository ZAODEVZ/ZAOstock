import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';

// Lightweight health check for uptime monitoring (see
// .github/workflows/uptime.yml). Does a real, cheap round-trip to the
// database - a HEAD count on `events` - so it fails when the DB is
// unreachable OR misconfigured, not just when the process is down.
//
// It also reports the Supabase host the deployment is actually talking to.
// NEXT_PUBLIC_SUPABASE_URL is public (it ships in the client bundle), so
// this leaks nothing secret - but it's the single signal that would have
// caught the 2026-07 outage, where prod was silently pointed at the wrong
// Supabase project. A monitor can assert on `db.host` to pin the right one.
export const dynamic = 'force-dynamic';

export async function GET() {
  let dbHost = 'unset';
  try {
    dbHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').hostname;
  } catch {
    dbHost = 'invalid-url';
  }

  const startedAt = performance.now();
  try {
    const supabase = getSupabaseAdmin();
    // HEAD + count: no rows transferred, just confirms the table is
    // reachable and the schema exists on the connected project.
    const { error } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true });

    const latencyMs = Math.round(performance.now() - startedAt);

    if (error) {
      console.error('[api/health] db check failed', error);
      return NextResponse.json(
        { status: 'degraded', db: { ok: false, host: dbHost, latencyMs, code: error.code } },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { status: 'ok', db: { ok: true, host: dbHost, latencyMs } },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    // getSupabaseAdmin throws when env vars are missing entirely.
    console.error('[api/health] unhealthy', err);
    return NextResponse.json(
      { status: 'unhealthy', db: { ok: false, host: dbHost } },
      { status: 503 },
    );
  }
}
