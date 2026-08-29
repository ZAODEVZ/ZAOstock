import type { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import Link from 'next/link';
import { RiderForm } from './RiderForm';
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
            Thanks for being part of the lineup. This is the official rider and information packet. Complete the sections that apply. If you have not been confirmed yet, start at{' '}
            <Link href="/musicians/submit" className="text-denim-400 underline underline-offset-4 hover:text-denim-500">
              /musicians/submit
            </Link>{' '}
            instead.
          </p>
        </div>
      </Section>
      <Section>
        <div className="max-w-[760px]">
          <RiderForm />
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
