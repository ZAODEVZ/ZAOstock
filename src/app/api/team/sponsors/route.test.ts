import { describe, it, expect, vi, beforeEach } from 'vitest';

// referred_by carries the name the finder's fee is paid to
// (docs/sponsor/finders-fee-structure.md). These tests pin that it is accepted,
// trimmed, bounded, and written to the sponsors row on create and update, and
// that it stays optional so a sponsor with no referrer still saves.

const { getSupabaseAdmin, getStockTeamMember } = vi.hoisted(() => ({
  getSupabaseAdmin: vi.fn(),
  getStockTeamMember: vi.fn(),
}));
vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));
vi.mock('@/lib/auth/session', () => ({ getStockTeamMember }));
vi.mock('@/lib/log-activity', () => ({ logActivity: vi.fn(), logFieldChanges: vi.fn() }));
vi.mock('@/lib/api/resolve-event', () => ({ resolveEventId: async () => 'event-1' }));

import { POST, PATCH } from './route';

const ID = '00000000-0000-4000-8000-000000000001';

function call(handler: typeof POST, body: unknown) {
  const req = {
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => body,
    text: async () => JSON.stringify(body),
    nextUrl: new URL('http://localhost/api/team/sponsors'),
    url: 'http://localhost/api/team/sponsors',
  } as unknown as Parameters<typeof POST>[0];
  return handler(req);
}

function stub() {
  const written: { insert?: Record<string, unknown>; update?: Record<string, unknown> } = {};
  const supabase = {
    from: () => ({
      insert: (row: Record<string, unknown>) => {
        written.insert = row;
        return {
          select: () => ({ single: async () => ({ data: { id: ID, ...row }, error: null }) }),
        };
      },
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: ID }, error: null }) }) }),
      update: (row: Record<string, unknown>) => {
        written.update = row;
        return { eq: async () => ({ error: null }) };
      },
    }),
  };
  getSupabaseAdmin.mockReturnValue(supabase);
  return written;
}

beforeEach(() => {
  getStockTeamMember.mockResolvedValue({ memberId: 'member-1' });
});

describe('POST /api/team/sponsors referred_by', () => {
  it('stores a trimmed referred_by on the new sponsor row', async () => {
    const written = stub();
    const res = await call(POST, { name: 'Test Sponsor', track: 'local', referred_by: '  Test Referrer  ' });
    expect(res.status).toBe(201);
    expect(written.insert?.referred_by).toBe('Test Referrer');
  });

  it('still creates a sponsor when referred_by is left out', async () => {
    const written = stub();
    const res = await call(POST, { name: 'Test Sponsor', track: 'local' });
    expect(res.status).toBe(201);
    expect(written.insert).not.toHaveProperty('referred_by');
  });

  it('rejects a referred_by longer than 200 characters', async () => {
    stub();
    const res = await call(POST, { name: 'Test Sponsor', track: 'local', referred_by: 'x'.repeat(201) });
    expect(res.status).toBe(400);
  });

  it('rejects a non-string referred_by', async () => {
    stub();
    const res = await call(POST, { name: 'Test Sponsor', track: 'local', referred_by: 42 });
    expect(res.status).toBe(400);
  });

  it('requires a team session', async () => {
    getStockTeamMember.mockResolvedValue(null);
    const res = await call(POST, { name: 'Test Sponsor', track: 'local', referred_by: 'Test Referrer' });
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/team/sponsors referred_by', () => {
  it('updates referred_by on its own', async () => {
    const written = stub();
    const res = await call(PATCH, { id: ID, referred_by: 'Test Referrer' });
    expect(res.status).toBe(200);
    expect(written.update?.referred_by).toBe('Test Referrer');
  });
});
