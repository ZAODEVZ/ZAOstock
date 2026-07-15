import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { issueMobileToken } from '@/lib/auth/session';
import { verifyWalletProof } from '@/lib/auth/verify-wallet-signature';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

const walletLoginSchema = z.object({
  address: z.string().min(1),
  message: z.string().min(1),
  signature: z.string().min(1),
});

// Wallet-connect counterpart to /api/team/mobile-login and the earlier
// (now removed) Privy version - same bearer-token outcome, but the
// credential proving who you are is a signed message from a wallet the
// member already owns, verified with zero custody on our side.
export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitPublicForm(request, 'team-wallet-login', { windowMs: 5 * 60_000, maxAttempts: 10 });
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const parsed = walletLoginSchema.safeParse(parsedBody.data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    const verified = await verifyWalletProof(parsed.data);
    if (!verified) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { data: match } = await supabase
      .from('team_members')
      .select('id, name, active')
      .ilike('wallet_address', parsed.data.address)
      .maybeSingle();

    // Same generic response as every other login route in this app, for the
    // same reason - no distinguishing "no wallet on file" from "wallet on
    // file but inactive" from "signature didn't verify."
    if (!match || match.active === false) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    await supabase.from('team_members').update({ last_login_at: new Date().toISOString() }).eq('id', match.id);
    const token = await issueMobileToken(match.id, match.name);
    return NextResponse.json({ success: true, token, name: match.name });
  } catch (err) {
    console.error('[team/wallet-login] unexpected', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
