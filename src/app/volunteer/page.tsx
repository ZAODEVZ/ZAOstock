import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { FESTIVAL } from '@/content/festival';
import { SITE } from '@/content/site';
import { SiteShell, Section, Eyebrow, Card } from '@/components/poster';

// /volunteer - CLOSED, 2026-10-04. ZAOstock 2026 happened on 3 October, so the
// sign-up sheet is closed and nobody is asked to pick a job. The page is a
// thank-you to the crew plus the contact line. The sheet's data still lives in
// src/content/volunteer-slots.ts (kept as the record, not rendered here), and
// PrintButton.tsx stays in the folder for the same reason.

const TITLE = 'Volunteer sheet, closed';
const DESCRIPTION = `The ZAOstock volunteer sheet is closed: the festival happened on ${FESTIVAL.dateLabel}. Thank you to the crew.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/volunteer' },
  openGraph: { title: `${TITLE} · ZAOstock 2026`, description: DESCRIPTION, url: 'https://zaostock.com/volunteer', images: [OG_IMAGE], type: 'website' },
  twitter: { card: 'summary_large_image', title: `${TITLE} · ZAOstock 2026`, description: DESCRIPTION },
};

export default function VolunteerPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">{FESTIVAL.dateLabel}</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            The volunteer sheet is closed.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            ZAOstock 2026 happened on {FESTIVAL.dateLabel}, and the sheet closed with it. Thank you to everyone on the crew who gave a day to Franklin Street.
          </p>
        </div>
      </Section>

      <Section>
        <Card>
          <Eyebrow className="mb-2">Questions</Eyebrow>
          <p className="text-sm text-ink-secondary m-0">
            Write to{' '}
            <a href={`mailto:${SITE.contact}`} className="underline hover:no-underline">{SITE.contact}</a>.
          </p>
        </Card>
      </Section>
    </SiteShell>
  );
}
