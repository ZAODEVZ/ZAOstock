import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';

const rsvpSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(200),
  email: z.string().trim().email('Valid email required').max(200),
  eventSlug: z.string().trim().max(100).optional(),
  source: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(1000).optional(),
  hp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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

    const emailLower = parsed.data.email.toLowerCase();
    const { data: existing } = await supabase
      .from('rsvps')
      .select('id')
      .eq('email', emailLower)
      .maybeSingle();

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
    });

    if (error) {
      return NextResponse.json({ error: 'Could not submit right now' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[events/rsvp] unexpected', err);
    return NextResponse.json({ error: 'Could not submit right now' }, { status: 500 });
  }
}
