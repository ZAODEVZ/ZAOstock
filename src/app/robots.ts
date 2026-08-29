import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/test', '/team', '/team/'],
      },
    ],
    sitemap: 'https://zaostock.com/sitemap.xml',
    host: 'https://zaostock.com',
  };
}
