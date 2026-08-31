import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { generateClaimToken, slugify } from '@/lib/artists';
import { ENV } from '@/lib/env';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

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

  token: z.string().trim().max(200).optional(),
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
    const limited = rateLimitPublicForm(request, 'musicians-rider');
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.data;
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

    // Match an existing artist by email only. Matching by name too (the
    // prior behavior) let anyone who knew a confirmed artist's public band
    // name - not even their email - overwrite their profile and receive
    // their edit token. Name isn't ownership proof; email plus the existing
    // token check below is the actual gate.
    let existing: { id: string; name: string; claim_token: string | null; notes: string | null } | null = null;
    const byEmail = await supabase
      .from('artists')
      .select('id, name, claim_token, notes')
      .ilike('contact_email', d.contact_email)
      .maybeSingle();
    if (byEmail.data) {
      existing = byEmail.data;
    }

    // A row that already has a claim_token has already been claimed - knowing
    // the artist's email isn't proof you're that person. Require the actual
    // token before allowing an update or re-issuing it.
    if (existing?.claim_token && existing.claim_token !== d.token) {
      return NextResponse.json(
        { success: true, message: 'Thanks - if you already have a profile, use your existing edit link to update it.' },
        { status: 200 },
      );
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

      // CONCURRENCY GUARD (Iman's audit: "rider notes read-modify-write can
      // drop a line under concurrent writes"). We read `existing.notes`,
      // appended a block, and are about to write the whole field back. Two
      // riders submitted close together both read the same `notes`, and the
      // second write silently erases the first one's block - the submitter
      // sees success and their rider is gone.
      //
      // So the write is conditional on `notes` still being what we read.
      // PostgREST turns the filter into a WHERE clause, so a row changed since
      // our read does not match and we get zero rows back instead of
      // clobbering it. On a miss we re-read and rebuild the merge once. One
      // retry is enough: two riders racing is plausible, three hitting the
      // same artist row inside one round trip is not.
      let updateError: { message?: string } | null = null;
      let wrote = false;

      for (let attempt = 0; attempt < 2 && !wrote; attempt += 1) {
        if (attempt > 0) {
          // Someone wrote between our read and our write. Rebuild the merge
          // against the CURRENT value so their block survives too.
          const fresh = await supabase.from('artists').select('notes').eq('id', artistId).maybeSingle();
          const freshNotes: string | null = fresh.data?.notes ?? null;
          existing.notes = freshNotes;
          updates.notes = [freshNotes?.trim(), riderBlock].filter(Boolean).join('\n\n');
        }

        const base = supabase.from('artists').update(updates).eq('id', artistId);
        const guarded = existing.notes === null ? base.is('notes', null) : base.eq('notes', existing.notes);
        const res = await guarded.select('id');

        updateError = res.error;
        if (updateError) break;
        wrote = Array.isArray(res.data) && res.data.length > 0;
      }

      if (!wrote && !updateError) {
        // Both attempts lost the race. Fail loudly rather than reporting a
        // success that wrote nothing - a dropped rider that says "thanks" is
        // exactly the bug this guard exists to prevent.
        console.error('[rider] concurrent write lost twice for artist', artistId);
        return NextResponse.json(
          { success: false, message: 'Someone else updated this profile at the same moment. Please submit again.' },
          { status: 409 },
        );
      }
      if (updateError && /rider_submitted/.test(updateError.message || '')) {
        delete updates.rider_submitted;
        // Keep the same concurrency guard on the retry. Without it this
        // fallback path silently reintroduces the very race the block above
        // exists to close - and it is the path that runs whenever the
        // `rider_submitted` column is absent, so it is not a rare branch.
        const retryBase = supabase.from('artists').update(updates).eq('id', artistId);
        const retryGuarded = existing.notes === null ? retryBase.is('notes', null) : retryBase.eq('notes', existing.notes);
        const retry = await retryGuarded.select('id');
        updateError = retry.error;
        if (!updateError && !(Array.isArray(retry.data) && retry.data.length > 0)) {
          console.error('[rider] concurrent write lost on the rider_submitted fallback for artist', artistId);
          return NextResponse.json(
            { success: false, message: 'Someone else updated this profile at the same moment. Please submit again.' },
            { status: 409 },
          );
        }
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
