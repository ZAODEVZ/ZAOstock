import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
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
    images: [{ url: '/zao/wavewarz-banner.jpg', width: 1200, height: 630, alt: 'ZAOstock - a community-built music festival' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZAOstock 2026',
    description: 'A one-day artist-built music festival in downtown Ellsworth, Maine. October 3, 2026.',
    images: ['/zao/wavewarz-banner.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-[#f5a623] focus:text-black focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
