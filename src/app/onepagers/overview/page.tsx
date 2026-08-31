import Link from 'next/link';
import { TIERS } from '@/content/site';
import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { getStockTeamMember } from '@/lib/auth/session';
import { getOnePager } from '@/lib/onepagers';
import { getStockCounts, getPublicMembers } from '@/lib/members';
import { CopyButton } from '../[slug]/CopyButton';
import { PrintButton } from '../[slug]/PrintButton';

export const dynamic = 'force-dynamic';

const FESTIVAL_DATE = '2026-10-03T12:00:00-04:00';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'ZAOstock 2026 — Overview',
    description:
      'ZAO Festivals presents ZAOstock — a one-day artist-built music festival in Ellsworth, Maine. October 3, 2026.',
    alternates: { canonical: '/onepagers/overview' },
    openGraph: {
      url: 'https://zaostock.com/onepagers/overview',
      images: [OG_IMAGE],
      title: 'ZAOstock 2026 — Overview',
      description:
        'ZAO Festivals presents ZAOstock — October 3, 2026 at the Franklin Street Parklet, Ellsworth, Maine.',
    },
  };
}

interface Stat {
  value: string;
  label: string;
  sub?: string;
}

interface Pillar {
  number: string;
  title: string;
  body: string;
}

interface Partner {
  name: string;
  role: string;
  confirmed: boolean;
}

const PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'Music first',
    body:
      'Independent artists at the center. The lineup is open-call, peer-curated, and built around what serves the room — not what serves a sponsor brief.',
  },
  {
    number: '02',
    title: 'Community second',
    body:
      'The ZAO is 100+ members across 20+ countries. ZAOstock is the global community showing up for one local town: Ellsworth, Maine. Year 1 is about relationship.',
  },
  {
    number: '03',
    title: 'Technology third',
    body:
      'We use Farcaster, distribution platforms, and decentralized tools because they make the work easier for musicians and artists — not because they ARE the work. Tools serve the music. Always that order.',
  },
];

const PARTNERS: Partner[] = [
  { name: 'Town of Ellsworth', role: 'Venue partner — Franklin St Parklet', confirmed: true },
  { name: 'Black Moon Public House', role: 'The evening, indoors + official after-party', confirmed: true },
  // Heart of Ellsworth removed 2026-08-14: official-partner status not yet
  // approved by them. Do not re-add without written confirmation.
  { name: 'Star 97.7', role: 'Local radio promotion', confirmed: true },
  { name: 'Wallace Events', role: 'Event equipment + tenting', confirmed: true },
  { name: 'WaveWarZ', role: 'Live music-battle format on the ZAOstock stage', confirmed: true },
  { name: 'COC Concertz', role: 'UNSET', confirmed: true },
  { name: 'ENTERACT', role: 'Production + operational support', confirmed: true },
].filter((p) => p.confirmed);

// SPONSOR_TIERS used to be defined here, with its own names and its own
// dollar figures - "Broadcast Partner $1,000+" and "Year-Round Partner
// $5,000+". Those prices were never typed by Zaal. `site.ts` has held every
// tier price as null on purpose since 27 August, and site.test.ts asserts it,
// but this page never imported from site.ts, so the two drifted and THIS one
// was the copy the public actually saw.
//
// docs/sponsor/slide-9-tier-ladder.md records an earlier ladder killed for
// exactly this ("a machine inventing a decision"), and the 2026-05-12 public
// surfaces audit flagged a $500-$2,500 range as INCONSISTENT. The ladder came
// out of the deck and survived here.
//
// Now there is one source. Prices come from site.ts, which means there are
// none until Zaal types them.

