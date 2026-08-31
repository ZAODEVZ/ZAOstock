import type { MetadataRoute } from 'next';

const BASE = 'https://zaostock.com';

// /circles is not listed while its API returns 500 in production (the circles
// table is not in the live database, measured 2026-08-29); /team is private.
//
// /tickets IS listed. It was not, when it shipped, which left the Pro Ticket
// with no working front door AND no discoverability - ticket.zaostock.com still
// redirects to the free Luma page, so the sitemap is how the paid option gets
// found at all.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    '',
    '/musicians',
    '/musicians/submit',
    '/musicians/rider',
    '/artists',
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
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : 0.7,
  }));
}
