import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ZAOstock Program | October 3, 2026',
  description: 'Day-of schedule for ZAOstock. Draft program with music sets, WaveWarZ battles, and short talks throughout the day.',
  openGraph: {
    title: 'ZAOstock Program',
    description: 'Day-of schedule for ZAOstock. Music sets, WaveWarZ battles, and short talks throughout the day.',
    url: 'https://zaostock.com/program',
  },
};

interface Block {
  target: string;
  label: string;
  type: 'MUSIC' | 'TALK' | 'BATTLE' | 'DJ' | 'BREAK';
  detail: string;
}

const PROGRAM: Block[] = [
  { target: '12:00', type: 'DJ', label: 'Doors open', detail: 'Welcome DJ set, crowd arrives, grab your first drink.' },
  { target: '12:15', type: 'MUSIC', label: 'Opening set', detail: 'First artist of the day, 25-30 minutes.' },
  { target: '~12:50', type: 'TALK', label: 'Welcome to ZAOstock', detail: '5-10 minutes. What this is and why we built it.' },
  { target: '~13:05', type: 'MUSIC', label: 'Artist — TBA', detail: '15-20 minute set. Lineup announces August 2026.' },
  { target: '~13:35', type: 'TALK', label: 'Music distribution 101', detail: '5-10 minutes. Why digital distribution matters for independent artists, pitched for IRL audience.' },
  { target: '~13:50', type: 'MUSIC', label: 'Artist — TBA', detail: '15-20 minute set. Lineup announces August 2026.' },
  { target: '~14:20', type: 'BREAK', label: 'Mid-day break', detail: '15 minutes. Food trucks, bathrooms, mingle.' },
  { target: '~14:35', type: 'MUSIC', label: 'Artist — TBA', detail: '20-30 minute set. Lineup announces August 2026.' },
  { target: '~15:10', type: 'BATTLE', label: 'WaveWarZ battle', detail: 'Two artists go head-to-head. Audience decides the winner.' },
  { target: '~15:45', type: 'DJ', label: 'DJ bridge', detail: 'Music keeps going while we reset the stage.' },
  { target: '~16:00', type: 'MUSIC', label: 'Artist set', detail: 'Independent artist set.' },
  { target: '~16:30', type: 'TALK', label: 'The ZAO community', detail: '5-10 minutes. How to join, what ZAO is.' },
  { target: '~16:45', type: 'TALK', label: 'Partners and Year 2', detail: '5-10 minutes. Thank-you and preview of 2027.' },
  { target: '~16:55', type: 'BATTLE', label: 'WaveWarZ battle', detail: 'Two artists go head-to-head. Audience decides the winner.' },
  { target: '~17:25', type: 'DJ', label: 'DJ bridge', detail: 'Stage reset.' },
  { target: '~17:30', type: 'MUSIC', label: 'Closing set', detail: 'Special guest, 25-30 minutes.' },
  { target: '~17:55', type: 'DJ', label: 'Wind down', detail: 'Closing DJ set. Afterparty at Black Moon Public House downtown.' },
];

const TYPE_COLOR: Record<Block['type'], string> = {
  MUSIC: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  TALK: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  BATTLE: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
  DJ: 'border-gray-500/40 bg-gray-500/10 text-gray-400',
  BREAK: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
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
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Day-of Schedule</h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Fluid pacing. Music, talks, and WaveWarZ battles flow together with 5-10 minutes of breathing room between blocks. Times are approximate targets, not hard clocks.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-[10px]">
          {(['MUSIC', 'BATTLE', 'TALK', 'DJ', 'BREAK'] as const).map((t) => (
            <div key={t} className={`text-center font-bold px-2 py-1 rounded border ${TYPE_COLOR[t]}`}>
              {t}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {PROGRAM.map((block, i) => (
            <div
              key={i}
              className="bg-[#0d1b2a] rounded-lg border border-white/[0.08] p-3 flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-16">
                <p className="text-sm font-mono font-bold text-white">{block.target}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${TYPE_COLOR[block.type]}`}>
                    {block.type}
                  </span>
                  <p className="text-sm font-medium text-white">{block.label}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{block.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">What is WaveWarZ</p>
          <p className="text-sm text-gray-300 leading-relaxed">
            WaveWarZ is a live music battle. Two artists go head-to-head and the audience decides the winner. Expect a couple of WaveWarZ battles across the day.
          </p>
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Things to know</p>
          <ul className="text-sm text-gray-300 space-y-1.5">
            <li>- Confirmed so far: Werb and Lyons Den. Full lineup announces August 2026.</li>
            <li>- Weather: tent coverage via Wallace Events, rain or shine.</li>
            <li>- Afterparty at Black Moon Public House, walkable downtown.</li>
            <li>- This schedule is a draft. Final version locks September 2026.</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block text-sm text-[#f5a623] hover:text-[#ffd700]"
          >
            Back to ZAOstock
          </Link>
        </div>
      </div>
    </div>
  );
}
