import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Donate to ZAO Festivals',
  description:
    'Two ways to give: PayPal for fiat or Giveth for crypto. Funds cover artist pay and materials for ZAOstock 2026 in Ellsworth, Maine.',
  openGraph: {
    title: 'Donate to ZAO Festivals',
    description: 'Support ZAOstock 2026. PayPal or Giveth.',
  },
};

const PAYPAL_URL = 'https://paypal.com/paypalme/zaalpanthaki';
const GIVETH_URL = 'https://giveth.io/project/sustaining-zao-festivals-creativity-technology';

const PRESETS = [10, 25, 50, 100];

export default function DonatePage() {
  return (
    <div className="relative min-h-[100dvh] bg-[#0a1628] text-white pb-12">
      {/* Noise overlay - global film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"200\\" height=\\"200\\"><filter id=\\"n\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.9\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%\\" height=\\"100%\\" filter=\\"url(%23n)\\"/></svg>")',
        }}
      />

      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; ZAOstock
          </Link>
          <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">Donate</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-10 space-y-10 relative z-10">
        {/* Hero */}
        <div className="space-y-4">
          <p className="inline-block rounded-full bg-[#f5a623]/10 px-3 py-1 text-xs text-[#f5a623] font-medium border border-[#f5a623]/30 uppercase tracking-[0.18em]">
            Two ways to give
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95]">
            Fund the music.
          </h1>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
            ZAOstock 2026 is a community-built one-day outdoor music festival in Ellsworth, Maine on October 3. Funds cover artist pay and materials for the event. Festival runs at break-even.
          </p>
        </div>

        {/* Amount preset - one-click PayPal with preset amount */}
        <section className="bg-[#0d1b2a] border border-white/[0.08] rounded-2xl p-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              One-tap fiat
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#f5a623]">
              PayPal preset &rarr;
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((n) => (
              <a
                key={n}
                href={`${PAYPAL_URL}/${n}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0a1628] border border-white/[0.12] hover:border-[#f5a623] hover:bg-[#f5a623]/10 hover:scale-[1.03] rounded-lg px-3 py-3 text-center font-bold text-white transition-all"
              >
                ${n}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 mt-3">
            Tap an amount to open PayPal pre-filled. Crypto + custom amounts below.
          </p>
        </section>

        {/* 2-path donate split: 60/40 PayPal primary, Giveth secondary */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* PayPal - primary 7/12 */}
          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-7 bg-gradient-to-br from-[#f5a623]/20 via-[#f5a623]/8 to-transparent border border-[#f5a623]/40 rounded-2xl p-6 sm:p-8 flex flex-col group hover:border-[#f5a623] hover:shadow-[0_0_40px_rgba(245,166,35,0.2)] transition-all"
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#f5a623]">
                Fiat / PayPal
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                Fastest path
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Send via PayPal
            </h2>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              Direct to <span className="text-white font-mono">paypal.me/zaalpanthaki</span>. Card or PayPal balance. Goes straight to project operations.
            </p>
            <div className="flex-1" />
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                30 seconds
              </span>
              <span className="bg-[#f5a623] text-black font-bold px-5 py-3 rounded-lg text-sm group-hover:bg-[#ffd700] transition-colors">
                Send PayPal &rarr;
              </span>
            </div>
          </a>

          {/* Giveth - secondary 5/12 */}
          <a
            href={GIVETH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lg:col-span-5 bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent border border-rose-500/40 rounded-2xl p-6 sm:p-8 flex flex-col group hover:border-rose-400 hover:shadow-[0_0_40px_rgba(244,63,94,0.18)] transition-all"
          >
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-300">
                Crypto / Giveth
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">
                GIVbacks $5+
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Send via Giveth
            </h2>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              Wallet-to-wallet. USDC on Base preferred. Works on Ethereum, Base, Optimism, Polygon, Gnosis, Arbitrum, Celo.
            </p>
            <div className="flex-1" />
            <div className="mt-6 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
                Wallet required
              </span>
              <span className="bg-rose-500 text-white font-bold px-5 py-3 rounded-lg text-sm group-hover:bg-rose-400 transition-colors">
                Send Crypto &rarr;
              </span>
            </div>
          </a>
        </section>

        {/* Trust strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden">
          <TrustTile label="100%" sub="To project operations" />
          <TrustTile label="0 fees" sub="No platform cut on Giveth" />
          <TrustTile label="Verified" sub="Giveth project (since 2024)" />
          <TrustTile label="Break-even" sub="Fair pay, run at cost" />
        </section>

        {/* Stats bento - what's been raised + what's coming */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile value="Year 1" sub="First festival in Maine" />
          <StatTile value="5" sub="Past contributors" />
          <StatTile value="Oct 3" sub="2026 festival day" />
          <StatTile value="Maine" sub="Franklin St Parklet" />
        </section>

        {/* What it's for */}
        <section className="bg-[#0d1b2a] rounded-2xl p-6 border border-white/[0.08] space-y-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5a623] font-bold">
            Where it goes
          </p>
          <p className="text-base text-gray-200 leading-relaxed">
            Funds cover artist pay and materials for the event. Two simple buckets. The city covers production (stage, sound, tents, hospitality) so every dollar here goes to the people performing and what they need on the day.
          </p>
        </section>

        {/* ZAO Festivals lineage */}
        <section className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f5a623] font-bold">
            ZAO Festivals so far
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LineageCard year="Apr 2024" name="ZAO-PALOOZA" where="NYC at NFT NYC" detail="12 artists. Volunteer-organized. Broke even." />
            <LineageCard year="Dec 2024" name="ZAO-CHELLA" where="Miami Wynwood at Art Basel" detail="16+ musicians, 100+ visual artists, ZAO HOUSE residency, live WaveWarZ battle." />
            <LineageCard year="Jul 2026" name="ZAOville" where="DMV — co-hosted with DCoop" detail="Cross-promotion. Lineup includes PROF!T, ELYVN, and more." accent />
            <LineageCard year="Oct 3 2026" name="ZAOstock" where="Ellsworth, Maine" detail="Year 1 in Maine. One-day festival during Maine Craft Weekend." accent />
          </div>
        </section>

        <footer className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
          <span>ZAO Festivals · 2026 · Ellsworth, Maine</span>
          <Link href="/" className="hover:text-[#f5a623] transition-colors">
            zaostock.com &rarr;
          </Link>
        </footer>
      </div>
    </div>
  );
}

function TrustTile({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="bg-[#0d1b2a] p-4 text-center">
      <p className="text-lg font-bold text-white">{label}</p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

function StatTile({ value, sub }: { value: string; sub: string }) {
  return (
    <div className="bg-[#0d1b2a] border border-white/[0.08] rounded-xl p-4">
      <p className="text-3xl sm:text-4xl font-bold text-[#f5a623] tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 mt-2">{sub}</p>
    </div>
  );
}

function LineageCard({ year, name, where, detail, accent }: { year: string; name: string; where: string; detail: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? 'border-[#f5a623]/40 bg-[#f5a623]/[0.04]' : 'border-white/[0.08] bg-[#0d1b2a]'}`}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <p className="font-bold text-white">{name}</p>
        <span className="text-[10px] uppercase tracking-[0.15em] text-[#f5a623]">{year}</span>
      </div>
      <p className="text-xs text-gray-400 mb-2">{where}</p>
      <p className="text-xs text-gray-300 leading-relaxed">{detail}</p>
    </div>
  );
}
