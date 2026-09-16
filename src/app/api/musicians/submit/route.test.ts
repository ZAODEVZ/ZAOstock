import { describe, it, expect, vi } from 'vitest';

// THE RED CONTROL FOR THE 2026-09-16 BUG. artists_status_check (the live
// schema) allows exactly six values: wishlist, contacted, interested,
// confirmed, declined, travel_booked. This route wrote 'submitted' - not one
// of them - so every real submission violated the constraint, the insert
// errored, and the route returned a bare 500 that discarded the person's
// answers (src/components/FormsUnavailable.tsx documents the 2026-08-23
// shape of this same failure). Reproduced live 2026-09-16 via a labelled
// probe insert: Postgres 23514, check constraint "artists_status_check".

const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));
vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));
vi.mock('@/lib/api/rate-limit', () => ({ rateLimitPublicForm: () => null }));

import { POST } from './route';

function post(body: unknown) {
  const req = { headers: new Headers(), json: async () => body } as unknown as Parameters<typeof POST>[0];
  return POST(req);
}

const VALID = {
  name: 'Test Act',
  contact_email: 'test@example.com',
  city: 'Ellsworth',
  genre: 'Folk',
};

function insertStub(result: { error: unknown }) {
  let written: Record<string, unknown> | null = null;
  const supabase = {
    from: (table: string) => ({
      insert: (row: Record<string, unknown>) => {
        if (table === 'artists') written = row;
        return Promise.resolve(result);
      },
    }),
  };
  return { supabase, getWritten: () => written };
}

describe('POST /api/musicians/submit', () => {
  it('rejects an empty body with 400 - validation was never the bug', async () => {
    const res = await post({});
    expect(res.status).toBe(400);
  });

  it('writes status "wishlist", never the constraint-violating "submitted"', async () => {
    const { supabase, getWritten } = insertStub({ error: null });
    getSupabaseAdmin.mockReturnValue(supabase);
    const res = await post(VALID);
    expect(res.status).toBe(201);
    expect(getWritten()?.status).toBe('wishlist');
  });

  // THE RED CONTROL FOR "NEVER DISCARD". A real insert failure - the exact
  // shape reproduced live - must not come back as a bare "submit failed"
  // with the payload gone. It comes back as submissionUnstored's 503, which
  // tells the person to email and says nothing they typed is lost.
  it('never discards on an insert error - falls back instead of a bare 500', async () => {
    const { supabase } = insertStub({
      error: { code: '23514', message: 'new row for relation "artists" violates check constraint "artists_status_check"' },
    });
    getSupabaseAdmin.mockReturnValue(supabase);
    const res = await post(VALID);
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toMatch(/email/i);
    expect(json.contact).toBeTruthy();
  });
});
