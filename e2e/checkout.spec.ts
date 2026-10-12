import { test, expect } from '@playwright/test';
import { SUPPORT_TIERS, stripeLinkFor, unlockCheckoutUrl } from '../src/content/site';

// The paid-support doors on /tickets and on what /donate now redirects to,
// read from the same site.ts the page renders from.
//
// THIS SPEC WAS WRONG, and nothing noticed, for three separate reasons. It is
// not run in CI (.github/workflows/ci.yml has no `npm run test:e2e` step), it
// pinned button copy and hrefs as string literals, and it asked for a page
// that no longer exists. Measured against production on 2026-09-30, at
// origin/main 6a9d737, running the pre-existing spec unchanged:
//
//     4 failed, 4 passed (8 cases)
//
//     /tickets  'PayPal always renders, for both tiers'   FAILS - no such link
//     /tickets  'Pay by card appears only once Stripe...' FAILS - expected 2, got 3
//     (both repeat for /donate)
//
// Three drifts, none of them this test's fault and all of them its job:
// PayPal was removed ("no paypal", Zaal, 2026-09-21, recorded in
// src/app/tickets/page.tsx), a cheaper $1 'Chip in' tier was added IN FRONT of
// the two this file names on 2026-09-23, and /donate was merged into
// /tickets#give on 2026-09-29. A spec that is left to assert a snapshot of one
// afternoon reports noise; every expectation below is now DERIVED from the
// constants the page itself reads, so a fourth tier is covered the day it
// exists instead of failing for the wrong reason.
//
// What this file keeps: every guarantee it made before. No form is submitted,
// no card is entered, no checkout is completed. Every assertion is about which
// door is visible and where it points.

// /donate is a redirect, not a page: next.config.ts sends it to /tickets#give
// (Zaal, 2026-09-29, "combine ticket and donate"). Navigating to it exercises
// the same render, so the matrix keeps both entries, and the last test pins the
// redirect itself - the reason the old PAGES list stopped meaning what it said.
const PAGES = ['/tickets', '/donate'] as const;

for (const path of PAGES) {
  test.describe(`${path} - paid support doors`, () => {
    test('every tier that has a checkout rail configured renders its own card link', async ({ page }) => {
      await page.goto(path);
      // The card doors are the "Pay by card" pills inside each tier card - the
      // label is identical on every one of them, so the count is what carries
      // the per-tier guarantee, and it is checked against the same
      // stripeLinkFor() the page calls. The old spec's 'Chip in $20' /
      // '$50' locators matched nothing at all: the label is "Pay by card", and
      // the tiers it named stopped existing on 2026-09-23 when a $1 'Chip in'
      // was added in front of them.
      const configured = SUPPORT_TIERS.filter((t) => stripeLinkFor(t.id) !== null);
      // Nothing configured at all would make this file vacuous, so say so.
      expect(configured.length, 'no tier has a Stripe link; this spec would assert nothing').toBeGreaterThan(0);

      const cardButtons = page.getByRole('link', { name: 'Pay by card' });
      await expect(cardButtons).toHaveCount(configured.length);

      // And each one is a real Payment Link, matched back to the tier that
      // owns it - so a page that rendered three identical links, or rendered
      // the $50 door for all three tiers, fails here.
      const hrefs = await cardButtons.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      const expected = configured.map((t) => stripeLinkFor(t.id));
      expect(hrefs.slice().sort()).toEqual(expected.slice().sort());
    });

    test('every card link points at a real Stripe Payment Link, never a dashboard URL', async ({ page }) => {
      await page.goto(path);
      const links = page.getByRole('link');
      const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      for (const href of hrefs) {
        if (href === null || !href.includes('stripe.com')) continue;
        // A dashboard URL, a bare stripe.com root, or an empty href would all
        // be the "renders a link that goes nowhere real" failure mode
        // src/content/checkout.test.ts guards against at the unit level - this
        // is the same guarantee, checked against what actually renders.
        expect(href, `link href: ${href}`).toMatch(/^https:\/\/buy\.stripe\.com\//);
        expect(href).not.toMatch(/^https:\/\/dashboard\.stripe\.com/);
        expect(href).not.toBe('https://stripe.com/');
      }
    });

    test('never shows a broken or empty link', async ({ page }) => {
      await page.goto(path);
      const links = page.getByRole('link');
      const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      for (const href of hrefs) {
        if (href === null) continue;
        expect(href, `link href: ${href}`).not.toBe('');
      }
    });

    test('the number of "Pay by card" buttons equals the number of configured tiers', async ({ page }) => {
      await page.goto(path);
      const cardButtons = page.getByRole('link', { name: 'Pay by card' });
      const count = await cardButtons.count();
      // Derived, never hardcoded. The old spec asserted `toBe(2)` and had
      // `if (count === 0) return` in front of it, so it both failed the day a
      // third tier landed AND asserted nothing on every day before that. A
      // derived count has no branch to fall into.
      const expected = SUPPORT_TIERS.filter((t) => stripeLinkFor(t.id) !== null).length;
      expect(count).toBe(expected);
    });

    test('onchain appears only on the Pro tier, and only once Unlock is configured', async ({ page }) => {
      await page.goto(path);
      const onchainButtons = page.getByRole('link', { name: 'Pay onchain' });
      const count = await onchainButtons.count();
      if (count === 0) {
        // Today's state: unlockCheckoutUrl() returns null while
        // UNLOCK_CHECKOUT_URL is the UNSET sentinel, so nothing renders and
        // there is correctly nothing to assert.
        expect(unlockCheckoutUrl()).toBeNull();
        return;
      }
      // Onchain is Pro-Ticket-only by design (see PRO_TICKET.id in the page
      // source) - never on the cheaper tiers.
      expect(count).toBe(1);
      const href = await onchainButtons.first().getAttribute('href');
      expect(href).toMatch(/^https:\/\/app\.unlock-protocol\.com\/checkout/);
      // ...and it must be the configured URL, not some other lock.
      expect(href).toBe(unlockCheckoutUrl());
    });
  });
}

test.describe('/donate - the redirect that replaced the page', () => {
  test('lands on the giving section of /tickets rather than a dead page', async ({ page }) => {
    // /donate used to be a second page with its own copy and its own checkout
    // buttons, and the matrix above covered both. It was merged on 2026-09-29,
    // and a spec that kept asking for it was covering a route that no longer
    // exists. Pin the replacement so the next merge has to update a real test.
    const response = await page.goto('/donate');
    expect(page.url()).toContain('/tickets');
    expect(page.url()).toContain('#give');
    // A redirect that works, not a 404 and not a soft-200 on an empty shell.
    expect(response?.status()).toBeLessThan(400);
  });
});
