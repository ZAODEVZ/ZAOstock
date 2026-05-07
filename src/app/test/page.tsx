import { Metadata } from 'next';
import Link from 'next/link';
import { CountdownTimer } from '@/components/CountdownTimer';
import { RSVPForm } from '../RSVPForm';
import { getPublicMembers, getStockCounts, type PublicMember } from '@/lib/members';
import { FactStrip } from '@/components/festival/FactStrip';
import { SectionHeader } from '@/components/festival/SectionHeader';
import { StatTile } from '@/components/festival/StatTile';
import { TierPanel } from '@/components/festival/TierPanel';
import { PastEventCard } from '@/components/festival/PastEventCard';
import { StickyActionBar } from '@/components/festival/StickyActionBar';
import { TeamMosaic } from '@/components/festival/TeamMosaic';
import { NoiseOverlay } from '@/components/festival/NoiseOverlay';
import { ScrollEyebrow } from '@/components/festival/ScrollEyebrow';
import { AnimatedGradient } from '@/components/festival/AnimatedGradient';
import { TiltCard } from '@/components/festival/TiltCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ZAOstock | Test Layout',
  description: 'ZAOstock - test layout preview',
  robots: { index: false, follow: false },
};

const FESTIVAL_DATE = '2026-10-03T12:00:00-04:00';

const FACTS = [
  { label: 'Date', value: 'Oct 03 2026' },
  { label: 'Venue', value: 'Franklin St Parklet' },
  { label: 'Time', value: '12 PM - 6 PM' },
  { label: 'Lineup', value: 'Independent Artists' },
];

const SPONSOR_OFFERINGS = [
  {
    category: 'Main Stage Sponsor',
    number: '01',
    items: [
      'Named credit on stage banner and signage',
      'Booth or table space on-site',
      'Welcome bag inclusion',
      'Live verbal credit during the event',
      'Co-presented in all printed materials',
    ],
  },
  {
    category: 'Broadcast Sponsor',
    number: '02',
    items: [
      'Named credit on festival website with backlink',
      'Livestream overlay credit',
      'Sponsored segment plus interview feature',
      'Social campaign across Farcaster, X, and Bluesky',
      'Newsletter credit (400+ editions)',
    ],
  },
  {
    category: 'Year-Round Sponsor',
    number: '03',
    items: [
      'Post-event thank-you feature and recap',
      'Advisory seat for Year 2 planning',
      'Priority placement in 2027',
      'Eligible support administered through New Media Commons, a fiscally sponsored project of Fractured Atlas',
    ],
  },
];

const PAST_EVENTS = [
  {
    year: 'NYC · Apr 2024',
    name: 'ZAO-PALOOZA',
    description: 'Community meet-up during NFT NYC. 12 artists. Volunteer-organized in six weeks. Broke even.',
    hue: 'rose' as const,
  },
  {
    year: 'Miami · Dec 2024',
    name: 'ZAO-CHELLA',
    description: 'Showcase in Wynwood during Art Basel. 16+ musicians, 100+ visual artists, 50+ music communities. ZAO HOUSE artist residency. Live WaveWarZ battle, cipher recorded on-site.',
    hue: 'indigo' as const,
  },
];

// PARTNER GATING RULES (strict): a partner may appear here only if
//   1. confirmed === true (locked agreement, not "in conversation")
//   2. poc is a real ZAO team member who owns the relationship
// Sponsors (paid placements) live in SPONSOR_OFFERINGS, not here.
const PARTNERS = [
  { name: 'Heart of Ellsworth', role: 'Local promotion + Maine Craft Weekend coordination', confirmed: true, poc: 'Zaal' },
  { name: 'Town of Ellsworth', role: 'Parklet venue', confirmed: true, poc: 'Zaal' },
  { name: 'New Media Commons (via Fractured Atlas)', role: 'Fiscal sponsorship infrastructure for eligible initiatives', confirmed: true, poc: 'FailOften' },
  { name: 'ENTERACT', role: 'Production + operational support', confirmed: true, poc: 'FailOften' },
  { name: 'Web3Metal', role: 'Partnership integration + community surface', confirmed: true, poc: 'Shawn' },
].filter((p) => p.confirmed);

