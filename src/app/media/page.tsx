import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { LINEUP_NAMES, displayName } from '@/content/site';
import { PRESS, RADIO, NEWSLETTER, STAR_977_URL, embedsFor, NO_SOCIALS } from '@/content/media';
import { getRosterArtists, slugify } from '@/lib/artists';
import { getFallbackLineup } from '@/lib/lineup-fallback';
import { parseSocials } from '@/lib/socials';
import { SiteShell, Section, Eyebrow, Card } from '@/components/poster';
import { RadioPlayer } from '@/components/RadioPlayer';

// /media - what has been written about ZAOstock, and where to follow each act.
// Content lives in src/content/media.ts (press, embeds) and
// src/content/zao-media.ts (The ZAO's own newsletter editions). Each act's
// links come from the roster, with the repo's bundled lineup copy as the
// fallback so the page never renders empty if the database is unreachable.

export const dynamic = 'force-dynamic';

const TITLE = 'Media and socials';
const DESCRIPTION = `Press coverage of ZAOstock and where to follow all ${LINEUP_NAMES.length} acts before ${FESTIVAL.dateLabel} in ${FESTIVAL.city}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/media' },
  openGraph: { title: `${TITLE} · ZAOstock 2026`, description: DESCRIPTION, url: 'https://zaostock.com/media', images: [OG_IMAGE], type: 'website' },
  twitter: { card: 'summary_large_image', title: `${TITLE} · ZAOstock 2026`, description: DESCRIPTION },
};

function fmtDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

async function socialsByName(): Promise<Record<string, string>> {
  const roster = await getRosterArtists().catch(() => []);
  const rows = roster.length ? roster : getFallbackLineup('zaostock');
  return Object.fromEntries(rows.map((a) => [a.name, a.socials ?? '']));
}

export default async function MediaPage() {
  const socials = await socialsByName();

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Media · {FESTIVAL.dateLabel}</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Media and socials.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Everything written, aired and published about ZAOstock, and where to follow each act before they play the {FESTIVAL.venue}.
          </p>
        </div>
      </Section>

      <Section>
        <Eyebrow className="mb-3">In the press</Eyebrow>
        <div className="grid grid-cols-1 gap-4 max-w-[760px]">
          {PRESS.map((p) => (
            <Card key={p.url}>
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted m-0">
                {p.outlet} · {fmtDate(p.date)}
              </p>
              <h2 className="font-display text-h3 text-ink-950 m-0 mt-2">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                  {p.title}
                </a>
              </h2>
              <p className="text-sm text-ink-secondary m-0 mt-2">{p.summary}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Eyebrow className="mb-3">On the radio</Eyebrow>
        <p className="text-sm text-ink-secondary m-0 mb-3 max-w-[760px]">
          With thanks to{' '}
          <a href={STAR_977_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-ink-950 underline hover:no-underline">
            Star 97.7
          </a>
          , our local radio partner.
        </p>
        <div className="flex flex-col gap-3 max-w-[760px]">
          {RADIO.map((r) => (
            <RadioPlayer key={r.src} src={r.src} title={r.title} detail={r.detail} />
          ))}
        </div>
      </Section>

      <Section>
        <Eyebrow className="mb-3">From The ZAO&apos;s newsletter</Eyebrow>
        <ul className="list-none m-0 p-0 space-y-2 max-w-[760px]">
          {NEWSLETTER.map((m) => (
            <li key={m.url} className="text-sm">
              <span className="font-mono text-xs text-ink-muted mr-2">{fmtDate(m.date)}</span>
              <a href={m.url} target="_blank" rel="noopener noreferrer" className="font-bold text-ink-950 underline hover:no-underline">
                {m.title}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Eyebrow className="mb-3">From the artists</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LINEUP_NAMES.map((name) => {
            const links = parseSocials(socials[name] ?? '').filter((t) => t.href);
            const embeds = embedsFor(name);
            return (
              <Card key={name}>
                <h2 className="font-display text-h3 text-ink-950 m-0">
                  <Link href={`/artist/${slugify(name)}`} className="hover:underline">
                    {displayName(name)}
                  </Link>
                </h2>
                {embeds.map((e) => (
                  <div key={e.id} className="mt-3 aspect-video w-full overflow-hidden rounded-md border border-ink-950/40">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${e.id}`}
                      title={e.title}
                      loading="lazy"
                      allow="encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ))}
                {links.length > 0 ? (
                  <ul className="list-none m-0 p-0 mt-3 space-y-1">
                    {links.map((t) => (
                      <li key={t.href!}>
                        <a href={t.href!} target="_blank" rel="noopener noreferrer" className="text-sm text-ink-secondary underline hover:text-ink-950 break-all">
                          {t.text.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : NO_SOCIALS.includes(name) ? (
                  <p className="text-sm text-ink-muted m-0 mt-3">No socials. Catch the set live on Franklin Street.</p>
                ) : (
                  <p className="text-sm text-ink-muted m-0 mt-3">Links coming soon. Meet them on Franklin Street.</p>
                )}
              </Card>
            );
          })}
        </div>
      </Section>
    </SiteShell>
  );
}
