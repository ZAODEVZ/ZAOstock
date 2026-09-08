import { describe, it, expect, vi, beforeEach } from 'vitest';

// This route is the ONLY thing that can set an artist to 'confirmed' while the
// team dashboard is retired, and 'confirmed' is exactly what the public reveal
// publishes. So the load-bearing assertions here are the refusals, not the
// happy path: it must fail closed with no secret, and it must NEVER create a
// row, because creating an artist and confirming it in one call is
// indistinguishable from inventing a signature.

const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));
const { logActivity } = vi.hoisted(() => ({ logActivity: vi.fn() }));
const { secretRef } = vi.hoisted(() => ({ secretRef: { value: 'test-secret' as string | null } }));

vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));
vi.mock('@/lib/log-activity', () => ({ logActivity }));
vi.mock('@/lib/env', () => ({
  ENV: {
    get ARTIST_CONFIRM_SECRET() {
      if (secretRef.value === null) throw new Error('[env] ARTIST_CONFIRM_SECRET is required and not set');
      return secretRef.value;
    },
  },
}));

import { POST } from './route';

type Body = Record<string, unknown>;

function post(body: Body, auth: string | null = 'Bearer test-secret') {
  const headers = new Headers();
  if (auth !== null) headers.set('authorization', auth);
  return {
    headers,
    json: async () => body,
  } as unknown as Parameters<typeof POST>[0];
}

/** Records every write so a test can assert that NOTHING was written. */
const writes: Array<{ table: string; op: string; payload?: unknown }> = [];

function supabaseStub(existing: { id: string; name: string; status: string } | null, opts: { findError?: unknown; updateError?: unknown; event?: { id: string } | null } = {}) {
  return {
    from: (table: string) => ({
      // The artists lookup is now scoped to the event, so it chains TWO .eq()
      // calls. This returns a chainable shape rather than a one-shot, and
      // answers the events table with the festival row.
      select: () => {
        const chain = {
          eq: () => chain,
          maybeSingle: async () =>
            table === 'events'
              ? { data: opts.event === undefined ? { id: 'evt-zaostock' } : opts.event, error: null }
              : { data: existing, error: opts.findError ?? null },
        };
        return chain;
      },
      update: (payload: unknown) => {
        writes.push({ table, op: 'update', payload });
        return { eq: async () => ({ error: opts.updateError ?? null }) };
      },
      insert: (payload: unknown) => {
        writes.push({ table, op: 'insert', payload });
        return { error: null };
      },
      delete: () => {
        writes.push({ table, op: 'delete' });
        return { eq: async () => ({ error: null }) };
      },
    }),
  };
}

const ARTIST = { id: '11111111-1111-4111-8111-111111111111', name: 'Dcoop', status: 'contacted' };

beforeEach(() => {
  writes.length = 0;
  secretRef.value = 'test-secret';
  logActivity.mockReset();
  getSupabaseAdmin.mockReset();
});

describe('POST /api/admin/confirm-artist', () => {
  it('fails CLOSED with 503 when the secret is not configured', async () => {
    secretRef.value = null;
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(post({ name: 'Dcoop', confirmation_reference: 'form response 1' }));
    expect(res.status).toBe(503);
    // An unset secret must never mean "no auth required".
    expect(writes).toEqual([]);
  });

  it('rejects a wrong bearer token', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(post({ name: 'Dcoop', confirmation_reference: 'x' }, 'Bearer wrong-secret'));
    expect(res.status).toBe(401);
    expect(writes).toEqual([]);
  });

  it('rejects a missing authorization header', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(post({ name: 'Dcoop', confirmation_reference: 'x' }, null));
    expect(res.status).toBe(401);
    expect(writes).toEqual([]);
  });

  it('requires a written confirmation reference - decision 0005 in the schema', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(post({ name: 'Dcoop' }));
    expect(res.status).toBe(400);
    expect(writes).toEqual([]);

    const blank = await POST(post({ name: 'Dcoop', confirmation_reference: '   ' }));
    expect(blank.status).toBe(400);
    expect(writes).toEqual([]);
  });

  it('requires either an id or a name', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(post({ confirmation_reference: 'form response 1' }));
    expect(res.status).toBe(400);
    expect(writes).toEqual([]);
  });

  it('NEVER creates a row: an unknown act is a 404 and writes nothing', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(null));
    const res = await POST(post({ name: 'not-a-real-act', confirmation_reference: 'form response 9' }));
    expect(res.status).toBe(404);
    // The whole point. Creating and confirming in one call would be fabricating
    // a signature for an act that never replied.
    expect(writes).toEqual([]);
    expect(logActivity).not.toHaveBeenCalled();
  });

  it('confirms an existing act and records what justified it', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(
      post({ name: 'Dcoop', confirmation_reference: 'Google Form response 2026-09-11', city: 'Ellsworth' }),
    );
    expect(res.status).toBe(200);

    expect(writes).toHaveLength(1);
    const payload = writes[0].payload as Record<string, unknown>;
    expect(writes[0].op).toBe('update');
    expect(payload.status).toBe('confirmed');
    expect(payload.city).toBe('Ellsworth');
    // The live schema has NO confirmed_at and NO confirmation_reference column,
    // measured 2026-09-07. Writing either would fail at runtime.
    expect(payload.confirmed_at).toBeUndefined();
    expect(payload.confirmation_reference).toBeUndefined();

    expect(logActivity).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'confirm', fieldChanged: 'status', oldValue: 'contacted', newValue: 'confirmed' }),
    );
    // Decision 0005's paper trail lives in activity_log instead.
    expect(logActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldChanged: 'confirmation_reference',
        newValue: 'Google Form response 2026-09-11',
      }),
    );
  });

  it('only ever writes the fields it was given, and never an arbitrary status', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(
      post({ name: 'Dcoop', confirmation_reference: 'ref', status: 'declined', fee: 5000, claim_token: 'leak' }),
    );
    expect(res.status).toBe(200);
    const payload = writes[0].payload as Record<string, unknown>;
    // The caller asked for 'declined' and a fee. Neither is honoured.
    expect(payload.status).toBe('confirmed');
    expect(payload.fee).toBeUndefined();
    expect(payload.claim_token).toBeUndefined();
  });

  it('never returns a claim token or a fee', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ARTIST));
    const res = await POST(post({ name: 'Dcoop', confirmation_reference: 'ref' }));
    const body = await res.json();
    expect(JSON.stringify(body)).not.toContain('claim_token');
    expect(JSON.stringify(body)).not.toContain('fee');
    expect(body).toMatchObject({ ok: true, status: 'confirmed', previous_status: 'contacted' });
  });

  it('exposes no other verb - there is no GET, PATCH or DELETE on this route', async () => {
    const mod = await import('./route');
    expect(Object.keys(mod).sort()).toEqual(['POST']);
  });

  /**
   * The lookup used to run across the whole artists table with no event scope.
   * Four events exist; only zaostock has rows today, so this could not fire -
   * but Hurricane and Dcoop played past ZAO festivals, and backfilling those
   * rosters would have made a ZAOstock confirmation land on another event's row.
   */
  describe('scoping to the festival', () => {
    it('fails closed when the event cannot be resolved, rather than confirming unscoped', async () => {
      getSupabaseAdmin.mockReturnValue(
        supabaseStub({ id: 'a1', name: 'Dcoop', status: 'wishlist' }, { event: null }),
      );

      const res = await POST(post({ name: 'Dcoop', confirmation_reference: 'form response' }));

      expect(res.status).toBe(503);
      // The load-bearing part: nothing was written when the scope was unknown.
      expect(writes).toEqual([]);
    });
  });
});
