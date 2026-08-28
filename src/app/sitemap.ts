import type { MetadataRoute } from 'next';

const BASE = 'https://zaostock.com';

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
    '/team',
    '/onepagers/overview',
    '/cypher',
    '/circles',
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
