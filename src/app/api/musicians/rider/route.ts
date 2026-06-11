import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { generateClaimToken, slugify } from '@/lib/artists';
import { ENV } from '@/lib/env';

// Confirmed-artist rider intake. Public form at /musicians/rider.
// Closes the loop the artist deal memo promises ("technical rider intake form").
// Upserts the artists row (match by email, then name) and stores the full
// structured rider response as a labeled block in `notes` - no migration needed.

const riderSchema = z.object({
  event: z.string().trim().max(120).default('ZAOstock 2026'),
  name: z.string().trim().min(1, 'Artist / band name required').max(200),
  contact_email: z.string().trim().email('Valid email required').max(200),
  socials: z.string().trim().max(2000).optional(),
  streaming: z.string().trim().max(2000).optional(),
  website: z.string().trim().max(2000).optional(),
  bio: z.string().trim().max(2000).optional(),

  schedule_response: z.enum(['accepted', 'change_requested']),
  schedule_change_note: z.string().trim().max(2000).optional(),

  equipment_response: z.enum(['accepted', 'additional_needs']),
  equipment_needs: z.string().trim().max(2000).optional(),

  track_links: z.string().trim().max(4000).optional(),

  merch_selling: z.boolean().default(false),
  merch_types: z.string().trim().max(500).optional(),
  merch_table: z.enum(['need_table', 'own_table', '']).optional(),
  merch_manager: z.string().trim().max(300).optional(),

  interview_interest: z.boolean().default(false),
  interview_format: z.enum(['in_person', 'virtual', 'either', '']).optional(),
  interview_availability: z.string().trim().max(1000).optional(),

  retreat_interest: z.boolean().default(false),
  retreat_format: z.enum(['in_person', 'virtual', 'either', '']).optional(),
  retreat_availability: z.string().trim().max(1000).optional(),

  acknowledged: z.literal(true, {
    errorMap: () => ({ message: 'Acknowledgement is required to submit the rider' }),
  }),
  signature: z.string().trim().min(1, 'Type your name to acknowledge').max(200),

  hp: z.string().optional(),
});

function yn(v: boolean): string {
  return v ? 'YES' : 'NO';
}

function formatRiderBlock(d: z.infer<typeof riderSchema>): string {
  const lines: (string | null)[] = [
    `=== ARTIST RIDER RESPONSE (${d.event}) ===`,
    `submitted: ${new Date().toISOString()}`,
    '',
    '[Artist info]',
    d.streaming ? `streaming: ${d.streaming}` : null,
    d.website ? `website / media: ${d.website}` : null,
    '',
    '[Performance schedule]',
    `response: ${d.schedule_response === 'accepted' ? 'ACCEPTED' : 'CHANGE REQUESTED'}`,
    d.schedule_change_note ? `change request: ${d.schedule_change_note}` : null,
    '',
    '[Equipment]',
    `response: ${d.equipment_response === 'accepted' ? 'ACCEPTED' : 'ADDITIONAL NEEDS'}`,
    d.equipment_needs ? `needs: ${d.equipment_needs}` : null,
    '',
    '[Backing tracks]',
    d.track_links ? `links:\n${d.track_links}` : 'links: (none provided - uploaded files or sent separately)',
    '',
    '[Merchandise]',
    `selling: ${yn(d.merch_selling)}`,
    d.merch_selling && d.merch_types ? `types: ${d.merch_types}` : null,
    d.merch_selling && d.merch_table
      ? `table: ${d.merch_table === 'need_table' ? 'needs table space' : 'providing own'}`
      : null,
    d.merch_selling && d.merch_manager ? `managed by: ${d.merch_manager}` : null,
    '',
    '[Pre-show interview]',
    `interested: ${yn(d.interview_interest)}`,
    d.interview_interest && d.interview_format ? `format: ${d.interview_format}` : null,
    d.interview_interest && d.interview_availability ? `availability: ${d.interview_availability}` : null,
    '',
    '[Artist retreat / growth session]',
    `interested: ${yn(d.retreat_interest)}`,
    d.retreat_interest && d.retreat_format ? `format: ${d.retreat_format}` : null,
    d.retreat_interest && d.retreat_availability ? `availability: ${d.retreat_availability}` : null,
    '',
    '[Acknowledgement]',
    `agreed to rider + media release: YES`,
    `signature: ${d.signature}`,
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = riderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const d = parsed.data;

    // Honeypot - pretend success.
    if (d.hp && d.hp.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const riderBlock = formatRiderBlock(d);
    const supabase = getSupabaseAdmin();

    // Match an existing artist by email first, then by name.
    let existing: { id: string; name: string; claim_token: string | null; notes: string | null } | null = null;
    const byEmail = await supabase
      .from('artists')
      .select('id, name, claim_token, notes')
      .ilike('contact_email', d.contact_email)
      .maybeSingle();
    if (byEmail.data) {
      existing = byEmail.data;
    } else {
      const byName = await supabase
        .from('artists')
        .select('id, name, claim_token, notes')
        .ilike('name', d.name)
        .maybeSingle();
      if (byName.data) existing = byName.data;
    }

    let artistId: string;
    let artistName: string;
    let claimToken: string;

    if (existing) {
      claimToken = existing.claim_token || generateClaimToken();
      artistName = existing.name;
      artistId = existing.id;
      const mergedNotes = [existing.notes?.trim(), riderBlock].filter(Boolean).join('\n\n');
      const updates: Record<string, unknown> = {
        contact_email: d.contact_email,
        notes: mergedNotes,
        rider_submitted: true,
      };
      if (d.socials) updates.socials = d.socials;
      if (d.bio) updates.bio = d.bio;
      if (!existing.claim_token) updates.claim_token = claimToken;

      // `rider_submitted` is a convenience flag - tolerate its absence so this
      // works whether or not the column exists yet.
      let { error: updateError } = await supabase.from('artists').update(updates).eq('id', artistId);
      if (updateError && /rider_submitted/.test(updateError.message || '')) {
        delete updates.rider_submitted;
        ({ error: updateError } = await supabase.from('artists').update(updates).eq('id', artistId));
      }
      if (updateError) {
        console.error('[musicians/rider] update error', updateError);
        return NextResponse.json({ error: 'Could not save your rider right now' }, { status: 500 });
      }
    } else {
      claimToken = generateClaimToken();
      artistName = d.name;
      const insertRow: Record<string, unknown> = {
        name: d.name,
        contact_email: d.contact_email,
        socials: d.socials || '',
        bio: d.bio || '',
        status: 'submitted',
        claim_token: claimToken,
        notes: riderBlock,
      };
      const { data: inserted, error: insertError } = await supabase
        .from('artists')
        .insert(insertRow)
        .select('id')
        .single();
      if (insertError || !inserted) {
        console.error('[musicians/rider] insert error', insertError);
        return NextResponse.json({ error: 'Could not save your rider right now' }, { status: 500 });
      }
      artistId = inserted.id;
    }

    const slug = slugify(artistName);
    const base = ENV.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
    return NextResponse.json(
      {
        success: true,
        artistId,
        slug,
        token: claimToken,
        publicUrl: `${base}/artist/${slug}`,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('[musicians/rider] unexpected', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
