import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ZAOstock Program | October 3, 2026',
  description:
    'Day-of schedule for ZAOstock. Outdoors on Franklin Street from eleven, then indoors at Black Moon from six.',
  openGraph: {
    title: 'ZAOstock Program',
    description:
      'Outdoors from eleven, indoors from six. October 3, 2026 in Ellsworth, Maine.',
    url: 'https://zaostock.com/program',
  },
};

// Source of truth: ZAOOS research doc 2391 (ZAOstock Run of Show v2).
//
// Structure set by Zaal 2026-08-23: everything is OUTDOORS on the Franklin
// Street parklet until 6pm, then everything moves INDOORS to Black Moon.
// This replaced the earlier two-stage alternating design - one venue at a
// time, split by time of day rather than by set.
//
// NO ARTIST NAMES on this page. The lineup is not public until the reveal
// (Zaal, 2026-08-23), so slots stay generic here even where an act is
// confirmed internally. Do NOT hand-write names in. That covers the band
// Black Moon is underwriting for the indoor block too - it is booked and it is
// named in docs/plans/production-plan-2026-10-03.md, but it stays off this page
// until the reveal like every other act.
//
// Doors moved noon -> 11:00 on 2026-08-26. On Steve Peer's 45-minute/15-minute
// cadence, noon to four is exactly four slots and five acts are confirmed for
// the day, so the day opens an hour earlier rather than dropping an act.
//
// The indoor block was two entries (18:00-20:00 DJ party, 20:00-late local
// acts). A single 6-9 booking replaces both.
//
// IN BOOKING, NOT BOOKED (Zaal, 2026-08-27). All four acts from Steve's draft -
// The Crown Vics, DJ Aquavantes, The Somes Sound, North Creek - are PROPOSED
// ONLY. Nobody has confirmed which are booked. So this page says "in booking"
// and commits to neither an act nor a downbeat. Do not upgrade this wording
// without a confirmation you can point at.

type Venue = 'OUT' | 'IN';

interface Block {
  start: string;
  end: string;
  venue: Venue;
  label: string;
  detail: string;
}

const BLOCKS: Block[] = [
  {
    start: '11:00',
    end: '16:00',
    venue: 'OUT',
    label: 'Live music',
    detail:
      'Independent artists back to back on the parklet stage, 45 minutes each with a DJ covering every changeover. Lineup announced once every set is locked.',
  },
  {
    start: '16:00',
    end: '18:00',
    venue: 'OUT',
    label: 'WaveWarZ',
    detail:
      'Live music battles. Artists go head to head and the audience decides, online and in the street.',
  },
  {
    start: '18:00',
    end: '21:00',
    venue: 'IN',
    label: 'The after party',
    detail:
      'Everything moves inside to Black Moon Public House, walkable, right next door. Live music for the evening, in booking.',
  },
  {
    start: '21:00',
    end: 'late',
    venue: 'IN',
    label: 'DJ to close',
    detail: 'Music until the room empties, indoors.',
  },
];

const VENUE: Record<Venue, { name: string; where: string; cls: string; bar: string }> = {
  OUT: {
    name: 'Outdoors',
    where: 'Franklin Street Parklet',
    cls: 'border-[#f5a623]/40 bg-[#f5a623]/10 text-[#f5a623]',
    bar: 'bg-[#f5a623]',
  },
  IN: {
    name: 'Indoors',
    where: 'Black Moon Public House',
    cls: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
    bar: 'bg-rose-400',
  },
};

export default function ProgramPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-12">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; ZAOstock
          </Link>
          <span className="text-xs text-gray-500">Oct 3, 2026</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <p className="inline-block rounded-full bg-[#f5a623]/10 px-3 py-1 text-xs text-[#f5a623] font-medium border border-[#f5a623]/30">
            Draft Program
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Outside, Then In</h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            A full day in two halves. Live music on Franklin Street from eleven, then the whole
            thing walks next door into Black Moon at six and keeps going.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['OUT', 'IN'] as const).map((v) => (
            <div key={v} className={`rounded-lg border p-3 ${VENUE[v].cls}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider">{VENUE[v].name}</p>
              <p className="text-xs mt-1 opacity-80">{VENUE[v].where}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {BLOCKS.map((b) => {
            const v = VENUE[b.venue];
            return (
              <div
                key={b.start}
                className="bg-[#0d1b2a] rounded-lg border border-white/[0.08] p-4 flex items-start gap-3"
              >
                <span
                  className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${v.bar}`}
                  aria-hidden="true"
                />
                <div className="flex-shrink-0 w-[86px]">
                  <p className="text-sm font-mono font-bold text-white tabular-nums">{b.start}</p>
                  <p className="text-[10px] font-mono text-gray-500 tabular-nums">to {b.end}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${v.cls}`}>
                      {v.name}
                    </span>
                    <p className="text-sm font-medium text-white">{b.label}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">{b.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">
            Spend it in Ellsworth
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            The whole point of putting this on Franklin Street is to show what a day like this does
            for the businesses already here. Eat at the places around you, drink at Black Moon, buy
            something from the shop you walk past. We are measuring what 3 October does for this
            block, and the number only exists if you make it.
          </p>
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Things to know</p>
          <ul className="text-sm text-gray-300 space-y-1.5">
            <li>- Free to attend. Optional Pro Ticket supports the festival.</li>
            <li>- Full lineup announced once every set is locked.</li>
            <li>- Weather: tent coverage via Wallace Events, rain or shine.</li>
            <li>- Black Moon is open through the day, walkable, right next door.</li>
            <li>- This schedule is a draft. Final version locks September 2026.</li>
          </ul>
        </div>

        <div className="text-center">
          <Link href="/" className="inline-block text-sm text-[#f5a623] hover:text-[#ffd700]">
            Back to ZAOstock
          </Link>
        </div>
      </div>
    </div>
  );
}
