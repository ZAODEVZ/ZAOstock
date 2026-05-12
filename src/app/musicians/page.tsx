import type { Metadata } from 'next';
import { EntryPage } from '@/components/entry/EntryPage';

export const metadata: Metadata = {
  title: 'For Musicians · ZAOstock',
  description:
    'Made music nobody is paying you to make? You are who we built this for. ZAOstock is a one-day outdoor festival in Ellsworth Maine on October 3, 2026. Every artist on stage was discovered through The ZAO.',
  openGraph: {
    title: 'For Musicians · ZAOstock 2026',
    description: 'Made music nobody is paying you to make? Submit for the lineup. October 3, 2026. Ellsworth, Maine.',
    url: 'https://zaostock.com/musicians',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Musicians · ZAOstock 2026',
    description: 'Made music nobody is paying you to make? Submit for the lineup. October 3, 2026.',
  },
};

export default function MusiciansPage() {
  return (
    <EntryPage
      personaSlug="musicians"
      personaLabel="Musicians"
      hero="Made music nobody is paying you to make? You are who we built this for."
      subhead="ZAOstock is a one-day outdoor festival in Ellsworth Maine on October 3, 2026. Every artist on stage was discovered through The ZAO, a community of 100+ independent musicians who actually support each other's work."
      youGet={[
        'A real stage in front of a real audience. Target 200-400 in person, 1K+ via livestream.',
        'Recording of your set, photo from the day, included in the recap reel.',
        'A direct line into the ZAO music community - 100+ people who already care about independent artists.',
      ]}
      weAsk={[
        '25-minute set window.',
        'Standard technical rider - we will work with what you need.',
        'Show up the day before for soundcheck.',
        'Help share when we post your slot. We do the heavy lift on socials, you amplify.',
      ]}
      ctas={[
        { label: 'Email us your music', href: 'mailto:info@thezao.com?subject=ZAOstock%20Musician%20Interest', primary: true },
        { label: 'Recommend a musician', href: 'mailto:info@thezao.com?subject=ZAOstock%20Musician%20Recommendation' },
      ]}
      footnote="Submissions open until roughly one month before the event. Independent and ZAO-vetted only. This is not a pay-to-play festival."
    />
  );
}
