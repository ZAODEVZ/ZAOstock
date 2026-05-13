import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublicMembers, type PublicMember } from '@/lib/members';
import { FactStrip } from '@/components/festival/FactStrip';
import { SectionHeader } from '@/components/festival/SectionHeader';
import { StatTile } from '@/components/festival/StatTile';
import { TierPanel } from '@/components/festival/TierPanel';
import { PastEventCard } from '@/components/festival/PastEventCard';
import { TeamMosaic } from '@/components/festival/TeamMosaic';
import { NoiseOverlay } from '@/components/festival/NoiseOverlay';
import { AnimatedGradient } from '@/components/festival/AnimatedGradient';
import { TiltCard } from '@/components/festival/TiltCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ZAOstock 2026 - The Pitch',
  description:
    'ZAOstock is a one-day community-built outdoor music festival in Ellsworth, Maine on October 3, 2026. Built by The ZAO, a community of 100+ independent musicians. The pitch in one page.',
  openGraph: {
    title: 'ZAOstock 2026 - The Pitch',
    description: 'A one-day community-built outdoor music festival in Ellsworth, Maine. Independent artists. One stage. All day. Free to attend.',
    url: 'https://zaostock.com/pitch',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZAOstock 2026 - The Pitch',
    description: 'A one-day community-built music festival. The pitch in one page.',
  },
};

