import type { MetadataRoute } from 'next';
import { LINEUP_NAMES } from '@/content/site';
import { slugify } from '@/lib/artists';

const BASE = 'https://zaostock.com';

// /circles is not listed: it is a permanent redirect to /meetings, so the
// target is what belongs in the map. /team is private.
//
// /tickets IS listed. It shipped without an entry, which left the Pro Ticket
// with no working front door AND no discoverability - ticket.zaostock.com still
// redirects to the free Luma page, so the sitemap is how the paid option gets
// found at all.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    '',
    '/musicians',
    '/musicians/rider',
    '/artists',
    '/live',
    '/event-organizers',
    '/apply',
    '/suggest',
    '/donate',
    '/tickets',
    '/program',
    '/ellsworth',
    '/acadia',
    '/festivals',
    '/sponsor',
    '/partners',
    '/build',
    '/meetings',
    '/onepagers/overview',
    '/zaoville',
    '/privacy',
    '/press',
    '/design',
    // /artist/<slug> pages render for every act on the bill since the
    // 2026-09-15 ruling (no reveal gate on the site, unlike the app's lineup
    // API) - missing here since they shipped, so newsletters linking these
    // for two weeks had nothing pointing search at them. Same source
    // (LINEUP_NAMES + slugify) that artist-slugs.test.ts holds every act's
    // URL to, so this list can't drift from the real routes.
    ...LINEUP_NAMES.map((name) => `/artist/${slugify(name)}`),
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : 0.7,
  }));
}
