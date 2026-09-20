import { describe, it, expect } from 'vitest';
import type { NextRequest } from 'next/server';
import { STRIPE_LINKS, stripeLinkFor } from '@/content/site';
import { GET } from './route';

// GET doesn't read the request itself - only params - so a minimal stub is
// enough, same pattern as src/app/api/backstage/[code]/route.test.ts.
const req = {} as NextRequest;

function get(tier: string) {
  return GET(req, { params: Promise.resolve({ tier }) });
}

// Derived from stripeLinkFor's own verdict, not from assuming every
// STRIPE_LINKS entry is wired - a future UNSET tier must not break this
// file, same reasoning as checkout.test.ts's LIVE_TIERS pattern (#258).
const WIRED = Object.keys(STRIPE_LINKS).filter((id) => stripeLinkFor(id) !== null);

describe('GET /t/<tier>', () => {
  it('redirects to the live link for every currently-wired tier, temporarily', async () => {
    expect(WIRED.length).toBeGreaterThan(0); // the point of this test, not a tautology
    for (const tierId of WIRED) {
      const res = await get(tierId);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe(STRIPE_LINKS[tierId]);
    }
  });

  it('404s for a tier id that is not wired, and for one that does not exist at all', async () => {
    for (const tierId of Object.keys(STRIPE_LINKS)) {
      if (WIRED.includes(tierId)) continue;
      expect((await get(tierId)).status).toBe(404);
    }
    expect((await get('nope')).status).toBe(404);
  });

  it('never redirects permanently, so a regenerated Stripe link cannot strand old clicks', async () => {
    const res = await get(WIRED[0]);
    expect(res.status).not.toBe(301);
    expect(res.status).not.toBe(308);
  });
});
