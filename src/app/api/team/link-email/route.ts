import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { verifyPrivyIdentityEmail } from '@/lib/auth/verify-privy-identity';
import { parseJsonBody } from '@/lib/api/parse-json';

const linkEmailSchema = z.object({
  identityToken: z.string().min(1),
});

// Requires an existing session (password or already-linked email) - this is
// how a member first connects an email to their account, not how they
// prove who they are from scratch. Server-verifies the Privy token so a
// client can't just assert an arbitrary email.
export async function POST(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const parsed = linkEmailSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  let email: string | null;
  try {
    email = await verifyPrivyIdentityEmail(parsed.data.identityToken);
  } catch (err) {
    console.error('[team/link-email] token verification failed', err);
    return NextResponse.json({ error: 'Could not verify that email' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'No verified email on that Privy account' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('team_members').update({ email }).eq('id', member.memberId);

  if (error) {
    // Most likely the partial unique index on lower(email) - someone else
    // already linked this address.
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That email is already linked to another account' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to link email' }, { status: 500 });
  }

  return NextResponse.json({ success: true, email });
}
