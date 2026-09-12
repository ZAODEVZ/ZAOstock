import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import Link from 'next/link';
import { FESTIVAL } from '@/content/festival';
import { SITE, LINEUP_NAMES, LINEUP_NAMES_NOTE } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Badge, Button, Card, SectionHeader } from '@/components/poster';
import { BLOCKS, publicSlots, type Venue } from '@/content/program';

export const metadata: Metadata = {
  title: 'Program',
  description: 'Day-of schedule for ZAOstock, Saturday 3 October 2026. Outdoors on Franklin Street from noon, then indoors at Black Moon from six.',
  alternates: { canonical: '/program' },
  openGraph: {
    title: 'Program | ZAOstock',
    description: 'Outdoors from noon, indoors from six. Saturday 3 October 2026 in Ellsworth, Maine.',
    url: 'https://zaostock.com/program',
    images: [OG_IMAGE],
  },
};

// Source of truth: docs/plans/ros-5min-2026-10-03.md (v7, 28 Aug 05:0x) and
// Zaal's typed verdicts in ~/zao-vault/daily/2026-08-27.md and 2026-08-28.md.
//
// One venue at a time (Zaal, 23 Aug): outdoors on the parklet until six, then
// the street clears and Black Moon hosts their own evening next door.
//
// Music starts at NOON: a five-minute intro on the mic, then eight acts with
// seven-minute changeovers held by the MC plus sponsor spots (2026-09-10).
// No DJ between sets. WaveWarZ came OFF the programme (Zaal, 2026-09-07), so the
// 16:00-18:00 battle block is gone. The evening indoors is Black Moon's, with
// Steve's DJ Aquaventus set; the close is Black Moon's licence hour, UNSET.
//
// NAMES AND TIMES: the grid below names every act with its set time, and it is
// the one public place set times live. NONE of them is described as confirmed - not one has
// countersigned. The battlers are no longer named anywhere, because the block
// they were named for is off. Steve's own
// act name is not on disk. There is no fire act (Zaal, 2026-09-11: "Drop the
// fire act."). Do not hand-write any other name in.

const VENUE: Record<Venue, { name: string; where: string; dot: string }> = {
  OUT: { name: 'Outdoors', where: FESTIVAL.venue, dot: 'bg-gold-400' },
  IN: { name: 'Indoors', where: 'Black Moon Public House, next door', dot: 'bg-denim-400' },
};

/** The bill is published in order, so the row carries its place, not a clock. */
function order(block: Parameters<typeof publicSlots>[0], index: number): string {
  // The outdoor bill is a running order. The evening is Black Moon's two rows
  // and numbering those would read as a bill we programmed.
  if (block.venue !== 'OUT') return '';
  const acts = publicSlots(block).slice(0, index + 1).filter((s) => s.tone === 'set');
  return String(acts.length);
}

const TONE: Record<'set' | 'gap' | 'open' | 'battle', string> = {
  set: 'text-ink-950 font-extrabold',
  battle: 'text-ink-950 font-extrabold',
  gap: 'text-ink-secondary font-semibold',
  open: 'text-ink-950 font-extrabold',
};

const GOOD_TO_KNOW = [
  `${FESTIVAL.admission}. No ticket, no wristband for the street.`,
  `${SITE.weather} Tent cover from Wallace Events.`,
  'One venue at a time. Nothing plays in two rooms at once.',
  'Black Moon is open through the day, walkable, right next door.',
  'Each artist gets their own post with their bio and photo, in the order their details come in. Times can shift by a few minutes on the day.',
  'Friday 2 October is soundcheck night, artists only.',
];

export default function ProgramPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
          <div className="max-w-[760px]">
            <Eyebrow tone="denim">Program · {FESTIVAL.dateLabel}</Eyebrow>
            <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Outside, then in.</h1>
            <p className="text-lg text-ink-secondary measure m-0">
              Music from noon on the {FESTIVAL.venue}. At six the street clears, and their own evening starts inside Black Moon next door.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge tone="gold">Meet the artists, one at a time</Badge>
              <span className="text-sm text-ink-muted">{LINEUP_NAMES.join(', ')}. {LINEUP_NAMES_NOTE}</span>
            </div>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 m-0">
            {(['OUT', 'IN'] as const).map((v) => (
              <div key={v} className="grain bg-paper-200 border border-ink-950/60 rounded-md px-5 py-4">
                <dt className="font-mono text-eyebrow font-bold uppercase tracking-[0.12em] text-ink-muted m-0 flex items-center gap-2">
                  <span className={['h-3 w-3 rounded-full border-2 border-ink-950 shrink-0', VENUE[v].dot].join(' ')} aria-hidden="true" />
                  {VENUE[v].name}
                </dt>
                <dd className="text-sm font-bold text-ink-950 m-0 mt-1 pl-5">{VENUE[v].where}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {BLOCKS.map((b) => {
        const v = VENUE[b.venue];
        return (
          <Section key={b.start} id={`b-${b.start.replace(':', '')}`}>
            <TwoUp>
              <SectionHeader
                eyebrow={`${b.venue === 'OUT' ? 'Noon to six' : 'From six'} · ${v.name}`}
                title={b.title}
                lede={b.lede}
              />
              <ol className="list-none m-0 p-0 border border-ink-950/60 rounded-md overflow-hidden">
                {publicSlots(b).map((s, i) => (
                  <li key={i} className="grid grid-cols-[32px_1fr] gap-4 px-5 py-3 border-t border-ink-950/60 first:border-t-0 bg-paper-200/60">
                    <span className="font-mono text-sm font-bold text-ink-muted tabular pt-0.5">{s.tone === 'set' ? order(b, i) : ''}</span>
                    <span>
                      <span className={['block text-sm', TONE[s.tone]].join(' ')}>{s.label}</span>
                      {s.detail ? <span className="block text-[13px] text-ink-muted mt-0.5">{s.detail}</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
            </TwoUp>
          </Section>
        );
      })}

      <Section>
        <TwoUp>
          <div className="flex flex-col gap-6">
            <SectionHeader eyebrow="Good to know" title="Before you come." />
            <ul className="list-none m-0 p-0 flex flex-col gap-2 measure">
              {GOOD_TO_KNOW.map((g) => (
                <li key={g} className="flex gap-3 text-base text-ink-950">
                  <span className="font-mono text-eyebrow font-bold text-denim-400 pt-1.5 shrink-0">-</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card>
            <Eyebrow className="mb-2">Spend it in Ellsworth</Eyebrow>
            <p className="text-sm text-ink-secondary m-0">
              The point of putting this on Franklin Street is to show what a day like this does for the businesses already here. Eat at the places around you, drink at Black Moon, buy something from the shop you walk past. We are measuring what 3 October does for this block, and the number only exists if you make it.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href={FESTIVAL.rsvpUrl} external size="sm">
                RSVP free
              </Button>
              <Button href="/ellsworth" variant="secondary" size="sm">
                Getting here
              </Button>
              <Link href="/press" className="self-center text-sm text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500">
                Press
              </Link>
            </div>
          </Card>
        </TwoUp>
      </Section>
    </SiteShell>
  );
}
