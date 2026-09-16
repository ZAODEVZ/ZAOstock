import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { getArtistOpsStatus, type ArtistOpsRow } from '@/lib/artists';
import { logFieldChanges } from '@/lib/log-activity';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';
import { findActByCode } from '@/content/artist-ops';

/**
 * PATCH /api/backstage/<code> - writes an act's own row, gated by the
 * backstage code alone.
 *
 * THE CODE IS THE AUTH. `findActByCode` re-derives the act from the SHA-256
 * of the raw code in the URL, exactly as the page does - it is never trusted
 * from a client-supplied act name or id. A code that hashes to nothing is a
 * 404 and nothing is written. This is a SEPARATE mechanism from
 * `claim_token` (src/app/api/artist-profile/route.ts, the public
 * self-editable page) - two different private links with two different
 * purposes, and this route does not touch that one.
 *
 * Deliberately NOT the confirm-artist route: ARTIST_CONFIRM_SECRET being
 * unset (503) has no bearing here, and this route can never set
 * status='confirmed' - it only ever writes the seven ops fields
 * `missingItems` asks about. Status changes are still a human decision under
 * decision 0005.
 */

const bodySchema = z.object({
  bio: z.string().max(2000).optional(),
  photoUrl: z
    .string()
    .max(500)
    .optional()
    .refine((v) => !v || /^https:\/\//i.test(v), { message: 'Photo link must start with https://' }),
  city: z.string().max(200).optional(),
  socials: z.string().max(500).optional(),
  rider: z.string().max(2000).optional(),
  soundcheckConfirmed: z.boolean().optional(),
  filmingConsent: z.boolean().optional(),
});

const FIELD_TO_COLUMN: Record<keyof z.infer<typeof bodySchema>, string> = {
  bio: 'bio',
  photoUrl: 'photo_url',
  city: 'city',
  socials: 'socials',
  rider: 'rider',
  soundcheckConfirmed: 'soundcheck_confirmed',
  filmingConsent: 'filming_consent',
};

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const limited = rateLimitPublicForm(request, 'backstage-submit', { windowMs: 10 * 60_000, maxAttempts: 20 });
  if (limited) return limited;

  const { code } = await params;
  const act = findActByCode(code);
  if (!act) {
    // Same shape as the page: a wrong code is a 404, not a 403 - it must
    // not confirm to a guesser that "the code is wrong but the route
    // exists" is a distinct answer from "this page/act does not exist".
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const parsedBody = await parseJsonBody(request);
  if (!parsedBody.ok) return parsedBody.response;

  const parsed = bodySchema.safeParse(parsedBody.data);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const current: ArtistOpsRow | null = await getArtistOpsStatus(act.name).catch(() => null);
  if (!current) {
    // Same null-not-throw contract as getArtistOpsStatus's own callers - a
    // name mismatch or a query failure must not write half a row.
    return NextResponse.json({ error: 'Could not find your row' }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  for (const key of Object.keys(parsed.data) as Array<keyof typeof parsed.data>) {
    const value = parsed.data[key];
    if (value === undefined) continue;
    const column = FIELD_TO_COLUMN[key];
    updates[column] = value;
    before[column] = (current as unknown as Record<string, unknown>)[key];
    after[column] = value;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('artists').update(updates).eq('id', current.id);
  if (error) {
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }

  // Best-effort, per logFieldChanges' own contract (it swallows and logs a
  // warning rather than throwing) - a logging failure must not undo a save
  // that already succeeded.
  await logFieldChanges(null, 'artist', current.id, before, after);

  return NextResponse.json({ success: true });
}
