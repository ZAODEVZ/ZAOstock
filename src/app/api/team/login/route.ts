import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { scryptSync, timingSafeEqual } from 'crypto';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { saveStockTeamSession } from '@/lib/auth/session';

const loginSchema = z.object({
  password: z.string().min(1).max(64),
});

// Best-effort in-memory throttle (per warm instance). A durable store is the
// real fix, but this raises the bar against naive brute-forcing of team codes.
const WINDOW_MS = 5 * 60_000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

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
    const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Wait a few minutes and try again.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const normalized = parsed.data.password.trim().toUpperCase();

    const supabase = getSupabaseAdmin();
    const { data: members, error } = await supabase
      .from('team_members')
      .select('id, name, password_hash, active')
      .neq('active', false);

    if (error || !members) {
      return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }

    const match = members.find((m) => m.password_hash && verifyPassword(normalized, m.password_hash));

    if (!match) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    await saveStockTeamSession(match.id, match.name);
    return NextResponse.json({ success: true, name: match.name });
  } catch (err) {
    console.error('[team/login] unexpected', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
