import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ZAOstock 2026',
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
  startDate: '2026-10-03T11:00:00-04:00',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-[#f5a623] focus:text-black focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <div id="main-content">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
