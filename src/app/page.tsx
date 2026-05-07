import { Metadata } from 'next';
import Link from 'next/link';
import { CountdownTimer } from '@/components/CountdownTimer';
import { RSVPForm } from './RSVPForm';
import { getPublicMembers, getStockCounts, type PublicMember } from '@/lib/members';
import { PublicTeamGrid } from './PublicTeamGrid';
import { NoiseOverlay } from '@/components/festival/NoiseOverlay';
import { AnimatedGradient } from '@/components/festival/AnimatedGradient';
import { TagMarquee } from '@/components/festival/TagMarquee';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ZAOstock | Community Music Festival',
  description:
    'ZAOstock — a community-built outdoor music festival in Ellsworth, Maine. October 3, 2026 at the Franklin Street Parklet.',
  openGraph: {
    title: 'ZAOstock | Community Music Festival',
    description:
      'ZAOstock — a community-built outdoor music festival in Ellsworth, Maine. October 3, 2026.',
    images: ['/images/festivals/zao-stock-logo.jpeg'],
  },
};

// Festival date — October 3, 2026, 12pm ET
const FESTIVAL_DATE = '2026-10-03T12:00:00-04:00';

const SPONSOR_OFFERINGS = [
  { category: 'Main Stage Partner', items: [
    'Named credit on stage banner and signage',
    'Booth or table space on-site',
    'Welcome bag inclusion',
    'Live verbal credit during the event',
    'Co-presented in all printed materials',
  ]},
  { category: 'Broadcast Partner', items: [
    'Named credit on festival website with backlink',
    'Livestream overlay credit',
    'Sponsored segment plus interview feature',
    'Social campaign across Farcaster, X, and Bluesky',
    'Newsletter credit (400+ editions)',
  ]},
  { category: 'Year-Round Partner', items: [
    'Post-event thank-you feature and recap',
    'Advisory seat for Year 2 planning',
    'Priority placement in 2027',
    'Eligible support administered through New Media Commons, a fiscally sponsored project of Fractured Atlas',
  ]},
];

const ZAO_FESTIVALS = [
  {
    name: 'ZAO-PALOOZA',
    when: 'NYC · Apr 2024',
    description: 'Community meet-up in New York during NFT NYC. 12 artists. Volunteer-organized in six weeks. Broke even.',
  },
  {
    name: 'ZAO-CHELLA',
    when: 'Miami · Dec 2024',
    description: 'Showcase in Wynwood during Art Basel Miami. 16+ musicians, 100+ visual artists, 50+ music communities. ZAO HOUSE artist residency for performers and organizers. Live WaveWarZ battle, cipher recorded on-site.',
  },
  {
    name: 'ZAOville',
    when: 'DMV · Jul 2026',
    description: 'DMV chapter co-hosted with DCoop (founder of The Village Entertainment Collective; performed at ZAO-CHELLA Miami 2024, returning for ZAOstock). Cross-promotion across the ZAO Festivals series. Lineup includes PROF!T, ELYVN, and more.',
  },
  {
    name: 'ZAOstock',
    when: 'Ellsworth ME · Oct 3 2026',
    description: 'Community-built one-day outdoor music festival at the Franklin Street Parklet. Part of the 9th Annual Art of Ellsworth during Maine Craft Weekend.',
  },
];

const PARTNERS = [
  { name: 'Heart of Ellsworth', role: 'Local promotion + Maine Craft Weekend coordination', confirmed: true },
  { name: 'Town of Ellsworth', role: 'Parklet venue', confirmed: true },
  { name: 'New Media Commons (via Fractured Atlas)', role: 'Fiscal sponsorship infrastructure for eligible initiatives', confirmed: true },
  { name: 'ENTERACT', role: 'Production + operational support', confirmed: true },
].filter((p) => p.confirmed);

