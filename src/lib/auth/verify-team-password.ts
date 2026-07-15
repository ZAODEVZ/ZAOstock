import { scryptSync, timingSafeEqual } from 'crypto';
import { getSupabaseAdmin } from '@/lib/db/supabase';

export interface TeamPasswordMatch {
  id: string;
  name: string;
  active: boolean | null;
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

// Shared by /api/team/login and /api/team/mobile-login - same credential,
// two different session mechanisms (cookie vs. bearer token) issued after a
// successful match. Returns null on a DB error too, same as a non-match, so
// callers don't need a separate error branch for "couldn't check" vs.
// "checked and it's wrong."
export async function findTeamPasswordMatch(normalizedPassword: string): Promise<TeamPasswordMatch | null> {
  const supabase = getSupabaseAdmin();
  const { data: members, error } = await supabase.from('team_members').select('id, name, password_hash, active');
  if (error || !members) return null;

  const match = members.find((m) => m.password_hash && verifyPassword(normalizedPassword, m.password_hash));
  return match ? { id: match.id, name: match.name, active: match.active } : null;
}
