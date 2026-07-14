import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { generateClaimToken, slugify } from '@/lib/artists';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

const cypherSchema = z.object({
  name: z.string().trim().min(1, 'Name required').max(200),
  email: z.string().trim().email('Valid email required').max(200).optional(),
  socials: z.string().trim().max(500).optional(),
  cypher_role: z.string().trim().min(1, 'Tell us what you bring').max(300),
  notes: z.string().trim().max(1000).optional(),
  token: z.string().trim().max(200).optional(),
  hp: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitPublicForm(request, 'cypher');
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const body = parsedBody.data;
    const parsed = cypherSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 },
      );
    }

    if (parsed.data.hp && parsed.data.hp.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const notesBlob = [
      parsed.data.email ? `email: ${parsed.data.email}` : null,
      parsed.data.notes ? `notes: ${parsed.data.notes}` : null,
      'cypher signup via /cypher',
    ]
      .filter(Boolean)
      .join('\n');

    const supabase = getSupabaseAdmin();

    // Only merge into an existing artist when the submitter proves ownership of
    // the matching email. Matching by name alone let anyone overwrite a
    // confirmed artist's profile and receive their edit token (write-IDOR).
    // With no email (or no email match) we always create a new row instead.
    let existing: { id: string; name: string; claim_token: string | null } | null = null;
    if (parsed.data.email) {
      const { data } = await supabase
        .from('artists')
        .select('id, name, claim_token')
        .ilike('contact_email', parsed.data.email)
        .maybeSingle();
      existing = data;
    }

    // A row that already has a claim_token has already been claimed by
    // someone - knowing the artist's email isn't proof you're that person.
    // Require the actual token before allowing an update or re-issuing it
    // (otherwise anyone who guesses/knows a confirmed artist's email could
    // overwrite their profile and walk away with their edit link).
    if (existing?.claim_token && existing.claim_token !== parsed.data.token) {
      return NextResponse.json(
        { success: true, message: 'Thanks - if you already have a profile, use your existing edit link to update it.' },
        { status: 200 },
      );
    }

    let claim_token: string;
    let name: string;

    if (existing) {
      claim_token = existing.claim_token || generateClaimToken();
      name = existing.name;
      const updates: Record<string, unknown> = {
        cypher_interested: true,
        cypher_role: parsed.data.cypher_role,
        notes: notesBlob,
      };
      if (parsed.data.socials) updates.socials = parsed.data.socials;
      if (!existing.claim_token) updates.claim_token = claim_token;
      const { error: updateError } = await supabase
        .from('artists')
        .update(updates)
        .eq('id', existing.id);
      if (updateError) {
        return NextResponse.json({ error: 'Could not update signup' }, { status: 500 });
      }
    } else {
      claim_token = generateClaimToken();
      name = parsed.data.name;
      const insertRow: Record<string, unknown> = {
        name: parsed.data.name,
        status: 'wishlist',
        socials: parsed.data.socials || '',
        cypher_interested: true,
        cypher_role: parsed.data.cypher_role,
        notes: notesBlob,
        claim_token,
      };
      // Store the email in a queryable column so a repeat signup updates the
      // same row (via the email match above) instead of creating a duplicate.
      if (parsed.data.email) insertRow.contact_email = parsed.data.email;
      const { error: insertError } = await supabase.from('artists').insert(insertRow);
      if (insertError) {
        return NextResponse.json({ error: 'Could not save signup' }, { status: 500 });
      }
    }

    const slug = slugify(name);
    const editUrl = `/artist/${slug}?token=${claim_token}`;
    const publicUrl = `/artist/${slug}`;

    return NextResponse.json({ success: true, slug, editUrl, publicUrl, claim_token }, { status: 201 });
  } catch (err) {
    console.error('[cypher] unexpected', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
