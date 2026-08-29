import { Metadata } from 'next';
import { SITE, DELIVERABLES, ATTENDANCE, ELLSWORTH, ZAO, WAVEWARZ_STATS, SERIES } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Card, Stat, SectionHeader, BorderedList } from '@/components/poster';

// One sponsor page, absorbing /sponsor/deck and /pitch (both redirect here).
// Content is deck slides 2, 3, 6, 8, 10, 11 and 12 as of 2026-08-27. The
// tier ladder (slide 9) is OFF this page: the DECK lane is redrafting it and
// no price exists, so the page shows the four things every partner gets and
// "packages on request" (site-fix brief, 28 Aug). Attendance 200-250 in
// person, about 1,000 online is Zaal's typed figure (27 Aug 19:3x) and is
// public here only. The advisor block stays off until each named person has
// agreed; the ENTERACT payment route is not named until ENTERACT agrees.
// Prints to a clean PDF for the person who will not open a deck.

export const metadata: Metadata = {
  title: 'Sponsor',
  description:
    'Sponsor ZAOstock 2026: put your name on the busiest weekend of the fall in downtown Ellsworth, Maine. Commercial sponsorship, no tax receipt; ZAOstock has no fiscal sponsor.',
  openGraph: {
    title: 'Sponsor | ZAOstock',
    description: 'Put your name on the busiest weekend of the fall. Saturday 3 October 2026, Ellsworth, Maine.',
    url: 'https://zaostock.com/sponsor',
  },
};

const WHY = [
  {
    title: 'Your block, on the busiest weekend of the fall.',
    body: `${SITE.weekend} brings statewide promotion. Art of Ellsworth is in its ninth year. ZAOstock puts live music on Franklin Street inside both.`,
  },
  {
    title: 'Free to attend.',
    body: 'Nobody chooses between your door and a ticket.',
  },
  {
    title: 'We measure an ordinary Saturday against 3 October, and publish it.',
    body: 'If it works for downtown businesses, you have the number. If it does not, you have that too.',
  },
] as const;

const FOR_YOU = [
  { term: 'Before', detail: 'Named in the announcement, the newsletter and the lineup reveal on 1 September.' },
  { term: 'During', detail: 'On-stage mentions, your logo on the backdrop, presence on the stream.' },
  { term: 'After', detail: 'Named in the recap, in the published local-business measurement, and in the footage that keeps circulating.' },
] as const;

