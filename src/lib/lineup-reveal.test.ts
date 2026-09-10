import { describe, it, expect } from 'vitest';
import { isPublishable } from './lineup-reveal';
import { getFallbackLineup } from './lineup-fallback';
import { PUBLIC_LINEUP } from '@/content/site';

// The public /artist/<slug> pages and the public lineup show an act only once
// its row is complete (isPublishable), and the fallback lineup must answer to the slug the
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
// empty, so this is not the degraded path. Meanwhile the website serves Lyons Den
// from PUBLIC_LINEUP, which is hardcoded in the bundle.
//
// At the reveal the website would announce a confirmed act while the mobile app
// and every /artist/<slug> page showed an empty bill. Found by Iman, 2026-08-31.
//
// The fallback is deliberately NOT populated to paper over this: lineup-fallback.ts
// says entries are copied from the real roster and never invented, and nobody here
// holds Lyons Den's genre, city, bio or photo. Writing blanks to silence a test
// would be exactly the fabrication that file exists to prevent.
//
// So this pins the disagreement instead of hiding it. It fails the moment anyone
// changes one side without the other, which forces the decision Zaal owes:
// either Lyons Den goes into the artists table as confirmed and linked to the
// event, or it is said out loud that the app is not a reveal surface this year.
describe('the site and the app must not disagree silently about the lineup', () => {
  it('pins the known gap so changing one side trips the other', () => {
    expect(PUBLIC_LINEUP).toEqual(['Lyons Den']);
    expect(getFallbackLineup('zaostock')).toEqual([]);
    expect(getFallbackLineup('zaostock-2026')).toEqual([]);
  });
});
