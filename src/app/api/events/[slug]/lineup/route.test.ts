import { describe, it, expect, vi, beforeEach } from 'vitest';

// The behaviour under test is what this endpoint does when Supabase is NOT
// reachable, which is the state it was actually in on 2026-08-22 (egress quota
// hit, REST returning 402, no refill until 2026-09-21). The load-bearing
// assertion is that a failure never produces an empty 200.

const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));
const { getFallbackLineup } = vi.hoisted(() => ({ getFallbackLineup: vi.fn() }));

vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));
vi.mock('@/lib/lineup-fallback', () => ({
  getFallbackLineup,
  AS_OF: '2026-08-22',
}));

import { GET } from './route';

const params = Promise.resolve({ slug: 'zaostock-2026' });
const req = {} as Parameters<typeof GET>[0];

/** Minimal stand-in for the two chained Supabase queries the route makes. */
function supabaseStub(opts: {
  event?: { id: string } | null;
  eventError?: unknown;
  artists?: unknown[];
  artistsError?: unknown;
}) {
  return {
    from: (table: string) => {
      if (table === 'events') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: opts.event === undefined ? { id: 'evt-1' } : opts.event,
                error: opts.eventError ?? null,
              }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: async () => ({
                data: opts.artists ?? [],
                error: opts.artistsError ?? null,
              }),
            }),
          }),
        }),
      };
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  getFallbackLineup.mockReturnValue([]);
});

describe('GET /api/events/[slug]/lineup', () => {
  it('serves the live lineup when Supabase answers', async () => {
    getSupabaseAdmin.mockReturnValue(
      supabaseStub({ artists: [{ id: 'a1', name: 'Test Act', set_order: 1 }] }),
    );

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.source).toBe('live');
    expect(body.artists).toHaveLength(1);
    expect(body.degraded).toBeUndefined();
  });

  it('returns 404 for an unknown event, which is an answer and not a degradation', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub({ event: null }));

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.degraded).toBeUndefined();
  });

  it('serves the committed fallback when the artists query fails', async () => {
    getFallbackLineup.mockReturnValue([{ id: 'f1', name: 'Committed Act', set_order: 1 }]);
    getSupabaseAdmin.mockReturnValue(
      supabaseStub({ artistsError: { message: 'egress quota exceeded' } }),
    );

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.source).toBe('fallback');
    expect(body.degraded).toBe(true);
    expect(body.as_of).toBe('2026-08-22');
    expect(body.artists).toHaveLength(1);
  });

  it('serves the committed fallback when the event lookup fails', async () => {
    getFallbackLineup.mockReturnValue([{ id: 'f1', name: 'Committed Act', set_order: 1 }]);
    getSupabaseAdmin.mockReturnValue(supabaseStub({ eventError: { message: '402' } }));

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.source).toBe('fallback');
  });

  // The whole point of the change. An empty fallback must not be dressed up as
  // a real answer - "no confirmed artists" and "we could not find out" are
  // different claims.
  it('fails honestly with 503 when Supabase is down and the fallback is empty', async () => {
    getFallbackLineup.mockReturnValue([]);
    getSupabaseAdmin.mockReturnValue(
      supabaseStub({ artistsError: { message: 'egress quota exceeded' } }),
    );

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.degraded).toBe(true);
    expect(body.retry).toBe(true);
    expect(body.artists).toBeUndefined();
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('never answers 200 with an empty artists array sourced from a failure', async () => {
    getFallbackLineup.mockReturnValue([]);
    getSupabaseAdmin.mockReturnValue(supabaseStub({ eventError: { message: '402' } }));

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).not.toBe(200);
    expect(Array.isArray(body.artists)).toBe(false);
  });

  it('degrades rather than throwing when the Supabase client itself is unavailable', async () => {
    getSupabaseAdmin.mockImplementation(() => {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured');
    });

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.reason).toBe('upstream-unavailable');
  });

  it('degrades when the query throws a network error instead of returning one', async () => {
    getSupabaseAdmin.mockReturnValue({
      from: () => {
        throw new Error('fetch failed');
      },
    });

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.reason).toBe('upstream-unavailable');
  });

  it('lets a live response be edge-cached so the cache can cover a later outage', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub({ artists: [] }));

    const res = await GET(req, { params });

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('stale-while-revalidate');
  });
});
