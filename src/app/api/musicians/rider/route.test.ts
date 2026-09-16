import { describe, it, expect, vi } from 'vitest';

// Same bug as musicians/submit, in this route's new-artist insert branch:
// status: 'submitted' is not one of the six values artists_status_check
// allows, so a rider from someone with no existing row always errored and
// was discarded. This file covers that branch (no existing artist matched
// by email) - the update/concurrency-guard branch for an already-claimed
// artist is untouched by this fix and already had its own coverage story.

const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));
vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));
vi.mock('@/lib/api/rate-limit', () => ({ rateLimitPublicForm: () => null }));
vi.mock('@/lib/artists', () => ({
  generateClaimToken: () => 'claim-token-stub',
  slugify: (name: string) => name.toLowerCase().replace(/\s+/g, '-'),
}));
vi.mock('@/lib/env', () => ({ ENV: { NEXT_PUBLIC_APP_URL: 'https://zaostock.com' } }));

import { POST } from './route';

function post(body: unknown) {
  const req = { headers: new Headers(), json: async () => body } as unknown as Parameters<typeof POST>[0];
  return POST(req);
}

const VALID = {
  name: 'New Rider Act',
  contact_email: 'rider-test@example.com',
  schedule_response: 'accepted',
  equipment_response: 'accepted',
  acknowledged: true,
  signature: 'Rider Test',
};

/** No existing artist row matches the email - the route's insert branch. */
function noMatchThenInsertStub(insertResult: { data: { id: string } | null; error: unknown }) {
  let written: Record<string, unknown> | null = null;
  const supabase = {
    from: () => ({
      select: () => ({ ilike: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
      insert: (row: Record<string, unknown>) => {
        written = row;
        return { select: () => ({ single: async () => insertResult }) };
      },
    }),
  };
  return { supabase, getWritten: () => written };
}

describe('POST /api/musicians/rider - new-artist branch', () => {
  it('writes status "wishlist", never the constraint-violating "submitted"', async () => {
    const { supabase, getWritten } = noMatchThenInsertStub({ data: { id: 'artist-1' }, error: null });
    getSupabaseAdmin.mockReturnValue(supabase);
    const res = await post(VALID);
    expect(res.status).toBe(201);
    expect(getWritten()?.status).toBe('wishlist');
  });

  it('never discards on an insert error - falls back instead of a bare 500', async () => {
    const { supabase } = noMatchThenInsertStub({
      data: null,
      error: { code: '23514', message: 'violates check constraint "artists_status_check"' },
    });
    getSupabaseAdmin.mockReturnValue(supabase);
    const res = await post(VALID);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toMatch(/email/i);
  });
});
