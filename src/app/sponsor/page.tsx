import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { SITE, PARTNERS, ZAO, WAVEWARZ_STATS, SERIES } from '@/content/site';
import { FESTIVAL, nextEditionLine } from '@/content/festival';
import { SiteShell, Section, TwoUp, Eyebrow, Button, Stat, SectionHeader, BorderedList } from '@/components/poster';

// PAST TENSE, 2026-10-04. ZAOstock 2026 happened on 3 October (Zaal: "pushing
// eveything zaostock to the past"), so the 2026 sponsor pitch is gone: the
// deliverables, the "four things every partner gets", the artist-sponsor card
// and the before / during / after rows all promised things about a day that has
// passed. In their place: a short record of who supported 2026 (the PARTNERS
// list, one source with / and /partners) and one contact line for anyone who
// wants to talk about a future edition. No benefits are described, because none
// have been set for a future edition. DELIVERABLES, TIERS and the rest stay in
// src/content/site.ts as the record of what was offered in 2026.
//
// Attendance is NOT public (Zaal, 2026-09-24: "dont say these number anywhere").
// The advisor block stays off until each named person has agreed.

export const metadata: Metadata = {
  title: 'Sponsors and partners, 2026',
  description:
    'The sponsors and partners who backed ZAOstock 2026 in downtown Ellsworth, Maine, and who to write to about a future edition.',
  alternates: { canonical: '/sponsor' },
  openGraph: {
    title: 'Sponsor | ZAOstock',
    description: `Who backed ZAOstock 2026. ${FESTIVAL.dateLabel}, ${FESTIVAL.city}.`,
    url: 'https://zaostock.com/sponsor',
    images: [OG_IMAGE],
  },
  twitter: twitterCard(
    'Sponsor | ZAOstock',
    `Who backed ZAOstock 2026. ${FESTIVAL.dateLabel}, ${FESTIVAL.city}.`,
  ),
};

export default function SponsorPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">ZAOstock 2026 · Sponsors and partners</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Thank you to everyone who backed ZAOstock 2026.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            {FESTIVAL.dateLabel}. {FESTIVAL.venue}, downtown Ellsworth, Maine, then Black Moon Public House next door. These are the partners who supported it.
          </p>
        </div>
      </Section>

      <Section id="supporters">
        <TwoUp>
          <SectionHeader eyebrow="Who supported 2026" title="The partners." lede="Each had a named point of contact on the ZAO team." />
          <BorderedList rows={PARTNERS.map((p) => ({ term: p.name, detail: p.role }))} />
        </TwoUp>
      </Section>

      <Section id="who">
        <TwoUp>
          <SectionHeader
            eyebrow="Who we are"
            title="The ZAO, since 2024. Every week."
            lede="The ZAO is an independent community of musicians and digital creators. Music first, community second, technology third. ZAO Festivals is its events arm; ZAOstock is its flagship, and it runs at break-even."
          />
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <Stat value={ZAO.weeklySessions.value} label={ZAO.weeklySessions.label} />
              <Stat value={ZAO.festivalsRun.value} label={ZAO.festivalsRun.label} />
            </div>
            <BorderedList rows={SERIES.map((e) => ({ term: e.name, detail: `${e.place}, ${e.when}. ${e.note}` }))} />
          </div>
        </TwoUp>
      </Section>

      <Section id="wavewarz">
        <TwoUp>
          <SectionHeader
            eyebrow="WaveWarZ"
            title="Two artists go head to head. The audience decides."
            lede="A live music-battle format, online all year. The audience picks the winner, and the winning artist is paid straight away."
          />
          <div>
            <Stat value={WAVEWARZ_STATS.battles.value} label={`${WAVEWARZ_STATS.battles.label}, as of ${WAVEWARZ_STATS.asOf}`} />
          </div>
        </TwoUp>
      </Section>

      <Section id="next">
        <div className="max-w-[760px]">
          <SectionHeader eyebrow="A future edition" title="Want to talk about the next one?" />
          <p className="text-lg text-ink-secondary measure mt-4 m-0">{nextEditionLine()}</p>
          <p className="text-lg text-ink-secondary measure mt-2 m-0">
            Write to{' '}
            <a href={`mailto:${SITE.contact}`} className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
              {SITE.contact}
            </a>
            .
          </p>
          <div className="mt-7 no-print">
            <Button href={`mailto:${SITE.contact}`} external size="lg">
              Email {SITE.contact}
            </Button>
          </div>
        </div>
      </Section>

      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          body { background: #FAF3E6 !important; }
          section { break-inside: avoid; padding: 16px 0 !important; }
        }
      `}</style>
    </SiteShell>
  );
}
