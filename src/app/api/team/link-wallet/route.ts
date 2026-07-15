import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { verifyWalletProof } from '@/lib/auth/verify-wallet-signature';
import { parseJsonBody } from '@/lib/api/parse-json';

const linkWalletSchema = z.object({
  address: z.string().min(1),
  message: z.string().min(1),
  signature: z.string().min(1),
});

// Requires an existing session (password or already-linked wallet) - this is
// how a member first connects a wallet to their account, not how they prove
// who they are from scratch. Server-verifies the signature so a client
// can't just assert an arbitrary address.
export async function POST(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const parsed = linkWalletSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const verified = await verifyWalletProof(parsed.data);
  if (!verified) {
    return NextResponse.json({ error: 'Could not verify that wallet' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('team_members')
    .update({ wallet_address: parsed.data.address })
    .eq('id', member.memberId);

  if (error) {
    // Most likely the partial unique index on lower(wallet_address) -
    // someone else already linked this address.
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That wallet is already linked to another account' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to link wallet' }, { status: 500 });
  }

  return NextResponse.json({ success: true, address: parsed.data.address });
}