const HERO_FACTS = [
  { label: 'Date', value: 'Oct 03 2026' },
  { label: 'Venue', value: 'Franklin St Parklet' },
  { label: 'City', value: 'Ellsworth ME' },
  { label: 'Entry', value: 'Free' },
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

const PARTNERS = [
  { name: 'Heart of Ellsworth', role: 'Local promotion + Maine Craft Weekend coordination' },
  { name: 'Town of Ellsworth', role: 'Parklet venue' },
  { name: 'New Media Commons (via Fractured Atlas)', role: 'Fiscal sponsorship infrastructure for eligible initiatives' },
  { name: 'ENTERACT', role: 'Production + operational support' },
  { name: 'Web3Metal', role: 'Partnership integration + community surface' },
];

const PLUG_IN_DOORS = [
  {
    label: 'Musicians',
    pitch: 'Submit for the lineup. 25-minute set, real stage, full recording. Submissions close Sep 3.',
    href: '/musicians',
  },
  {
    label: 'Artists',
    pitch: 'Visual artists - we are taking interest. Bring posters, signage, photography, motion. Email to talk.',
    href: '/artists',
  },
  {
    label: 'Organizers',
    pitch: 'Run your own ZAO in your city. Next chapter under the ZAO Festivals umbrella.',
    href: '/event-organizers',
  },
  {
    label: 'Sponsors',
    pitch: 'Three tracks (Main Stage / Broadcast / Year-Round). Two funding paths - tax-deductible or commercial.',
    href: '/sponsor',
  },
  {
    label: 'Supporters',
    pitch: 'Free to attend. Pro Ticket $50 (20 spots round 1) includes a 1:1 with the team and a real way to plug in.',
    href: '/#pro-ticket',
  },
];

export default async function PitchPage() {
  const publicMembers = await getPublicMembers();
  const typedMembers: PublicMember[] = publicMembers;

  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-24 sm:pb-12 font-[family-name:var(--font-display)]">
      <NoiseOverlay />
      <AnimatedGradient />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="font-bold text-base tracking-tight">ZAOstock</Link>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.2em] hidden sm:inline">
              / The Pitch / Oct 03 2026
            </span>
          </div>
          <nav className="flex items-center gap-5">
            <Link
              href="/"
              className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-[#f5a623] transition-colors"
            >
              ← Festival page
            </Link>
            <a
              href="mailto:info@thezao.com?subject=ZAOstock%20Pitch%20Followup"
              className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[#f5a623] hover:text-[#ffd700] transition-colors"
            >
              Email us
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
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
              The Pitch / One Page / Share Anywhere
            </span>
          </div>
          <h1
            className="font-bold tracking-[-0.04em] leading-[0.9]"
            style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
          >
            A community-built music festival
            <br />
            <span className="text-[#f5a623]">that paid for itself.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-lg sm:text-2xl text-gray-300 leading-relaxed">
            ZAOstock 2026 is the third chapter in the ZAO Festivals series. PALOOZA in NYC and CHELLA in Miami broke even.
            Now we are taking the model to Ellsworth, Maine - on the road to Acadia, during Maine Craft Weekend.
          </p>
          <div className="mt-10">
            <FactStrip facts={HERO_FACTS} />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-6 py-4 transition-colors"
            >
              See the festival page
            </Link>
            <a
              href="mailto:info@thezao.com?subject=ZAOstock%20Conversation"
              className="border border-white/30 hover:border-[#f5a623] hover:text-[#f5a623] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-6 py-4 transition-colors"
            >
              Start a conversation
            </a>
          </div>
        </div>
      </section>

      {/* What ZAOstock Is */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="What it is" title="One stage. All day. Free to listen." />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6">
            <div className="lg:col-span-7 space-y-5">
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                A one-day outdoor music festival at the Franklin Street Parklet in downtown Ellsworth, Maine. Independent artists with DJs between every act. Part of the 9th annual Art of Ellsworth during Maine Craft Weekend.
              </p>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                Free to attend. A $50 Pro Ticket (20 spots in round 1) is optional - buyers get a 1:1 with the team and a real way to plug in.
              </p>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                Built by 27 teammates and 100+ ZAO community members. Run at break-even.
              </p>
            </div>
            <div className="lg:col-span-5 lg:pl-8 lg:border-l border-white/[0.12]">
              <dl className="space-y-5">
                {[
                  { k: 'Date', v: 'Saturday October 3, 2026' },
                  { k: 'Time', v: '12 PM - 6 PM Eastern' },
                  { k: 'Location', v: 'Franklin St Parklet, Ellsworth Maine' },
                  { k: 'Series', v: '9th Annual Art of Ellsworth' },
                  { k: 'Weekend', v: 'Maine Craft Weekend' },
                ].map((row) => (
                  <div key={row.k} className="flex flex-col gap-1 pb-4 border-b border-white/[0.08]">
                    <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">{row.k}</dt>
                    <dd className="text-base sm:text-lg text-white">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Lineage proof */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="The Lineage" title="What came before. Both broke even." />
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-3xl mt-3 mb-8">
            The ZAO Festivals series tested the model in two cities before Ellsworth. PALOOZA proved community could volunteer-organize a real festival in 6 weeks. CHELLA proved the model scales across communities and IP rails.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TiltCard>
              <PastEventCard
                year="NYC · Apr 2024"
                name="ZAO-PALOOZA"
                description="Community meet-up during NFT NYC. 12 artists. Volunteer-organized in six weeks. Broke even."
                hue="rose"
                status="past"
              />
            </TiltCard>
            <TiltCard>
              <PastEventCard
                year="Miami · Dec 2024"
                name="ZAO-CHELLA"
                description="Showcase in Wynwood during Art Basel. 16+ musicians, 100+ visual artists, 50+ music communities. ZAO HOUSE artist residency. Live WaveWarZ battle, cipher recorded on-site."
                hue="indigo"
                status="past"
              />
            </TiltCard>
            <TiltCard>
              <PastEventCard
                year="DMV · Jul 2026"
                name="ZAOville"
                description="DMV chapter co-hosted with DCoop (founder of The VEC; performed at CHELLA 2024, returning for ZAOstock). Cross-promotion across the series. Lineup includes PROF!T, ELYVN, and more."
                hue="emerald"
                status="upcoming"
              />
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Why Ellsworth */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Why Ellsworth" title="The crossroads of Downeast Maine." />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                Ellsworth sits at the gateway to Acadia National Park. The downtown received National Historic Register designation. The Heart of Ellsworth runs the Art of Ellsworth series, now in its 9th annual year.
              </p>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                Population 8,000. Awareness goal: 4,000 residents have heard of ZAOstock before October 3. The infrastructure to support a festival here already exists - we are plugging into it.
              </p>
            </div>
            <div className="lg:col-span-5 lg:pl-8 lg:border-l border-white/[0.12]">
              <dl className="space-y-5">
                {[
                  { k: 'Town population', v: '8,000' },
                  { k: 'Status', v: 'National Historic Register' },
                  { k: 'Host series', v: 'Art of Ellsworth' },
                  { k: 'Year', v: '9th annual' },
                  { k: 'Awareness goal', v: '4,000 residents pre-event' },
                ].map((row) => (
                  <div key={row.k} className="flex flex-col gap-1 pb-4 border-b border-white/[0.08]">
                    <dt className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.18em]">{row.k}</dt>
                    <dd className="text-base sm:text-lg text-white">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="The Numbers" title="What is real, today." />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.12] border border-white/[0.12] mt-6">
            <StatTile value="27" label="Teammates building this" accent />
            <StatTile value="100+" label="ZAO community members" />
            <StatTile value="2" label="Prior festivals broke even (NYC + Miami)" />
            <StatTile value="501(c)(3)" label="Funding infrastructure via NMC / Fractured Atlas" />
          </div>
        </div>
      </section>

      {/* The model */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="The Model" title="Four ways the festival gets funded." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.12] border border-white/[0.12] mt-6">
            <div className="bg-[#0d1b2a] p-6 sm:p-8">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[#f5a623]">01 / Attendees</span>
              <p className="font-bold text-white text-xl tracking-tight mt-3">Free entry</p>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                The festival is free to attend. Sidewalk listening always free. Parklet entry free. We are not gatekeeping music.
              </p>
            </div>
            <div className="bg-[#0d1b2a] p-6 sm:p-8">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[#f5a623]">02 / Pro Ticket</span>
              <p className="font-bold text-white text-xl tracking-tight mt-3">$50 - 20 spots</p>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Round 1 capped at 20. Pro Ticket buyers get a 1:1 with the team and a real way to plug in. Direct support for artist pay.
              </p>
            </div>
            <div className="bg-[#0d1b2a] p-6 sm:p-8">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[#f5a623]">03 / Sponsors</span>
              <p className="font-bold text-white text-xl tracking-tight mt-3">3 tracks</p>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Main Stage, Broadcast, Year-Round. Two paths: tax-deductible via NMC/Fractured Atlas, or commercial via ENTERACT. Custom packages for local + national.
              </p>
            </div>
            <div className="bg-[#0d1b2a] p-6 sm:p-8">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[#f5a623]">04 / Partners</span>
              <p className="font-bold text-white text-xl tracking-tight mt-3">Time + venue</p>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Partners give time, venue, and infrastructure - not cash. Named credit in exchange. 5 partners locked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Money flow detail */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Two-Path Money Flow" title="Tax-deductible or commercial. Pick the one that fits." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.12] border border-white/[0.12] mt-6">
            <div className="bg-[#0d1b2a] p-7 sm:p-9">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[#f5a623]">Public Path</span>
              <p className="font-bold text-white text-xl tracking-tight mt-3">Tax-deductible donation</p>
              <p className="text-sm sm:text-base text-gray-300 mt-3 leading-relaxed">
                Donor pays Fractured Atlas (501(c)(3)). FA takes admin (6-8%). Funds flow to New Media Commons (the fiscally sponsored project of FA). NMC routes production funds to ENTERACT (2% treasury fee). ENTERACT executes the production.
              </p>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                Sponsor gets a tax receipt. Best for donors who need the deduction.
              </p>
            </div>
            <div className="bg-[#0d1b2a] p-7 sm:p-9">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[#f5a623]">Commercial Path</span>
              <p className="font-bold text-white text-xl tracking-tight mt-3">Direct via ENTERACT</p>
              <p className="text-sm sm:text-base text-gray-300 mt-3 leading-relaxed">
                Client pays ENTERACT directly. 50% upfront, 50% before delivery. ENTERACT takes 2% treasury fee. Production executes against the brief.
              </p>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                No tax receipt. Best for commercial sponsors who do not need the deduction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor tracks detail */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Sponsor Tracks" title="Same level of recognition. Pick by what fits your goals." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.12] border border-white/[0.12] mt-6">
            {SPONSOR_OFFERINGS.map((g) => (
              <TierPanel key={g.category} category={g.category} number={g.number} items={g.items} />
            ))}
          </div>
        </div>
      </section>

      {/* Confirmed partners */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="Confirmed Partners" title="Five locked. More in conversation." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.12] border border-white/[0.12] mt-6">
            {PARTNERS.map((p) => (
              <div key={p.name} className="bg-[#0d1b2a] p-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#f5a623]">Confirmed</span>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-gray-600">/CFM</span>
                </div>
                <p className="font-bold text-white text-lg tracking-tight">{p.name}</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="The Team" title="Built by these people." />
          <TeamMosaic members={typedMembers} />
          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-600 tracking-[0.18em] mt-5">
            Tap any name for full bio + links
          </p>
        </div>
      </section>

      {/* Plug in */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow="How To Plug In" title="Five doors. Pick yours." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.12] border border-white/[0.12] mt-6">
            {PLUG_IN_DOORS.map((d) => (
              <Link
                key={d.label}
                href={d.href}
                className="group bg-[#0d1b2a] hover:bg-[#0f1f33] p-6 sm:p-8 transition-colors"
              >
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[#f5a623]">{d.label}</span>
                <p className="text-sm text-gray-300 mt-3 leading-relaxed group-hover:text-white transition-colors">
                  {d.pitch}
                </p>
                <span className="inline-block mt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[#f5a623]">
                  See the door -&gt;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="my-16 sm:my-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="border border-[#f5a623]/30 bg-[#0d1b2a] p-8 sm:p-12">
            <SectionHeader eyebrow="Start a conversation" title="Write us. We respond." />
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mt-4 max-w-3xl">
              ZAOstock is moving. The festival is October 3, 2026. The lineup window closes September 3. Sponsor and partner conversations are happening now. If any of this lands, write us.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="mailto:info@thezao.com?subject=ZAOstock%20Conversation"
                className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-7 py-4 transition-colors"
              >
                info@thezao.com
              </a>
              <Link
                href="/"
                className="border border-white/30 hover:border-[#f5a623] hover:text-[#f5a623] font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] px-7 py-4 transition-colors"
              >
                See the festival page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.12] mt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-wrap items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.2em]">
            ZAOstock / Oct 03 2026 / Ellsworth ME / The Pitch
          </span>
          <div className="flex items-center gap-5 flex-wrap">
            <Link href="/musicians" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 hover:text-[#f5a623] tracking-[0.18em] transition-colors">Musicians</Link>
            <Link href="/artists" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 hover:text-[#f5a623] tracking-[0.18em] transition-colors">Artists</Link>
            <Link href="/event-organizers" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 hover:text-[#f5a623] tracking-[0.18em] transition-colors">Organizers</Link>
            <Link href="/sponsor" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 hover:text-[#f5a623] tracking-[0.18em] transition-colors">Sponsor</Link>
            <Link href="/" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-400 hover:text-[#f5a623] tracking-[0.18em] transition-colors">Festival page</Link>
            <a href="https://thezao.com" target="_blank" rel="noopener noreferrer" className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-[#f5a623] hover:text-[#ffd700] tracking-[0.18em] transition-colors">The ZAO</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
