import type { MetadataRoute } from 'next';
import { LINEUP_NAMES } from '@/content/site';
import { slugify } from '@/lib/artists';

const BASE = 'https://zaostock.com';

// /musicians/rider is not listed: the page is noindex (it is the confirmed
// acts' form), and a sitemap URL Google is told not to index is a conflicting
// signal Search Console reports as an error.
//
// No lastModified: it was new Date() on every URL on every request, and
// Google stops trusting a lastmod that always says "now". Omitted beats wrong.
//
// /circles is not listed: it is a permanent redirect to /meetings, so the
// target is what belongs in the map. /team is private.
//
// /tickets IS listed. It shipped without an entry, which left the Pro Ticket
// with no working front door AND no discoverability - ticket.zaostock.com still
// redirects to the free Luma page, so the sitemap is how the paid option gets
// found at all.

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/musicians',
    '/artists',
    '/live',
    '/event-organizers',
    '/apply',
    '/suggest',
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
    '/media',
    '/brand',
    '/privacy',
    '/terms',
    '/contact',
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
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : 0.7,
  }));
}
