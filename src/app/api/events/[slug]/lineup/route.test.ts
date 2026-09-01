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

const params = Promise.resolve({ slug: 'zaostock' });
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

  // Regression, 2026-08-31. While Supabase was down this slug reached the
  // fallback and answered; the moment the real database came back, the event
  // lookup ran first and turned it into a hard 404 for the mobile app. The
  // assertion that matters is the slug the query is given, not the status.
  it('resolves the mobile app slug to the events-table slug rather than 404ing', async () => {
    const slugsQueried: string[] = [];
    getSupabaseAdmin.mockReturnValue({
      from: (table: string) => {
        if (table === 'events') {
          return {
            select: () => ({
              eq: (_column: string, value: string) => {
                slugsQueried.push(value);
                return { maybeSingle: async () => ({ data: { id: 'evt-1' }, error: null }) };
              },
            }),
          };
        }
        return {
          select: () => ({
            eq: () => ({ eq: () => ({ order: async () => ({ data: [], error: null }) }) }),
          }),
        };
      },
    });

    const res = await GET(req, { params: Promise.resolve({ slug: 'zaostock-2026' }) });

    expect(slugsQueried).toEqual(['zaostock']);
    expect(res.status).toBe(200);
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

  it('lets a live lineup WITH A ROSTER be edge-cached, so the cache can cover a later outage', async () => {
    getSupabaseAdmin.mockReturnValue(
      supabaseStub({ artists: [{ id: 'a1', name: 'Test Act', set_order: 1 }] }),
    );

    const res = await GET(req, { params });

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('stale-while-revalidate');
  });

  // THIS TEST USED TO ASSERT THE BUG.
  //
  // It was the test above, stubbed with `artists: []`, and it passed - so the
  // suite was pinning a 24-hour stale window onto an EMPTY roster and calling
  // that the desired behaviour. Production returns {"artists":[],"source":"live"}
  // today and the edge already answers it X-Vercel-Cache: HIT, so the thing
  // being pinned was the 7 September reveal failing to reach the mobile app for
  // up to a day, quietly. Rewritten 2026-09-01.
  //
  // An empty live answer is still true and still 200. It just must not be held.
  it('does not hold an EMPTY live roster in a long stale window', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub({ artists: [] }));

    const res = await GET(req, { params });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.source).toBe('live');
    expect(body.artists).toEqual([]);
    expect(res.headers.get('Cache-Control')).not.toContain('stale-while-revalidate');
  });
});
