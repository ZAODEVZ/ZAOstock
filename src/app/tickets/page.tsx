import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { SITE, SUPPORT_TIERS, PRO_TICKET, PRO_ROUND, stripeLinkFor, unlockCheckoutUrl } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';
import { StripeBuyButton, hasBuyButton } from '@/components/StripeBuyButton';

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
// card he pointed at (price, name, one-line blurb, a couple of bullets, the
// embedded Buy Button or RSVP button at the bottom). No tier is admission -
// the Free tile still says so, in as few words as the redesign leaves room for.
//
// The paid tiles read SUPPORT_TIERS from src/content/site.ts, the same source
// /donate reads.

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
            Four ways in.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            RSVP free, or chip in at {SUPPORT_TIERS.slice(0, -1).map((t) => t.price).join(', ')} or {PRO_TICKET.price}. This is patronage, not admission - access is free either way.
          </p>
        </div>
      </Section>

      <Section id="support">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-2">
          <Card>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-[2.25rem] leading-none text-red-500">Free</span>
            </div>
            <h3 className="font-display text-h3 text-ink-950 m-0 mt-2">RSVP</h3>
            <p className="text-sm text-ink-secondary m-0 mt-1">Hold a spot. No line, no ticket to show at the door.</p>
            <ul className="list-disc pl-5 m-0 mt-3 text-sm text-ink-950 flex flex-col gap-1">
              <li>Tells us how many to plan for - water, seating, shelter.</li>
              <li>Not required. Turn up either way.</li>
            </ul>
            <div className="mt-4 flex flex-wrap items-start gap-2">
              <Button href={FESTIVAL.rsvpUrl} external variant="primary">
                RSVP free
              </Button>
            </div>
          </Card>
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
                  "closer to just the top". items-start: without it, flex's
                  default align-items:stretch matches every child to the
                  tallest one on the line, and the embedded button's own
                  card renders ~230px tall.
                  Zaal, 2026-09-23: "i like the embed... this page should have
                  those both on the first screen" - reversal of an earlier
                  same-day call to drop it. Every tier with a Buy Button id
                  on file (see StripeBuyButton.tsx) renders that; a tier
                  without one falls back to the plain link so it is never
                  dead while its Buy Button is still pending. */}
              <div className="mt-4 flex flex-wrap items-start gap-2">
                {hasBuyButton(tier.id) ? (
                  <StripeBuyButton tierId={tier.id as 'fan' | 'supporter' | 'pro'} />
                ) : stripeLinkFor(tier.id) ? (
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
                  detail: 'No. No tier changes anything about the day. Only the Pro Ticket adds a 1:1 with the team before the event; every tier credits you as a supporter.',
                },
                {
                  term: 'What is the difference between them',
                  detail: 'Only the 1:1 on the Pro Ticket. Every tier supports the festival and credits you by name.',
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
