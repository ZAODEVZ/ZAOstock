import { describe, expect, it } from 'vitest';
import config from '../../next.config';

/**
 * The two paths a person reaches for that the site does not have.
 *
 * `/lineup` is the intuitive URL for a lineup and is the one most likely to end
 * up on a poster or in a QR code; `/sponsors` is the plural of the real route.
 * Both 404'd on production on 2026-09-08, five days before the reveal.
 *
 * This is pinned as a test because the failure is invisible from inside: a
 * Next.js 404 still renders the root layout, so a dead path looks healthy to
 * anything that checks page content instead of the status code. That is exactly
 * how it was missed the first time.
 */
describe('redirects for paths people guess', () => {
  it('sends /lineup to the running order and /sponsors to /sponsor', async () => {
    const redirects = await config.redirects!();
    const bySource = Object.fromEntries(redirects.map((r) => [r.source, r]));

    expect(bySource['/lineup']?.destination).toBe('/program');
    expect(bySource['/sponsors']?.destination).toBe('/sponsor');
  });

  it('keeps them temporary, so a real /lineup page can be added later', async () => {
    const redirects = await config.redirects!();
    for (const r of redirects) expect(r.permanent).toBe(false);
  });
});
