import type { Metadata } from 'next';
import { SiteShell, Section, Eyebrow, Button, Card, SectionHeader } from '@/components/poster';

export const metadata: Metadata = {
  title: 'ZAOville Pool Party',
  description:
    'The ZAOville Pool Party: Laurel, Maryland, Saturday 25 July 2026. Co-hosted with Dcoop and The VEC. Free entry, free drinks, open mic, live sets and a DJ night swim. Part of the ZAO Festivals series.',
  openGraph: {
    title: 'ZAOville Pool Party | ZAO Festivals',
    description: 'Laurel, Maryland, Saturday 25 July 2026. Co-hosted with Dcoop and The VEC. Free entry, free drinks, open mic, live sets, DJ night swim.',
    url: 'https://zaostock.com/zaoville',
    type: 'website',
  },
};

interface Slot {
  time: string;
  label: string;
  type: 'OPEN' | 'SET' | 'DJ' | 'FINALE';
}

// A recap. Lineup from the ZAOville artist rider; times were set by event management.
const LINEUP: Slot[] = [
  { time: '3:00 - 3:45', label: 'Open Mic', type: 'OPEN' },
  { time: '3:45 - 4:05', label: 'DJ Set', type: 'DJ' },
  { time: '4:10 - 4:40', label: 'Ashley', type: 'SET' },
  { time: '4:50 - 5:20', label: 'Lyons Den', type: 'SET' },
  { time: '5:30 - 6:00', label: 'Dcoop', type: 'SET' },
  { time: '6:10 - 6:40', label: 'PROF!T', type: 'SET' },
  { time: '7:00 - 7:30', label: 'John Clark', type: 'SET' },
  { time: '7:40 - 8:10', label: 'ELYVN', type: 'SET' },
  { time: '8:10 - 8:40', label: 'DJ Set', type: 'DJ' },
  { time: '8:40', label: 'Finale', type: 'FINALE' },
  { time: 'Finale - 10:00', label: 'Night Swim DJ Set', type: 'DJ' },
];

const TYPE_TONE: Record<Slot['type'], string> = {
  OPEN: 'bg-olive-400 text-ink-950',
  SET: 'bg-denim-400 text-paper-200',
  DJ: 'bg-paper-200 text-ink-950',
  FINALE: 'bg-gold-400 text-ink-950',
};

const SERIES = [
  { name: 'ZAO-PALOOZA', place: 'New York City', year: 'April 2024' },
  { name: 'ZAO-CHELLA', place: 'Miami', year: 'December 2024' },
  { name: 'ZAOville', place: 'Laurel, Maryland', year: '25 July 2026', current: true },
  { name: 'ZAOstock', place: 'Ellsworth, Maine', year: '3 October 2026' },
];

export default function ZAOvillePage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Laurel, Maryland · Saturday 25 July 2026</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">ZAOville Pool Party</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            The DMV chapter of the ZAO Festivals series, co-hosted with Dcoop, founder of The VEC. Free entry, free drinks: a vibe sesh and food from 11 AM, then open mic, live independent sets and a DJ night swim to close. Cross-promoted across the series and feeding straight into ZAOstock.
          </p>
        </div>
      </Section>

      <Section>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 list-none m-0 p-0">
          {SERIES.map((e) => (
            <li key={e.name} className={['grain rounded-md border p-3', e.current ? 'border-2 border-ink-950 bg-gold-300 shadow-hard' : 'border-ink-950/60 bg-paper-200'].join(' ')}>
              <p className="font-sans font-extrabold text-sm text-ink-950 m-0">{e.name}</p>
              <p className="font-mono text-eyebrow text-ink-muted mt-1 m-0">
                {e.place} · {e.year}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader eyebrow="Lineup" title="How the day ran." lede="Artist arrival 2 PM latest. Times were assigned by event management." className="mb-6" />
        <ol className="list-none m-0 p-0 flex flex-col gap-2 max-w-[760px]">
          {LINEUP.map((s, i) => (
            <li key={i} className="grain bg-paper-200 border border-ink-950/60 rounded-md px-4 py-3 flex items-center gap-4">
              <span className="font-mono text-sm font-bold text-ink-950 tabular w-28 shrink-0">{s.time}</span>
              <span className={['font-mono text-[11px] font-bold uppercase tracking-[0.04em] px-2 py-0.5 rounded-pill border-2 border-ink-950 shrink-0', TYPE_TONE[s.type]].join(' ')}>{s.type}</span>
              <span className="text-sm font-semibold text-ink-950">{s.label}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-[760px]">
          <Card>
            <Eyebrow className="mb-2">Equipment provided by The VEC</Eyebrow>
            <ul className="list-disc pl-5 m-0 text-sm text-ink-950 flex flex-col gap-1">
              <li>DJ sound management</li>
              <li>Sennheiser wireless mics and a headset mic</li>
              <li>Two JBL monitors</li>
            </ul>
            <p className="text-sm text-ink-muted m-0 mt-3">Outside of essentials, artists provided their own equipment. The host is not responsible for lost, stolen or damaged property.</p>
          </Card>
          <Card>
            <Eyebrow className="mb-2">Performing at a ZAO Festivals event?</Eyebrow>
            <p className="text-sm text-ink-secondary m-0">Confirmed artists complete the performance and participation rider: schedule, equipment, backing tracks, merch, interview and retreat.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href="/musicians/rider" size="sm">
                Complete your rider
              </Button>
              <Button href="/festivals" variant="secondary" size="sm">
                The series
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </SiteShell>
  );
}
