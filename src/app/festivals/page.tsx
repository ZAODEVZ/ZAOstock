import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { InstagramEmbed } from './InstagramEmbed';

// Deferred: react-tweet ships real client-side weight, and TWEETS below is
// currently empty (all entries commented out) - no reason to include it in
// this page's bundle until there's an actual tweet ID to render.
const Tweet = dynamic(() => import('react-tweet').then((m) => m.Tweet));

export const metadata: Metadata = {
  title: 'ZAO Festivals',
  description:
    'ZAO Festivals is The ZAO\'s series of community-owned, artist-built music festivals - free to attend, artists paid fairly, the crowd that funds it owns it. Flagship: ZAOstock 2026, Ellsworth, Maine.',
  openGraph: {
    title: 'ZAO Festivals',
    description:
      'A series of community-owned, artist-built music festivals. Free, fair, owned by the people who show up. Flagship: ZAOstock 2026.',
    url: 'https://zaostock.com/festivals',
    type: 'website',
  },
};

interface Chapter {
  name: string;
  place: string;
  year: string;
  note: string;
  href?: string;
  status: 'past' | 'next' | 'flagship';
}

// The ZAO Festivals series. Details from ZAO's own festival history (see ZAOOS memory).
const SERIES: Chapter[] = [
  { name: 'ZAO-PALOOZA', place: 'New York City', year: 'Apr 2024', note: 'During NFT NYC - 12 artists, the community’s first IRL meetup. Broke even.', href: '#recap', status: 'past' },
  { name: 'ZAO-CHELLA', place: 'Wynwood, Miami', year: 'Dec 2024', note: 'During Art Basel, in Wynwood - 16+ musicians, WaveWarZ LIVE, AR art, cross-community.', href: '#recap', status: 'past' },
  { name: 'ZAOville', place: 'DMV', year: 'Jul 2026', note: 'Co-hosted with DCoop + The VEC - open mic, live sets, DJ night swim.', href: '/zaoville', status: 'next' },
  { name: 'ZAOstock', place: 'Ellsworth, Maine', year: 'Oct 3, 2026', note: 'The flagship - free, all-day, downtown, gateway to Acadia.', href: '/', status: 'flagship' },
];

interface Principle {
  k: string;
  t: string;
  b: string;
}

const PRINCIPLES: Principle[] = [
  { k: '01', t: 'Artist-built', b: 'The lineup and the day are built by the artists and the community, not a promoter extracting margin. Curated by the people in the room.' },
  { k: '02', t: 'Community-owned', b: 'The crowd that funds it owns it. We treat a festival as a protocol, not a product - open, shared, repeatable by anyone.' },
  { k: '03', t: 'Free + fair', b: 'Free to attend. Artists paid fairly and transparently. Built in public, every step shared.' },
];

// X posts to embed. Add the tweet ID (the number at the end of an x.com/<user>/status/<ID> link).
// Photos + videos render inline. Newest first.
const TWEETS: string[] = [
  // '1234567890123456789',
];

// Instagram posts/reels to embed. Paste the full permalink (https://www.instagram.com/reel/<id>/ or /p/<id>/).
// This is where the real ZAO-CHELLA / ZAO-PALOOZA recap media lives (@zaofestivals).
const INSTAGRAM: string[] = [
  'https://www.instagram.com/reel/DDa-oPBJ7G7/', // ZAO-CHELLA 2024 Miami recap ("you can feel the love")
  'https://www.instagram.com/reel/DDLVvNuu5_3/', // ZAO-CHELLA 2024 "Future of Art & Technology" (wristkeyglobal coverage)
];

const STATUS_STYLE: Record<Chapter['status'], string> = {
  past: 'border-white/15 bg-white/[0.03] text-gray-400',
  next: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  flagship: 'border-[#f5a623]/50 bg-[#f5a623]/10 text-[#f5a623]',
};

