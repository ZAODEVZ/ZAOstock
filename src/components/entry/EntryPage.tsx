import Link from 'next/link';
import { NoiseOverlay } from '@/components/festival/NoiseOverlay';
import { AnimatedGradient } from '@/components/festival/AnimatedGradient';
import { SectionHeader } from '@/components/festival/SectionHeader';

export interface EntryPageCTA {
  label: string;
  href: string;
  primary?: boolean;
}

export interface EntryPageProps {
  /** "musicians", "artists", "event-organizers" - shown as eyebrow + slug */
  personaSlug: string;
  /** Display label for the persona, e.g. "Musicians" */
  personaLabel: string;
  /** Big hero headline */
  hero: string;
  /** One-line subhead under the hero */
  subhead: string;
  /** "What you get" bullet list */
  youGet: string[];
  /** "What we ask" bullet list */
  weAsk: string[];
  /** Action CTAs at bottom of page */
  ctas: EntryPageCTA[];
  /** Optional final note (e.g. eligibility, deadline) */
  footnote?: string;
}

export function EntryPage(props: EntryPageProps) {
  const { personaSlug, personaLabel, hero, subhead, youGet, weAsk, ctas, footnote } = props;

  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-24 sm:pb-12 font-[family-name:var(--font-display)]">
      <NoiseOverlay />
      <AnimatedGradient />

      <div className="relative">
        <header className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">
              ZAO<span className="text-[#f5a623]">stock</span>
            </span>
          </Link>
          <Link
            href="/"
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-gray-400 hover:text-white transition-colors"
          >
            ← Home
          </Link>
        </header>

        <section className="max-w-5xl mx-auto px-5 sm:px-8 mt-12 sm:mt-20">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[#f5a623]">
            For / {personaLabel}
          </span>
          <h1
            className="mt-4 font-bold tracking-[-0.02em] leading-[1.05]"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
          >
            {hero}
          </h1>
          <p className="mt-6 max-w-3xl text-lg sm:text-xl text-gray-300 leading-relaxed">
            {subhead}
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-5 sm:px-8 mt-16 sm:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/[0.12] border border-white/[0.12]">
            <div className="bg-[#0d1b2a] p-7 sm:p-9">
              <SectionHeader eyebrow="What you get" title="If you plug in" />
              <ul className="space-y-3 text-base text-gray-200 leading-relaxed">
                {youGet.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#f5a623] flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0d1b2a] p-7 sm:p-9">
              <SectionHeader eyebrow="What we ask" title="In return" />
              <ul className="space-y-3 text-base text-gray-200 leading-relaxed">
                {weAsk.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-[#f5a623] flex-shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-5 sm:px-8 mt-16 sm:mt-24">
          <SectionHeader eyebrow="How to plug in" title="Pick a door" align="center" />
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 mt-6">
            {ctas.map((cta, i) => (
              <Link
                key={i}
                href={cta.href}
                className={
                  cta.primary
                    ? 'inline-block bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-7 py-4 text-base transition-colors font-[family-name:var(--font-mono)] uppercase tracking-[0.14em]'
                    : 'inline-block border border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-black font-bold rounded-lg px-7 py-4 text-base transition-colors font-[family-name:var(--font-mono)] uppercase tracking-[0.14em]'
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
          {footnote ? (
            <p className="text-center mt-8 text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
              {footnote}
            </p>
          ) : null}
        </section>

        <footer className="max-w-7xl mx-auto px-5 sm:px-8 mt-24 sm:mt-32 pt-10 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              ZAOstock is one chapter in the ZAO Festivals series. Past chapters: ZAO-PALOOZA NYC (2024), ZAO-CHELLA Miami (2024). Built by The ZAO, a community of 100+ independent musicians.
            </p>
            <div className="flex gap-4 text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.18em] text-gray-500">
              <Link href="/musicians" className={`hover:text-white transition-colors ${personaSlug === 'musicians' ? 'text-[#f5a623]' : ''}`}>
                Musicians
              </Link>
              <Link href="/artists" className={`hover:text-white transition-colors ${personaSlug === 'artists' ? 'text-[#f5a623]' : ''}`}>
                Artists
              </Link>
              <Link href="/event-organizers" className={`hover:text-white transition-colors ${personaSlug === 'event-organizers' ? 'text-[#f5a623]' : ''}`}>
                Organizers
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                ← Home
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
            <p>
              Questions? Email{' '}
              <a
                href="mailto:info@thezao.com"
                className="text-[#f5a623] hover:text-[#ffd700] transition-colors"
              >
                info@thezao.com
              </a>
            </p>
            <p className="font-[family-name:var(--font-mono)] uppercase tracking-[0.18em] text-[10px] text-gray-600">
              Onward to October
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
