import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ZAOstock Program | October 3, 2026',
  description:
    'Day-of schedule for ZAOstock. Two stages alternating on a 45-minute cadence from noon, then the after-party indoors at Black Moon.',
  openGraph: {
    title: 'ZAOstock Program',
    description:
      'Two stages alternating on a 45-minute cadence. The music never stops. October 3, 2026 in Ellsworth, Maine.',
    url: 'https://zaostock.com/program',
  },
};

// Source of truth: ZAOOS research doc 2391 (ZAOstock Run of Show v2), which
// supersedes doc 428. Every value here is a decision from the 2026-08-15 Steve
// Peer call (doc 2295) or the 2026-08-17 standup (doc 2310):
//   - two stages, alternating, so there is no gap in the music
//   - 45-minute cadence, scripted
//   - main show 12:00-18:00, after-party 18:00-20:00 fully indoors
// Artists are deliberately unnamed. The roster lives in the `artists` table
// and is not public until the lineup reveal. Do NOT hand-write names here.

type Stage = 'OUT' | 'IN';

interface Slot {
  start: string;
  end: string;
  stage: Stage;
  n: number;
}

const MAIN: Slot[] = [
  { start: '12:00', end: '12:45', stage: 'OUT', n: 1 },
  { start: '12:45', end: '13:30', stage: 'IN', n: 2 },
  { start: '13:30', end: '14:15', stage: 'OUT', n: 3 },
  { start: '14:15', end: '15:00', stage: 'IN', n: 4 },
  { start: '15:00', end: '15:45', stage: 'OUT', n: 5 },
  { start: '15:45', end: '16:30', stage: 'IN', n: 6 },
  { start: '16:30', end: '17:15', stage: 'OUT', n: 7 },
  { start: '17:15', end: '18:00', stage: 'IN', n: 8 },
];

const AFTER: { start: string; end: string; label: string }[] = [
  { start: '18:00', end: '18:40', label: 'Hip-hop crew, open to riff along' },
  { start: '18:40', end: '19:20', label: 'Live band' },
  { start: '19:20', end: '20:00', label: 'DJ close' },
];

const STAGE_META: Record<Stage, { name: string; where: string; cls: string; dot: string }> = {
  OUT: {
    name: 'Outdoor',
    where: 'Franklin Street Parklet',
    cls: 'border-[#f5a623]/40 bg-[#f5a623]/10 text-[#f5a623]',
    dot: 'bg-[#f5a623]',
  },
  IN: {
    name: 'Indoor',
    where: 'Black Moon Public House',
    cls: 'border-rose-400/40 bg-rose-400/10 text-rose-300',
    dot: 'bg-rose-400',
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Two Stages, No Gaps</h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Sets alternate between the outdoor parklet and the room at Black Moon, so while one
            stage plays the other is already being reset. Forty-five minutes each, straight through
            from noon.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['OUT', 'IN'] as const).map((s) => (
            <div key={s} className={`rounded-lg border p-3 ${STAGE_META[s].cls}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider">{STAGE_META[s].name}</p>
              <p className="text-xs mt-1 opacity-80">{STAGE_META[s].where}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold px-1">
            Main show &middot; 12:00 to 18:00
          </p>
          {MAIN.map((slot) => {
            const m = STAGE_META[slot.stage];
            return (
              <div
                key={slot.n}
                className={`bg-[#0d1b2a] rounded-lg border border-white/[0.08] p-3 flex items-center gap-3 ${
                  slot.stage === 'IN' ? 'sm:ml-8' : 'sm:mr-8'
                }`}
              >
                <span className={`w-1.5 h-8 rounded-full flex-shrink-0 ${m.dot}`} aria-hidden="true" />
                <div className="flex-shrink-0 w-[92px]">
                  <p className="text-sm font-mono font-bold text-white tabular-nums">{slot.start}</p>
                  <p className="text-[10px] font-mono text-gray-500 tabular-nums">to {slot.end}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${m.cls}`}>
                      {m.name}
                    </span>
                    <p className="text-sm font-medium text-white">Set {slot.n}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    45 minutes. Artist announced with the lineup.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold px-1">
            After-party &middot; 18:00 to 20:00 &middot; all indoors
          </p>
          {AFTER.map((b) => (
            <div
              key={b.start}
              className="bg-[#0d1b2a] rounded-lg border border-white/[0.08] p-3 flex items-center gap-3 sm:ml-8"
            >
              <span className="w-1.5 h-8 rounded-full flex-shrink-0 bg-rose-400" aria-hidden="true" />
              <div className="flex-shrink-0 w-[92px]">
                <p className="text-sm font-mono font-bold text-white tabular-nums">{b.start}</p>
                <p className="text-[10px] font-mono text-gray-500 tabular-nums">to {b.end}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${STAGE_META.IN.cls}`}>
                    Indoor
                  </span>
                  <p className="text-sm font-medium text-white">{b.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">
            Why it alternates
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            One stage plays while the other changes over, so you never stand in front of a stage
            watching someone coil cables. Walk between the two whenever you like. There is no point
            in the day where the music stops.
          </p>
        </div>

        {/*
          The lift figure goes here once it exists. See ZAOOS doc 2392: the point
          of the day is proving what an event like this does for Franklin Street
          businesses, measured as a normal Saturday against 3 October. The
          baseline has to be captured BEFORE the event or it is gone.
          Until there is a real measured number, this block asks attendees to
          create the thing being measured. Do NOT put an estimated figure here.
        */}
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
            <li>- Full lineup announced once every set is locked.</li>
            <li>- Which artist plays which slot is assigned, not requested.</li>
            <li>- Weather: tent coverage via Wallace Events, rain or shine.</li>
            <li>- After-party is at Black Moon Public House, walkable downtown.</li>
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
