import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { issueMobileToken } from '@/lib/auth/session';
import { verifyPrivyIdentityEmail } from '@/lib/auth/verify-privy-identity';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

const privyLoginSchema = z.object({
  identityToken: z.string().min(1),
});

// Mobile-only counterpart to /api/team/mobile-login - same bearer-token
// outcome, but the credential proving who you are is a Privy-verified email
// instead of the team password. Only works once a member has linked an
// email via /api/team/link-email; nothing here creates a team_members row.
export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitPublicForm(request, 'team-privy-login', { windowMs: 5 * 60_000, maxAttempts: 10 });
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const parsed = privyLoginSchema.safeParse(parsedBody.data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    let email: string | null;
    try {
      email = await verifyPrivyIdentityEmail(parsed.data.identityToken);
    } catch (err) {
      console.error('[team/privy-login] token verification failed', err);
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data: match } = email
      ? await supabase.from('team_members').select('id, name, active').ilike('email', email).maybeSingle()
      : { data: null };

    // Same generic response as the password login route, for the same
    // reason - no distinguishing "no email on file" from "email on file but
    // inactive" from "token didn't verify."
    if (!match || match.active === false) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    await supabase.from('team_members').update({ last_login_at: new Date().toISOString() }).eq('id', match.id);
    const token = await issueMobileToken(match.id, match.name);
    return NextResponse.json({ success: true, token, name: match.name });
  } catch (err) {
    console.error('[team/privy-login] unexpected', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
