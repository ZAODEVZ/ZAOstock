import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { parseJsonBody } from '@/lib/api/parse-json';
import { resolveEventId } from '@/lib/api/resolve-event';

export async function GET(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const eventId = await resolveEventId(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('event_id', eventId)
    .order('sort_order');

  if (error) return NextResponse.json({ error: 'Failed to load goals' }, { status: 500 });
  return NextResponse.json({ goals: data });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['locked', 'wip', 'tbd']).optional(),
  details: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const parsed = patchSchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const { id, ...updates } = parsed.data;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('goals').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });

  return NextResponse.json({ success: true });
}
