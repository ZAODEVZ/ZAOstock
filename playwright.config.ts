import { defineConfig, devices } from '@playwright/test';

// E2E for zaostock.com's paid-support checkout doors, per doc 2504 (ZAOOS
// research library): confirm what a real visitor sees, not what the code
// intends to render. Runs against the LIVE site by default - PayPal, Stripe
// and Unlock are all external hosts this repo cannot stand up locally, and
// `stripeLinkFor` / `unlockCheckoutUrl` read STRIPE_LINKS / UNLOCK_CHECKOUT_URL
// in src/content/site.ts, which are plain string constants (not env vars) -
// they flip only when someone edits that file and the change deploys. Set
// E2E_BASE_URL to point at a preview deployment instead.
//
// Read-only: no test here submits a payment form, enters card details, or
// completes a checkout. Every assertion is about which door is visible and
// where it points, not about moving money.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'https://zaostock.com',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
