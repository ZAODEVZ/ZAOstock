import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { RiderForm } from './RiderForm';
import { FormsUnavailable } from '@/components/FormsUnavailable';
import { formIsLive, emailByDesign } from '@/lib/forms-status';
import { SITE } from '@/content/site';
import { SiteShell, Section, Eyebrow } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Artist Rider · ZAOstock',
  description:
    'Confirmed for the ZAOstock lineup? Complete your performance & participation rider - schedule, equipment, backing tracks, merch, interview, and retreat.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/musicians/rider' },
  openGraph: {
    title: 'Artist Rider · ZAOstock',
    description: 'Confirmed for the ZAOstock lineup? Complete your performance & participation rider.',
    url: 'https://zaostock.com/musicians/rider',
    images: [OG_IMAGE],
  },
};

export default function RiderPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Confirmed artists</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">Performance and participation rider.</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Thanks for being part of the lineup. This is the official rider and information packet. Complete the sections that apply. If you have not been confirmed yet, email{' '}
            <a href={`mailto:${SITE.contact}`} className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
              {SITE.contact}
            </a>{' '}
            instead.
          </p>
        </div>
      </Section>
      <Section>
        <div className="max-w-[760px]">
          {formIsLive('rider') ? (
            <RiderForm />
          ) : (
            <FormsUnavailable
              reason={emailByDesign('rider') ? 'by-design' : 'database-down'}
              action="send your rider"
              subject="ZAOstock rider"
              include={['Your act name and the name you go by on stage', 'Set length and instrumentation, with anything you need on stage', 'Travel: where from, and whether you need help with it', 'Merch: whether you need a table', 'A link to a track or a set']}
            />
          )}
          <p className="text-sm text-ink-muted mt-6 m-0">
            The host is not responsible for lost, stolen or damaged property. Questions about your rider: email{' '}
            <a href={`mailto:${SITE.contact}`} className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
              {SITE.contact}
            </a>
            .
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
