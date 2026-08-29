import { NextRequest, NextResponse } from 'next/server';
import { TEAM_DASHBOARD_RETIRED, TEAM_RETIRED_MESSAGE } from '@/lib/team-status';

import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import { findTeamPasswordMatch } from '@/lib/auth/verify-team-password';
import { parseJsonBody } from '@/lib/api/parse-json';
import { rateLimitPublicForm } from '@/lib/api/rate-limit';

const requestAccessSchema = z.object({
  password: z.string().min(1).max(64),
});

export async function POST(request: NextRequest) {
  if (TEAM_DASHBOARD_RETIRED) return NextResponse.json({ error: TEAM_RETIRED_MESSAGE }, { status: 410 });
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
    const match = await findTeamPasswordMatch(normalized);

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
