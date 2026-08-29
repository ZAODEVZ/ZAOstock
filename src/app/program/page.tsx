import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import Link from 'next/link';
import { FESTIVAL } from '@/content/festival';
import { SITE, PUBLIC_LINEUP, WAVEWARZ } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Badge, Button, Card, SectionHeader } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Program',
  description: 'Day-of schedule for ZAOstock, Saturday 3 October 2026. Outdoors on Franklin Street from noon, WaveWarZ from four, then indoors at Black Moon from six.',
  alternates: { canonical: '/program' },
  openGraph: {
    title: 'Program | ZAOstock',
    description: 'Outdoors from noon, WaveWarZ from four, indoors from six. Saturday 3 October 2026 in Ellsworth, Maine.',
    url: 'https://zaostock.com/program',
    images: [OG_IMAGE],
  },
};

// Source of truth: docs/plans/ros-5min-2026-10-03.md (v7, 28 Aug 05:0x) and
// Zaal's typed verdicts in ~/zao-vault/daily/2026-08-27.md and 2026-08-28.md.
//
// One venue at a time (Zaal, 23 Aug): outdoors on the parklet until six, then
// everything walks next door into Black Moon.
//
// Music starts at NOON: a five-minute intro on the mic, then about 30 minutes
// per act with 5- or 10-minute changeovers held by the MC plus sponsor spots.
// No DJ between sets. The last set ends 15:05 and the stretch to the 15:45
// reset is OPEN; WaveWarZ 16:00-18:00 opens with the story; Stilo's DJ set
// 18:00-20:00 runs straight into Steve's set 20:00-22:00 hosted by Black
// Moon; the close is Black Moon's licence hour, UNSET.
//
// NAMES: the lineup reveal is 1 September. Until then only Lyons Den (public
// since 23 Aug) and the WaveWarZ battlers plus their MC (Zaal, 27 Aug 19:3x)
// are named. Stilo is named as a battler, not as the evening DJ. Steve's own
// act name is not on disk. The fire performance is Dcoop's to time and place;
// no row until he says. Do not hand-write any other name in.

type Venue = 'OUT' | 'IN';

interface Slot {
  time: string;
  label: string;
  detail?: string;
  tone?: 'set' | 'gap' | 'open' | 'battle';
}

interface Block {
  start: string;
  end: string;
  venue: Venue;
  title: string;
  lede: string;
  slots: Slot[];
}

const BLOCKS: Block[] = [
  {
    start: '12:00',
    end: '16:00',
    venue: 'OUT',
    title: 'Live sets',
    lede: 'Independent artists back to back on the parklet stage, about 30 minutes each. Between sets the MC keeps the day moving with the story of the event and a word from the partners.',
    slots: [
      { time: '12:00', label: 'Doors. Music starts at noon.', detail: 'A five-minute welcome on the mic.', tone: 'gap' },
      { time: '12:05', label: 'Set 1', tone: 'set' },
      { time: '12:35', label: 'Changeover', detail: 'The MC, the six o’clock move, Art of Ellsworth, a partner spot.', tone: 'gap' },
      { time: '12:45', label: 'Set 2', tone: 'set' },
      { time: '13:20', label: 'Set 3', tone: 'set' },
      { time: '13:55', label: `Set 4 - ${PUBLIC_LINEUP[0]}`, detail: 'Confirmed.', tone: 'set' },
      { time: '14:25', label: 'Changeover', detail: 'The MC, the WaveWarZ pitch, a partner spot.', tone: 'gap' },
      { time: '14:35', label: 'Set 5', detail: 'Closes the outdoor block.', tone: 'set' },
      { time: '15:05', label: 'Open stretch', detail: 'Around forty minutes with nothing booked yet. The MC and our partners hold the stage.', tone: 'open' },
      { time: '15:45', label: 'Battle stage reset', detail: 'The MC hands to Hurricane.', tone: 'gap' },
    ],
  },
  {
    start: '16:00',
    end: '18:00',
    venue: 'OUT',
    title: 'WaveWarZ',
    lede: `Live music battles. Two artists go head to head and the audience decides, in the street and online. ${WAVEWARZ.battlers.join(', ')}. ${WAVEWARZ.mc} on the mic.`,
    slots: [
      { time: '16:00', label: 'The WaveWarZ story', detail: `${WAVEWARZ.mc} with Stilo. Lights on.`, tone: 'gap' },
      { time: '16:15', label: 'Rules, bracket, how to vote', tone: 'gap' },
      { time: '16:25', label: 'Battle 1', tone: 'battle' },
      { time: '16:50', label: 'Voting', detail: 'Hurricane and a partner spot.', tone: 'gap' },
      { time: '17:00', label: 'Battle 2', tone: 'battle' },
      { time: '17:25', label: 'Voting', tone: 'gap' },
      { time: '17:35', label: 'Final', detail: 'Low sun.', tone: 'battle' },
      { time: '17:55', label: 'Result', detail: 'Hurricane walks the crowd next door.', tone: 'gap' },
    ],
  },
  {
    start: '18:00',
    end: '22:00',
    venue: 'IN',
    title: 'The evening at Black Moon',
    lede: 'At six the whole street walks next door, together. The music is already on when the first person reaches the door.',
    slots: [
      { time: '18:00', label: 'DJ set', detail: 'Two hours, as the street walks in.', tone: 'set' },
      { time: '20:00', label: 'Live set', detail: 'Hosted by Black Moon, straight on from the DJ. No gap.', tone: 'set' },
    ],
  },
];

const VENUE: Record<Venue, { name: string; where: string; dot: string }> = {
  OUT: { name: 'Outdoors', where: FESTIVAL.venue, dot: 'bg-gold-400' },
  IN: { name: 'Indoors', where: 'Black Moon Public House, next door', dot: 'bg-denim-400' },
};

const TONE: Record<NonNullable<Slot['tone']>, string> = {
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
  `The full lineup is announced ${SITE.lineupRevealLabel}. Times can shift by a few minutes on the day.`,
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
              Music from noon on the {FESTIVAL.venue}. WaveWarZ from four. At six the whole street walks next door into Black Moon and keeps going until ten.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge tone="gold">Lineup reveal · {SITE.lineupRevealLabel}</Badge>
              <span className="text-sm text-ink-muted">{PUBLIC_LINEUP.join(', ')} confirmed. The rest of the names on the day the reveal lands.</span>
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
                eyebrow={`${b.start} - ${b.end} · ${v.name}`}
                title={b.title}
                lede={b.lede}
              />
              <ol className="list-none m-0 p-0 border border-ink-950/60 rounded-md overflow-hidden">
                {b.slots.map((s, i) => (
                  <li key={i} className="grid grid-cols-[72px_1fr] gap-4 px-5 py-3 border-t border-ink-950/60 first:border-t-0 bg-paper-200/60">
                    <span className="font-mono text-sm font-bold text-ink-950 tabular pt-0.5">{s.time}</span>
                    <span>
                      <span className={['block text-sm', TONE[s.tone ?? 'set']].join(' ')}>{s.label}</span>
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
