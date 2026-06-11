import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { verifyClaimToken } from '@/lib/artists';
import { logger } from '@/lib/logger';

// Records a backing-track file an artist just uploaded. Token-gated.
// The file already lives in the bucket; here we index it on the artist row
// (append to `notes`) so the music team can find it without DB migrations.

const schema = z.object({
  slug: z.string().min(1).max(200),
  token: z.string().min(4).max(64),
  filename: z.string().min(1).max(200),
  storage_path: z.string().min(1).max(500),
  size_bytes: z.number().int().min(0),
});

function formatBytes(n: number): string {
  if (!n) return '0 B';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
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

  // Guard: the storage path must belong to this artist.
  if (!parsed.data.storage_path.startsWith(`artist/${artistId}/`)) {
    return NextResponse.json({ error: 'storage_path does not match artist' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: row, error: fetchErr } = await supabase
    .from('artists')
    .select('notes')
    .eq('id', artistId)
    .maybeSingle();

  if (fetchErr) {
    logger.error({ fetchErr }, 'rider track index fetch failed');
    return NextResponse.json({ error: 'Could not record upload' }, { status: 500 });
  }

  const line = `TRACK FILE: ${parsed.data.filename} (${formatBytes(parsed.data.size_bytes)}) -> ${parsed.data.storage_path}`;
  const mergedNotes = [row?.notes?.trim(), line].filter(Boolean).join('\n');

  const { error: updateErr } = await supabase.from('artists').update({ notes: mergedNotes }).eq('id', artistId);
  if (updateErr) {
    logger.error({ updateErr }, 'rider track index update failed');
    return NextResponse.json({ error: 'Could not record upload' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
