import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import { FESTIVAL } from '@/content/festival';
import { eventJsonLd } from '@/content/event-jsonld';
import './globals.css';

// Three families per DESIGN.md: Boogaloo for display, Rubik for body and UI,
// Space Mono for eyebrows, labels and figures. Exposed as CSS variables that
// globals.css maps into Tailwind's font-display / font-sans / font-mono.
// Self-hosted since 2026-09-30 (src/app/fonts/README.md): next/font/google
// fetched these on every build and the fetch failed three times that day.
// Same families, weights and CSS variables as before.
const boogaloo = localFont({
  src: './fonts/Boogaloo-400.woff2',
  weight: '400',
  variable: '--font-boogaloo',
  display: 'swap',
});

// Oswald: the condensed heading face for the homepage in Candy's look
// (2026-09-10). Her build asked for Arial Narrow, a system font most visitors
// do not have, so the look changed machine to machine; this pins it.
const oswald = localFont({
  src: './fonts/Oswald-variable.woff2',
  weight: '600 700',
  variable: '--font-oswald',
  display: 'swap',
});

const rubik = localFont({
  src: './fonts/Rubik-variable.woff2',
  weight: '400 800',
  variable: '--font-rubik',
  display: 'swap',
});

const spaceMono = localFont({
  src: [
    { path: './fonts/SpaceMono-400.woff2', weight: '400' },
    { path: './fonts/SpaceMono-700.woff2', weight: '700' },
  ],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'ZAOstock 2026', template: '%s | ZAOstock' },
  description: `A one-day artist-built music festival held in downtown Ellsworth, Maine, ${FESTIVAL.shortDate}. Run by The ZAO.`,
  metadataBase: new URL('https://zaostock.com'),
  // Google Search Console ownership proof. Next.js renders this as
  // <meta name="google-site-verification" content="..."> in <head>.
  // Issued 2026-09-28 for the URL-prefix property https://zaostock.com/ on the
  // info@thezao.com account. It is a public token by design - it exists to be
  // served in the page source. Removing it un-verifies the property, which
  // silently stops sitemap submission and indexing requests, so it stays.
  verification: { google: 'Ur33SQv4u9BTUs4NDk5lcRZKAOuB-lc6lZERJ2fBpkU' },
  openGraph: {
    title: 'ZAOstock 2026',
    description: `A one-day artist-built music festival held in downtown Ellsworth, Maine, ${FESTIVAL.shortDate}.`,
    url: 'https://zaostock.com',
    siteName: 'ZAOstock',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZAOstock 2026',
    description: `A one-day artist-built music festival held in downtown Ellsworth, Maine, ${FESTIVAL.shortDate}.`,
  },
};

// Event structured data lives in src/content/event-jsonld.ts (image, performer
// and street address added 2026-09-28 for Search Console's Events report).

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${boogaloo.variable} ${oswald.variable} ${rubik.variable} ${spaceMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-gold-400 focus:text-ink-950 focus:font-bold focus:px-4 focus:py-2 focus:rounded-sm focus:border-2 focus:border-ink-950"
        >
          Skip to content
        </a>
        <div id="main-content">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
