import { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeader } from '@/components/festival/SectionHeader';

export const metadata: Metadata = {
  title: 'Visiting Ellsworth, Maine | ZAOstock',
  description:
    'Everything you need for ZAOstock weekend in Ellsworth, Maine - getting here, where to stay, where to eat, and what to do in the gateway to Acadia National Park.',
  openGraph: {
    title: 'Visiting Ellsworth, Maine | ZAOstock',
    description:
      'Getting here, where to stay, where to eat, and what to do in Ellsworth - the gateway to Acadia National Park. October 3, 2026.',
    url: 'https://zaostock.com/ellsworth',
    images: [{ url: '/zao/wavewarz-banner.jpg', width: 1200, height: 630, alt: 'Ellsworth, Maine - host of ZAOstock' }],
  },
};

// ---------------------------------------------------------------------------
// CONTENT - populate these from the City Hall info dump.
// Anything marked TODO is a placeholder waiting on real local data.
// ---------------------------------------------------------------------------

const GETTING_HERE: { mode: string; detail: string }[] = [
  { mode: 'By car', detail: 'TODO: confirm drive times - approx from Portland, Bangor, Boston. Route 1 / Route 1A through downtown.' },
  { mode: 'Nearest airport', detail: 'TODO: confirm - Bangor International (BGR) and Hancock County-Bar Harbor (BHB).' },
  { mode: 'Parking', detail: 'TODO: city hall parking info - public lots, street parking, festival-day plan near the Franklin Street Parklet.' },
];

const STAY: { name: string; note: string }[] = [
  { name: 'TODO: hotel / inn', note: 'From City Hall list - name, distance to venue, booking link.' },
];

const EAT: { name: string; note: string }[] = [
  { name: 'Black Moon Public House', note: 'ZAOstock afterparty venue.' },
  { name: 'TODO: more from City Hall', note: 'Restaurants, cafes, breweries near downtown.' },
];

const DO: { name: string; note: string }[] = [
  { name: 'Acadia National Park', note: 'Ellsworth is the gateway - roughly 4M visitors a year pass through.' },
  { name: 'TODO: downtown + local', note: 'Things to do from City Hall - downtown, waterfront, nearby.' },
];

export default function EllsworthPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-16">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors">
            &larr; ZAOstock
          </Link>
          <span className="text-xs text-gray-500">Oct 3, 2026</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        <section className="space-y-3">
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[#f5a623] tracking-[0.2em]">
            Plan your weekend
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-bold tracking-tight">
            Ellsworth, Maine
          </h1>
          <p className="text-gray-300 leading-relaxed">
            Crossroads of Downeast Maine and the gateway to Acadia National Park. Home to ZAOstock on
            October 3, 2026 at the Franklin Street Parklet, as part of the 9th Annual Art of Ellsworth
            during Maine Craft Weekend.
          </p>
        </section>

        {/* Getting here */}
        <section>
          <SectionHeader eyebrow="Getting here" title="How to reach Ellsworth." />
          <div className="space-y-3">
            {GETTING_HERE.map((g) => (
              <div key={g.mode} className="rounded-xl border border-white/[0.08] bg-[#0d1b2a] p-4">
                <div className="font-semibold text-white">{g.mode}</div>
                <p className="text-sm text-gray-400 mt-1">{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Where to stay */}
        <section>
          <SectionHeader eyebrow="Where to stay" title="Beds near the venue." />
          <div className="space-y-3">
            {STAY.map((s) => (
              <div key={s.name} className="rounded-xl border border-white/[0.08] bg-[#0d1b2a] p-4">
                <div className="font-semibold text-white">{s.name}</div>
                <p className="text-sm text-gray-400 mt-1">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eat & drink */}
        <section>
          <SectionHeader eyebrow="Eat & drink" title="Where to refuel." />
          <div className="space-y-3">
            {EAT.map((e) => (
              <div key={e.name} className="rounded-xl border border-white/[0.08] bg-[#0d1b2a] p-4">
                <div className="font-semibold text-white">{e.name}</div>
                <p className="text-sm text-gray-400 mt-1">{e.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Things to do */}
        <section>
          <SectionHeader eyebrow="Things to do" title="Make a weekend of it." />
          <div className="space-y-3">
            {DO.map((d) => (
              <div key={d.name} className="rounded-xl border border-white/[0.08] bg-[#0d1b2a] p-4">
                <div className="font-semibold text-white">{d.name}</div>
                <p className="text-sm text-gray-400 mt-1">{d.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-[#f5a623]/30 bg-[#f5a623]/5 p-6 text-center">
          <h2 className="text-xl font-bold">Coming to ZAOstock?</h2>
          <p className="text-sm text-gray-300 mt-2">
            October 3, 2026 - Franklin Street Parklet, Ellsworth, Maine. Free to attend.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://ticket.zaostock.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-6 py-3 text-sm transition-colors"
            >
              RSVP on Luma
            </a>
            <Link
              href="/"
              className="border border-white/20 hover:border-[#f5a623]/50 rounded-lg px-6 py-3 text-sm transition-colors"
            >
              Festival home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
