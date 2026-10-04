import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { SiteShell, Section, Eyebrow } from '@/components/poster';
import { FESTIVAL } from '@/content/festival';
import { SITE } from '@/content/site';

// PAST TENSE, 2026-10-04: these are the terms ZAOstock 2026 ran under. Tense
// only; the meaning of each section is unchanged. The refund line stands,
// because support purchases are still possible on /tickets.

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Weather, refunds, filming and entry conditions for ZAOstock - plain language, no legal boilerplate.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms | ZAOstock',
    description: 'Weather, refunds, filming and entry conditions for ZAOstock.',
    url: 'https://zaostock.com/terms',
    images: [OG_IMAGE],
  },
  twitter: twitterCard('Terms | ZAOstock', 'Weather, refunds, filming and entry conditions for ZAOstock.'),
};

export default function TermsPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
      <div className="max-w-[760px] space-y-8">
        <div className="space-y-2">
          <Eyebrow tone="denim">Terms</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1">Terms</h1>
          <p className="text-lg text-ink-secondary measure">
            Plain language, no legal boilerplate. What happened with weather, refunds, filming, and getting in.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Weather</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            {FESTIVAL.dateLabel} was rain or shine - we did not cancel for weather, and the parklet was
            open to the sky. {FESTIVAL.afterParty.name} Public House next door hosted its
            own evening; that was their room and their event, not a second ZAOstock stage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Refunds</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            Ticket purchases are non-refundable. This is a free, all-ages festival - a paid ticket is a
            Chip in, Friend or Backer contribution to the event, not an admission fee, and admission itself
            never requires one. If something goes wrong with your purchase, email{' '}
            <a href={`mailto:${SITE.contact}?subject=ZAOstock%20ticket%20question`} className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              {SITE.contact}
            </a>{' '}
            and we&apos;ll sort it out.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Photography &amp; filming</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            ZAOstock was photographed and filmed throughout the day, including drone footage, for the recap
            video, the livestream, and future promotion. By attending, you agreed that your
            likeness may appear in that footage. If you would rather not appear in the event video, email{' '}
            <a href={`mailto:${SITE.contact}?subject=ZAOstock%20footage%20question`} className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              {SITE.contact}
            </a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Getting in</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            All ages, family-friendly. There was no crowd surfing, no mosh pit, no stage diving, no weapons. We reserved
            the right to refuse entry or ask someone to leave to keep the event safe for everyone else.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Questions</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            ZAOstock was a small, volunteer-run community event, not a company with a legal department - if
            anything here is unclear, email{' '}
            <a href={`mailto:${SITE.contact}?subject=ZAOstock%20terms%20question`} className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              {SITE.contact}
            </a>{' '}
            and we&apos;ll answer directly. See also our{' '}
            <a href="/privacy" className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              privacy page
            </a>{' '}
            for what we collect and how it&apos;s used.
          </p>
        </section>
      </div>
      </Section>
    </SiteShell>
  );
}