export default function FestivalsPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-20">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623] transition-colors">
            &larr; ZAOstock
          </Link>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-gray-500 tracking-[0.2em]">
            ZAO Festivals
          </span>
          <a
            href="https://thezao.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#f5a623] hover:text-[#ffd700] transition-colors"
          >
            The ZAO
          </a>
        </div>
      </header>

      {/* Full-bleed series hero. SWAP the photo for a wide crowd/stage shot
          that represents the series as a whole (currently a past-event
          placeholder) — no code change needed. */}
      <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
        <Image src="/zao/wavewarz-banner.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-[0.5]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/55 to-[#0a1628]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/85 via-[#0a1628]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-8">
            <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[#f5a623]">
              The series
            </div>
            <h1 className="mt-3 text-4xl sm:text-6xl font-bold leading-[1.02] tracking-tight">
              ZAO Festivals
            </h1>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-5 sm:px-8">
        {/* Hero intro */}
        <section className="pt-10 pb-10">
          <p className="max-w-2xl text-lg text-gray-300 leading-relaxed">
            ZAO Festivals is The ZAO&apos;s series of community-owned, artist-built music festivals. Free to
            attend, artists paid fairly, and the crowd that funds it owns it. We have thrown them in New York and
            Miami, we are throwing one in the DMV this summer, and our flagship lands in Maine this October.
          </p>
          <p className="mt-3 max-w-2xl text-gray-400 leading-relaxed">
            <span className="text-white font-semibold">ZAO Festivals presents ZAOstock</span> - one umbrella,
            many events, one DNA.
          </p>
        </section>

        {/* Principles */}
        <section className="py-8 border-t border-white/[0.08]">
          <div className="grid gap-4 sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.k} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-[#f5a623]">{p.k}</div>
                <div className="mt-2 font-semibold">{p.t}</div>
                <div className="mt-1 text-sm text-gray-400 leading-relaxed">{p.b}</div>
              </div>
            ))}
          </div>
        </section>

        {/* The series timeline */}
        <section className="py-8 border-t border-white/[0.08]">
          <h2 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-gray-500">
            The chapters
          </h2>
          <div className="mt-4 space-y-2">
            {SERIES.map((c) => {
              const inner = (
                <div
                  className={`rounded-xl border p-4 transition-colors ${STATUS_STYLE[c.status]} ${c.href ? 'hover:border-[#f5a623]/60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                      <span className="font-semibold text-white">{c.name}</span>
                      <span className="text-sm text-gray-400">{c.place}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {c.status === 'flagship' && (
                        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[#f5a623]">
                          flagship
                        </span>
                      )}
                      <span className="font-[family-name:var(--font-mono)] text-[11px] text-gray-400">{c.year}</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-400 leading-relaxed">{c.note}</p>
                </div>
              );
              return c.href ? (
                <Link key={c.name} href={c.href} className="block">
                  {inner}
                </Link>
              ) : (
                <div key={c.name}>{inner}</div>
              );
            })}
          </div>
        </section>

        {/* Flagship: ZAOstock */}
        <section className="py-8 border-t border-white/[0.08]">
          <h2 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-gray-500">
            This year&apos;s flagship
          </h2>
          <div className="mt-4 rounded-2xl border border-[#f5a623]/30 bg-gradient-to-br from-[#f5a623]/10 to-transparent p-6">
            <h3 className="text-2xl font-bold">ZAOstock 2026</h3>
            <p className="mt-2 text-gray-300 leading-relaxed">
              A free, one-day, artist-built music festival in downtown Ellsworth, Maine - Saturday October 3,
              part of Art of Ellsworth weekend, at the gateway to Acadia. Independent artists, one stage, free
              to listen from the sidewalk.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/"
                className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] px-4 py-2.5 rounded transition-colors"
              >
                ZAOstock 2026
              </Link>
              <Link
                href="/sponsor"
                className="border border-white/20 hover:border-[#f5a623]/50 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] px-4 py-2.5 rounded transition-colors"
              >
                Sponsor
              </Link>
              <Link
                href="/musicians"
                className="border border-white/20 hover:border-[#f5a623]/50 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] px-4 py-2.5 rounded transition-colors"
              >
                Play it
              </Link>
            </div>
          </div>
        </section>

        {/* From the festivals - photos + videos (Instagram + X) */}
        {(TWEETS.length > 0 || INSTAGRAM.length > 0) && (
          <section id="recap" className="py-8 border-t border-white/[0.08] scroll-mt-16">
            <h2 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-gray-500">
              From the festivals
            </h2>
            {INSTAGRAM.length > 0 && <div className="mt-4"><InstagramEmbed urls={INSTAGRAM} /></div>}
            {TWEETS.length > 0 && (
              <div data-theme="dark" className="mt-4 flex flex-col items-center gap-4">
                {TWEETS.map((id) => (
                  <Tweet key={id} id={id} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Get involved */}
        <section className="py-8 border-t border-white/[0.08]">
          <h2 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-gray-500">
            Be part of it
          </h2>
          <p className="mt-3 text-gray-400 leading-relaxed">
            Bring a festival to your city, sponsor one, play one, or build with us. ZAO Festivals is a model
            anyone can run - the goal is more community-owned culture in more places.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em]">
            <Link href="/event-organizers" className="text-gray-300 hover:text-[#f5a623] transition-colors">Organize -&gt;</Link>
            <Link href="/sponsor" className="text-gray-300 hover:text-[#f5a623] transition-colors">Sponsor -&gt;</Link>
            <Link href="/zaoville" className="text-gray-300 hover:text-[#f5a623] transition-colors">ZAOville -&gt;</Link>
            <a href="https://thezao.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#f5a623] transition-colors">The ZAO -&gt;</a>
          </div>
        </section>
      </main>
    </div>
  );
}
