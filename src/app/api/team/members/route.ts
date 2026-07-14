import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { parseJsonBody } from '@/lib/api/parse-json';

export async function GET() {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, scope, active, last_login_at, access_requested_at')
    .order('created_at');

  if (error) return NextResponse.json({ error: 'Failed to load team' }, { status: 500 });
  return NextResponse.json({ members: data });
}

const reinstateSchema = z.object({
  id: z.string().uuid(),
  active: z.boolean(),
});

// Reinstating (or manually pausing) another member's access is the first
// server-side role check in this codebase - the /team dashboard otherwise
// just gates on "is any authenticated team member." Access control is
// sensitive enough to warrant it: only leads can flip someone else's access.
export async function PATCH(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: actor, error: actorError } = await supabase
    .from('team_members')
    .select('role')
    .eq('id', member.memberId)
    .single();

  if (actorError || actor?.role !== 'lead') {
    return NextResponse.json({ error: 'Only leads can change access' }, { status: 403 });
  }

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const parsed = reinstateSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const update = parsed.data.active
    ? { active: true, deactivated_at: null, access_requested_at: null, last_login_at: new Date().toISOString() }
    : { active: false, deactivated_at: new Date().toISOString() };

  const { error: updateError } = await supabase.from('team_members').update(update).eq('id', parsed.data.id);

  if (updateError) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}
