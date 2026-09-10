import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /ops is the crew's ops board. Its own README is explicit that the
        // crew code is "a curtain, not a lock" - anyone who loads the page can
        // read the board in source. Keeping it out of search results is the
        // curtain doing its job; it is NOT access control, and nothing on that
        // page should ever depend on it being private.
        // /backstage is one page per act behind a code in the URL. Also a
        // curtain: noindex on the page is what keeps it out of results.
        disallow: ['/api/', '/test', '/team', '/team/', '/ops', '/backstage'],
      },
    ],
    sitemap: 'https://zaostock.com/sitemap.xml',
    host: 'https://zaostock.com',
  };
}
