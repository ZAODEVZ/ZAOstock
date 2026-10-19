import { test, expect } from '@playwright/test';

// Doc 2504 flow 2, the half that can run without a secret. A backstage link
// with a code that matches no act must 404 to the "does not match" page, never
// render an act's private sheet. The valid-code half is not here on purpose:
// real codes are never in this repo, only their SHA-256 hashes
// (src/content/artist-ops.ts), so a test for it would need a secret in CI.
// findActByCode itself is unit-tested in artist-ops.test.ts.

test('a made-up backstage code 404s to the "does not match an act" page', async ({ page }) => {
  const code = `e2e-not-a-real-code-${Date.now()}`;
  const res = await page.goto(`/backstage/${code}`);
  expect(res, 'no response at all - is the server up?').not.toBeNull();
  expect(res!.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('That link does not match an act.');
  // And nothing from an act's sheet leaked through.
  await expect(page.getByText('This page is yours')).toHaveCount(0);
});
