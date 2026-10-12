import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { FESTIVAL, nextEditionLine } from '@/content/festival';
import { SITE } from '@/content/site';
import { SiteShell, Section, Eyebrow, Card } from '@/components/poster';

// /apply - CLOSED, 2026-10-04. The 2026 volunteer application closed when
// ZAOstock happened on 3 October. The page says so, thanks the crew and keeps
// the contact line. ApplyForm.tsx and the /api/apply route are left in place,
// untouched, but nothing renders the form any more.

const DESCRIPTION = `Volunteer applications for ZAOstock are closed: the festival happened on ${FESTIVAL.dateLabel}. Thank you to the crew.`;

export const metadata: Metadata = {
  title: 'Volunteer applications, closed',
  description: DESCRIPTION,
  alternates: { canonical: '/apply' },
  openGraph: {
    title: 'Volunteer | ZAOstock',
    description: DESCRIPTION,
    url: 'https://zaostock.com/apply',
    images: [OG_IMAGE],
  },
  twitter: twitterCard('Volunteer | ZAOstock', DESCRIPTION),
};

export default function ApplyPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Volunteer</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Applications are closed.</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            ZAOstock 2026 happened on {FESTIVAL.dateLabel} at the {FESTIVAL.venue}, {FESTIVAL.city}. It was community-built and community-run. Thank you to everyone on the crew.
          </p>
        </div>
      </Section>

      <Section>
        <Card>
          <Eyebrow className="mb-2">Questions</Eyebrow>
          <p className="text-sm text-ink-secondary m-0 mb-2">{nextEditionLine()}</p>
          <p className="text-sm text-ink-secondary m-0">
            Write to{' '}
            <a href={`mailto:${SITE.contact}`} className="underline hover:no-underline">{SITE.contact}</a>.
          </p>
        </Card>
      </Section>
    </SiteShell>
  );
}
