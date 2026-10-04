import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { SITE, LINEUP_NAMES, SUPPORT_TIERS, PRO_TICKET, GIVETH_URL, GIVETH_WALLET, stripeLinkFor, unlockCheckoutUrl } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';

// PAST TENSE, 2026-10-04. ZAOstock 2026 happened on Saturday 3 October and Zaal
// ruled everything pushed to the past: "can u loop on pushing eveything zaostock
// to the past". RSVP is over, so the free RSVP card and the "do I need the RSVP"
// row are gone. The page is now where you back the artists who played: the three
// support tiers and the Giveth section stay (they still work). The history below
// is kept for the record of how the page got here.
//
// WHY THIS PAGE EXISTS
//
// ticket.zaostock.com 302s straight to a free Luma RSVP page, and FESTIVAL.rsvpUrl
// points at that subdomain. So the only "ticket" door on the whole site led to the
// free RSVP, and the paid tiers were reachable only by someone who thought to
// visit /donate - which nobody looking for a ticket does. Two doors, one address.
//
// REDESIGNED 2026-09-24. Zaal: "i dont understand what is so hard... this is the
// exact setup i want for all 3 tickets... redesign the tickets page to be
// cleaner we dont need all the stuff at the top we just need 4 easy to see
// options free 1$ 20$ 50$". This replaces the earlier two-card intro (a
// standalone RSVP card plus a second "nothing else to buy" filler card) and the
// separate SUPPORT TIERS section with ONE grid of four equal-weight cards -
// Free/RSVP alongside the three paid tiers, each shaped like the Pro Ticket
// card he pointed at (price, name, one-line blurb, a couple of bullets, a
// button at the bottom). No tier is admission - the Free tile still says so,
// in as few words as the redesign leaves room for.
//
// SAME DAY, second pass: the embedded <stripe-buy-button> broke this exact
// grid (overflowed its Card once every tier had a Buy Button id on file -
// see the button-rendering comment below), so every card now uses the same
// plain pill button as Free's "RSVP free", per Zaal pointing at the broken
// screenshot: "this UI isnt great lets just do the [RSVP FREE] style".
//
// The paid tiles read SUPPORT_TIERS from src/content/site.ts.
//
// COMBINED 2026-09-29. Zaal: "its already all there for the tickets we just need
// to combine ticket and donation page". /donate is gone (it redirects to
// /tickets#give). The #give section is crypto only, through Giveth; card
// support is the $1 / $20 / $50 tiers above (Zaal, 29 Sep: "just keep the
// giveth as this side as a pay with crypto option the 1 5 20 options are
// above"). PayPal is not offered (finance grill 28 Sep, item 10).

export const metadata: Metadata = {
  title: `Support the artists who played, ${FESTIVAL.shortDate}, Ellsworth, Maine`,
  description:
    `ZAOstock 2026 was free to attend. You can still chip in to support the artists who played. Ellsworth, Maine, ${FESTIVAL.shortDate}.`,
  alternates: { canonical: '/tickets' },
  openGraph: {
    title: 'Support the artists | ZAOstock',
    description: 'ZAOstock 2026 was free to attend. Chip in to support the artists who played.',
    url: 'https://zaostock.com/tickets',
    images: [OG_IMAGE],
  },
  twitter: twitterCard(
    'Support the artists | ZAOstock',
    'ZAOstock 2026 was free to attend. Chip in to support the artists who played.',
  ),
};

