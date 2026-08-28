import type { Metadata } from 'next';
import { Boogaloo, Rubik, Space_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

// Three families per DESIGN.md: Boogaloo for display, Rubik for body and UI,
// Space Mono for eyebrows, labels and figures. Exposed as CSS variables that
// globals.css maps into Tailwind's font-display / font-sans / font-mono.
const boogaloo = Boogaloo({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-boogaloo',
  display: 'swap',
});

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-rubik',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'ZAOstock 2026', template: '%s | ZAOstock' },
  description: 'A one-day artist-built music festival in downtown Ellsworth, Maine. October 3, 2026. Run by The ZAO.',
  metadataBase: new URL('https://zaostock.com'),
  openGraph: {
    title: 'ZAOstock 2026',
    description: 'A one-day artist-built music festival in downtown Ellsworth, Maine. October 3, 2026.',
    url: 'https://zaostock.com',
    siteName: 'ZAOstock',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZAOstock 2026',
    description: 'A one-day artist-built music festival in downtown Ellsworth, Maine. October 3, 2026.',
  },
};

// Event structured data - lets Google show ZAOstock's date/location/price
// directly in search results (rich snippets), instead of the site being
// invisible to that system entirely. Facts here must stay in sync with the
// real event details - only edit alongside the actual date/venue/time.
const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicEvent',
  name: 'ZAOstock 2026',
  description: 'A free, one-day, artist-built music festival in downtown Ellsworth, Maine. Run by The ZAO.',
  startDate: '2026-10-03T12:00:00-04:00',
  endDate: '2026-10-03T18:00:00-04:00',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: 'Franklin Street Parklet',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ellsworth',
      addressRegion: 'ME',
      addressCountry: 'US',
    },
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://zaostock.com',
  },
  organizer: {
    '@type': 'Organization',
    name: 'The ZAO',
    url: 'https://zaostock.com',
  },
  // The evening next door. One venue at a time: this starts when the parklet ends.
  subEvent: {
    '@type': 'MusicEvent',
    name: 'ZAOstock 2026 - the evening at Black Moon Public House',
    startDate: '2026-10-03T18:00:00-04:00',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Black Moon Public House',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ellsworth',
        addressRegion: 'ME',
        addressCountry: 'US',
      },
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${boogaloo.variable} ${rubik.variable} ${spaceMono.variable}`}>
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
