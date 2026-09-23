import { describe, it, expect } from 'vitest';
import { isPublishable } from './lineup-reveal';
import { getFallbackLineup } from './lineup-fallback';
import { PUBLIC_LINEUP } from '@/content/site';

// The public lineup API (the reveal the ZAO Festivals app reads) shows an act
// only once its row is complete (isPublishable) - /artist/<slug> stopped using
// this gate 2026-09-15 (see lineup-reveal.ts) and now renders every act on the
// bill. The fallback lineup must answer to the slug the
// events table actually uses ('zaostock') as well as the one the mobile app
// calls ('zaostock-2026'). Both were wrong on 2026-08-28 (Iman's audit, items
// 05 and 06).

describe('isPublishable - the per-artist gate', () => {
  const PHOTO = 'https://example.com/press.jpg';

  it('publishes a confirmed act with a bio and a photo', () => {
    expect(isPublishable({ status: 'confirmed', bio: 'Plays loud.', photo_url: PHOTO })).toBe(true);
  });

  // THE CASE THIS GATE EXISTS FOR. Dcoop, 2026-09-10: confirmed, bio in, no
  // photo. Zaal: nobody is posted without their bio and photo in hand.
  it('does NOT publish a confirmed act whose photo is empty', () => {
    expect(isPublishable({ status: 'confirmed', bio: 'Plays loud.', photo_url: '' })).toBe(false);
    expect(isPublishable({ status: 'confirmed', bio: 'Plays loud.', photo_url: '   ' })).toBe(false);
    expect(isPublishable({ status: 'confirmed', bio: 'Plays loud.', photo_url: null })).toBe(false);
    expect(isPublishable({ status: 'confirmed', bio: 'Plays loud.' })).toBe(false);
  });

  it('does NOT publish a confirmed act whose bio is empty', () => {
    expect(isPublishable({ status: 'confirmed', bio: '', photo_url: PHOTO })).toBe(false);
    expect(isPublishable({ status: 'confirmed', bio: null, photo_url: PHOTO })).toBe(false);
  });

  it('does NOT publish anything that is not confirmed, however complete', () => {
    for (const status of ['wishlist', 'declined', 'contacted', '', null, undefined]) {
      expect(isPublishable({ status, bio: 'Plays loud.', photo_url: PHOTO }), String(status)).toBe(false);
    }
  });
});

describe('fallback lineup slugs', () => {
  it('answers to both the events-table slug and the mobile app slug', () => {
    expect(getFallbackLineup('zaostock')).toEqual(getFallbackLineup('zaostock-2026'));
    expect(getFallbackLineup('nope')).toEqual([]);
  });
});

// The site and the app answer "who is playing" from two different places, and on
// 2026-09-01 they disagree. Measured: the live endpoint returns
// {"artists":[],"source":"live"} - Supabase is UP and the artists table is simply
// empty, so this is not the degraded path. Meanwhile the website serves LyonsDen
// from PUBLIC_LINEUP, which is hardcoded in the bundle.
//
// At the reveal the website would announce a confirmed act while the mobile app
// and every /artist/<slug> page showed an empty bill. Found by Iman, 2026-08-31.
//
// The fallback is deliberately NOT populated to paper over this: lineup-fallback.ts
// says entries are copied from the real roster and never invented, and nobody here
// holds LyonsDen's genre, city, bio or photo. Writing blanks to silence a test
// would be exactly the fabrication that file exists to prevent.
//
// So this pins the disagreement instead of hiding it. It fails the moment anyone
// changes one side without the other, which forces the decision Zaal owes:
// either LyonsDen goes into the artists table as confirmed and linked to the
// event, or it is said out loud that the app is not a reveal surface this year.
//
// RESOLVED 2026-09-23. The artists table now carries the bill: the live endpoint
// answered source "live", published true, pending 0, 8 artists, LyonsDen among
// them. The fallback was populated as a verbatim copy of that response, so the
// pin above has done its job and becomes the invariant it was protecting: every
// name the site hardcodes must be on the bill the app would serve when Supabase
// is down.
describe('the site and the app must not disagree silently about the lineup', () => {
  it('every name the site hardcodes is in the committed fallback', () => {
    const names = getFallbackLineup('zaostock').map((a) => a.name);
    for (const n of PUBLIC_LINEUP) expect(names).toContain(n);
  });
});

// The degraded path serves this file to the ZAO Festivals app when Supabase is
// down (route.ts: degraded()). An empty array there is a 503 on show day; a
// half-filled entry is a broken card. Pinned to the 2026-09-23 copy.
describe('the committed fallback is a real bill', () => {
  const bill = getFallbackLineup('zaostock');

  it('carries the eight confirmed acts', () => {
    expect(bill).toHaveLength(8);
  });

  it('every act has a unique id, a name, a bio and a photo', () => {
    expect(new Set(bill.map((a) => a.id)).size).toBe(bill.length);
    for (const a of bill) {
      expect(a.name.trim()).not.toBe('');
      expect(a.bio.trim()).not.toBe('');
      expect(a.photo_url.trim()).not.toBe('');
    }
  });

  it('is ordered by set_order', () => {
    const orders = bill.map((a) => a.set_order ?? Infinity);
    expect(orders).toEqual([...orders].sort((x, y) => x - y));
  });
});
