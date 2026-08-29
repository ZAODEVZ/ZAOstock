import type { MetadataRoute } from 'next';

const BASE = 'https://zaostock.com';

// /circles is not listed while its API returns 500 in production (the circles
// table is not in the live database, measured 2026-08-29); /team is private.

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
    '/program',
    '/ellsworth',
    '/acadia',
    '/festivals',
    '/sponsor',
    '/partners',
    '/build',
    '/onepagers/overview',
    '/cypher',
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
