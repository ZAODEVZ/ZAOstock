import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'postimg.cc' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Report-Only: never blocks anything, just lets you see (via the
          // browser console) what a real CSP would flag before actually
          // enforcing one. No dangerouslySetInnerHTML/inline-script injection
          // points were found in a security audit, so this is a defense-in-
          // depth starting point, not a response to a known gap. Move to a
          // real Content-Security-Policy header once this has run clean for
          // a while with no unexpected violations.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://pbs.twimg.com https://i.imgur.com https://imgur.com https://i.postimg.cc https://postimg.cc",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src 'self' https://platform.twitter.com https://www.instagram.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // zaofestivals.com -> /festivals (the ZAO Festivals umbrella hub)
        {
          source: '/',
          destination: '/festivals',
          has: [{ type: 'host', value: 'zaofestivals.com' }],
        },
        {
          source: '/',
          destination: '/festivals',
          has: [{ type: 'host', value: 'www.zaofestivals.com' }],
        },
        {
          source: '/:path*',
          destination: '/festivals/:path*',
          has: [{ type: 'host', value: 'zaofestivals.com' }],
        },
        {
          source: '/:path*',
          destination: '/festivals/:path*',
          has: [{ type: 'host', value: 'www.zaofestivals.com' }],
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default config;
