import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { NEXT_EDITION, nextEditionLine } from '@/content/festival';
import { SITE } from '@/content/site';
import { IN_PERSON, VIRTUAL, signedUp, type VolunteerDay } from '@/content/volunteer-slots';
import { SiteShell, Section, Eyebrow, Card } from '@/components/poster';
import { PrintButton } from './PrintButton';

// /volunteer - the sign-up sheet for ZAOstock 2027, rendered from
// src/content/volunteer-slots.ts. Screen and paper come from the same file.
// Nobody signs up here: people message Zaal, and Zaal updates the file.
//
// Reopened 2026-10-08 (Zaal: "lets open it up and make it better"). It was a
// closed thank-you page from 2026-10-04. The 2027 place and times are not set,
// so the sheet says so and shows the head count each job was PLANNED for in
// 2026 (not an attendance figure, never recorded), never as a 2027 promise. Every 2027 fact comes from NEXT_EDITION.

const TITLE = 'Volunteer sign-up sheet';
const DESCRIPTION = `Help at ${NEXT_EDITION.name}, in person or online. See the jobs and message us to put your name down.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/volunteer' },
  openGraph: { title: `${TITLE} · ${NEXT_EDITION.name}`, description: DESCRIPTION, url: 'https://zaostock.com/volunteer', images: [OG_IMAGE], type: 'website' },
  twitter: { card: 'summary_large_image', title: `${TITLE} · ${NEXT_EDITION.name}`, description: DESCRIPTION },
};

function Sheet({ days }: { days: VolunteerDay[] }) {
  return (
    <div className="flex flex-col gap-6">
      {days.map((d) => (
        <Card key={d.id} className="break-inside-avoid">
          <h3 className="font-display text-h3 text-ink-950 m-0">{d.title}</h3>
          <p className="text-sm text-ink-muted m-0 mt-1">{d.where}</p>
          <table className="w-full mt-4 text-sm border-collapse">
            <thead>
              <tr className="text-left text-ink-muted">
                <th className="py-1 pr-3 font-bold">Job</th>
                <th className="py-1 pr-3 font-bold whitespace-nowrap">Planned for 2026</th>
                <th className="py-1 pr-3 font-bold whitespace-nowrap">Signed up</th>
                <th className="py-1 font-bold hidden print:table-cell">Name</th>
              </tr>
            </thead>
            <tbody>
              {d.slots.map((s) => (
                <tr key={s.id} className="border-t border-ink-950/15 align-top">
                  <td className="py-2 pr-3">
                    <span className="font-bold text-ink-950">{s.job}</span>
                    <span className="block text-ink-secondary">{s.what}</span>
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap text-ink-secondary">
                    {s.plannedFor2026} {s.plannedFor2026 === 1 ? 'person' : 'people'}
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap font-bold text-ink-950">{s.taken}</td>
                  <td className="py-2 hidden print:table-cell w-[35%] border-b border-ink-950/40" />
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );
}

export default function VolunteerPage() {
  const total = signedUp(IN_PERSON) + signedUp(VIRTUAL);
  return (
    <SiteShell>
      <style>{'@media print { header, footer, nav { display: none !important; } }'}</style>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">{nextEditionLine()}</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">
            Volunteer sign-up sheet.
          </h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Help in person on the day, or online from anywhere. Pick a job below, then email{' '}
            <a href={`mailto:${SITE.contact}`} className="underline hover:no-underline">{SITE.contact}</a>{' '}
            with the job and your name, and we will count you in here. Names are never shown on this page.
          </p>
          <p className="text-sm text-ink-muted measure m-0 mt-3">
            The place and times for {NEXT_EDITION.name} are not set yet. The &ldquo;Planned for 2026&rdquo; column is how many
            people last year&rsquo;s sheet planned for each job, so you can see the size of it. Signed up so far: {total}.
          </p>
          <div className="mt-6">
            <PrintButton />
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow className="mb-3">In person</Eyebrow>
        <Sheet days={IN_PERSON} />
      </Section>

      <Section>
        <Eyebrow className="mb-3">Online</Eyebrow>
        <Sheet days={VIRTUAL} />
      </Section>
    </SiteShell>
  );
}
