import { test, expect } from '@playwright/test';

// The paid-support doors on /tickets and /donate, both reading the same
// SUPPORT_TIERS from src/content/site.ts. PayPal is the door that has always
// existed; Stripe ("Pay by card") and Unlock ("Pay onchain") render only once
// their env vars are set in production (stripeLinkFor / unlockCheckoutUrl in
// site.ts both return null until then), so this spec pins BOTH states: the
// PayPal-only day (today) and what must be true the day Stripe/Unlock land.
//
// Nothing here submits a form or completes a purchase - every check is about
// which button exists and what href it carries.

const PAGES = ['/tickets', '/donate'] as const;

for (const path of PAGES) {
  test.describe(`${path} - paid support doors`, () => {
    test('PayPal always renders, for both tiers', async ({ page }) => {
      await page.goto(path);
      const supporterLink = page.getByRole('link', { name: 'Chip in $20' });
      const proLink = page.getByRole('link', { name: 'Chip in $50' });
      await expect(supporterLink).toBeVisible();
      await expect(proLink).toBeVisible();
      await expect(supporterLink).toHaveAttribute('href', /^https:\/\/paypal\.com\/paypalme\/zaalpanthaki\/20$/);
      await expect(proLink).toHaveAttribute('href', /^https:\/\/paypal\.com\/paypalme\/zaalpanthaki\/50$/);
      // External links open in a new tab and never leak a referrer/opener.
      await expect(supporterLink).toHaveAttribute('target', '_blank');
      await expect(supporterLink).toHaveAttribute('rel', /noopener/);
    });

    test('never shows a broken or placeholder checkout link', async ({ page }) => {
      await page.goto(path);
      // A dashboard URL, a bare stripe.com root, or an empty href would all be
      // the exact "renders a link that goes nowhere real" failure mode
      // src/content/checkout.test.ts guards against at the unit level - this
      // is the same guarantee, checked against what actually renders.
      const links = page.getByRole('link');
      const hrefs = await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      for (const href of hrefs) {
        if (href === null) continue;
        expect(href).not.toBe('');
        expect(href).not.toMatch(/^https:\/\/dashboard\.stripe\.com/);
        expect(href).not.toBe('https://stripe.com/');
      }
    });

    test('Pay by card appears only once Stripe is actually configured', async ({ page }) => {
      await page.goto(path);
      const cardButtons = page.getByRole('link', { name: 'Pay by card' });
      const count = await cardButtons.count();
      if (count === 0) {
        // Today's state: stripeLinkFor() returns null in production until
        // Zaal creates the Payment Links (site.ts CARD AND ONCHAIN CHECKOUT).
        return;
      }
      // The day it's live: exactly one per tier, and it's a real Stripe
      // Payment Link, never the dashboard URL a copy-paste mistake would give.
      expect(count).toBe(2);
      const hrefs = await cardButtons.evaluateAll((els) => els.map((el) => el.getAttribute('href')));
      for (const href of hrefs) {
        expect(href).toMatch(/^https:\/\/buy\.stripe\.com\//);
      }
    });

    test('Pay onchain appears only on the Pro tier, only once Unlock is configured', async ({ page }) => {
      await page.goto(path);
      const onchainButtons = page.getByRole('link', { name: 'Pay onchain' });
      const count = await onchainButtons.count();
      if (count === 0) {
        // Today's state: unlockCheckoutUrl() returns null until Zaal creates
        // the Unlock lock on Base.
        return;
      }
      // Onchain is Pro-Ticket-only by design (see PRO_TICKET.id check in the
      // page source) - never on the $20 Supporter tier.
      expect(count).toBe(1);
      await expect(onchainButtons.first()).toHaveAttribute('href', /^https:\/\/app\.unlock-protocol\.com\/checkout/);
    });
  });
}
