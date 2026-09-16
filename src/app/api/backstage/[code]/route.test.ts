import { describe, it, expect, vi, beforeEach } from 'vitest';

// THE RED CONTROLS, verbatim from the 2026-09-16 ask: "a submit with the
// wrong code writes nothing." findActByCode is mocked rather than exercised
// against real OPS_ACTS codes, because real codes are never in this repo
// (only their SHA-256 hashes) - this file asserts the ROUTE's behaviour
// given what findActByCode returns, which is the same contract the real
// function honours (tested separately in artist-ops.test.ts).

const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));
const { logFieldChanges } = vi.hoisted(() => ({ logFieldChanges: vi.fn() }));
const { findActByCode } = vi.hoisted(() => ({ findActByCode: vi.fn() }));
const { getArtistOpsStatus } = vi.hoisted(() => ({ getArtistOpsStatus: vi.fn() }));

vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));
vi.mock('@/lib/log-activity', () => ({ logFieldChanges }));
vi.mock('@/lib/api/rate-limit', () => ({ rateLimitPublicForm: () => null }));
vi.mock('@/content/artist-ops', () => ({ findActByCode }));
vi.mock('@/lib/artists', () => ({ getArtistOpsStatus }));

import { PATCH } from './route';

const ACT = { key: 'crown-vics', name: 'The Crown Vics', setStart: '12:05', minutes: 33, codeSha256: 'irrelevant-here' };
const ROW = {
  id: 'row-1',
  bio: '',
  photoUrl: '',
  city: '',
  socials: '',
  rider: '',
  soundcheckConfirmed: null,
  filmingConsent: null,
};

/** Records every write so a test can assert that NOTHING was written. */
let writes: Array<{ table: string; payload: unknown; id: unknown }>;

function supabaseStub() {
  return {
    from: (table: string) => ({
      update: (payload: unknown) => ({
        eq: async (_col: string, id: unknown) => {
          writes.push({ table, payload, id });
          return { error: null };
        },
      }),
    }),
  };
}

function patch(body: unknown, code = 'whatever-1234') {
  const req = {
    headers: new Headers(),
    json: async () => body,
  } as unknown as Parameters<typeof PATCH>[0];
  return PATCH(req, { params: Promise.resolve({ code }) });
}

beforeEach(() => {
  writes = [];
  vi.clearAllMocks();
  getSupabaseAdmin.mockReturnValue(supabaseStub());
});

describe('PATCH /api/backstage/[code] - the code is the auth', () => {
  it('a wrong code 404s and writes nothing', async () => {
    findActByCode.mockReturnValue(null);
    const res = await patch({ bio: 'Trying to sneak this in.' });
    expect(res.status).toBe(404);
    expect(writes).toEqual([]);
    expect(getArtistOpsStatus).not.toHaveBeenCalled();
  });

  it('a right code with no matching row 404s and writes nothing', async () => {
    findActByCode.mockReturnValue(ACT);
    getArtistOpsStatus.mockResolvedValue(null);
    const res = await patch({ bio: 'x' });
    expect(res.status).toBe(404);
    expect(writes).toEqual([]);
  });

  it('an empty body is refused before any write', async () => {
    findActByCode.mockReturnValue(ACT);
    getArtistOpsStatus.mockResolvedValue(ROW);
    const res = await patch({});
    expect(res.status).toBe(400);
    expect(writes).toEqual([]);
  });

  it('a non-https photo link is refused before any write', async () => {
    findActByCode.mockReturnValue(ACT);
    getArtistOpsStatus.mockResolvedValue(ROW);
    const res = await patch({ photoUrl: 'http://example.com/p.jpg' });
    expect(res.status).toBe(400);
    expect(writes).toEqual([]);
  });

  it('writes ONLY the fields provided, mapped to their real column names', async () => {
    findActByCode.mockReturnValue(ACT);
    getArtistOpsStatus.mockResolvedValue(ROW);
    const res = await patch({ bio: 'A real bio.', filmingConsent: true });
    expect(res.status).toBe(200);
    expect(writes).toHaveLength(1);
    expect(writes[0].table).toBe('artists');
    expect(writes[0].id).toBe('row-1');
    expect(writes[0].payload).toEqual({ bio: 'A real bio.', filming_consent: true });
  });

  it('logs the field change with real before/after values, not just success', async () => {
    findActByCode.mockReturnValue(ACT);
    getArtistOpsStatus.mockResolvedValue({ ...ROW, city: 'Ellsworth, Maine' });
    await patch({ city: 'Bar Harbor, Maine' });
    expect(logFieldChanges).toHaveBeenCalledWith(
      null,
      'artist',
      'row-1',
      { city: 'Ellsworth, Maine' },
      { city: 'Bar Harbor, Maine' },
    );
  });

  it('a yes/no field of false is a real write, not treated as absent', async () => {
    findActByCode.mockReturnValue(ACT);
    getArtistOpsStatus.mockResolvedValue(ROW);
    const res = await patch({ soundcheckConfirmed: false });
    expect(res.status).toBe(200);
    expect(writes[0].payload).toEqual({ soundcheck_confirmed: false });
  });
});
