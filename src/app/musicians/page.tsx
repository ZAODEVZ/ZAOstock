import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { EntryPage } from '@/components/entry/EntryPage';
import { FESTIVAL } from '@/content/festival';
import { LINEUP_NAMES } from '@/content/site';
import { SOUNDCHECK } from '@/content/artist-ops';

export const metadata: Metadata = {
  title: 'For Musicians',
  description:
    `Made music nobody is paying you to make? We built this for you. ZAOstock is a free outdoor festival in Ellsworth, Maine, on ${FESTIVAL.shortDate}.`,
  alternates: { canonical: '/musicians' },
  openGraph: {
    title: 'For Musicians · ZAOstock 2026',
    description: `Made music nobody is paying you to make? Tell us about it. ZAOstock, ${FESTIVAL.shortDate}, ${FESTIVAL.city}.`,
    url: 'https://zaostock.com/musicians',
    images: [OG_IMAGE],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Musicians · ZAOstock 2026',
    description: `Made music nobody is paying you to make? Tell us about it. ZAOstock, ${FESTIVAL.shortDate}.`,
  },
};

export default function MusiciansPage() {
  return (
    <EntryPage
      personaSlug="musicians"
      personaLabel="Musicians"
      hero="Made music nobody is paying you to make? You are who we built this for."
      subhead={`ZAOstock is a one-day outdoor festival in Ellsworth Maine on ${FESTIVAL.shortDate}. Every artist on stage was discovered through The ZAO, a community of 100+ independent musicians who actually support each other's work.`}
      youGet={[
        'A real stage in front of a real audience, on Franklin Street and on the livestream.',
        'A recording of your set and photos from the day, included in the recap reel.',
        'A direct line into the ZAO music community - 100+ people who already care about independent artists.',
      ]}
      weAsk={[
        'A set window: 33 or 40 minutes this year, set by the running order.',
        'Standard technical rider - we will work with what you need.',
        `Soundcheck is ${SOUNDCHECK.day}, ${SOUNDCHECK.window}.`,
        'Help share when we post your slot. We do the heavy lift on socials, you amplify.',
      ]}
      ctas={[
        { label: 'Email info@thezao.com', href: 'mailto:info@thezao.com?subject=ZAOstock%20Musician%20Interest', primary: true },
      ]}
      facts={[
        { term: 'Date', detail: `${FESTIVAL.dateLabel}, music from noon` },
        { term: 'Where', detail: `${FESTIVAL.venue}, ${FESTIVAL.city}; Black Moon Public House next door from six` },
        { term: 'Soundcheck', detail: `${SOUNDCHECK.day}, 9:30 AM to noon, artists only` },
        { term: 'Set length', detail: '33 or 40 minutes in 2026, set by the running order' },
        { term: '2026 bill', detail: `Full: ${LINEUP_NAMES.length} acts. Tell us about your music for the next ZAO Festivals event` },
        { term: 'Pay', detail: 'Not pay-to-play. Independent and ZAO-vetted only' },
      ]}
      footnote="Independent and ZAO-vetted only. This is not a pay-to-play festival."
    />
  );
}
