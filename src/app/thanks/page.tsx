import { Suspense } from 'react';
import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { SiteShell, Section, Eyebrow, Button } from '@/components/poster';
import { FESTIVAL } from '@/content/festival';
import { SITE } from '@/content/site';
import { ThanksTierBlock } from './ThanksTierBlock';

// The page Stripe's Payment Link redirect lands on after checkout - both
// tiers' after_completion is set to zaostock.com/thanks. Deliberately a
// STATIC page: the site holds no Stripe secret key, no webhook and no
// server route (see the STRIPE_LINKS comment block in
// src/content/site.ts), so this page cannot look up the session, the buyer,
// the amount or the tier from Stripe. It must read correctly for anyone who
// lands on it, including someone who types the URL directly with no
// purchase behind it at all.
//
// Not in the sitemap or footer nav - a destination, not a page anyone
// should navigate to.

export const metadata: Metadata = {
  title: 'Thanks',
  description: "You're in - ZAOstock ticket confirmation.",
  robots: { index: false },
  alternates: { canonical: '/thanks' },
  openGraph: {
    title: "Thanks | ZAOstock",
    description: "You're in - ZAOstock ticket confirmation.",
    url: 'https://zaostock.com/thanks',
    images: [OG_IMAGE],
  },
  twitter: twitterCard('Thanks | ZAOstock', "You're in - ZAOstock ticket confirmation."),
};

export default function ThanksPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
      <div className="max-w-[760px] space-y-8">
        <div className="space-y-2">
          <Eyebrow tone="denim">Confirmed</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1">You&apos;re in.</h1>
          <p className="text-lg text-ink-secondary measure">
            Your receipt is on its way by email from Stripe. If anything looks off, email{' '}
            <a href={`mailto:${SITE.contact}?subject=ZAOstock%20ticket%20question`} className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              {SITE.contact}
            </a>
            .
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">The day</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            {FESTIVAL.dateLabel}, {FESTIVAL.window}. {FESTIVAL.venue}, {FESTIVAL.city}.
          </p>
        </section>

        <Suspense fallback={null}>
          <ThanksTierBlock />
        </Suspense>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Before you go</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            Weather, refunds, filming, and entry conditions are all on our{' '}
            <a href="/terms" className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              terms page
            </a>
            . For the stream and day-of updates, see{' '}
            <a href="/live" className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              zaostock.com/live
            </a>
            .
          </p>
          <div className="pt-2">
            <Button href="/" variant="secondary" size="sm">
              Back to zaostock.com
            </Button>
          </div>
        </section>
      </div>
      </Section>
    </SiteShell>
  );
}
