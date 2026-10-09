import { test, expect } from '@playwright/test';

for (const colorScheme of ['light', 'dark'] as const) {
  test(`homepage card outlines stay inside the clipping grid in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    const cards = page.locator('a[class*="plugCard"]');
    await expect(cards).toHaveCount(4);
    for (const card of await cards.all()) {
      await card.focus();
      await expect(card).toBeFocused();
      await expect(card).toHaveCSS('outline-style', 'solid');
      await expect(card).toHaveCSS('outline-width', '3px');
      await expect(card).toHaveCSS('outline-offset', '-5px');
    }
  });
}
