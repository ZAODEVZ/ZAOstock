import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ZAOville · ZAO Festivals',
  description:
    'ZAOville is the DMV chapter of the ZAO Festivals series, co-hosted with DCoop and The VEC. Open mic, live sets, and DJ night swim. Part of the lineage behind ZAO-PALOOZA, ZAO-CHELLA, and ZAOstock.',
  openGraph: {
    title: 'ZAOville · ZAO Festivals',
    description:
      'The DMV chapter of the ZAO Festivals series, co-hosted with DCoop and The VEC. Open mic, live sets, DJ night swim.',
    url: 'https://zaostock.com/zaoville',
    type: 'website',
  },
};

interface Slot {
  time: string;
  label: string;
  type: 'OPEN' | 'SET' | 'DJ' | 'FINALE';
}

// Lineup from the ZAOville artist rider. Times tentative, set by event management.
const LINEUP: Slot[] = [
  { time: '3:00 - 3:45', label: 'Open Mic', type: 'OPEN' },
  { time: '3:45 - 4:05', label: 'DJ Set', type: 'DJ' },
  { time: '4:10 - 4:40', label: 'Ashley', type: 'SET' },
  { time: '4:50 - 5:20', label: 'Lyons Den', type: 'SET' },
  { time: '5:30 - 6:00', label: 'DCoop', type: 'SET' },
  { time: '6:10 - 6:40', label: 'PROF!T', type: 'SET' },
  { time: '7:00 - 7:30', label: 'John Clark', type: 'SET' },
  { time: '7:40 - 8:10', label: 'ELYVN', type: 'SET' },
  { time: '8:10 - 8:40', label: 'DJ Set', type: 'DJ' },
  { time: '8:40', label: 'Finale', type: 'FINALE' },
  { time: 'Finale - 10:00', label: 'Night Swim DJ Set', type: 'DJ' },
];

const TYPE_COLOR: Record<Slot['type'], string> = {
  OPEN: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  SET: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  DJ: 'border-gray-500/40 bg-gray-500/10 text-gray-400',
  FINALE: 'border-[#f5a623]/40 bg-[#f5a623]/10 text-[#f5a623]',
};

const SERIES = [
  { name: 'ZAO-PALOOZA', place: 'NYC', year: 'Apr 2024' },
  { name: 'ZAO-CHELLA', place: 'Miami', year: 'Dec 2024' },
  { name: 'ZAOville', place: 'DMV', year: 'Jul 2026', current: true },
  { name: 'ZAOstock', place: 'Ellsworth ME', year: 'Oct 2026' },
];

export default function ZAOvillePage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-16">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; ZAOstock
          </Link>
          <span className="text-xs text-gray-500">ZAO Festivals series</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="space-y-3">
          <p className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-medium border border-emerald-500/30">
            DMV Chapter · Summer 2026
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">ZAOville</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            The DMV chapter of the ZAO Festivals series, co-hosted with DCoop (founder of The VEC).
            Open mic, live independent sets, host transitions, and a DJ night swim to close it out.
            Cross-promoted across the series and feeding directly into ZAOstock.
          </p>
        </div>

        {/* Series lineage */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SERIES.map((e) => (
            <div
              key={e.name}
              className={`rounded-lg border p-3 ${
                e.current
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-white/[0.08] bg-[#0d1b2a]'
              }`}
            >
              <p className={`text-sm font-bold ${e.current ? 'text-emerald-400' : 'text-white'}`}>
                {e.name}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
                {e.place} · {e.year}
              </p>
            </div>
          ))}
        </div>

        {/* Lineup */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Lineup</h2>
          <p className="text-xs text-gray-500">
            Artist arrival 2 PM latest. Times are assigned by event management and slightly tentative.
          </p>
          <div className="space-y-2">
            {LINEUP.map((s, i) => (
              <div
                key={i}
                className="bg-[#0d1b2a] rounded-lg border border-white/[0.08] p-3 flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-24">
                  <p className="text-xs font-mono font-bold text-white">{s.time}</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${TYPE_COLOR[s.type]}`}>
                  {s.type}
                </span>
                <p className="text-sm font-medium text-white">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What The VEC provides */}
        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">
            Equipment provided by The VEC
          </p>
          <ul className="text-sm text-gray-300 space-y-1.5">
            <li>- DJ sound management</li>
            <li>- Sennheiser wireless mics + headset mic</li>
            <li>- 2 JBL monitors</li>
          </ul>
          <p className="text-xs text-gray-500 leading-relaxed">
            Outside of essentials, artists provide their own equipment. The host is not responsible
            for lost, stolen, or damaged property.
          </p>
        </div>

        {/* CTA to rider */}
        <div className="bg-gradient-to-br from-[#f5a623]/15 via-[#f5a623]/5 to-transparent rounded-xl p-5 border border-[#f5a623]/30 space-y-3">
          <p className="text-sm font-bold text-white">Performing at a ZAO Festivals event?</p>
          <p className="text-xs text-gray-300 leading-relaxed">
            Confirmed artists complete the performance &amp; participation rider - schedule,
            equipment, backing tracks, merch, interview, and retreat.
          </p>
          <Link
            href="/musicians/rider"
            className="inline-block bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-4 py-2.5 text-sm transition-colors"
          >
            Complete your rider
          </Link>
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