export default async function StockPage() {
  const [publicMembers, counts] = await Promise.all([
    getPublicMembers(),
    getStockCounts(),
  ]);
  const typedMembers: PublicMember[] = publicMembers;

  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-12">
      <NoiseOverlay />
      <AnimatedGradient />
      {/* Simple public header */}
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">ZAOstock</h1>
            <p className="text-xs text-gray-400">Community Music Festival</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/program"
              className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors"
            >
              Program
            </Link>
            <Link
              href="/suggest"
              className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors"
            >
              Suggest
            </Link>
            <Link
              href="/apply"
              className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors"
            >
              Volunteer
            </Link>
            <Link
              href="/donate"
              className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/sponsor/deck"
              className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors"
            >
              Partner
            </Link>
            <Link
              href="/stock#team"
              className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors"
            >
              Team
            </Link>
            <Link
              href="/"
              className="text-sm text-[#f5a623] hover:text-[#ffd700] transition-colors"
          >
            The ZAO
          </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5a623]/[0.06] via-[#0a1628]/85 to-[#0a1628]" />
        <div className="relative max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
          <div className="inline-block rounded-full bg-[#f5a623]/15 px-4 py-1.5 text-sm text-[#f5a623] font-medium border border-[#f5a623]/40 backdrop-blur-sm">
            October 3, 2026
          </div>
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tight">ZAOstock</h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-md mx-auto">
            A community-built outdoor music festival in Ellsworth, Maine. Independent artists. One stage. All day.
          </p>
          <p className="text-sm text-gray-400">
            Franklin Street Parklet &middot; 12pm&ndash;6pm &middot; Part of Art of Ellsworth
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/donate"
              className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-5 py-2.5 text-sm transition-colors"
            >
              Donate
            </Link>
            <Link
              href="/apply"
              className="border border-white/30 hover:border-[#f5a623] hover:text-[#f5a623] text-white font-bold rounded-lg px-5 py-2.5 text-sm transition-colors"
            >
              Volunteer
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* Countdown */}
        <div className="bg-[#0d1b2a] rounded-xl p-6 border border-white/[0.08]">
          <CountdownTimer targetDate={FESTIVAL_DATE} eventName="ZAOstock" />
        </div>

      </div>

      {/* Festival vibes tag marquee — full-bleed */}
      <TagMarquee
        tags={[
          'Independent artists',
          'Year 1 in Maine',
          'Oct 3 2026',
          'Franklin St Parklet',
          'Maine Craft Weekend',
          'Art of Ellsworth',
          'Free to listen',
          'Community-built',
          'Break-even',
          'Run by The ZAO',
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* About */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">About the Festival</p>
          <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
            <p className="text-sm text-gray-300 leading-relaxed">
              ZAOstock is The ZAO&apos;s flagship IRL music festival &mdash; a full-day outdoor showcase at the
              Franklin Street Parklet in downtown Ellsworth, Maine. Independent artists perform with DJs between.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Part of the 9th Annual Art of Ellsworth during Maine Craft Weekend, ZAOstock brings the
              decentralized music community together in the &ldquo;Crossroads of Downeast&rdquo; &mdash; where
              every car heading to Acadia National Park passes through.
            </p>
          </div>
        </section>

        {/* Community Ethos */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">How We Run It</p>
          <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1 text-gray-300">Operates at break-even</span>
              <span className="text-xs bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1 text-gray-300">Volunteer opportunities</span>
              <span className="text-xs bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1 text-gray-300">Fair artist pay</span>
              <span className="text-xs bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1 text-gray-300">Community-built</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              ZAOstock is built by the community for the community. Every dollar raised covers artist pay and materials for the event.
            </p>
          </div>
        </section>

        {/* Lineup */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">Lineup</p>
          <div className="bg-[#0d1b2a] rounded-xl border border-white/[0.08] p-5 text-center">
            <p className="text-sm text-gray-300">Full lineup coming soon</p>
            <p className="text-xs text-gray-500 mt-1">Independent artists with DJs between</p>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="space-y-3 scroll-mt-20">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">The Team</p>
          <PublicTeamGrid members={typedMembers} />
          <p className="text-[11px] text-gray-600 italic px-1">
            Tap any name for their full bio and links.
          </p>
        </section>

        {/* Partners */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">Partners</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PARTNERS.map((partner) => (
              <div key={partner.name} className="bg-[#0d1b2a] rounded-xl p-4 border border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white text-sm">{partner.name}</p>
                  {partner.confirmed && (
                    <span className="text-[10px] text-[#f5a623] bg-[#f5a623]/10 rounded-full px-1.5 py-0.5">Confirmed</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{partner.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Volunteer CTA */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">Join The Crew</p>
          <div className="bg-gradient-to-br from-[#f5a623]/15 via-[#f5a623]/5 to-transparent rounded-xl p-5 border border-[#f5a623]/30">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-white">Volunteer at ZAOstock</p>
                <p className="text-sm text-gray-300 mt-1">
                  Festival built by the community. Setup, check-in, stage crew, content, teardown, or anything in between - sign up below.
                </p>
              </div>
              {counts.volunteers > 0 && (
                <div className="flex-shrink-0 text-right">
                  <p className="text-2xl font-bold text-[#f5a623]">{counts.volunteers}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">signed up</p>
                </div>
              )}
            </div>
            <Link
              href="/apply"
              className="inline-block bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-4 py-2.5 text-sm transition-colors mt-4"
            >
              Sign up to volunteer -&gt;
            </Link>
          </div>
        </section>

        {/* RSVP */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">RSVP</p>
          <div className="bg-gradient-to-r from-[#f5a623]/10 to-[#ffd700]/5 rounded-xl p-5 border border-[#f5a623]/30">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-white">Get Notified</p>
                <p className="text-sm text-gray-400 mt-1">
                  Be the first to know when tickets drop, the lineup is announced, and more.
                </p>
              </div>
              {counts.rsvps > 0 && (
                <div className="flex-shrink-0 text-right">
                  <p className="text-2xl font-bold text-[#f5a623]">{counts.rsvps}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">on the list</p>
                </div>
              )}
            </div>
            <RSVPForm eventSlug="zao-stock-2026" />
          </div>
        </section>

        {/* Sponsorship */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">Partner With Us</p>
          <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-2">
            <p className="text-sm text-gray-300 leading-relaxed">
              No Gold / Silver / Bronze. Partners get named credit for the role they play: Main Stage Partner, Broadcast Partner, or Year-Round Partner. Three paths, plus flexible custom packages for Local Ellsworth businesses, digital creator brands, and ecosystem partners. Tax-deductible support for qualifying ZAO Festival initiatives may be administered through New Media Commons, a fiscally sponsored project of Fractured Atlas, in coordination with ENTERACT.
            </p>
            <p className="text-xs text-gray-500">
              Full deck on request &middot; Reach out to start the conversation
            </p>
          </div>
          <div className="space-y-3">
            {SPONSOR_OFFERINGS.map((group) => (
              <div key={group.category} className="bg-[#0d1b2a] rounded-xl border border-white/[0.08] overflow-hidden">
                <div className="bg-gradient-to-r from-[#f5a623]/20 to-transparent px-4 py-2.5">
                  <span className="font-bold text-sm text-[#f5a623]">{group.category}</span>
                </div>
                <ul className="px-4 py-3 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-[#f5a623] mt-0.5">&#8226;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ZAO Festivals series */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">ZAO Festivals</p>
          <div className="space-y-3">
            {ZAO_FESTIVALS.map((event) => (
              <div key={event.name} className="bg-[#0d1b2a] rounded-xl p-4 border border-white/[0.08]">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <p className="font-bold text-white">{event.name}</p>
                  <span className="text-[10px] text-[#f5a623] uppercase tracking-wider">{event.when}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{event.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fundraising Links */}
        <section className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider px-1">Support ZAOstock</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#0d1b2a] rounded-xl p-4 border border-white/[0.08] opacity-60">
              <p className="font-medium text-white text-sm">Giveth Campaign</p>
              <p className="text-xs text-gray-500 mt-1">Coming soon</p>
            </div>
            <div className="bg-[#0d1b2a] rounded-xl p-4 border border-white/[0.08] opacity-60">
              <p className="font-medium text-white text-sm">GoFundMe Campaign</p>
              <p className="text-xs text-gray-500 mt-1">Coming soon</p>
            </div>
          </div>
        </section>

        {/* Footer: team login */}
        <footer className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-600">
          <span>ZAOstock &middot; Oct 3, 2026 &middot; Ellsworth ME</span>
          <Link href="/team" className="hover:text-[#f5a623] transition-colors">
            Team dashboard login -&gt;
          </Link>
        </footer>
      </div>
    </div>
  );
}
