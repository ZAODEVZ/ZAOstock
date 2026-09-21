import type { Metadata } from 'next';
import Link from 'next/link';
import { OG_IMAGE } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { SITE, LINEUP_NAMES } from '@/content/site';
import { SiteShell, Section, Eyebrow, Badge, Button, Card } from '@/components/poster';
import { LINEUP_ARTISTS } from './lineup-artists';

export const metadata: Metadata = {
  title: 'Artists',
  description:
    `The 2026 ZAOstock lineup. ${LINEUP_NAMES.length} independent acts on the ${FESTIVAL.venue} stage, ${FESTIVAL.dateLabel} in Ellsworth, Maine.`,
  alternates: { canonical: '/artists' },
  openGraph: {
    title: 'Artists · ZAOstock 2026',
    description: `${LINEUP_NAMES.length} independent acts on the ${FESTIVAL.venue} stage, ${FESTIVAL.dateLabel} in Ellsworth, Maine.`,
    url: 'https://zaostock.com/artists',
    images: [OG_IMAGE],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artists · ZAOstock 2026',
    description: `${LINEUP_NAMES.length} independent acts on the ${FESTIVAL.venue} stage, ${FESTIVAL.dateLabel} in Ellsworth, Maine.`,
  },
};

export default function ArtistsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Lineup · {FESTIVAL.dateLabel}</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            The 2026 Lineup.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            {LINEUP_NAMES.length} independent acts back to back on the {FESTIVAL.venue} in {FESTIVAL.city}.
            Outdoors from noon to six. Free admission, rain or shine.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge tone="gold">{LINEUP_NAMES.length} acts &middot; Playing in order</Badge>
            <span className="text-sm text-ink-muted">
              Bios and photos go up one artist at a time as details are confirmed.
            </span>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {LINEUP_ARTISTS.map((act) => (
            <Card key={act.slug} className="flex flex-col justify-between p-6 hover:border-gold-500/80 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted">
                    Act {act.order}
                  </span>
                  <Badge tone="outline">
                    {act.genre}
                  </Badge>
                </div>
                <h2 className="font-display text-2xl font-bold text-ink-950 mb-2">
                  {act.name}
                </h2>
                {act.highlight ? (
                  <p className="text-sm text-ink-secondary m-0 mb-4">
                    {act.highlight}
                  </p>
                ) : null}
              </div>
              <div className="pt-2 border-t border-ink-950/10 flex items-center justify-between">
                <Link
                  href={`/artist/${act.slug}`}
                  className="font-sans text-xs font-bold uppercase tracking-wider text-fire-600 hover:text-fire-700 inline-flex items-center gap-1.5"
                >
                  View artist profile &rarr;
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="max-w-[760px] space-y-6">
          <Card>
            <Eyebrow className="mb-2">Visual Art &amp; Creative Energy</Eyebrow>
            <h3 className="font-display text-xl font-bold text-ink-950 mb-2">
              Beyond the stage.
            </h3>
            <p className="text-sm text-ink-secondary m-0 mb-4">
              Posters, signage, photography, and on-site visuals are built collaboratively with the ZAO community and local makers. Part of the 9th Annual Art of Ellsworth and Maine Craft Weekend.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/program" variant="secondary" size="sm">
                Festival program
              </Button>
              <Button href="/apply" variant="secondary" size="sm">
                Volunteer with crew
              </Button>
              <Button href={`mailto:${SITE.contact}?subject=ZAOstock%20Creative%20Inquiry`} variant="ghost" size="sm">
                Email creative team
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </SiteShell>
  );
}
