import type { MetadataRoute } from 'next';

const BASE = 'https://zaostock.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    '',
    '/musicians',
    '/musicians/submit',
    '/artists',
    '/event-organizers',
    '/pitch',
    '/apply',
    '/suggest',
    '/donate',
    '/program',
    '/sponsor',
    '/sponsor/deck',
    '/team',
    '/onepagers/overview',
    '/cypher',
    '/circles',
    '/zaoville',
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1.0 : 0.7,
  }));
}
