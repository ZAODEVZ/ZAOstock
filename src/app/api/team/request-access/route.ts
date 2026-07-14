import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scryptSync, timingSafeEqual } from 'crypto';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

const requestAccessSchema = z.object({
  password: z.string().min(1).max(64),
});

function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const result = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (result.length !== expected.length) return false;
  return timingSafeEqual(result, expected);
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitPublicForm(request, 'team-request-access');
    if (limited) return limited;

    const parsedBody = await parseJsonBody(request);
    if (!parsedBody.ok) return parsedBody.response;
    const parsed = requestAccessSchema.safeParse(parsedBody.data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const normalized = parsed.data.password.trim().toUpperCase();

    const supabase = getSupabaseAdmin();
    const { data: members, error } = await supabase
      .from('team_members')
      .select('id, password_hash, active');

    if (error || !members) {
      return NextResponse.json({ error: 'Request failed' }, { status: 500 });
    }

    const match = members.find((m) => m.password_hash && verifyPassword(normalized, m.password_hash));

    // Same generic response whether the code was wrong, the member was
    // already active, or the request was recorded - a locked-out member
    // shouldn't be able to use this endpoint to probe which codes are valid.
    if (match && match.active === false) {
      await supabase
        .from('team_members')
        .update({ access_requested_at: new Date().toISOString() })
        .eq('id', match.id);
    }

    return NextResponse.json({ success: true, message: 'If that code is on file, an admin has been notified.' });
  } catch (err) {
    console.error('[team/request-access] unexpected', err);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
