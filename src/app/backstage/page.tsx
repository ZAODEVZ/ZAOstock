import type { Metadata } from 'next';
import { SiteShell, Section, SectionHeader, Card } from '@/components/poster';
import { SITE } from '@/content/site';
import { ArtistForm } from './ArtistForm';

// The form with no code at all. Zaal, 2026-09-10: the code is for the
// background page, never for the form.
export const metadata: Metadata = {
  title: 'Artist details | ZAOstock',
  robots: { index: false, follow: false },
};

export default function BackstageIndex() {
  return (
    <SiteShell>
      <Section first className="pt-10 sm:pt-14">
        <div className="max-w-[760px] space-y-6">
          <SectionHeader
            as="h1"
            eyebrow="Backstage"
            title="Artist details"
            lede={
              <>
                For acts on the ZAOstock bill. Your own link carries your set and the weekend; the form is the same
                either way. Questions: <a href={`mailto:${SITE.contact}`} className="underline">{SITE.contact}</a>.
              </>
            }
          />
          <Card>
            <ArtistForm />
          </Card>
        </div>
      </Section>
    </SiteShell>
  );
}
