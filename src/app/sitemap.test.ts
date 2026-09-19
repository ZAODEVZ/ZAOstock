import { describe, expect, it, vi } from 'vitest';

// sitemap.ts pulls in slugify() from '@/lib/artists', which sits beside the
// Supabase admin client - unresolvable under vitest without this, same fix
// artist-slugs.test.ts uses.
vi.mock('server-only', () => ({}));

import sitemap from './sitemap';
import { LINEUP_NAMES } from '@/content/site';
import { slugify } from '@/lib/artists';

/**
 * The eight /artist/<slug> pages shipped without a sitemap entry - an
 * oversight, not the reveal gate (that stopped gating the site on
 * 2026-09-15; every act's page renders). Found 2026-09-19 by a sweep after
 * PR #242, two weeks into newsletters linking these pages with nothing
 * pointing search at them.
 */
describe('sitemap', () => {
  it('lists every act on the bill at /artist/<slug>', () => {
    const urls = sitemap().map((r) => r.url);

    for (const name of LINEUP_NAMES) {
      expect(urls).toContain(`https://zaostock.com/artist/${slugify(name)}`);
    }
  });

  it('still lists the plural index', () => {
    const urls = sitemap().map((r) => r.url);
    expect(urls).toContain('https://zaostock.com/artists');
  });
});
