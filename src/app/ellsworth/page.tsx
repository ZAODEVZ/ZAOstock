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
  },
};

// ---------------------------------------------------------------------------
// CONTENT - seeded from web research (2026-06). Refine/expand with City Hall
// specifics: festival-day parking plan, exact addresses, booking/links.
// ---------------------------------------------------------------------------

const GETTING_HERE: { mode: string; detail: string }[] = [
  { mode: 'By car', detail: 'About 40 min (30 mi) from Bangor, ~3 hrs (135 mi) from Portland, and ~5 hrs from Boston. Route 1 / Route 1A run right through downtown.' },
  { mode: 'Bangor International (BGR)', detail: 'Nearest major airport, ~40 min away. A direct shuttle bus runs to Ellsworth twice daily (~35 min). Best bet for most travelers.' },
  { mode: 'Hancock County-Bar Harbor (BHB)', detail: 'Smaller regional airport ~20 min away, with seasonal Cape Air service (including from Boston). Closest to the venue.' },
  { mode: 'Parking', detail: 'Downtown has public lots and street parking near the Franklin Street Parklet. Festival-day parking details coming soon.' },
];

const STAY: { name: string; note: string }[] = [
  { name: 'Hampton Inn Ellsworth/Bar Harbor', note: 'One of the newest hotels in town. Indoor heated saltwater pool, breakfast included.' },
  { name: 'Comfort Inn Ellsworth - Bar Harbor', note: 'Indoor saltwater pool and hot tub, free WiFi, daily continental breakfast.' },
  { name: 'Colonial Inn Ellsworth', note: '85-room property, renovated in 2016. Central to downtown.' },
  { name: 'Hawthorn Extended Stay by Wyndham', note: 'Suites with full kitchens - good for a multi-night stay. Breakfast + onsite laundry.' },
  { name: 'Book early', note: 'Ellsworth is the Acadia gateway and early October is foliage season - rooms go fast. Reserve ahead.' },
];

const EAT: { name: string; note: string }[] = [
  { name: 'Black Moon Public House', note: 'The ZAOstock afterparty venue. Start here after the show.' },
  { name: 'Union River Lobster Pot', note: 'Seasonal seafood on the banks of the Union River downtown - lobster and a famous slice of pie.' },
  { name: 'Cleonice', note: 'Mediterranean bistro in the historic 1938 Luchini building on Main Street.' },
  { name: 'Serendib', note: 'Award-winning Indian and Sri Lankan cuisine.' },
  { name: 'Fogtown Brewing', note: 'Taproom with a dog-friendly beer garden.' },
  { name: 'Airline Brewing Company', note: 'British-style local beers and classic pub fare.' },
];

const DO: { name: string; note: string }[] = [
  { name: 'Acadia National Park', note: 'Ellsworth is the gateway - about 25 mi to Bar Harbor and the park. Carriage roads, Cabot Cliffs, Cadillac Mountain sunrise.' },
  { name: 'Woodlawn Museum, Gardens & Park', note: 'The historic Black House on 180 acres - gardens, trails, and a croquet court.' },
  { name: 'Birdsacre (Stanwood Wildlife Sanctuary)', note: 'Rescued birds and miles of quiet walking trails, plus the Stanwood homestead museum.' },
  { name: 'Downtown Ellsworth', note: '19th-century Main Street: galleries (Courthouse Gallery, Atlantic Art Glass), shops, and cafes climbing up from the river.' },
];

const GOOD_TO_KNOW: { label: string; detail: string }[] = [
  { label: 'Weather', detail: 'Early October runs roughly 58-62°F by day, ~44°F at night - crisp and breezy with peak fall color. Pack layers and a jacket; ZAOstock is outdoors.' },
  { label: 'Daylight', detail: 'About 11 hours of daylight, sunrise ~6:48 AM, sunset ~5:49 PM. The festival runs noon-6 PM, finishing near golden hour.' },
  { label: 'Rain', detail: 'Roughly a 1-in-3 chance of rain on any given fall day - a packable rain layer is smart.' },
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

        {/* Good to know */}
        <section>
          <SectionHeader eyebrow="Good to know" title="Before you come." />
          <div className="space-y-3">
            {GOOD_TO_KNOW.map((g) => (
              <div key={g.label} className="rounded-xl border border-white/[0.08] bg-[#0d1b2a] p-4">
                <div className="font-semibold text-white">{g.label}</div>
                <p className="text-sm text-gray-400 mt-1">{g.detail}</p>
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
