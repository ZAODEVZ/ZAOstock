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
        'A real stage in front of a real audience, on Franklin Street and on the livestream.',
        'A recording of your set and photos from the day, included in the recap reel.',
        'A direct line into the ZAO music community - 100+ people who already care about independent artists.',
      ]}
      weAsk={[
        'A set window. The length is settled with you when your slot is.',
        'Standard technical rider - we will work with what you need.',
        'Soundcheck night is Friday 2 October. Be there.',
        'Help share when we post your slot. We do the heavy lift on socials, you amplify.',
      ]}
      ctas={[
        { label: 'Submit your music', href: '/musicians/submit', primary: true },
        { label: 'Email info@thezao.com', href: 'mailto:info@thezao.com?subject=ZAOstock%20Musician%20Interest' },
      ]}
      facts={[
        { term: 'Date', detail: 'Saturday 3 October 2026, music from noon' },
        { term: 'Where', detail: 'Franklin Street Parklet, Ellsworth, Maine; Black Moon Public House next door from six' },
        { term: 'Submissions close', detail: '3 September 2026' },
        { term: 'Soundcheck', detail: 'Friday 2 October, artists only' },
        { term: 'Set length', detail: 'Settled with you when your slot is' },
        { term: 'Pay', detail: 'Not pay-to-play. Independent and ZAO-vetted only' },
      ]}
      footnote="Submissions close 3 September 2026. Independent and ZAO-vetted only. This is not a pay-to-play festival."
    />
  );
}
