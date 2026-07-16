import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getStockTeamMember } from '@/lib/auth/session';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { logActivity, logFieldChanges } from '@/lib/log-activity';
import { parseJsonBody } from '@/lib/api/parse-json';
import { resolveEventId } from '@/lib/api/resolve-event';
import { sendPushNotification } from '@/lib/push/send-push-notification';

export async function GET(request: NextRequest) {
  const member = await getStockTeamMember();
  if (!member) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const owner = request.nextUrl.searchParams.get('owner');
  const eventId = await resolveEventId(request);
  const supabase = getSupabaseAdmin();

  let query = supabase
    .from('todos')
    .select('*, owner:team_members!owner_id(id, name), creator:team_members!created_by(id, name)')
    .eq('event_id', eventId)
    .order('status')
    .order('created_at', { ascending: false });

  if (owner) {
    query = query.eq('owner_id', owner);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Failed to load todos' }, { status: 500 });

  return NextResponse.json({ todos: data });
}

const createSchema = z.object({
  title: z.string().min(1).max(500),
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
    .from('todos')
    .insert({
      title: parsed.data.title,
      owner_id: parsed.data.owner_id || null,
      created_by: member.memberId,
      event_id: eventId,
    })
    .select('*, owner:team_members!owner_id(id, name), creator:team_members!created_by(id, name)')
    .single();

  if (error) return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  await logActivity({
    actorId: member.memberId,
    entityType: 'todo',
    entityId: data.id,
    action: 'create',
    newValue: { title: data.title, owner_id: data.owner_id },
  });

  // Notify the assignee - but not when someone assigns a todo to
  // themselves, and not exposing push_token in the response above (a
  // separate, server-only lookup instead) since Expo's push API accepts
  // unauthenticated sends to any token it's given.
  if (data.owner_id && data.owner_id !== member.memberId) {
    const { data: owner } = await supabase.from('team_members').select('push_token').eq('id', data.owner_id).maybeSingle();
    if (owner?.push_token) {
      await sendPushNotification({
        to: owner.push_token,
        title: 'New todo assigned to you',
        body: data.title,
        data: { path: '/(tabs)' },
      });
    }
  }

  return NextResponse.json({ todo: data }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  notes: z.string().max(2000).optional(),
  owner_id: z.string().uuid().nullable().optional(),
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
    .from('todos')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const { error } = await supabase
    .from('todos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  if (before) {
    await logFieldChanges(member.memberId, 'todo', id, before, updates);
  }

  // Notify on reassignment specifically - not on a status/notes-only edit,
  // not when the owner_id didn't actually change, and not on self-assign.
  if (updates.owner_id && updates.owner_id !== before?.owner_id && updates.owner_id !== member.memberId) {
    const { data: owner } = await supabase.from('team_members').select('push_token').eq('id', updates.owner_id).maybeSingle();
    if (owner?.push_token && before) {
      await sendPushNotification({
        to: owner.push_token,
        title: 'Todo assigned to you',
        body: before.title,
        data: { path: '/(tabs)' },
      });
    }
  }

  return NextResponse.json({ success: true });
}
