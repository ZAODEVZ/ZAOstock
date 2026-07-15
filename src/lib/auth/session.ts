import { getIronSession, IronSession, sealData, unsealData } from 'iron-session';
import { cookies, headers } from 'next/headers';
import { ENV } from '@/lib/env';
import { getSupabaseAdmin } from '@/lib/db/supabase';

export interface StockTeamPayload {
  memberId?: string;
  memberName?: string;
}

interface MobileTokenPayload {
  memberId: string;
  memberName: string;
}

const MOBILE_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days, same lifetime as the cookie session

// Built lazily, not as a module-level constant - ENV.SESSION_SECRET now
// throws if unset (see lib/env.ts), and this needs to stay inside
// getStockTeamMember()'s own try/catch so a missing secret fails closed
// (anonymous) instead of crashing every page that imports this module,
// including at build time during Next's page-data collection.
function stockTeamSessionOptions() {
  return {
    password: ENV.SESSION_SECRET,
    cookieName: 'team_session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax' as const,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  };
}

export async function getStockTeamSession(): Promise<IronSession<StockTeamPayload>> {
  const cookieStore = await cookies();
  return getIronSession<StockTeamPayload>(cookieStore, stockTeamSessionOptions());
}

// Shared by both auth paths below - a valid session/token alone isn't
// enough, since either can outlive a member being deactivated (by the
// inactivity cron or a lead's manual PATCH) by up to 30 days otherwise.
// Re-check `active` against the DB on every read rather than trusting
// whatever was true when the cookie/token was issued.
async function resolveIfActive(memberId: string, memberName: string): Promise<{ memberId: string; memberName: string } | null> {
  const supabase = getSupabaseAdmin();
  const { data: row } = await supabase.from('team_members').select('active').eq('id', memberId).maybeSingle();
  if (!row || row.active === false) return null;
  return { memberId, memberName };
}

async function getBearerTeamMember(): Promise<{ memberId: string; memberName: string } | null> {
  const headerStore = await headers();
  const authHeader = headerStore.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = await unsealData<MobileTokenPayload>(token, {
      password: ENV.SESSION_SECRET,
      ttl: MOBILE_TOKEN_TTL_SECONDS,
    });
    if (!payload.memberId || !payload.memberName) return null;
    return resolveIfActive(payload.memberId, payload.memberName);
  } catch {
    // Expired or tampered token - same as no token.
    return null;
  }
}

// Cookie session first (web), falling back to an `Authorization: Bearer`
// token (mobile app - see issueMobileToken()) when there's no cookie. Every
// existing /api/team/* route already calls this with no arguments, so
// mobile support needed zero changes at the ~15 call sites - `headers()` and
// `cookies()` both read from the current request context implicitly in a
// Route Handler, no request object needs to be threaded through.
export async function getStockTeamMember(): Promise<{ memberId: string; memberName: string } | null> {
  // Fail closed (anonymous) instead of throwing - a misconfigured/missing
  // SESSION_SECRET should never 500 a public page.
  try {
    const session = await getStockTeamSession();
    if (session.memberId && session.memberName) {
      const member = await resolveIfActive(session.memberId, session.memberName);
      if (!member) session.destroy();
      return member;
    }

    return await getBearerTeamMember();
  } catch (err) {
    console.error('[getStockTeamMember] session read failed (check SESSION_SECRET):', err);
    return null;
  }
}

export async function issueMobileToken(memberId: string, memberName: string): Promise<string> {
  return sealData({ memberId, memberName } satisfies MobileTokenPayload, {
    password: ENV.SESSION_SECRET,
    ttl: MOBILE_TOKEN_TTL_SECONDS,
  });
}

export async function saveStockTeamSession(memberId: string, memberName: string) {
  const session = await getStockTeamSession();
  session.memberId = memberId;
  session.memberName = memberName;
  await session.save();
}

export async function clearStockTeamSession() {
  const session = await getStockTeamSession();
  session.destroy();
}
