import type { Metadata } from 'next';
import { EntryPage } from '@/components/entry/EntryPage';

export const metadata: Metadata = {
  title: 'For Artists · ZAOstock',
  description:
    'Visual artists, designers, photographers, and makers - we are taking interest. ZAOstock 2026 is a one-day outdoor festival in Ellsworth Maine on October 3, 2026. If you want to bring visual energy to the build, reach out.',
  openGraph: {
    title: 'For Artists · ZAOstock 2026',
    description: 'Visual artists - we are taking interest. Email info@thezao.com if you want to bring visual energy to ZAOstock.',
    url: 'https://zaostock.com/artists',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Artists · ZAOstock 2026',
    description: 'Visual artists - we are taking interest. Email info@thezao.com to talk.',
  },
};

export default function ArtistsPage() {
  return (
    <EntryPage
      personaSlug="artists"
      personaLabel="Artists"
      hero="Visual artists - we are taking interest."
      subhead="ZAOstock is a one-day outdoor festival in Ellsworth Maine on October 3, 2026. We are not locking specifics for the visual side yet. If you do work that could fit - posters, signage, photography, motion, on-site - reach out and we will talk about how to participate."
      youGet={[
        'A conversation with the ZAO team about how your work could fit into ZAOstock.',
        'Named credit if your work makes it into the build.',
        'Part of the ZAO Festivals lineage if it lands - ZAO-PALOOZA NYC and ZAO-CHELLA Miami came before.',
      ]}
      weAsk={[
        'Show us what you make. Portfolio, links, samples - whatever lives where.',
        'Be patient. We are working out what we can actually offer before we commit to anything.',
        'Be honest about what you want in return so we can be honest about what we can do.',
      ]}
      ctas={[
        { label: 'Email info@thezao.com', href: 'mailto:info@thezao.com?subject=ZAOstock%20Artist%20Interest', primary: true },
      ]}
      footnote="We are not promising compensation, crew perks, or specific deliverables yet. We are taking interest from artists who want to participate and working out the details case by case. If this sounds like an opportunity, write us."
    />
  );
}
