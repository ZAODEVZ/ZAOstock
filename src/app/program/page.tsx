import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import Link from 'next/link';
import { FESTIVAL } from '@/content/festival';
import { LINEUP_NAMES, displayName } from '@/content/site';
import { SiteShell, Section, TwoUp, Eyebrow, Badge, Button, SectionHeader, BorderedList } from '@/components/poster';
import { QUICK_ANSWERS, faqJsonLd } from '@/content/quick-answers';
import { BLOCKS, actTimes, publicSlots, type Venue } from '@/content/program';

export const metadata: Metadata = {
  title: `Program and set times, ${FESTIVAL.shortDate}, Ellsworth, Maine (the record of the day)`,
  description: `The running order for ZAOstock, ${FESTIVAL.dateLabel}. Outdoors on Franklin Street from noon, then indoors at Black Moon from six.`,
  alternates: { canonical: '/program' },
  openGraph: {
    title: 'Program | ZAOstock',
    description: `Outdoors from noon, indoors from six. The record of ${FESTIVAL.dateLabel} in Ellsworth, Maine.`,
    url: 'https://zaostock.com/program',
    images: [OG_IMAGE],
  },
  twitter: twitterCard(
    'Program | ZAOstock',
    `Outdoors from noon, indoors from six. The record of ${FESTIVAL.dateLabel} in Ellsworth, Maine.`,
  ),
};

// PAST TENSE, 2026-10-04: this page is the record of the day. The running order
// and times stay exactly as they were; the "Good to know / Before you come"
// advice and the "Spend it in Ellsworth" call are gone because the day has
// passed. The comments below describe how the schedule was built.
//
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
// the one public place set times live (Zaal, 2026-09-28: "Publish times on
// /program"; actTimes() in program.ts derives them, never typed here). NONE of them is described as confirmed - not one has
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

export default function ProgramPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
          <div className="max-w-[760px]">
            <Eyebrow tone="denim">The 2026 program, as published · {FESTIVAL.dateLabel}</Eyebrow>
            <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Outside, then in.</h1>
            <p className="text-lg text-ink-secondary measure m-0">
              {LINEUP_NAMES.length} acts were on the bill from noon on the {FESTIVAL.venue}, with the evening billed at Black Moon next door. Set times are the published schedule.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {/* The plain comma-separated name list this used to carry was
                  redundant with the ordered schedule just below it on this
                  same page - and a worse UI of the same lineup. Zaal,
                  2026-09-27: "this hould be a good UI of all the artists."
                  The badge now links to the real one. */}
              <Link href="/artists">
                <Badge tone="gold">Meet the artists</Badge>
              </Link>
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
        const times = actTimes(b);
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
                      <span className={['block text-sm', TONE[s.tone]].join(' ')}>{displayName(s.label)}</span>
                      {times[s.label] ? <span className="block font-mono text-[13px] font-bold text-ink-secondary tabular mt-0.5">{times[s.label]}</span> : null}
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
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/live" size="sm">
            Watch the replay
          </Button>
          <Button href="/tickets" variant="secondary" size="sm">
            Support the artists
          </Button>
          <Link href="/press" className="self-center text-sm text-denim-400 font-semibold underline underline-offset-4 hover:text-denim-500">
            Press
          </Link>
        </div>
      </Section>

      {/* Quick answers: one array, rendered visibly and as FAQPage data, so
          what search and AI assistants read is exactly what a visitor sees.
          Source and provenance of every answer: src/content/quick-answers.ts. */}
      <Section>
        <SectionHeader eyebrow="Quick answers" title="What people asked." />
        <BorderedList className="mt-6" rows={QUICK_ANSWERS.map(({ q, a }) => ({ term: q, detail: a }))} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()).replace(/</g, '\\u003c') }}
        />
      </Section>
    </SiteShell>
  );
}
