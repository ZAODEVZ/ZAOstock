import { describe, it, expect, vi } from 'vitest';

// Same mocking shape as src/app/api/events/[slug]/lineup/route.test.ts: a
// hand-built stand-in for the chained Supabase query this file makes.
const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));
vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));

import { getArtistBySlug, getRosterArtists, isOnBill, slugify } from './artists';

describe('isOnBill - the red control for the eight-act scope', () => {
  // Real rows, measured against the live database 2026-09-15.
  const onTheBill = { set_order: 1, status: 'wishlist' }; // The Crown Vics
  const confirmedOnTheBill = { set_order: 7, status: 'confirmed' }; // DCoop
  const cypherApplicant = { set_order: null, status: 'wishlist' }; // AttaBotty
  const declinedButHeldASlot = { set_order: 6, status: 'declined' }; // Hurricane

  it('includes an unconfirmed act that is actually on the bill', () => {
    expect(isOnBill(onTheBill)).toBe(true);
  });

  it('includes a confirmed act on the bill', () => {
    expect(isOnBill(confirmedOnTheBill)).toBe(true);
  });

  // THE CASE THIS FUNCTION EXISTS FOR. A `status != 'declined'` check alone
  // passes this row - it is exactly the pre-2026-08-29 bug (Iman's audit,
  // items 05 and the reveal rule) that a scope of set_order-only, forgetting
  // status, would also miss the other way.
  it('excludes a cypher/open-mic applicant with no set_order, even though not declined', () => {
    expect(isOnBill(cypherApplicant)).toBe(false);
  });

  // THE OTHER HALF. set_order-only, forgetting status, would let a declined
  // act back onto public pages the moment it is dropped - Hurricane held
  // slot 6 before he was cut 2026-09-10, and his set_order was never cleared.
  it('excludes a declined act even though it still carries a set_order', () => {
    expect(isOnBill(declinedButHeldASlot)).toBe(false);
  });
});

function supabaseStub(rows: Array<Record<string, unknown>>) {
  return {
    from: (table: string) => {
      if (table === 'events') {
        return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: 'evt-1' }, error: null }) }) }) };
      }
      return { select: () => ({ eq: () => ({ order: async () => ({ data: rows, error: null }) }) }) };
    },
  };
}

const ROWS = [
  { id: '1', name: 'The Crown Vics', status: 'wishlist', set_order: 1 },
  { id: '2', name: 'DCoop', status: 'confirmed', bio: 'Real bio.', photo_url: 'https://example.com/p.jpg', set_order: 7 },
  { id: '3', name: 'Hurricane', status: 'declined', set_order: 6 },
  { id: '4', name: 'AttaBotty', status: 'wishlist', set_order: null },
];

describe('getRosterArtists - end to end through the real filter', () => {
  it('the roster it returns matches isOnBill exactly - Hurricane and AttaBotty both gone, both acts on the bill present', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ROWS));
    const roster = await getRosterArtists();
    expect(roster.map((a) => a.name).sort()).toEqual(['DCoop', 'The Crown Vics']);
  });

  it('an unconfirmed act on the bill gets blank fields, not dropped and not crashed on', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ROWS));
    const roster = await getRosterArtists();
    const vics = roster.find((a) => a.name === 'The Crown Vics')!;
    expect(vics.bio).toBe('');
    expect(vics.photo_url).toBe('');
    expect(vics.setOrder).toBe(1);
  });

  it('getArtistBySlug finds an unconfirmed act by its slug - the exact 404 this ruling fixes', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ROWS));
    const artist = await getArtistBySlug(slugify('The Crown Vics'));
    expect(artist?.name).toBe('The Crown Vics');
  });

  it('getArtistBySlug returns null for a cypher applicant, not a page', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ROWS));
    expect(await getArtistBySlug(slugify('AttaBotty'))).toBeNull();
  });

  it('getArtistBySlug returns null for a declined act', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(ROWS));
    expect(await getArtistBySlug(slugify('Hurricane'))).toBeNull();
  });
});
