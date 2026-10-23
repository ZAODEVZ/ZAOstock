import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL, NEXT_EDITION } from '@/content/festival';
import { SITE, SUPPORT_TIERS, PRO_TICKET, GIVETH_URL, GIVETH_WALLET, stripeLinkFor, unlockCheckoutUrl } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, SectionHeader, BorderedList } from '@/components/poster';

// ZAOSTOCK 2027, 2026-10-23. Zaal (relayed by the seat, 22 Oct): build the
// 2027 ticket page from the existing site. Constraints from that ask: no 2027
// date (it is Zaal's call and under review against the Art of Ellsworth dates,
// vault notes/zaostock-2027-art-of-ellsworth-date-2026-10-22.md), no prices,
// no sponsor or partner names without a source, no AI-made visuals. Ground: the
// zaostock ICM box (boxes/zaostock.llm.txt), which records 2026 as free, all
// ages, and says nothing about 2027 admission. So this page says tickets are
// not on sale, 2026 was free, and 2027 admission is not announced. It reads
// NEXT_EDITION.name only, never NEXT_EDITION.dateLabel; tickets.test.ts pins
// that. The 2026 support tiers and Giveth stay below, labelled as support,
// not a 2027 ticket.
//
// PAST TENSE, 2026-10-04. ZAOstock 2026 happened on Saturday 3 October and Zaal
// ruled everything pushed to the past: "can u loop on pushing eveything zaostock
// to the past". RSVP is over, so the free RSVP card and the "do I need the RSVP"
// row are gone. The page is now where you back the artists: the three
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
  title: `Tickets, ${NEXT_EDITION.name}`,
  description:
    `Tickets for ${NEXT_EDITION.name} are not on sale yet. ZAOstock 2026 was free to attend. You can still chip in to support the artists.`,
  alternates: { canonical: '/tickets' },
  openGraph: {
    title: `Tickets | ${NEXT_EDITION.name}`,
    description: `Tickets for ${NEXT_EDITION.name} are not on sale yet. ZAOstock 2026 was free to attend.`,
    url: 'https://zaostock.com/tickets',
    images: [OG_IMAGE],
  },
  twitter: twitterCard(
    `Tickets | ${NEXT_EDITION.name}`,
    `Tickets for ${NEXT_EDITION.name} are not on sale yet. ZAOstock 2026 was free to attend.`,
  ),
};

const ASK_URL = `mailto:${SITE.contact}?subject=${encodeURIComponent(`${NEXT_EDITION.name} tickets`)}`;

export default function TicketsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Not on sale yet</Eyebrow>
          <h1 className="font-display text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            {NEXT_EDITION.name} tickets.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Nothing is on sale yet. ZAOstock 2026 was free to attend - no ticket, no gate. The date, the place and how
            to get in for 2027 have not been announced. When they are, they go on this page.
          </p>
        </div>
      </Section>

      <Section id="next">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
          <Card>
            <h3 className="font-display text-h3 text-ink-950 m-0">Hear when tickets open</h3>
            <p className="text-sm text-ink-secondary m-0 mt-1">
              Email us and ask to be told when {NEXT_EDITION.name} tickets open.
            </p>
            <div className="mt-4">
              <Button href={ASK_URL} external variant="primary">
                Email {SITE.contact}
              </Button>
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-h3 text-ink-950 m-0">Help on the day</h3>
            <p className="text-sm text-ink-secondary m-0 mt-1">
              The volunteer sheet for {NEXT_EDITION.name} is open. See the jobs and put your name down.
            </p>
            <div className="mt-4">
              <Button href="/volunteer" variant="secondary">
                Volunteer sign-up sheet
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <Section id="support">
        <SectionHeader
          eyebrow="Chip in now"
          title="Support the artists."
          lede={`These are support, not a ${NEXT_EDITION.name} ticket. Card only; crypto is below.`}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
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
              lede={`Nothing here buys access to ${NEXT_EDITION.name}. In 2026 access was free.`}
            />
            <BorderedList
              rows={[
                { term: `${NEXT_EDITION.name} tickets`, detail: 'Not on sale. How to get in has not been announced.' },
                { term: 'When and where', detail: 'Not announced yet. It goes on this page when it is.' },
                { term: 'Does chipping in buy a ticket', detail: 'No. The tiers above are support only.' },
                { term: 'What is the difference between them', detail: 'Only the amount.' },
                { term: 'Other ways to give', detail: 'The tiers above take card. For crypto, give through Giveth, above.' },
                { term: 'Questions', detail: SITE.contact },
              ]}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Eyebrow>Last year</Eyebrow>
            <BorderedList
              rows={[
                { term: 'When', detail: `${FESTIVAL.shortDate}, music from ${SITE.musicFrom}` },
                { term: 'Where', detail: FESTIVAL.venue },
                { term: 'Admission', detail: `${FESTIVAL.admission}. No ticket was checked at the parklet.` },
              ]}
            />
            <div>
              <Button href="/program" variant="secondary">
                See how 2026 ran
              </Button>
            </div>
          </div>
        </TwoUp>
      </Section>
    </SiteShell>
  );
}
