import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { logActivity, logFieldChanges } from '@/lib/log-activity';
import { SPONSOR_TRACKS, SPONSOR_STATUSES } from '@/lib/team-constants';
import { parseJsonBody } from '@/lib/api/parse-json';
import { resolveEventId } from '@/lib/api/resolve-event';

export async function GET(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const eventId = await resolveEventId(request);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('sponsors')
    .select('*, owner:team_members!owner_id(id, name)')
    .eq('event_id', eventId)
    .order('track')
    .order('status')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Failed to load sponsors' }, { status: 500 });
  return NextResponse.json({ sponsors: data });
}

const createSchema = z.object({
  name: z.string().min(1).max(200),
  track: z.enum(SPONSOR_TRACKS),
  status: z.enum(SPONSOR_STATUSES).optional(),
  contact_name: z.string().max(200).optional(),
  contact_email: z.string().max(200).optional(),
  contact_phone: z.string().max(50).optional(),
  why_them: z.string().max(1000).optional(),
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
    .from('sponsors')
    .insert({ ...parsed.data, event_id: eventId })
    .select('*, owner:team_members!owner_id(id, name)')
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 });
  await logActivity({
    actorId: member.memberId,
    entityType: 'sponsor',
    entityId: data.id,
    action: 'create',
    newValue: { name: data.name, track: data.track, status: data.status },
  });
  return NextResponse.json({ sponsor: data }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200).optional(),
  track: z.enum(SPONSOR_TRACKS).optional(),
  status: z.enum(SPONSOR_STATUSES).optional(),
  contact_name: z.string().max(200).optional(),
  contact_email: z.string().max(200).optional(),
  contact_phone: z.string().max(50).optional(),
  amount_committed: z.number().min(0).optional(),
  amount_paid: z.number().min(0).optional(),
  why_them: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  owner_id: z.string().uuid().nullable().optional(),
  last_contacted_at: z.string().datetime().nullable().optional(),
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
    .from('sponsors')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase
    .from('sponsors')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
  if (before) {
    await logFieldChanges(member.memberId, 'sponsor', id, before, updates);
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
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: before } = await supabase
    .from('sponsors')
    .select('name, track, status')
    .eq('id', parsed.data.id)
    .maybeSingle();

  const { error } = await supabase.from('sponsors').delete().eq('id', parsed.data.id);

  if (error) return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  await logActivity({
    actorId: member.memberId,
    entityType: 'sponsor',
    entityId: parsed.data.id,
    action: 'delete',
    oldValue: before ?? null,
  });
  return NextResponse.json({ success: true });
}
