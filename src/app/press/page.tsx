import { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeader } from '@/components/festival/SectionHeader';
import { FESTIVAL } from '@/content/festival';

export const metadata: Metadata = {
  title: 'Press Kit | ZAOstock',
  description:
    'Press resources for ZAOstock - a free one-day music and art festival on October 3, 2026 in Ellsworth, Maine. Boilerplate, logos, facts, and contact.',
  openGraph: {
    title: 'Press Kit | ZAOstock',
    description:
      'Everything press needs for ZAOstock, October 3, 2026 in Ellsworth, Maine. Boilerplate, logos, and contact.',
    url: 'https://zaostock.com/press',
  },
};

// ---------------------------------------------------------------------------
// PRESS KIT
//
// Shipped 2026-08-25, deliberately WITHOUT the lineup. Performer names are not
// publishable until the reveal on Sep 1 (see src/content/festival.ts - the
// publication rules are enforced by festival.test.ts). Press that asks before
// then still needs something real to point at, which is the whole reason this
// page exists early rather than landing complete on reveal day.
//
// ON SEP 1: add the lineup section. Everything else here should still be true.
// ---------------------------------------------------------------------------

const PRESS_EMAIL = 'info@thezao.com';

// Short and long boilerplate. Written to be copy-pasted verbatim into a
// listing or an article without editing, which is the only form of boilerplate
// anyone actually uses.
const BOILERPLATE_SHORT =
  'ZAOstock is a free one-day music and art festival on Saturday, October 3, 2026, ' +
  'at the Franklin Street Parklet in Ellsworth, Maine, with an after-party next door ' +
  'at Black Moon Public House. It is part of the 9th annual Art of Ellsworth and ' +
  'Maine Craft Weekend, and is run by ZAO Festivals.';

const BOILERPLATE_LONG =
  'ZAOstock is a free one-day music and art festival taking place on Saturday, ' +
  'October 3, 2026 in downtown Ellsworth, Maine. Music runs from noon at the ' +
  'Franklin Street Parklet, then moves indoors to Black Moon Public House next door ' +
  'for the evening. The day is programmed as a single continuous event rather than ' +
  'competing stages, so nobody has to choose what to miss. ' +
  'ZAOstock takes place inside the 9th annual Art of Ellsworth and Maine Craft ' +
  'Weekend, and is produced by ZAO Festivals, the events arm of The ZAO - a ' +
  'creator-first music community. Admission is free.';

const FACTS: { label: string; value: string }[] = [
  { label: 'What', value: 'ZAOstock, a free one-day music and art festival' },
  { label: 'When', value: FESTIVAL.dateLabel },
  { label: 'Where', value: `${FESTIVAL.venue}, ${FESTIVAL.city}` },
  { label: 'Evening', value: `${FESTIVAL.afterParty.name} Public House, ${FESTIVAL.afterParty.note}` },
  { label: 'Admission', value: FESTIVAL.admission },
  { label: 'Part of', value: '9th annual Art of Ellsworth and Maine Craft Weekend' },
  { label: 'Produced by', value: 'ZAO Festivals' },
];

// Only assets that actually exist in this repo are listed. A press kit that
// links a missing file is worse than one that lists fewer things.
const ASSETS: { name: string; note: string; href: string }[] = [
  {
    name: 'ZAOstock 2026 badge',
    note: 'Primary mark, full colour, PNG',
    href: '/brand/logos/zaostock26_badge_official.png',
  },
  {
    name: 'ZAOstock 2026 badge, black and white',
    note: 'For single-colour print',
    href: '/brand/logos/zaostock26_badge_bw_final.png',
  },
];

