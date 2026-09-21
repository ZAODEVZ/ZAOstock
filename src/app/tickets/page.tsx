import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { SITE, SUPPORT_TIERS, PRO_TICKET, PRO_ROUND, PAYPAL_URL, stripeLinkFor, unlockCheckoutUrl } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';
import { StripeBuyButton } from '@/components/StripeBuyButton';

// WHY THIS PAGE EXISTS
//
// ticket.zaostock.com 302s straight to a free Luma RSVP page, and FESTIVAL.rsvpUrl
// points at that subdomain. So the only "ticket" door on the whole site led to the
// free RSVP, and the $50 Pro Ticket was reachable only by someone who thought to
// visit /donate - which nobody looking for a ticket does. Two doors, one address.
//
// Admission is free and stays free. The free RSVP is the primary action on this
// page and the Pro Ticket sits below it, never in front of it, so nobody reads
// "tickets" as "this costs money".
//
// The paid block reads SUPPORT_TIERS from src/content/site.ts, the same source
// /donate reads. If item 5 on the 2 September agenda drops the paid tiers, delete
// the one Section marked SUPPORT TIERS below and nothing else on this page changes.
//
// Two tiers as of 2026-09-01, $20 and $50, cheapest first. NEITHER IS ADMISSION:
// the copy below says so twice, because "tickets" plus two prices is exactly the
// shape a reader mistakes for a paywall on a free festival.

export const metadata: Metadata = {
  title: 'Tickets',
  description:
    `ZAOstock 2026 is free to attend. RSVP to hold a spot, or take a Pro Ticket to help fund the day. Ellsworth, Maine, ${FESTIVAL.shortDate}.`,
  alternates: { canonical: '/tickets' },
  openGraph: {
    title: 'Tickets | ZAOstock',
    description: 'Free to attend. RSVP to hold a spot, or chip in to help fund the day.',
    url: 'https://zaostock.com/tickets',
    images: [OG_IMAGE],
  },
  twitter: twitterCard(
    'Tickets | ZAOstock',
    'Free to attend. RSVP to hold a spot, or chip in to help fund the day.',
  ),
};

export default function TicketsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">{FESTIVAL.admission}</Eyebrow>
          <h1 className="font-display text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Come for nothing. Chip in if you can.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            ZAOstock is free to attend, all day, in downtown Ellsworth on {FESTIVAL.shortDate}. There is no gate and no
            wristband to buy. RSVP so we know roughly how many people to plan for. {SITE.weather}
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <Eyebrow>Free · RSVP</Eyebrow>
              <span className="font-mono text-eyebrow text-ink-muted">What most people want</span>
            </div>
            <h2 className="font-display text-h3 text-ink-950 m-0">Hold a spot</h2>
            <p className="text-sm text-ink-secondary m-0 mt-2">
              Free, and it takes a moment. It is not a ticket you have to show at the door, because there is no door.
              It tells us how much water, seating and shelter to plan for.
            </p>
            <div className="mt-4">
              <Button href={FESTIVAL.rsvpUrl} external>
                RSVP free
              </Button>
            </div>
          </Card>
          <Card>
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <Eyebrow>Optional</Eyebrow>
              <span className="font-mono text-eyebrow text-ink-muted">Not required</span>
            </div>
            <h2 className="font-display text-h3 text-ink-950 m-0">Nothing else to buy</h2>
            <p className="text-sm text-ink-secondary m-0 mt-2">
              Neither paid tier gets you a better spot, an earlier entry or a different view. Both are ways to fund the
              day, not ways to buy a better one.
            </p>
          </Card>
        </div>
      </Section>

      {/* SUPPORT TIERS - delete this whole Section if the 2 September agenda drops them. */}
      <Section id="support">
        <SectionHeader
          eyebrow="Chip in"
          title="Two ways to pay for a day that costs nothing to attend."
          lede="Still free at the gate. This is patronage, not admission: it covers artist fees, materials and production for a festival that charges nobody to turn up."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
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
              {/* PayPal is the door that exists today. The card and onchain doors below
                  render only once their URLs exist; see CARD AND ONCHAIN CHECKOUT in
                  src/content/site.ts. Until then this is exactly the old one-button block.
                  items-start: without it, flex's default align-items:stretch matches
                  every child to the tallest one on the line. The Stripe Buy Button's own
                  card renders ~230px tall, so the plain pill Button (border-radius:9999px)
                  stretched to that height and turned into a giant orange oval - caught
                  from a live screenshot on 2026-09-20, not predicted. */}
              <div className="mt-4 flex flex-wrap items-start gap-2">
                {/* Always secondary, on both tiers. This used to be primary on
                    the Pro tier from when it was the only button on the card -
                    a normal "make the premium tier pop" pattern. Once the card
                    option (StripeBuyButton, a full-size embedded widget) landed
                    beside it, that same styling made the PayPal link the loud
                    solid-orange button next to a plain-looking widget, so a
                    glance-and-click favored PayPal by accident. Flagged live by
                    Zaal, 2026-09-21: "the tickets page still takes us to paypal
                    sometimes." Equal weight lets whichever option someone
                    actually wants stand on its own. */}
                <Button href={`${PAYPAL_URL}/${tier.amount}`} external variant="secondary">
                  Chip in {tier.price}
                </Button>
                {tier.id === PRO_TICKET.id ? (
                  // Zaal's own Buy Button - a second front-end onto the same
                  // Payment Link as stripeLinkFor(tier.id), not a new door.
                  // Replaces the plain link below rather than sitting beside
                  // it. See StripeBuyButton.tsx for the tradeoffs.
                  <StripeBuyButton />
                ) : stripeLinkFor(tier.id) ? (
                  <Button href={stripeLinkFor(tier.id) as string} external variant="secondary">
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
        <p className="text-[13px] text-ink-muted m-0 mt-4">
          {PRO_ROUND.goal}. After taking the {PRO_TICKET.name}, email {SITE.contact} so we can schedule your 1:1.
        </p>
      </Section>

      <Section>
        <TwoUp>
          <div className="flex flex-col gap-6">
            <SectionHeader
              eyebrow="Straight answers"
              title="What a ticket does and does not get you."
              lede="The festival runs at break-even. Nothing here buys access, because access is free."
            />
            <BorderedList
              rows={[
                { term: 'Admission', detail: `${FESTIVAL.admission}. No ticket is checked at the parklet.` },
                { term: 'Do I need the RSVP', detail: 'No. It helps us plan numbers, that is all. Turn up either way.' },
                {
                  term: 'Does paying get me in earlier',
                  detail: 'No. Neither tier changes anything about the day. The higher one adds a 1:1 with the team before the event; both credit you as a supporter.',
                },
                {
                  term: 'What is the difference between them',
                  detail: 'Only the 1:1. Both support the festival and both credit you by name.',
                },
                { term: 'Other ways to give', detail: 'PayPal for fiat or Giveth for crypto, at /donate.' },
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
                { term: 'Weather', detail: SITE.weather },
              ]}
            />
            <div>
              <Button href="/donate" variant="secondary">
                Other ways to give
              </Button>
            </div>
          </div>
        </TwoUp>
      </Section>
    </SiteShell>
  );
}
