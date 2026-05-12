import type { Metadata } from 'next';
import { EntryPage } from '@/components/entry/EntryPage';

export const metadata: Metadata = {
  title: 'For Artists · ZAOstock',
  description:
    'Build the visual identity of a festival people remember. ZAOstock needs visual artists across the build - posters, signage, on-site installations, photography, motion. Your work becomes part of the ZAO Festivals lineage.',
  openGraph: {
    title: 'For Artists · ZAOstock 2026',
    description: 'Build the visual identity of a festival people remember. Posters, signage, installations, motion. October 3, 2026.',
    url: 'https://zaostock.com/artists',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Artists · ZAOstock 2026',
    description: 'Build the visual identity. Posters, signage, installations, motion.',
  },
};

export default function ArtistsPage() {
  return (
    <EntryPage
      personaSlug="artists"
      personaLabel="Artists"
      hero="Build the visual identity of a festival people remember."
      subhead="ZAOstock needs visual artists across the build. Posters, signage, on-site installations, photography, motion graphics. Your work becomes part of the ZAO Festivals lineage that started in NYC and Miami."
      youGet={[
        'Named credit on every surface your work appears - zaostock.com, social, day-of signage, recap content.',
        'A real piece in your portfolio - a festival people travel to see.',
        'Direct collaboration with Candy and DCoop on the brand kit and logo work.',
        'Pay or revenue share depending on the project. Per-piece deals - we work it out together.',
        'Day-of access plus crew shirt plus meals on site.',
        'Eligible for the 5/10/15% finder and management fee structure if you bring a partner relationship.',
      ]}
      weAsk={[
        'Bring your work or portfolio when you reach out. No pitch decks needed - just show what you make.',
        'Be willing to iterate. This is a community-build, not a client deal.',
        'Show up day-of if your work is on-site (installations, live photography, projection, etc).',
        'Help share when we feature your work.',
      ]}
      ctas={[
        { label: 'Send your portfolio', href: 'mailto:info@thezao.com?subject=ZAOstock%20Artist%20Portfolio', primary: true },
        { label: 'Recommend an artist', href: 'mailto:info@thezao.com?subject=ZAOstock%20Artist%20Recommendation' },
      ]}
      footnote="Bring an idea, not a pitch deck. The team that ships the visual identity for ZAOstock 2026 carries that work forward into ZAOville, future festivals, and the broader ZAO Festivals brand kit."
    />
  );
}
