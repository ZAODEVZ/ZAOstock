import { Metadata } from 'next';
import { FESTIVAL } from '@/content/festival';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { SiteShell, Section, Eyebrow } from '@/components/poster';
import { SITE } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact & Support',
  description: `Reach the ZAOstock team with a question about a purchase, or anything else about the free festival that ran in Ellsworth, Maine, ${FESTIVAL.shortDate}.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact & Support | ZAOstock',
    description: `Reach the ZAOstock team with a question about a purchase, or anything else about the free festival that ran in Ellsworth, Maine, ${FESTIVAL.shortDate}.`,
    url: 'https://zaostock.com/contact',
    images: [OG_IMAGE],
  },
  twitter: twitterCard('Contact & Support | ZAOstock', 'Reach ZAOstock with a question about a purchase, or anything else.'),
};

export default function ContactPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
      <div className="max-w-[760px] space-y-8">
        <div className="space-y-2">
          <Eyebrow tone="denim">Contact</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1">Contact &amp; support</h1>
          <p className="text-lg text-ink-secondary measure">
            One email reaches the small volunteer team that ran ZAOstock. Real people read it and reply.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Supported the artists?</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            For a question about your purchase, email{' '}
            <a href={`mailto:${SITE.contact}?subject=ZAOstock%20ticket%20question`} className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              {SITE.contact}
            </a>
            . The terms the day ran under are on our{' '}
            <a href="/terms" className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              terms page
            </a>{' '}
            - worth a look before you write in.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Everything else</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            Playing, sponsoring, press, or anything not covered above - same address,{' '}
            <a href={`mailto:${SITE.contact}?subject=ZAOstock%20question`} className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              {SITE.contact}
            </a>
            . Tell us what you&apos;re asking about and we&apos;ll get it to the right person.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">The replay</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            To watch the day again, and for the running order, see{' '}
            <a href="/live" className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              zaostock.com/live
            </a>
            .
          </p>
        </section>
      </div>
      </Section>
    </SiteShell>
  );
}