const HOW_TO = [
  {
    role: 'Artists',
    detail:
      'Submit through the open call. Cutoff is roughly one month before the event. Independent + ZAO-vetted.',
    cta: { label: 'Suggest an artist', href: '/suggest' },
  },
  {
    role: 'Sponsors',
    detail:
      'Five packages, prices on request. Local + national both welcome. Commercial sponsorship only.',
    cta: { label: 'Partner deck', href: '/sponsor/deck' },
  },
  {
    role: 'Volunteers',
    detail: 'Day-of crew, hospitality, setup, breakdown. Fed and credited.',
    cta: { label: 'Sign up', href: '/apply' },
  },
  {
    role: 'Press + media',
    detail: 'Briefings, interviews, photo passes. Email info@thezao.com or browse our briefings.',
    cta: { label: 'Briefings', href: '/onepagers' },
  },
];

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export default async function OverviewOnePager() {
  const [pager, counts, members, session] = await Promise.all([
    getOnePager('overview').catch(() => null),
    getStockCounts().catch(() => null),
    getPublicMembers().catch(() => []),
    getStockTeamMember().catch(() => null),
  ]);

  const days = daysUntil(FESTIVAL_DATE);
  const teamCount = (members ?? []).length;
  const sponsorAmount = counts?.sponsorsCommittedAmount ?? 0;
  const sponsorCount = counts?.sponsorsCommitted ?? 0;
  const volunteerCount = counts?.volunteers ?? 0;

  const stats: Stat[] = [
    { value: 'Oct 3', label: '2026', sub: 'Noon - late' },
    { value: 'Ellsworth', label: 'Maine', sub: 'Franklin St Parklet' },
    { value: `${days}`, label: 'days to go', sub: 'as of today' },
    { value: `${teamCount}`, label: 'team members', sub: '8 circles' },
  ];

  return (
    <main className="min-h-screen bg-paper-100 text-ink-950 print:bg-white print:text-slate-900">
      {/* Top bar */}
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 print:hidden">
        <Link href="/" className="text-sm text-denim-500 hover:underline">
          &larr; ZAOstock home
        </Link>
        <div className="flex items-center gap-2">
          {session && (
            <Link
              href="/onepagers"
              className="text-xs text-ink-muted hover:text-denim-500 underline"
            >
              All briefings
            </Link>
          )}
          {pager && <CopyButton text={pager.body} />}
          <PrintButton />
        </div>
      </div>

      {/* HERO */}
      <header className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-12 print:py-6">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500">
            ZAO Festivals presents
          </div>
          <h1 className="mt-2 text-5xl font-black leading-none text-ink-950 sm:text-6xl print:text-slate-900 print:text-4xl">
            ZAOstock
            <span className="ml-3 align-top text-2xl font-bold text-denim-500 print:text-denim-500">
              2026
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink-950 print:text-slate-700">
            A one-day, artist-built music festival in downtown Ellsworth, Maine. Run by{' '}
            <strong className="text-ink-950 print:text-slate-900">The ZAO</strong> — a global,
            independent music community. Year 1: relationship over scale.
          </p>
        </div>
      </header>

      {/* STATS GRID */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-px bg-white/5 sm:grid-cols-4 print:bg-slate-200">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-paper-100 px-4 py-6 print:bg-white"
            >
              <div className="text-2xl font-black text-ink-950 print:text-slate-900">{s.value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-denim-500 print:text-denim-500">
                {s.label}
              </div>
              {s.sub && (
                <div className="mt-1 text-xs text-ink-muted print:text-ink-muted">{s.sub}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-10 print:py-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500 print:text-denim-500">
            Order of priorities
          </h2>
          <div className="mt-2 text-2xl font-bold text-ink-950 print:text-slate-900">
            Music first. Community second. Technology third.
          </div>
          <p className="mt-2 text-sm text-ink-muted print:text-ink-muted">
            That order matters. We are digital creators focused on helping musicians and other
            artists with distribution and support.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.number}
                className="rounded-lg border border-ink-950/60 bg-paper-200 p-4 print:border-slate-300 print:bg-slate-50"
              >
                <div className="text-xs font-mono text-denim-500 print:text-denim-500">
                  {p.number}
                </div>
                <div className="mt-1 text-base font-bold text-ink-950 print:text-slate-900">
                  {p.title}
                </div>
                <p className="mt-2 text-sm text-ink-950 print:text-slate-700">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-10 print:py-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500 print:text-denim-500">
            What it is
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-base font-bold text-ink-950 print:text-slate-900">
                The festival
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-950 print:text-slate-700">
                One-day outdoor festival at the Franklin Street Parklet in downtown Ellsworth.
                Independent + ZAO-vetted artists, multiple acts, day-into-evening. Programmed
                end-to-end by The ZAO community.
              </p>
            </div>
            <div>
              <div className="text-base font-bold text-ink-950 print:text-slate-900">
                The umbrella
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-950 print:text-slate-700">
                <strong className="text-ink-950 print:text-slate-900">ZAO Festivals</strong> is our
                event arm. ZAOstock is the flagship. Future events inherit the equity, mailing
                list, and trust we build this year.
              </p>
            </div>
            <div>
              <div className="text-base font-bold text-ink-950 print:text-slate-900">
                The brand
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-950 print:text-slate-700">
                <strong className="text-ink-950 print:text-slate-900">The ZAO</strong> (ZTalent
                Artist Organization) is an independent music community: 100+ members, 30+
                countries, organized around fractals (weekly peer-ranked contribution rounds) and
                a shared treasury.
              </p>
            </div>
            <div>
              <div className="text-base font-bold text-ink-950 print:text-slate-900">
                The lineup
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-950 print:text-slate-700">
                Open-call. Submission-based. Cutoff roughly one month before the event. Curated
                by the Music circle (DCoop + Shawn) with peer input.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHERE WE ARE */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-10 print:py-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500 print:text-denim-500">
            Where we are
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-paper-200 p-4 print:bg-slate-50">
              <div className="text-xs uppercase tracking-wider text-ink-muted print:text-ink-muted">
                Sponsors
              </div>
              <div className="mt-1 text-2xl font-bold text-ink-950 print:text-slate-900">
                ${sponsorAmount.toLocaleString()}
              </div>
              <div className="text-xs text-ink-muted print:text-ink-muted">
                {sponsorCount} committed
              </div>
            </div>
            <div className="rounded-lg bg-paper-200 p-4 print:bg-slate-50">
              <div className="text-xs uppercase tracking-wider text-ink-muted print:text-ink-muted">
                Team
              </div>
              <div className="mt-1 text-2xl font-bold text-ink-950 print:text-slate-900">
                {teamCount}
              </div>
              <div className="text-xs text-ink-muted print:text-ink-muted">8 circles</div>
            </div>
            <div className="rounded-lg bg-paper-200 p-4 print:bg-slate-50">
              <div className="text-xs uppercase tracking-wider text-ink-muted print:text-ink-muted">
                Volunteers
              </div>
              <div className="mt-1 text-2xl font-bold text-ink-950 print:text-slate-900">
                {volunteerCount}
              </div>
              <div className="text-xs text-ink-muted print:text-ink-muted">signed up</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-base font-bold text-ink-950 print:text-slate-900">Partners</div>
            <ul className="mt-2 divide-y divide-white/5 print:divide-slate-200">
              {PARTNERS.map((p) => (
                <li key={p.name} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-semibold text-ink-950 print:text-slate-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-ink-muted print:text-ink-muted">{p.role}</div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.confirmed
                        ? 'bg-olive-300 text-ink-950 print:bg-emerald-100 print:text-emerald-800'
                        : 'bg-paper-100/50 text-ink-950 print:bg-slate-200 print:text-slate-700'
                    }`}
                  >
                    {p.confirmed ? 'Confirmed' : 'In conversation'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SPONSORSHIP TIERS */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-10 print:py-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500 print:text-denim-500">
            Sponsorship
          </h2>
          <p className="mt-2 text-sm text-ink-muted print:text-ink-muted">
            Commercial sponsorship. Direct-deal with The ZAO.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className="rounded-lg border border-ink-950/60 bg-amber-500/[0.03] p-4 print:border-amber-700/40 print:bg-amber-50"
              >
                <div className="text-base font-bold text-ink-950 print:text-slate-900">{t.name}</div>
                {t.price ? (
                  <div className="text-sm font-semibold text-denim-500 print:text-denim-500">{t.price}</div>
                ) : null}
                <p className="mt-3 text-xs text-ink-950 print:text-slate-700">{t.gets}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO BE INVOLVED */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-10 print:py-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500 print:text-denim-500">
            How to be involved
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {HOW_TO.map((row) => (
              <div
                key={row.role}
                className="rounded-lg border border-ink-950/60 bg-paper-200 p-4 print:border-slate-300 print:bg-white"
              >
                <div className="text-base font-bold text-ink-950 print:text-slate-900">
                  {row.role}
                </div>
                <p className="mt-1 text-sm text-ink-950 print:text-slate-700">{row.detail}</p>
                <Link
                  href={row.cta.href}
                  className="mt-3 inline-block text-sm font-semibold text-denim-500 hover:underline print:text-denim-500"
                >
                  {row.cta.label} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YEAR 1 COMMITMENTS */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-10 print:py-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500 print:text-denim-500">
            Year 1 commitments
          </h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              'Show up locally. Meet the city, the venue, the music scene. Roddy at City Hall, Steve Peer in the basement.',
              'Take care of the artists. Fair pay, real promo, real community. Open-call lineup, peer curation.',
              'Document everything. Public log. Build in public.',
              "Don't overscale. Capacity the venue + city are happy with. Year 2 earns the right to grow.",
            ].map((c, i) => (
              <li key={c} className="flex gap-3">
                <span className="flex-shrink-0 text-2xl font-black text-denim-500 print:text-denim-500">
                  {i + 1}
                </span>
                <span className="text-sm text-ink-950 print:text-slate-700">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-b border-ink-950/60 print:border-slate-300">
        <div className="mx-auto max-w-4xl px-4 py-10 print:py-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-denim-500 print:text-denim-500">
            Contact
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-ink-muted print:text-ink-muted">For everything</div>
              <a
                href="mailto:info@thezao.com"
                className="mt-1 block text-xl font-bold text-denim-500 hover:underline print:text-denim-500"
              >
                info@thezao.com
              </a>
              <div className="mt-1 text-xs text-ink-muted print:text-ink-muted">
                Zaal — ZAOstock organizer, The ZAO founder
              </div>
            </div>
            <div>
              <div className="text-sm text-ink-muted print:text-ink-muted">Online</div>
              <ul className="mt-1 space-y-1 text-sm text-ink-950 print:text-slate-700">
                <li>
                  Site:{' '}
                  <Link href="/" className="text-denim-500 hover:underline print:text-denim-500">
                    zaostock.com
                  </Link>
                </li>
                <li>Farcaster: /thezao</li>
                <li>X: @thezao_</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD-EDITED LONG-FORM (renders only if pager body has content) */}
      {pager?.body && pager.body.trim().length > 0 && (
        <section className="border-b border-ink-950/60 print:hidden">
          <div className="mx-auto max-w-4xl px-4 py-10">
            <details className="group rounded-lg border border-ink-950/60 bg-paper-200 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-denim-500 hover:underline">
                + Long-form briefing (last edited via dashboard)
              </summary>
              <pre className="mt-4 whitespace-pre-wrap text-sm text-ink-950">{pager.body}</pre>
            </details>
          </div>
        </section>
      )}

      <footer className="mx-auto max-w-4xl px-4 py-8 text-xs text-ink-muted print:text-ink-muted">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            ZAO Festivals presents ZAOstock 2026 ·{' '}
            {pager?.updated_at && (
              <span className="text-ink-muted">v{pager.version} · updated {pager.updated_at.slice(0, 10)}</span>
            )}
          </div>
          <div className="text-right">
            zaostock.com/onepagers/overview
          </div>
        </div>
      </footer>
    </main>
  );
}