const NAV = [
  { href: '/program', label: 'Program' },
  { href: '/suggest', label: 'Suggest' },
  { href: '/apply', label: 'Volunteer' },
  { href: '/sponsor/deck', label: 'Partner' },
];

export default async function TestPage() {
  const [publicMembers, counts] = await Promise.all([getPublicMembers(), getStockCounts()]);
  const typedMembers: PublicMember[] = publicMembers;

  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-24 sm:pb-12 font-[family-name:var(--font-display)]">
      <NoiseOverlay />
      <AnimatedGradient />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <Link href="/test" className="font-bold text-base tracking-tight">ZAOstock</Link>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.2em] hidden sm:inline">
              / Oct 03 2026
            </span>
          </div>
          <nav className="flex items-center gap-5">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-[#f5a623] transition-colors hidden sm:inline"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/"
              className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[#f5a623] hover:text-[#ffd700] transition-colors"
            >
              The ZAO
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* dot pattern bg */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(245,166,35,0.6) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-[#f5a623]" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase text-[#f5a623] tracking-[0.25em]">
              Community Music Festival / Year 1
            </span>
          </div>
          <h1
            className="font-bold tracking-[-0.04em] leading-[0.85]"
            style={{ fontSize: 'clamp(4rem, 14vw, 11rem)' }}
          >
            ZAO<span className="text-[#f5a623]">stock</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-xl text-gray-300 leading-relaxed">
            A community-built outdoor music festival in Ellsworth, Maine. Independent artists. One stage. All day.
          </p>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#f5a623] font-medium leading-relaxed">
            Walk in free. Stay because it is good. Friday Oct 3, Ellsworth Maine.
          </p>
          <div className="mt-10">
            <FactStrip facts={FACTS} />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="#rsvp"
              className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-6 py-4 transition-colors"
            >
              Get on the list
            </Link>
            <Link
              href="/apply"
              className="border border-white/30 hover:border-[#f5a623] hover:text-[#f5a623] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-6 py-4 transition-colors"
            >
              Volunteer
            </Link>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em] ml-2">
              Tickets required for parklet entry / Free to listen from outside
            </span>
          </div>
          <ScrollEyebrow />
        </div>
      </section>

      {/* TODO[photos]: Source 6-12 high-res shots from past events
          - ZAO-PALOOZA NYC (Apr 2024) - stage + crowd + cipher
          - ZAO-CHELLA Miami (Dec 2024) - WaveWarZ battle + ZAO HOUSE residency + visual artists
          - ZAOville DMV prep (Jul 2026)
          When curated: reinstate VibesGrid section between "About" and "How We Run It".
          Also: replace TagMarquee here once lineup confirms (Aug 2026) with actual artist names.
      */}

      {/* Countdown bar */}
      <section className="border-y border-white/[0.12] bg-[#0d1b2a]/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.2em]">
              Countdown
            </span>
            <div className="flex-1 min-w-[260px]">
              <CountdownTimer targetDate={FESTIVAL_DATE} eventName="ZAOstock" />
            </div>
          </div>
        </div>
      </section>

      {/* Lineup teaser */}
      <section className="my-12 sm:my-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="The Lineup" title="Independent artists. One stage." />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                A full day of independent artists with DJs between every act. The full lineup drops August 2026 once final commitments are locked.
              </p>
            </div>
            <div className="lg:col-span-5 lg:pl-8 lg:border-l border-white/[0.12]">
              <dl className="space-y-4">
                <div className="flex flex-col gap-1">
                  <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">Lineup drops</dt>
                  <dd className="text-base text-white">August 2026</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">Stage</dt>
                  <dd className="text-base text-white">One stage, all day</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">Format</dt>
                  <dd className="text-base text-white">Live sets with DJs between</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* About: 2-col asymmetric */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <SectionHeader eyebrow="About" title="Every car heading to Acadia passes through. Free to listen from the sidewalk." />
              <div className="space-y-5 text-base sm:text-lg text-gray-300 leading-relaxed">
                <p>
                  ZAOstock is The ZAO&apos;s flagship IRL music festival. A full-day outdoor showcase at the Franklin
                  Street Parklet in downtown Ellsworth, Maine. Independent artists perform with DJs between.
                </p>
                <p>
                  Part of the 9th Annual Art of Ellsworth during Maine Craft Weekend, ZAOstock brings the decentralized
                  music community together in the Crossroads of Downeast.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-8 lg:border-l border-white/[0.12]">
              <dl className="space-y-5">
                {[
                  { k: 'Location', v: 'Franklin St Parklet, Ellsworth ME' },
                  { k: 'Series', v: '9th Annual Art of Ellsworth' },
                  { k: 'Weekend', v: 'Maine Craft Weekend' },
                ].map((row) => (
                  <div key={row.k} className="flex flex-col gap-1 pb-4 border-b border-white/[0.08]">
                    <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">
                      {row.k}
                    </dt>
                    <dd className="text-base text-white">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto + stats bento */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="How We Run It" title="Built by 26 teammates, the local Ellsworth crew, and the artists who want this to exist." />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.12] border border-white/[0.12]">
            <StatTile value="26" label="Teammates building this" accent />
            <StatTile value="100+" label="ZAO community members" />
            <StatTile value="2" label="Prior festivals (NYC + Miami)" />
            <StatTile value="501(c)(3)" label="Funding via New Media Commons / Fractured Atlas" />
          </div>
        </div>
      </section>

      {/* Crossroads of Downeast - location pride */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Where" title="Crossroads of Downeast Maine - gateway to Acadia." />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-5 space-y-4">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                Ellsworth sits at the gateway to Acadia National Park. Four million people drove through in 2025. Downtown just received National Historic Register designation.
              </p>
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                The Heart of Ellsworth ran 28 events in 2025 with 50+ sponsors. The infrastructure is here; we are plugging into it.
              </p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-white/[0.08]">
                <FactRow label="Visitors / yr" value="4M+" />
                <FactRow label="Status" value="Historic Register" />
                <FactRow label="Host series" value="Art of Ellsworth" />
                <FactRow label="Year" value="9th annual" />
              </dl>
            </div>
            <div className="lg:col-span-7 relative overflow-hidden border border-white/[0.12] bg-[#0d1b2a] aspect-[4/3] lg:aspect-auto group">
              {/* Stylized location panel - gradient backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d3a]/60 via-[#0d1b2a] to-[#0a1628] transition-transform duration-700 group-hover:scale-105">
                <div className="absolute inset-0 opacity-[0.08]" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(245,166,35,0.4) 0, transparent 50%), radial-gradient(circle at 70% 70%, rgba(244,63,94,0.3) 0, transparent 50%)',
                }} />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-[#f5a623]">Ellsworth · Maine</p>
                <p
                  className="font-bold text-white tracking-tight mt-1"
                  style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 0.9 }}
                >
                  Franklin St Parklet
                </p>
                <p className="text-sm text-gray-300 mt-2 max-w-md">
                  Where every car heading to Acadia National Park passes through.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Team */}
      <section id="team" className="my-16 sm:my-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="The Team" title="Built by these people." />
          <TeamMosaic members={typedMembers} />
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-600 tracking-[0.18em] mt-5">
            Tap any name for full bio + links
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Partners" title="Partners give time and skill. No cash." />
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-3xl mb-8">
            Partners give time, venue, and infrastructure - not money. Each one has a confirmed agreement and a dedicated point of contact on the ZAO team. Sponsorship tracks below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.12] border border-white/[0.12]">
            {PARTNERS.map((p) => (
              <div key={p.name} className="bg-[#0d1b2a] p-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#f5a623]">
                    Confirmed
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-gray-600">
                    /CFM
                  </span>
                </div>
                <p className="font-bold text-white text-lg tracking-tight">{p.name}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{p.role}</p>
                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-baseline justify-between gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">
                    POC
                  </span>
                  <span className="text-sm text-white font-medium">{p.poc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer + RSVP combined */}
      <section id="rsvp" className="my-16 sm:my-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Join In" title="Build the festival or get on the list." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.12] border border-white/[0.12]">
            <div className="bg-[#0d1b2a] p-8 sm:p-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-bold text-2xl sm:text-3xl tracking-tight">Volunteer</h3>
                {counts.volunteers > 0 && (
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#f5a623] text-3xl sm:text-4xl leading-none tabular-nums">
                      {counts.volunteers}
                    </p>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em] mt-2">
                      Signed up
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Setup, check-in, stage crew, content, teardown - or anything in between. Volunteers get crew shirts,
                meals on-site, and front-of-house access.
              </p>
              <Link
                href="/apply"
                className="inline-block mt-6 border border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-black font-bold font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-6 py-4 transition-colors"
              >
                Sign up to volunteer
              </Link>
            </div>
            <div className="bg-[#0d1b2a] p-8 sm:p-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="font-bold text-2xl sm:text-3xl tracking-tight">Get on the list</h3>
                {counts.rsvps > 0 && (
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#f5a623] text-3xl sm:text-4xl leading-none tabular-nums">
                      {counts.rsvps}
                    </p>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em] mt-2">
                      On the list
                    </p>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-5">
                Limited capacity. First to know when tickets drop and the lineup is announced.
              </p>
              <RSVPForm eventSlug="zao-stock-2026" />
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Sponsors" title="Three sponsorship tracks. Same level of recognition. Pick by what fits your goals." />
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-3xl mb-8">
            No Gold / Silver / Bronze. Sponsors fund the festival in exchange for named credit and on-site presence. Custom packages available for local Ellsworth businesses, digital creator brands, and ecosystem brands. Two funding paths: a public path for tax-deductible support administered through New Media Commons (a fiscally sponsored project of Fractured Atlas, 501(c)(3)), or a commercial path direct through ENTERACT for sponsors who do not need a tax receipt. Pick the one that fits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.12] border border-white/[0.12]">
            {SPONSOR_OFFERINGS.map((g) => (
              <TierPanel key={g.category} category={g.category} number={g.number} items={g.items} />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-white/[0.12] bg-[#0d1b2a] p-5">
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase text-gray-400 tracking-[0.18em]">
              Full deck on request / start the conversation
            </span>
            <Link
              href="/sponsor"
              className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-6 py-3 transition-colors"
            >
              Become a sponsor
            </Link>
          </div>
        </div>
      </section>

      {/* Past + upcoming */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Lineage" title="What came before. What's next." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAST_EVENTS.map((e) => (
              <TiltCard key={e.name}>
                <PastEventCard
                  year={e.year}
                  name={e.name}
                  description={e.description}
                  hue={e.hue}
                  status="past"
                />
              </TiltCard>
            ))}
            <TiltCard>
              <PastEventCard
                year="July 2026"
                name="ZAOville"
                description="DMV chapter co-hosted with DCoop (founder of The VEC; performed at ZAO-CHELLA Miami 2024, returning for ZAOstock). Cross-promotion across the ZAO Festivals series. Lineup includes PROF!T, ELYVN, and more."
                hue="emerald"
                status="upcoming"
              />
            </TiltCard>
            <TiltCard>
              <PastEventCard
                year="Oct 2026"
                name="ZAOstock"
                description="Community-built one-day festival in Ellsworth Maine. Part of the 9th Annual Art of Ellsworth during Maine Craft Weekend. Independent artists, one stage, all day."
                hue="amber"
                status="upcoming"
              />
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.12] mt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.2em]">
            ZAOstock / Oct 03 2026 / Ellsworth ME
          </span>
          <div className="flex items-center gap-5">
            <Link href="/onepagers/overview" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 hover:text-[#f5a623] tracking-[0.18em] transition-colors">
              Overview deck
            </Link>
            <Link href="/team" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 hover:text-[#f5a623] tracking-[0.18em] transition-colors">
              Team login
            </Link>
            <Link href="/" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[#f5a623] hover:text-[#ffd700] tracking-[0.18em] transition-colors">
              Live page
            </Link>
          </div>
        </div>
      </footer>

      <StickyActionBar />
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">
        {label}
      </dt>
      <dd className="text-base text-white font-medium mt-0.5">{value}</dd>
    </div>
  );
}
