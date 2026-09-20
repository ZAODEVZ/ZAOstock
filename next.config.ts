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
              // docs.google.com: the artist details form, embedded on /backstage.
              "frame-src 'self' https://platform.twitter.com https://www.instagram.com https://docs.google.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // Two paths people reach for that the site does not have.
  //
  // `/lineup` is the intuitive URL for a lineup - it is what someone types, and
  // what would get written on a poster or encoded in a QR. It has never been a
  // route: the nine acts are named on `/` and the running order lives on
  // `/program`. It is also absent from the sitemap, so nothing internal points
  // at it and this costs nothing to add.
  //
  // `/sponsors` is the plural of the real route, which is `/sponsor`. Both are
  // easy to write from memory and only one of them answers.
  //
  // Found on 2026-09-08, five days before the reveal and with the poster about
  // to print, by a sibling lane checking my og:image claim: my own check had
  // grepped for `og:image` WITHOUT checking the status code, and a Next.js 404
  // page still renders the root layout's tags - so a dead path measured as
  // healthy. The redirect is the cheap half of the fix; the lesson is that a
  // 200 is part of the measurement, not an assumption.
  //
  // Deliberately NOT permanent. A 308 is cached hard by browsers and would
  // outlive a future decision to give `/lineup` a real page of its own.
  async redirects() {
    return [
      { source: '/lineup', destination: '/program', permanent: false },
      { source: '/sponsors', destination: '/sponsor', permanent: false },
      // LyonsDen is one word (Zaal, 2026-09-14, quoting the artist). The public
      // artist slug is derived from the roster name by slugify(), so renaming
      // that row moved his page to /artist/lyonsden. The old two-word URL was
      // published first - it is in a newsletter draft and in messages sent to
      // him - so it keeps working.
      //
      // ORDER, learned the hard way on 2026-09-14: this redirect shipped BEFORE
      // the row was renamed and took his page down, because it pointed at a URL
      // that did not exist yet. Destination first, redirect second. The row now
      // reads "LyonsDen" and /artist/lyonsden serves 200, verified before this
      // line went back in.
      //
      // Not permanent, same as the two above: a 308 is cached hard by browsers
      // and would outlive any future change to how slugs are derived.
      { source: '/artist/lyons-den', destination: '/artist/lyonsden', permanent: false },
      // Tom Fellenz is the public billing everywhere (Zaal, 2026-09-14). The public
      // artist slug is derived from the roster name by slugify(), so renaming
      // that row moved his page to /artist/tom-fellenz. Redirect /artist/fellenz
      // so any links or bookmarks keep working.
      { source: '/artist/fellenz', destination: '/artist/tom-fellenz', permanent: false },
      // Zaal typed https://zaostock.com/artist as the lineup page (2026-09-19).
      // It has never been a route - the real index is /artists (plural), and
      // /artist only exists as the dynamic /artist/[slug] segment, which does
      // not match with no slug. No internal link ever pointed at the bare
      // singular form, so this is purely for someone typing or pasting it.
      { source: '/artist', destination: '/artists', permanent: false },
      // /volunteer is the intuitive link people guess for volunteering; the canonical route is /apply.
      { source: '/volunteer', destination: '/apply', permanent: false },
      // Zaal typed /support into Stripe's business_profile.support_url, not
      // /contact - confirmed from Stripe's own API 2026-09-20 22:3x. Stripe's
      // pending verification (business_model_verification.support) names that
      // exact URL, and a reviewer may click it, so this has to resolve without
      // him touching Stripe again. Not permanent, same reasoning as every
      // other redirect in this file: a 308 outlives any future decision to
      // give /support a page of its own.
      { source: '/support', destination: '/contact', permanent: false },
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
