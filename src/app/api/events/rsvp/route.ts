import { NextRequest, NextResponse } from 'next/server';
import { submissionUnstored } from '@/lib/api/submission-fallback';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

const rsvpSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(200),
  email: z.string().trim().email('Valid email required').max(200),
  eventSlug: z.string().trim().max(100).optional(),
  source: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(1000).optional(),
  hp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Held outside the try so an unexpected failure still logs what the person sent.
  let payload: unknown;
  try {
    const limited = rateLimitPublicForm(request, 'events-rsvp');
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.data;
    payload = body;
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }

    if (parsed.data.hp && parsed.data.hp.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const supabase = getSupabaseAdmin();

    const { data: event } = await supabase
      .from('events')
      .select('id')
      .eq('slug', parsed.data.eventSlug || 'zaostock')
      .maybeSingle();
    const eventId = event?.id ?? null;

    const emailLower = parsed.data.email.toLowerCase();
    let existingQuery = supabase.from('rsvps').select('id').eq('email', emailLower);
    existingQuery = eventId ? existingQuery.eq('event_id', eventId) : existingQuery.is('event_id', null);
    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Already RSVPed' }, { status: 409 });
    }

    const sourceParts = [
      parsed.data.source || 'homepage',
      parsed.data.eventSlug ? `event:${parsed.data.eventSlug}` : null,
    ].filter(Boolean) as string[];

    const { error } = await supabase.from('rsvps').insert({
      name: parsed.data.name,
      email: emailLower,
      source: sourceParts.join(' | '),
      notes: parsed.data.notes || null,
      event_id: eventId,
    });

    if (error) {
      return submissionUnstored('events/rsvp', parsed.data, error);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return submissionUnstored('events/rsvp', payload, err);
  }
}
