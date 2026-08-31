import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { SITE, PRO_TICKET, PAYPAL_URL } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';

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
// The Pro Ticket block reads PRO_TICKET from src/content/site.ts, the same source
// /donate reads. If item 5 on the 2 September agenda drops the Pro Ticket, delete
// the one Section marked PRO TICKET below and nothing else on this page changes.

export const metadata: Metadata = {
  title: 'Tickets',
  description:
    'ZAOstock 2026 is free to attend. RSVP to hold a spot, or take a Pro Ticket to help fund the day. Ellsworth, Maine, 3 October 2026.',
  alternates: { canonical: '/tickets' },
  openGraph: {
    title: 'Tickets | ZAOstock',
    description: 'Free to attend. RSVP to hold a spot, or take a Pro Ticket to help fund the day.',
    url: 'https://zaostock.com/tickets',
    images: [OG_IMAGE],
  },
};

export default function TicketsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">{FESTIVAL.admission}</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
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
            <h2 className="font-display font-normal text-h3 text-ink-950 m-0">Hold a spot</h2>
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
            <h2 className="font-display font-normal text-h3 text-ink-950 m-0">Nothing else to buy</h2>
            <p className="text-sm text-ink-secondary m-0 mt-2">
              No paid tier gets you a better spot, an earlier entry or a different view. Everything below is a way to
              fund the day, not a way to buy a better one.
            </p>
          </Card>
        </div>
      </Section>

      {/* PRO TICKET - delete this whole Section if the 2 September agenda drops it. */}
      <Section id="pro-ticket">
        <TwoUp>
          <SectionHeader
            eyebrow="Pro Ticket"
            title={`For the ${PRO_TICKET.countWord} people who want to make it happen.`}
            lede="Still free to attend. This is patronage, not admission: it covers artist fees, materials and production for a day that costs money to put on and charges nobody at the gate."
          />
          <Card>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-[2.25rem] leading-none text-red-500">{PRO_TICKET.price}</span>
              <Eyebrow>{PRO_TICKET.spots}</Eyebrow>
            </div>
            <ul className="list-disc pl-5 m-0 mt-3 text-sm text-ink-950 flex flex-col gap-1">
              {PRO_TICKET.gets.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <p className="text-[13px] text-ink-muted m-0 mt-3">
              {PRO_TICKET.goal}. After paying, email {SITE.contact} so we can schedule your 1:1.
            </p>
            <div className="mt-4">
              <Button href={`${PAYPAL_URL}/${PRO_TICKET.amount}`} external>
                Get the Pro Ticket
              </Button>
            </div>
          </Card>
        </TwoUp>
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
                  term: 'Does the Pro Ticket get me in earlier',
                  detail: 'No. It gets you a 1:1 with the team before the event and your name credited as a supporter. Nothing about the day itself changes.',
                },
                {
                  term: 'Tax',
                  detail:
                    'ZAOstock does not currently have a fiscal sponsor, so contributions are not tax-deductible and we cannot issue a charitable receipt.',
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
