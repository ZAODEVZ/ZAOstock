import { NextRequest, NextResponse } from 'next/server';
import { TEAM_DASHBOARD_RETIRED, TEAM_RETIRED_MESSAGE } from '@/lib/team-status';

import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { saveStockTeamSession } from '@/lib/auth/session';
import { findTeamPasswordMatch } from '@/lib/auth/verify-team-password';
import { parseJsonBody } from '@/lib/api/parse-json';

const loginSchema = z.object({
  password: z.string().min(1).max(64),
});

// Best-effort in-memory throttle (per warm instance). A durable store is the
// real fix, but this raises the bar against naive brute-forcing of team codes.
const WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  if (TEAM_DASHBOARD_RETIRED) return NextResponse.json({ error: TEAM_RETIRED_MESSAGE }, { status: 410 });
  try {
    const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Wait a few minutes and try again.' },
        { status: 429 },
      );
    }

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.data;
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const normalized = parsed.data.password.trim().toUpperCase();
    const match = await findTeamPasswordMatch(normalized);

    // Deliberately the same response whether the code was wrong or it
    // matched an inactive member - a distinct "your code is valid but
    // paused" response would let an attacker enumerate real team codes by
    // password-guessing and watching for the different status. The client
    // always offers a "request access" fallback after any failed login
    // instead, since /api/team/request-access is itself already a no-op for
    // wrong codes and active members.
    if (!match || match.active === false) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    await supabase.from('team_members').update({ last_login_at: new Date().toISOString() }).eq('id', match.id);
    await saveStockTeamSession(match.id, match.name);
    return NextResponse.json({ success: true, name: match.name });
  } catch (err) {
    console.error('[team/login] unexpected', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
