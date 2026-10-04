import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { EntryPage } from '@/components/entry/EntryPage';
import { FESTIVAL } from '@/content/festival';
import { LINEUP_NAMES } from '@/content/site';
import { SOUNDCHECK } from '@/content/artist-ops';

export const metadata: Metadata = {
  title: 'For Musicians',
  description:
    `Made music nobody is paying you to make? We built this for you. ZAOstock was a free outdoor festival in Ellsworth, Maine, on ${FESTIVAL.shortDate}.`,
  alternates: { canonical: '/musicians' },
  openGraph: {
    title: 'For Musicians · ZAOstock 2026',
    description: `Made music nobody is paying you to make? Tell us about it. ZAOstock played ${FESTIVAL.shortDate}, ${FESTIVAL.city}.`,
    url: 'https://zaostock.com/musicians',
    images: [OG_IMAGE],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Musicians · ZAOstock 2026',
    description: `Made music nobody is paying you to make? Tell us about it. ZAOstock played ${FESTIVAL.shortDate}.`,
  },
};

export default function MusiciansPage() {
  return (
    <EntryPage
      personaSlug="musicians"
      personaLabel="Musicians"
      hero="Made music nobody is paying you to make? You are who we built this for."
      subhead={`ZAOstock was a one-day outdoor festival in Ellsworth, Maine on ${FESTIVAL.shortDate}. Every artist on stage was discovered through The ZAO, a community of 100+ independent musicians who actually support each other's work.`}
      youGetHeading={{ eyebrow: 'What artists got', title: 'In 2026' }}
      weAskHeading={{ eyebrow: 'What we asked', title: 'In return' }}
      youGet={[
        'A real stage in front of a real audience, on Franklin Street and on the livestream.',
        'A recording of the set and photos from the day, for the recap.',
        'A direct line into the ZAO music community - 100+ people who already care about independent artists.',
      ]}
      weAsk={[
        'A set window: 33 or 40 minutes, set by the running order.',
        'Standard technical rider - we will work with what you need.',
        `Soundcheck was ${SOUNDCHECK.day}, ${SOUNDCHECK.window}.`,
        'Help share when we posted the slot. We did the heavy lift on socials, the artist amplified.',
      ]}
      ctas={[
        { label: 'Email info@thezao.com', href: 'mailto:info@thezao.com?subject=ZAOstock%20Musician%20Interest', primary: true },
      ]}
      facts={[
        { term: 'Date', detail: `${FESTIVAL.dateLabel}, music from noon` },
        { term: 'Where', detail: `${FESTIVAL.venue}, ${FESTIVAL.city}; Black Moon Public House next door from six` },
        { term: 'Soundcheck', detail: `${SOUNDCHECK.day}, 9:30 AM to noon, artists only` },
        { term: 'Set length', detail: '33 or 40 minutes in 2026, set by the running order' },
        { term: '2026 bill', detail: `${LINEUP_NAMES.length} acts played. Tell us about your music for the next ZAO Festivals event` },
        { term: 'Pay', detail: 'Not pay-to-play. Independent and ZAO-vetted only' },
      ]}
      footnote="Independent and ZAO-vetted only. This is not a pay-to-play festival."
    />
  );
}
