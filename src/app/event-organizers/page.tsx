import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { EntryPage } from '@/components/entry/EntryPage';
import { FESTIVAL, NEXT_EDITION } from '@/content/festival';

// THE 2027 MODEL - Zaal, 2026-10-05 ~19:00 EDT: "just the two events again
// nxt year ZAOVILLE and ZAOstock". The old pitch on this page ("Run your own
// ZAO", "ZAO-{YourCity}", "First city to commit gets the slot", per-city
// revenue split) is retired. Do not bring it back from an older deck.
//
// Artist residencies at invited events are a SIDE PLAN, internal only. Zaal,
// 2026-10-05 ~19:3x: "No don't say this right now just plan for it as a side
// thing". So no page says "residency" or offers one until he says so. The plan
// lives outside the repo (zaostock-content 06-zao-festivals-2027-plan.md).
// Nothing here names a fee, a date or a place for ZAOville 2027: none is set.

export const metadata: Metadata = {
  title: 'For Event Organizers',
  description:
    'In 2027 ZAO Festivals runs two events: ZAOville and ZAOstock. Running something and want to talk? Get in touch.',
  alternates: { canonical: '/event-organizers' },
  openGraph: {
    title: 'For Organizers · ZAO Festivals',
    description: 'In 2027 ZAO Festivals runs two events: ZAOville and ZAOstock.',
    url: 'https://zaostock.com/event-organizers',
    images: [OG_IMAGE],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Organizers · ZAO Festivals',
    description: 'In 2027 ZAO Festivals runs two events: ZAOville and ZAOstock.',
  },
};

export default function EventOrganizersPage() {
  return (
    <EntryPage
      personaSlug="event-organizers"
      personaLabel="Event Organizers"
      hero="ZAO Festivals in 2027: two events."
      subhead="In 2027 ZAO Festivals runs ZAOville and ZAOstock. We are not opening new city chapters. If you run events and want to talk, write to us."
      youGetHeading={{ eyebrow: 'In 2027', title: 'The two events' }}
      youGet={[
        'ZAOville 2027: date and place to be announced.',
        `${NEXT_EDITION.name}: ${NEXT_EDITION.dateLabel}. ${NEXT_EDITION.place}.`,
      ]}
      weAskHeading={{ eyebrow: 'Get in touch', title: 'If you run events' }}
      weAsk={[
        'Write to info@thezao.com and tell us about your event.',
      ]}
      ctas={[
        { label: 'Email us', href: 'mailto:info@thezao.com?subject=ZAO%20Festivals%202027', primary: true },
        { label: 'See the festivals', href: '/festivals' },
      ]}
      facts={[
        { term: 'ZAO-PALOOZA', detail: 'New York City, 2024' },
        { term: 'ZAO-CHELLA', detail: 'Miami, Wynwood, during Art Basel, December 2024' },
        { term: 'ZAOville', detail: 'Laurel, Maryland, July 2026' },
        { term: 'ZAOstock', detail: `${FESTIVAL.city}, ${FESTIVAL.shortDate} - the first in Maine` },
        { term: 'ZAOville 2027', detail: 'Date and place to be announced' },
        { term: NEXT_EDITION.name, detail: `${NEXT_EDITION.dateLabel}. ${NEXT_EDITION.place}` },
      ]}
      footnote="ZAO Festivals is the events arm of The ZAO."
    />
  );
}
