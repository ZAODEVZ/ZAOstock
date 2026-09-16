import { describe, it, expect, vi } from 'vitest';

// Same mocking shape as src/app/api/events/[slug]/lineup/route.test.ts: a
// hand-built stand-in for the chained Supabase query this file makes.
const { getSupabaseAdmin } = vi.hoisted(() => ({ getSupabaseAdmin: vi.fn() }));
vi.mock('@/lib/db/supabase', () => ({ getSupabaseAdmin }));

import { getArtistBySlug, getRosterArtists, isOnBill, slugify } from './artists';
import { OPS_ACTS } from '@/content/artist-ops';

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

// THE RED CONTROL FOR THE 2026-09-16 BUG. zaal-dotfiles-2d, reading
// /artist/lyonsden live: the page said "Act 8 of 8", but LyonsDen is 7th in
// the real running order (Crown Vics, OPEN X, Grass Rug, Acadia Rising,
// Michael Anderson, DCoop, LyonsDen, Fellenz). Cause: Hurricane held
// set_order 6 before he was declined 2026-09-10 and it was never reassigned,
// so the raw column reads 1,2,3,4,5,[6=excluded],7,8,9 for the nine rows -
// the eight surviving acts carry a gap-shaped column, not a dense 1..8
// sequence. This fixture is the REAL nine-row shape, not a simplified one,
// because the bug only exists when the excluded row sits in the MIDDLE of
// the sequence - a fixture that drops or appends it instead of interleaving
// it would not have caught this.
const NINE_ROWS_WITH_A_GAP = [
  { id: '1', name: 'The Crown Vics', status: 'wishlist', set_order: 1 },
  { id: '2', name: 'OPEN X', status: 'wishlist', set_order: 2 },
  { id: '3', name: 'Grass Rug', status: 'wishlist', set_order: 3 },
  { id: '4', name: 'Acadia Rising', status: 'wishlist', set_order: 4 },
  { id: '5', name: 'Michael Anderson', status: 'wishlist', set_order: 5 },
  { id: '6', name: 'Hurricane', status: 'declined', set_order: 6 },
  { id: '7', name: 'DCoop', status: 'confirmed', set_order: 7 },
  { id: '8', name: 'LyonsDen', status: 'confirmed', set_order: 8 },
  { id: '9', name: 'Tom Fellenz', status: 'wishlist', set_order: 9 },
];

describe('getRosterArtists - setOrder is a dense rank, not the raw column (2026-09-16)', () => {
  it('gives every surviving act a gap-free 1..8 rank, not the raw set_order with Hurricane\'s hole in it', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(NINE_ROWS_WITH_A_GAP));
    const roster = await getRosterArtists();
    expect(roster).toHaveLength(8);
    expect(roster.map((a) => a.setOrder)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('LyonsDen renders 7 of 8, not 8 of 8 - the exact case reported live', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(NINE_ROWS_WITH_A_GAP));
    const roster = await getRosterArtists();
    expect(roster.find((a) => a.name === 'LyonsDen')!.setOrder).toBe(7);
  });

  it('Tom Fellenz renders 8 of 8 once his row is on the bill', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(NINE_ROWS_WITH_A_GAP));
    const roster = await getRosterArtists();
    expect(roster.find((a) => a.name === 'Tom Fellenz')!.setOrder).toBe(8);
  });
});

// OPS_ACTS (src/content/artist-ops.ts) IS HAND-MAINTAINED - the codes behind
// it live in the private vault, so the list of eight cannot itself be read
// from the database. It is only correct as long as someone edits it every
// time the on-bill roster changes. Queued by the seat 2026-09-16: a status
// change (an act declined, a new one confirmed) with no matching OPS_ACTS
// edit would not 404 the backstage page (findActByCode does not touch the
// roster at all) - it would 404 that act's /artist/<slug>/flyer instead,
// silently, the first time anyone tried the "Your flyer" block or opened a
// share link, because the flyer route's slug comes from getArtistBySlug
// (the real roster), not from OPS_ACTS.
//
// This can only check that CODE reflects CODE - it re-uses the real nine-row
// gap fixture above (the true production shape, Hurricane declined mid-list)
// rather than inventing a simplified one, and cannot catch a live database
// edit nobody also made here. scripts/reveal-preflight.sh is the live half
// of this same chain for LINEUP_NAMES; this is its OPS_ACTS counterpart.
describe('OPS_ACTS mirrors the on-bill roster (2026-09-16, queued by the seat)', () => {
  it('names the same eight acts as getRosterArtists, same running order', async () => {
    getSupabaseAdmin.mockReturnValue(supabaseStub(NINE_ROWS_WITH_A_GAP));
    const roster = await getRosterArtists();
    expect(OPS_ACTS.map((a) => a.name)).toEqual(roster.map((a) => a.name));
  });

  // THE RED CONTROL, on the CHECK itself rather than on real data (real
  // OPS_ACTS cannot be mutated from a test, and does not currently have a
  // stale entry - that is what the test above just proved). A hand-built
  // stand-in list, shaped like OPS_ACTS but naming an act the mock roster no
  // longer has, must be caught, not waved through, or this guard is
  // decorative.
  it('catches a stand-in ops list naming an act that dropped off the bill', async () => {
    const rowsWithoutFellenz = NINE_ROWS_WITH_A_GAP.filter((r) => r.name !== 'Tom Fellenz');
    getSupabaseAdmin.mockReturnValue(supabaseStub(rowsWithoutFellenz));
    const roster = await getRosterArtists();
    const rosterNames = new Set(roster.map((a) => a.name));

    const staleOpsList = [{ name: 'DCoop' }, { name: 'LyonsDen' }, { name: 'Tom Fellenz' }];
    const stale = staleOpsList.filter((a) => !rosterNames.has(a.name));
    expect(stale.map((a) => a.name)).toEqual(['Tom Fellenz']);
  });
});
