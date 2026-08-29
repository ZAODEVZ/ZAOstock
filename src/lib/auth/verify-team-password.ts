import { scrypt as scryptCb, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { getSupabaseAdmin } from '@/lib/db/supabase';

const scrypt = promisify(scryptCb) as (password: string, salt: string, keylen: number) => Promise<Buffer>;

export interface TeamPasswordMatch {
  id: string;
  name: string;
  active: boolean | null;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const result = await scrypt(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (result.length !== expected.length) return false;
  return timingSafeEqual(result, expected);
}

// Shared by /api/team/login, /api/team/mobile-login and /api/team/request-access.
// Returns null on a DB error too, same as a non-match, so callers don't need a
// separate error branch for "couldn't check" vs. "checked and it's wrong."
//
// Two properties on purpose (Iman's audit, items 07 and 08):
// - scrypt runs on the libuv pool, not the event loop, so a wrong code no
//   longer stalls every other request for the length of the sweep;
// - every row is checked every time (no short-circuit), so a valid code at
//   roster position 1 takes the same time as an invalid one, and the
//   identical-body anti-enumeration design is not undone by timing.
export async function findTeamPasswordMatch(normalizedPassword: string): Promise<TeamPasswordMatch | null> {
  const supabase = getSupabaseAdmin();
  const { data: members, error } = await supabase.from('team_members').select('id, name, password_hash, active');
  if (error || !members) return null;

  const checks = await Promise.all(
    members.map(async (m) => (m.password_hash ? verifyPassword(normalizedPassword, m.password_hash) : false)),
  );
  const idx = checks.findIndex(Boolean);
  if (idx < 0) return null;
  const match = members[idx];
  return { id: match.id, name: match.name, active: match.active };
}
