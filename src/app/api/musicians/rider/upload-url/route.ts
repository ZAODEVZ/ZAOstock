import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { verifyClaimToken } from '@/lib/artists';
import { logger } from '@/lib/logger';

// Token-gated signed upload URL for confirmed artists submitting backing tracks.
// Reuses the private `stock-attachments` bucket under artist/<id>/tracks/.
// Access is controlled by the artist's claim token (issued on rider submission).

const BUCKET = 'stock-attachments';
const MAX_BYTES = 500 * 1024 * 1024; // 500 MB per file; bigger sets go via links.

const schema = z.object({
  slug: z.string().min(1).max(200),
  token: z.string().min(4).max(64),
  filename: z.string().min(1).max(200),
  mime_type: z.string().min(1).max(200),
  size_bytes: z.number().int().min(1).max(MAX_BYTES),
});

function safeFilename(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
  }

  const artistId = await verifyClaimToken(parsed.data.slug, parsed.data.token);
  if (!artistId) {
    return NextResponse.json({ error: 'Invalid or expired artist link' }, { status: 401 });
  }

  const fileToken = randomBytes(12).toString('hex');
  const clean = safeFilename(parsed.data.filename);
  const storagePath = `artist/${artistId}/tracks/${fileToken}-${clean}`;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(storagePath);

  if (error || !data) {
    logger.error({ error, storagePath }, 'rider track signed upload url failed');
    const msg = error?.message || 'Failed to create upload URL';
    const hint = /bucket/i.test(msg)
      ? ' Create private bucket `stock-attachments` in Supabase Storage first.'
      : '';
    return NextResponse.json({ error: `${msg}.${hint}` }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    storagePath,
    maxBytes: MAX_BYTES,
  });
}
