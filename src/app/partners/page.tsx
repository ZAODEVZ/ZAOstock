import { Metadata } from 'next';
import { SITE, PARTNERS } from '@/content/site';
import { SiteShell, Section, Eyebrow, Button, SectionHeader, PartnerTile } from '@/components/poster';

// The partner page. Same PARTNERS list as the homepage strip and the press
// kit, so the three cannot drift. A partner appears only when confirmed; a
// logo appears only when the file is in public/partners/. The three whose
// logos are still due (Town of Ellsworth, ENTERACT, Web3Metal, asked for
// 29 Aug) show a "Logo coming" badge, not a blank. Heart of Ellsworth stays
// off until confirmed in writing (src/content/site.ts).

export const metadata: Metadata = {
  title: 'Partners',
  description: 'The partners behind ZAOstock 2026: the venue, the evening, local radio, the tent, the battle format, and the crews.',
  openGraph: {
    title: 'Partners | ZAOstock',
    description: 'Partners give time, venue and infrastructure. Saturday 3 October 2026, Ellsworth, Maine.',
    url: 'https://zaostock.com/partners',
  },
};

export default function PartnersPage() {
  const withLogo = PARTNERS.filter((p) => p.logoSrc);
  const coming = PARTNERS.filter((p) => !p.logoSrc);

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Partners · ZAOstock 2026</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Partners give time, venue and infrastructure.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Each one has a confirmed agreement and a named point of contact on the ZAO team. Nobody here paid to be listed.
          </p>
        </div>
      </Section>

      <Section id="partners">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 m-0 p-0">
          {withLogo.map((p) => (
            <PartnerTile key={p.name} partner={p} />
          ))}
        </ul>
        {coming.length > 0 ? (
          <>
            <SectionHeader eyebrow="Also in" title="Logos on the way." className="mt-10 mb-4" />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 m-0 p-0">
              {coming.map((p) => (
                <PartnerTile key={p.name} partner={p} showComing />
              ))}
            </ul>
          </>
        ) : null}
      </Section>

      <Section id="sponsor">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            eyebrow="Sponsors"
            title="Put money behind a named artist, or the day."
            lede="Partners give what they already have. Sponsors put a name on the parklet banner, the programme, the site and the stream, and get a thank-you from the stage."
          />
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button href="/sponsor">Sponsor ZAOstock</Button>
            <Button href={`mailto:${SITE.contact}`} external variant="secondary">
              {SITE.contact}
            </Button>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
