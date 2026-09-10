import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { timingSafeEqual } from 'crypto';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { logActivity } from '@/lib/log-activity';
import { parseJsonBody } from '@/lib/api/parse-json';
import { ENV } from '@/lib/env';

/**
 * POST /api/admin/confirm-artist - option C, and nothing more.
 *
 * WHY THIS EXISTS
 * The public reveal publishes exactly `status = 'confirmed'`
 * (`/api/events/[slug]/lineup`), and the only thing that ever set that status
 * was the team dashboard, which is RETIRED - its login returns 410 and
 * /api/team/* returns 401, so there is no way to obtain a session. Without this
 * route a perfect set of artist replies still produces an empty bill.
 *
 * WHAT IT DELIBERATELY IS NOT
 * Not the dashboard coming back. There is no GET, no PATCH of arbitrary fields
 * and above all NO DELETE - the 2026-08-31 audit found any signed-in member
 * could delete any artist with no role check, and retiring the dashboard is
 * what closed that. Reopening it was the option NOT taken.
 *
 * THE ANTI-FABRICATION RULE
 * A missing artist is a 404. This route will NEVER create a row. Creating an
 * artist and marking it confirmed in one call is indistinguishable from
 * inventing a signature, and decision 0005 exists precisely so that nobody is
 * published who has not confirmed in writing. `confirmation_reference` is
 * REQUIRED and recorded, so every confirmation points at the written thing that
 * justified it - a form response, an email, a message. Decision 0005 is
 * enforced by the schema here, not by whoever remembers it.
 *
 * Only a forward move to 'confirmed' is possible. There is no un-confirm and no
 * arbitrary status, so this route cannot quietly pull a published act back down.
 */

// Matches the live schema, measured 2026-09-07 - NOT assumed. The artists table
// has no `slug`, no `confirmed_at` and no `confirmation_reference` column, and
// `socials` is TEXT rather than json. An earlier draft of this route used all
// four and would have failed at runtime on the first real confirmation.
/**
 * This route exists for one festival's reveal. Every lookup is scoped to it, so
 * a confirmation can never land on another event's artist row.
 */
const EVENT_SLUG = 'zaostock';

const bodySchema = z
  .object({
    id: z.string().uuid().optional(),
    /** Exact `artists.name`. There is no slug column on this table. */
    name: z.string().min(1).max(200).optional(),
    // The written confirmation this is based on. Required on purpose.
    confirmation_reference: z.string().trim().min(1).max(500),
    bio: z.string().max(5000).optional(),
    photo_url: z.string().url().max(2000).optional(),
    city: z.string().max(200).optional(),
    genre: z.string().max(200).optional(),
    socials: z.string().max(2000).optional(),
  })
  .refine((v) => Boolean(v.id) || Boolean(v.name), {
    message: 'Provide either id or name',
  });

function isAuthorized(authHeader: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(authHeader ?? '');
  // Compare lengths first: timingSafeEqual throws on a length mismatch.
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export async function POST(request: NextRequest) {
  let secret: string;
  try {
    secret = ENV.ARTIST_CONFIRM_SECRET;
  } catch {
    // Fail CLOSED. An unset secret must never mean "no auth required".
    console.error('[api/admin/confirm-artist] ARTIST_CONFIRM_SECRET not set');
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  if (!isAuthorized(request.headers.get('authorization'), secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;

  const parsed = bodySchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // SCOPED TO THIS FESTIVAL, always.
  //
  // The lookup used to be `.eq('name', ...)` across the whole artists table,
  // with no event scope. That works only while no two events share an artist
  // name. Measured 2026-09-08: four events exist and only `zaostock` has any
  // artist rows, so it could not fire - but Hurricane and DCoop both played
  // past ZAO festivals, and the day someone backfills those rosters a
  // confirmation sent for ZAOstock could land on ZAO-PALOOZA's row instead.
  //
  // Confirming the wrong festival's artist is indistinguishable from
  // confirming someone who never agreed, which is the thing decision 0005
  // exists to prevent. Fixed BEFORE the endpoint's first real use rather than
  // after, because the window where it is unused is the safe one.
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('slug', EVENT_SLUG)
    .maybeSingle();

  if (eventError || !event) {
    console.error('[api/admin/confirm-artist] event lookup failed', eventError);
    return NextResponse.json({ error: 'Event lookup failed' }, { status: 503 });
  }

  const lookup = supabase.from('artists').select('id, name, status').eq('event_id', event.id);
  const { data: existing, error: findError } = parsed.data.id
    ? await lookup.eq('id', parsed.data.id).maybeSingle()
    : await lookup.eq('name', parsed.data.name as string).maybeSingle();

  if (findError) {
    console.error('[api/admin/confirm-artist] lookup failed', findError);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }

  // NEVER create. See the anti-fabrication rule above.
  if (!existing) {
    return NextResponse.json(
      {
        error:
          'Artist not found. This route never creates rows - add the row first. ' +
          'Note the artists table currently holds a superseded wishlist, so most ' +
          'acts in the run of show have no row and the names do not match.',
      },
      { status: 404 },
    );
  }

  // Only columns that actually exist. The confirmation reference is recorded in
  // activity_log below rather than on the row, because there is no column for it
  // and inventing a migration in launch week is the riskier move.
  const updates: Record<string, unknown> = { status: 'confirmed' };
  if (parsed.data.bio !== undefined) updates.bio = parsed.data.bio;
  if (parsed.data.photo_url !== undefined) updates.photo_url = parsed.data.photo_url;
  if (parsed.data.city !== undefined) updates.city = parsed.data.city;
  if (parsed.data.genre !== undefined) updates.genre = parsed.data.genre;
  if (parsed.data.socials !== undefined) updates.socials = parsed.data.socials;

  const { error: updateError } = await supabase.from('artists').update(updates).eq('id', existing.id);
  if (updateError) {
    console.error('[api/admin/confirm-artist] update failed', updateError);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  await logActivity({
    actorId: null,
    entityType: 'artist',
    entityId: existing.id,
    action: 'confirm',
    fieldChanged: 'status',
    oldValue: existing.status,
    newValue: 'confirmed',
  });

  // Decision 0005's paper trail. The row cannot hold this, so the audit log does:
  // every confirmation points at the written thing that justified it.
  await logActivity({
    actorId: null,
    entityType: 'artist',
    entityId: existing.id,
    action: 'confirm',
    fieldChanged: 'confirmation_reference',
    oldValue: null,
    newValue: parsed.data.confirmation_reference,
  });

  // Public-safe fields only: no claim token, no fee, no contact details.
  return NextResponse.json({
    ok: true,
    id: existing.id,
    name: existing.name,
    previous_status: existing.status,
    status: 'confirmed',
  });
}
