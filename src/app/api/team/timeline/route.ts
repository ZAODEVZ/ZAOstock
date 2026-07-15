import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { logActivity, logFieldChanges } from '@/lib/log-activity';
import { parseJsonBody } from '@/lib/api/parse-json';
import { resolveEventId } from '@/lib/api/resolve-event';

export async function GET(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const eventId = await resolveEventId(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('timeline')
    .select('*, owner:team_members!owner_id(id, name)')
    .eq('event_id', eventId)
    .order('due_date', { ascending: true });

  if (error) return NextResponse.json({ error: 'Failed to load timeline' }, { status: 500 });
  return NextResponse.json({ milestones: data });
}

const createSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(1000).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().max(50).optional(),
  owner_id: z.string().uuid().nullable().optional(),
});

export async function POST(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const body = parsedBody.data;
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const eventId = await resolveEventId(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('timeline')
    .insert({ ...parsed.data, event_id: eventId })
    .select('*, owner:team_members!owner_id(id, name)')
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 });
  await logActivity({
    actorId: member.memberId,
    entityType: 'timeline',
    entityId: data.id,
    action: 'create',
    newValue: { title: data.title, due_date: data.due_date },
  });
  return NextResponse.json({ milestone: data }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(300).optional(),
  description: z.string().max(1000).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['pending', 'in_progress', 'done', 'blocked']).optional(),
  category: z.string().max(50).optional(),
  owner_id: z.string().uuid().nullable().optional(),
  notes: z.string().max(2000).optional(),
});

export async function PATCH(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const body = parsedBody.data;
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const { id, ...updates } = parsed.data;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: before } = await supabase
    .from('timeline')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase
    .from('timeline')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 });
  if (before) {
    await logFieldChanges(member.memberId, 'timeline', id, before, updates);
  }
  return NextResponse.json({ success: true });
}

const deleteSchema = z.object({ id: z.string().uuid() });

export async function DELETE(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;
  const body = parsedBody.data;
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: before } = await supabase
    .from('timeline')
    .select('title, due_date')
    .eq('id', parsed.data.id)
    .maybeSingle();

  const { error } = await supabase.from('timeline').delete().eq('id', parsed.data.id);
  if (error) return NextResponse.json({ error: 'Failed to delete milestone' }, { status: 500 });
  await logActivity({
    actorId: member.memberId,
    entityType: 'timeline',
    entityId: parsed.data.id,
    action: 'delete',
    oldValue: before ?? null,
  });
  return NextResponse.json({ success: true });
}