const ANGLES: { title: string; detail: string }[] = [
  {
    title: 'It is free, on purpose',
    detail:
      'Free admission is a deliberate choice rather than a first-year compromise. The aim is that somebody can decide to come at eleven in the morning and simply turn up.',
  },
  {
    title: 'One venue at a time',
    detail:
      'Most festivals run parallel stages and make the audience choose. ZAOstock runs one continuous programme that moves from the parklet indoors as the evening starts.',
  },
  {
    title: 'Downtown, not a field',
    detail:
      'The whole day happens in walking distance in downtown Ellsworth, using a public parklet and the pub next door rather than a site built for the weekend and taken down after.',
  },
  {
    title: 'Part of a bigger weekend',
    detail:
      'ZAOstock sits inside the 9th annual Art of Ellsworth and Maine Craft Weekend, so visitors get a festival day within a weekend that already brings people to the region.',
  },
];

export default function PressPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24">
        <SectionHeader eyebrow="For press" title="Press Kit" />

        <p className="text-gray-300 leading-relaxed text-lg">
          Everything you need to write about ZAOstock. If something is missing,
          ask - we would rather send it than have you guess.
        </p>

        {/* Facts ------------------------------------------------------- */}
        <section className="mt-14">
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#f5a623] mb-5">
            The facts
          </h3>
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {FACTS.map((f) => (
              <div key={f.label} className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-1 sm:gap-4 py-3">
                <dt className="text-gray-500 text-sm">{f.label}</dt>
                <dd className="text-gray-100">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Boilerplate ------------------------------------------------- */}
        <section className="mt-14">
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#f5a623] mb-3">
            Boilerplate
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            Written to be used as-is. No need to check with us first.
          </p>

          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Short</p>
          <blockquote className="border-l-2 border-[#f5a623] pl-4 text-gray-200 leading-relaxed mb-8">
            {BOILERPLATE_SHORT}
          </blockquote>

          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Long</p>
          <blockquote className="border-l-2 border-[#f5a623] pl-4 text-gray-200 leading-relaxed">
            {BOILERPLATE_LONG}
          </blockquote>
        </section>

        {/* Angles ------------------------------------------------------ */}
        <section className="mt-14">
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#f5a623] mb-5">
            What makes it different
          </h3>
          <div className="space-y-6">
            {ANGLES.map((a) => (
              <div key={a.title}>
                <p className="text-white font-bold">{a.title}</p>
                <p className="text-gray-400 leading-relaxed mt-1">{a.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Assets ------------------------------------------------------ */}
        <section className="mt-14">
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#f5a623] mb-5">
            Logos
          </h3>
          <div className="space-y-3">
            {ASSETS.map((a) => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-white/10 hover:border-[#f5a623] transition-colors p-4 rounded"
              >
                <p className="text-white font-bold">{a.name}</p>
                <p className="text-gray-500 text-sm mt-0.5">{a.note}</p>
              </a>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Need a vector version, a specific crop, or photography? Ask and we
            will send it.
          </p>
        </section>

        {/* Lineup - deliberately not here yet -------------------------- */}
        <section className="mt-14">
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#f5a623] mb-5">
            Lineup
          </h3>
          <p className="text-gray-300 leading-relaxed">
            The lineup is announced on <strong className="text-white">September 1</strong>.
            We are not releasing performer names before then, including to press -
            not because they are secret, but because several acts are still being
            confirmed and we would rather announce once and be right.
          </p>
          <p className="text-gray-400 leading-relaxed mt-3">
            If you are working to a deadline before September 1, get in touch and
            we will work something out.
          </p>
        </section>

        {/* Contact ----------------------------------------------------- */}
        <section className="mt-14 border-t border-white/10 pt-10">
          <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[#f5a623] mb-4">
            Contact
          </h3>
          <a
            href={`mailto:${PRESS_EMAIL}?subject=ZAOstock press enquiry`}
            className="text-2xl text-white hover:text-[#f5a623] transition-colors font-bold"
          >
            {PRESS_EMAIL}
          </a>
          <p className="text-gray-400 mt-3">
            Interviews, photography, guest list, or anything not covered here.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-[#f5a623] transition-colors">
              zaostock.com
            </Link>
            <Link href="/program" className="text-gray-400 hover:text-[#f5a623] transition-colors">
              The programme
            </Link>
            <Link href="/ellsworth" className="text-gray-400 hover:text-[#f5a623] transition-colors">
              Visiting Ellsworth
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