export default function SponsorPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Sponsor ZAOstock 2026</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Put your name on the busiest weekend of the fall.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Saturday 3 October 2026. Franklin Street Parklet, downtown Ellsworth, Maine, then Black Moon Public House next door. Free to attend, music from noon.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 no-print">
            <Button href="#get">What you get</Button>
            <Button href={`mailto:${SITE.contact}`} external variant="secondary">
              Start the conversation
            </Button>
          </div>
        </div>
      </Section>

      <Section id="why">
        <TwoUp>
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="Why" title="Three local reasons." />
            <ol className="list-none m-0 p-0 flex flex-col gap-5 measure">
              {WHY.map((w, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-mono text-eyebrow font-bold text-ink-muted pt-1.5 shrink-0">0{i + 1}</span>
                  <div>
                    <p className="font-sans font-extrabold text-h4 text-ink-950 m-0">{w.title}</p>
                    <p className="text-base text-ink-secondary m-0 mt-1">{w.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Stat value={ATTENDANCE.inPerson} label="expected in person" />
            <Stat value={ATTENDANCE.online} label="expected online" />
            <Stat value={ELLSWORTH.driveThrough.value} label={ELLSWORTH.driveThrough.label} />
            <Stat value={ELLSWORTH.artOfEllsworth.value} label={ELLSWORTH.artOfEllsworth.label} />
            <Stat value={ELLSWORTH.heartEvents.value} label={ELLSWORTH.heartEvents.label} />
            <Stat value={ELLSWORTH.heartSponsors.value} label={ELLSWORTH.heartSponsors.label} />
          </div>
        </TwoUp>
      </Section>

      <Section id="who">
        <TwoUp>
          <SectionHeader
            eyebrow="Who we are"
            title="The ZAO, since 2024. Every week."
            lede="The ZAO is an independent community of musicians and digital creators. Music first, community second, technology third. ZAO Festivals is its events arm; ZAOstock is its flagship, and it runs at break-even."
          />
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <Stat value={ZAO.weeklySessions.value} label={ZAO.weeklySessions.label} />
              <Stat value={ZAO.governanceMembers.value} label={ZAO.governanceMembers.label} />
            </div>
            <BorderedList rows={SERIES.map((e) => ({ term: e.name, detail: `${e.place}, ${e.when}. ${e.note}` }))} />
          </div>
        </TwoUp>
      </Section>

      <Section id="wavewarz">
        <TwoUp>
          <SectionHeader
            eyebrow="WaveWarZ"
            title="Two artists go head to head. The audience decides."
            lede="A live music-battle format, online all year and on the ZAOstock stage from four to six. The audience picks the winner in the street and online, and the artist is paid automatically, on-chain."
          />
          <div>
            <Stat value={WAVEWARZ_STATS.battles.value} label={`${WAVEWARZ_STATS.battles.label}, as of ${WAVEWARZ_STATS.asOf}`} />
          </div>
        </TwoUp>
      </Section>

      <Section id="get">
        <TwoUp>
          <SectionHeader
            eyebrow="What you get"
            title="Four things, whatever the size."
            lede="Every sponsor gets the same four surfaces. How big your name is on each one is the conversation."
          />
          <div className="flex flex-col gap-4">
            <BorderedList rows={DELIVERABLES.map((d) => ({ term: d.name, detail: d.detail }))} />
            <Card>
              <Eyebrow className="mb-1.5">Packages</Eyebrow>
              <p className="font-sans font-extrabold text-h4 text-ink-950 m-0">Packages on request.</p>
              <p className="text-sm text-ink-secondary m-0 mt-2">
                Tell us what you want your name on and we send back one page with the options. In-kind counts at retail value.
              </p>
              <div className="mt-4 no-print">
                <Button href={`mailto:${SITE.contact}?subject=ZAOstock%20sponsorship`} external size="sm">
                  Ask for the packages
                </Button>
              </div>
            </Card>
          </div>
        </TwoUp>
      </Section>

      <Section id="artist">
        <TwoUp>
          <SectionHeader
            eyebrow="Sponsor an artist"
            title="Cover one artist's costs. They make content with your name on it. They opt in."
            lede="One business pays for one named person to get to Ellsworth. The artist agrees to it; we never sell a likeness on their behalf."
          />
          <Card>
            <Eyebrow>Sponsor an artist</Eyebrow>
            <p className="font-sans font-extrabold text-h4 text-ink-950 m-0 mt-2">One artist, one business.</p>
            <p className="text-sm text-ink-secondary m-0 mt-3">Covers one artist&apos;s travel. Content carrying your name. Opt-in from the artist, every time. Never discounted, because it is a cost and not a margin.</p>
          </Card>
        </TwoUp>
      </Section>

      <Section id="for-you">
        <TwoUp>
          <SectionHeader eyebrow="What we do for you" title="Before, during and after." lede="Reach is across the team's accounts, the Farcaster /zao and /zabal channels, Telegram, the daily newsletter and the livestream." />
          <BorderedList rows={FOR_YOU} />
        </TwoUp>
      </Section>

      <Section id="next">
        <div className="max-w-[760px]">
          <SectionHeader eyebrow="Next step" title="One conversation, then a yes or a no." />
          <p className="text-lg text-ink-secondary measure mt-4 m-0">
            Fifteen minutes this week.{' '}
            <a href={`mailto:${SITE.contact}`} className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
              {SITE.contact}
            </a>
          </p>
          <p className="text-sm text-ink-muted measure mt-4 m-0">
            Sponsorship is a marketing spend. ZAOstock has no fiscal sponsor; nothing here is tax-deductible and no tax receipt is issued.
          </p>
          <div className="mt-7 no-print">
            <Button href={`mailto:${SITE.contact}`} external size="lg">
              Email {SITE.contact}
            </Button>
          </div>
        </div>
      </Section>

      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          body { background: #FAF3E6 !important; }
          section { break-inside: avoid; padding: 16px 0 !important; }
        }
      `}</style>
    </SiteShell>
  );
}
