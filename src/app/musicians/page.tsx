import type { Metadata } from 'next';
import { EntryPage } from '@/components/entry/EntryPage';

export const metadata: Metadata = {
  title: 'For Musicians · ZAOstock',
  description:
    'Made music nobody is paying you to make? You are who we built this for. ZAOstock is a one-day outdoor festival in Ellsworth Maine on October 3, 2026. Every artist on stage was discovered through The ZAO.',
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
        'Travel and lodging covered or crowdfunded via Giveth and GoFundMe (per-artist pool).',
        'Recording of your set, photo from the day, included in the recap reel.',
        'A direct line into the ZAO music community - 100+ people who already care about independent artists.',
        '100% of any merch or tip revenue you generate on-site. Day-of access plus crew shirt plus meals.',
      ]}
      weAsk={[
        '25-minute set window.',
        'Standard technical rider - we will work with what you need.',
        'Show up to soundcheck day-of.',
        'Help share when we post your slot. We do the heavy lift on socials, you amplify.',
      ]}
      ctas={[
        { label: 'Submit through The ZAO', href: '/suggest', primary: true },
        { label: 'DM Zaal directly', href: 'mailto:zaalp99@gmail.com?subject=ZAOstock%20Musician%20Submission' },
      ]}
      footnote="Submissions open until roughly one month before the event. Independent and ZAO-vetted only. This is not a pay-to-play festival."
    />
  );
}
