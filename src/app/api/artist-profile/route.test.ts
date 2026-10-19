import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Doc 2504 flow 3: "artist profile PATCH rejects a bad token". It is a unit test,
// not Playwright: there is no UI step, and verifyClaimToken reads the database,
// which CI deliberately has no credentials for. So the token check is mocked and
// the ROUTE's contract is what is asserted: a bad token gets 403 and the
// database is never touched; a malformed body gets 400 before any token check.
// The last case is the control - with a token the mock accepts, the route DOES
// reach the database - so a 403 above cannot come from the mock wiring alone.

const { verifyClaimToken } = vi.hoisted(() => ({ verifyClaimToken: vi.fn() }));
const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));

vi.mock('@/lib/artists', () => ({ verifyClaimToken }));
vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));
vi.mock('@/lib/api/rate-limit', () => ({ rateLimitPublicForm: () => null }));

import { PATCH } from './route';

function req(body: unknown) {
  return new NextRequest('https://zaostock.com/api/artist-profile', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  verifyClaimToken.mockReset();
  getSupabaseAdmin.mockReset();
});

describe('PATCH /api/artist-profile', () => {
  it('rejects a bad token with 403 and never touches the database', async () => {
    verifyClaimToken.mockResolvedValue(null);
    const res = await PATCH(req({ slug: 'open-x', token: 'wrong-token', bio: 'hijack attempt' }));
    expect(res.status).toBe(403);
    expect(verifyClaimToken).toHaveBeenCalledWith('open-x', 'wrong-token');
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('rejects a malformed body with 400 before checking any token', async () => {
    const res = await PATCH(req({ slug: 'open-x', token: 'x' }));
    expect(res.status).toBe(400);
    expect(verifyClaimToken).not.toHaveBeenCalled();
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });

  it('rejects a non-https photo URL with 400 before checking any token', async () => {
    const res = await PATCH(req({ slug: 'open-x', token: 'good-token', photo_url: 'http://example.com/a.png' }));
    expect(res.status).toBe(400);
    expect(verifyClaimToken).not.toHaveBeenCalled();
  });

  it('control: an accepted token does reach the database', async () => {
    verifyClaimToken.mockResolvedValue('artist-1');
    getSupabaseAdmin.mockImplementation(() => {
      throw new Error('database reached');
    });
    const res = await PATCH(req({ slug: 'open-x', token: 'good-token', bio: 'hello' }));
    expect(getSupabaseAdmin).toHaveBeenCalled();
    expect(res.status).toBe(500);
  });
});
