import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { EntryPage } from '@/components/entry/EntryPage';
import { FESTIVAL, NEXT_EDITION } from '@/content/festival';

// THE 2027 MODEL - Zaal, 2026-10-05 ~19:00 EDT, typed in the zaostock-content
// pane: "lets prep for 2027 and zaofestivals as an artist residencies for any
// events we can get invited to other than that just the two events again nxt
// year ZAOVILLE and ZAOstock". So ZAO Festivals runs two events of its own in
// 2027 and goes everywhere else as an invited residency. The old pitch on this
// page ("Run your own ZAO", "ZAO-{YourCity}", "First city to commit gets the
// slot", per-city revenue split) is retired. Do not bring it back from an
// older deck.
//
// What a residency is, the working definition (default, pending Zaal): a block
// of ZAO artists on the host's bill, with our stream and content, on their
// stage. We do not produce the host's event. Nothing here names a fee, a date
// or a place for ZAOville 2027: none is set.

export const metadata: Metadata = {
  title: 'For Event Organizers',
  description:
    'Invite ZAO Festivals to your event. We bring a residency of independent artists from The ZAO to your bill, with a livestream and content. In 2027 ZAO Festivals runs two events of its own: ZAOville and ZAOstock.',
  alternates: { canonical: '/event-organizers' },
  openGraph: {
    title: 'For Organizers · ZAO Festivals',
    description: 'Running an event? Invite ZAO Festivals, and we bring the artists.',
    url: 'https://zaostock.com/event-organizers',
    images: [OG_IMAGE],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Organizers · ZAO Festivals',
    description: 'Running an event? Invite ZAO Festivals, and we bring the artists.',
  },
};

export default function EventOrganizersPage() {
  return (
    <EntryPage
      personaSlug="event-organizers"
      personaLabel="Event Organizers"
      hero="Running an event? Invite ZAO Festivals."
      subhead="In 2027 ZAO Festivals runs two events of its own, ZAOville and ZAOstock. Everywhere else we come as an artist residency: you invite us, and we bring a block of ZAO artists to your bill."
      youGetHeading={{ eyebrow: 'What a residency brings', title: 'To your event' }}
      youGet={[
        'A curated set of independent artists from The ZAO, a community of 100+ musicians and digital creators.',
        'An MC between our sets, if you want one.',
        'A livestream of our block, so people who cannot be there can watch.',
        'Footage and recap content afterwards, crediting your event.',
      ]}
      weAskHeading={{ eyebrow: 'What we ask', title: 'From the host' }}
      weAsk={[
        'A slot on your bill, with the stage and the sound.',
        'Artist pay and travel costs agreed in writing before anyone books travel.',
        'Permission to stream and film our block.',
        'One contact on your side for the day.',
      ]}
      ctas={[
        { label: 'Invite us: email for a 30-min intro', href: 'mailto:info@thezao.com?subject=ZAO%20Festivals%20Residency%20Invite', primary: true },
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
      footnote="Residencies are booked one event at a time. You run your event; we bring the artists."
    />
  );
}