export default function TicketsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">{FESTIVAL.shortDate}</Eyebrow>
          <h1 className="font-display text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Support the artists who played.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            ZAOstock was free to attend - no ticket, no gate. If you want to back the {LINEUP_NAMES.length} artists who played, chip in at {SUPPORT_TIERS.slice(0, -1).map((t) => t.price).join(', ')} or {PRO_TICKET.price}.
          </p>
        </div>
      </Section>

      <Section id="support">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
          {SUPPORT_TIERS.map((tier) => (
            <Card key={tier.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-[2.25rem] leading-none text-red-500">{tier.price}</span>
                {tier.spots ? <Eyebrow>{tier.spots}</Eyebrow> : null}
              </div>
              <h3 className="font-display text-h3 text-ink-950 m-0 mt-2">{tier.name}</h3>
              <p className="text-sm text-ink-secondary m-0 mt-1">{tier.blurb}</p>
              <ul className="list-disc pl-5 m-0 mt-3 text-sm text-ink-950 flex flex-col gap-1">
                {tier.gets.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
              {/* Card only. PayPal sat here as a second door until Zaal, live,
                  2026-09-21: "no paypal" - card is the door now, full stop.
                  It's the only action on the card, so it reads as primary
                  rather than one of several equal-weight options (that equal-
                  weight styling was the fix for a PayPal-vs-card bias problem
                  that no longer applies once PayPal is gone). Right under the
                  bullet list, not floating beside another button - same ask,
                  "closer to just the top".
                  Zaal, 2026-09-24, pointing at a live screenshot: "this UI
                  isnt great lets just do the [RSVP FREE pill] style" - the
                  embedded <stripe-buy-button> broke the 4-column grid, its
                  white card and blue Buy button both overflowing their
                  Card's right edge once every tier had a Buy Button id on
                  file. Every tier now renders the exact same plain pill as
                  Free's "RSVP free" button (Button variant="primary"), so
                  all four cards match. StripeBuyButton.tsx is untouched for
                  reuse elsewhere; this page just stops calling it. */}
              <div className="mt-4 flex flex-wrap items-start gap-2">
                {stripeLinkFor(tier.id) ? (
                  <Button href={stripeLinkFor(tier.id) as string} external variant="primary">
                    Pay by card
                  </Button>
                ) : null}
                {tier.id === PRO_TICKET.id && unlockCheckoutUrl() ? (
                  <Button href={unlockCheckoutUrl() as string} external variant="secondary">
                    Pay onchain
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="give">
        <SectionHeader
          eyebrow="Pay with crypto"
          title="Or give in crypto."
          lede="Send it through Giveth to the ZAO Festivals project. It goes to the festival, the same as the tiers above."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          <Card>
            <span className="font-display text-[2.25rem] leading-none text-red-500">Giveth</span>
            <p className="text-sm text-ink-secondary m-0 mt-2">Give in crypto through Giveth, to the ZAO Festivals project.</p>
            <p className="font-mono text-[11px] text-ink-muted break-all m-0 mt-2">{GIVETH_WALLET}</p>
            <div className="mt-4">
              <Button href={GIVETH_URL} external variant="secondary">
                Give on Giveth
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <TwoUp>
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Straight answers"
              title="What your money does and does not do."
              lede="The festival ran at break-even. Nothing here buys access, because access was free."
            />
            <BorderedList
              rows={[
                { term: 'Admission', detail: `${FESTIVAL.admission}. No ticket was checked at the parklet.` },
                { term: 'Do I need to pay', detail: 'No. Everyone got in, paid or not, and nothing about the day depended on it.' },
                { term: 'What does it pay for', detail: 'Artist fees, sound and stage, and materials.' },
                { term: 'What is the difference between them', detail: 'Only the amount.' },
                { term: 'Other ways to give', detail: 'The tiers above take card. For crypto, give through Giveth, above.' },
                { term: 'Questions', detail: SITE.contact },
              ]}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Eyebrow>The day</Eyebrow>
            <BorderedList
              rows={[
                { term: 'When', detail: `${FESTIVAL.shortDate}, music from ${SITE.musicFrom}` },
                { term: 'Where', detail: FESTIVAL.venue },
                { term: 'Evening', detail: `${FESTIVAL.afterParty.name}, ${FESTIVAL.afterParty.note}` },
              ]}
            />
            <div>
              <Button href="#give" variant="secondary">
                Other ways to give
              </Button>
            </div>
          </div>
        </TwoUp>
      </Section>
    </SiteShell>
  );
}
