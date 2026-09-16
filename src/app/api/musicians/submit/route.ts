import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';
import { submissionUnstored } from '@/lib/api/submission-fallback';

const submitSchema = z.object({
  name: z.string().trim().min(1, 'Artist name required').max(200),
  contact_email: z.string().trim().email('Valid email required').max(200),
  city: z.string().trim().max(120).optional(),
  genre: z.string().trim().max(120).optional(),
  socials: z.string().trim().max(2000).optional(),
  track_ideas: z.string().trim().max(2000).optional(),
  mp3_links: z.string().trim().max(2000).optional(),
  bio: z.string().trim().max(2000).optional(),
  referred_by: z.string().trim().max(200).optional(),
  cypher_interested: z.boolean().optional().default(false),
  needs_travel: z.boolean().optional().default(false),
  travel_from: z.string().trim().max(200).optional(),
  hp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Held outside the try so an unexpected failure still logs what the person sent.
  let payload: unknown;
  try {
    const limited = rateLimitPublicForm(request, 'musicians-submit');
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.data;
    payload = body;
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }

    if (parsed.data.hp && parsed.data.hp.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const d = parsed.data;
    const notesParts = [
      d.track_ideas ? `track ideas:\n${d.track_ideas}` : null,
      d.mp3_links ? `mp3 / audio links:\n${d.mp3_links}` : null,
      d.referred_by ? `referred by: ${d.referred_by}` : null,
      'submitted via /musicians/submit',
    ].filter(Boolean);

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('artists').insert({
      name: d.name,
      contact_email: d.contact_email,
      city: d.city || '',
      genre: d.genre || '',
      socials: d.socials || '',
      bio: d.bio || '',
      // A fresh submission starts where every hand-added prospect starts -
      // 'wishlist' is the lowest rung of the pipeline the team already
      // triages from (src/app/team/ArtistPipeline.tsx STATUS_ORDER). There
      // is no separate 'submitted' status: the six-value artists_status_check
      // constraint never had one, so every insert here violated it and was
      // discarded - the exact "Could Not Submit Right Now" failure this fixes.
      status: 'wishlist',
      cypher_interested: d.cypher_interested,
      needs_travel: d.needs_travel,
      travel_from: d.travel_from || '',
      notes: notesParts.join('\n\n'),
    });

    if (error) {
      return submissionUnstored('musicians/submit', d, error);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return submissionUnstored('musicians/submit', payload, err);
  }
}
