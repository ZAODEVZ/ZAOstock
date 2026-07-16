import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { parseJsonBody } from '@/lib/api/parse-json';

const bodySchema = z.object({
  push_token: z.string().min(1).max(500),
});

// Called by the mobile app once a signed-in member grants notification
// permission. Only ever a bearer-token request (mobile-only feature, the
// web dashboard has no equivalent) but goes through the same
// getStockTeamMember() as every other /api/team/* route for consistency.
export async function POST(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const parsed = bodySchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('team_members').update({ push_token: parsed.data.push_token }).eq('id', member.memberId);

  if (error) return NextResponse.json({ error: 'Failed to save push token' }, { status: 500 });
  return NextResponse.json({ success: true });
}
