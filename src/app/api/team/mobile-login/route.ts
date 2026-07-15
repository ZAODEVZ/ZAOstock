import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { issueMobileToken } from '@/lib/auth/session';
import { findTeamPasswordMatch } from '@/lib/auth/verify-team-password';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

const loginSchema = z.object({
  password: z.string().min(1).max(64),
});

// Mobile counterpart to /api/team/login - same credential and the same
// findTeamPasswordMatch() check, but issues a sealed bearer token instead of
// setting a cookie (React Native has no first-class HTTP-only cookie jar
// across iOS/Android the way a browser does). The token is verified by the
// same getStockTeamMember() every existing /api/team/* route already calls,
// via the Authorization header fallback in lib/auth/session.ts.
export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitPublicForm(request, 'team-mobile-login', { windowMs: 5 * 60_000, maxAttempts: 10 });
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const parsed = loginSchema.safeParse(parsedBody.data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const normalized = parsed.data.password.trim().toUpperCase();
    const match = await findTeamPasswordMatch(normalized);

    // Same generic response as the web login route, for the same reason -
    // no distinguishing "wrong code" from "valid but paused."
    if (!match || match.active === false) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    await supabase.from('team_members').update({ last_login_at: new Date().toISOString() }).eq('id', match.id);
    const token = await issueMobileToken(match.id, match.name);
    return NextResponse.json({ success: true, token, name: match.name });
  } catch (err) {
    console.error('[team/mobile-login] unexpected', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
