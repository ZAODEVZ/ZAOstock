import type { MetadataRoute } from 'next';

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
