import { test, expect } from '@playwright/test';

for (const route of ['/', '/privacy']) {
  test(`the skip link transfers keyboard focus to its target on ${route}`, async ({ page }) => {
    await page.goto(route);
    const skipLink = page.getByRole('link', { name: 'Skip to content', exact: true });
    const target = page.locator('#main-content');
    await expect(skipLink).toHaveCount(1);
    await expect(target).toHaveCount(1);
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(target).toBeFocused();
  });
}
