import type { Metadata } from 'next';
import { EntryPage } from '@/components/entry/EntryPage';

export const metadata: Metadata = {
  title: 'For Event Organizers · ZAOstock',
  description:
    'Built a community? Run your own ZAO. ZAOstock is the fourth event in the ZAO Festivals series after ZAO-PALOOZA NYC, ZAO-CHELLA Miami, and ZAOville in the DMV. The next one could be yours - in your city, with your community, under the umbrella.',
  openGraph: {
    title: 'For Organizers · ZAOstock 2026',
    description: 'Built a community? Run your own ZAO. The next chapter could be yours - in your city, with your community.',
    url: 'https://zaostock.com/event-organizers',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Organizers · ZAOstock 2026',
    description: 'Run your own ZAO in your city. Next chapter could be yours.',
  },
};

export default function EventOrganizersPage() {
  return (
    <EntryPage
      personaSlug="event-organizers"
      personaLabel="Event Organizers"
      hero="Built a community? Run your own ZAO."
      subhead="ZAOstock is the fourth event in the ZAO Festivals series after ZAO-PALOOZA NYC, ZAO-CHELLA Miami, and ZAOville in the DMV. The next chapter could be yours - in your city, with your community, under the ZAO Festivals umbrella."
      youGet={[
        'The full ZAOstock playbook - run-of-show, sponsor framework, fiscal sponsorship infrastructure (NMC + Fractured Atlas), finders fee structure, livestream rig, partner template.',
        'Access to the 100+ member ZAO music community for booking artists.',
        'Brand co-presentation - your event runs as ZAO-{YourCity} with shared visual identity.',
        'Coaching from Zaal and the team during your first event.',
        'Per-event revenue split. We work the deal out per-city based on what you bring.',
      ]}
      weAsk={[
        'Real local roots in your city. You can answer "why your city" without flinching.',
        'Capacity to land a venue, permits, and day-of crew. We coach but you operate.',
        'Participation in the broader ZAO Festivals brand. Not your own competing brand.',
        'Honest financial reporting. Same break-even ethos that shapes ZAOstock.',
      ]}
      ctas={[
        { label: 'Schedule a 30-min intro', href: 'mailto:info@thezao.com?subject=ZAOstock%20Event%20Organizer%20Intro', primary: true },
        { label: 'Ask about hosting a city', href: 'mailto:info@thezao.com?subject=ZAOstock%20City%20Host%20Inquiry' },
      ]}
      footnote="Open conversations now for 2027 events. First city to commit gets the slot. Lineage so far: ZAO-PALOOZA (NYC, NFT NYC, April 2024) and ZAO-CHELLA (Miami, Art Basel, December 2024) - both broke even, both proved the model."
    />
  );
}
