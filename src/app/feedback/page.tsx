import { Metadata } from 'next';
import { OG_IMAGE, twitterCard } from '@/lib/meta';
import { SiteShell, Section, Eyebrow, Button } from '@/components/poster';
import { SITE, feedbackFormUrl } from '@/content/site';

// FEEDBACK, 2026-10-06. Zaal picked a Google Form (option A) for ZAOstock 2026
// feedback, shared from this page and from all the recap content. The form
// lives in the info@thezao.com Google account, so this page holds no answers
// and no personal data. Until FEEDBACK_FORM_URL in site.ts is set, the button
// is an email link instead: a page that promises a form must not link to
// nothing.
//
// EMBEDDED, 2026-10-07. Zaal: "form should be embeed". The form now sits on
// the page in an iframe (?embedded=true); the button opens it in a new tab for
// anyone whose browser blocks the frame. next.config.ts already allows
// docs.google.com in frame-src.

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Were you at ZAOstock, or did you watch the stream? Tell us how it was. Two minutes, and it shapes the next one.',
  alternates: { canonical: '/feedback' },
  openGraph: {
    title: 'How was ZAOstock? | ZAOstock',
    description: 'Tell us how it was. Two minutes, and it shapes the next one.',
    url: 'https://zaostock.com/feedback',
    images: [OG_IMAGE],
  },
  twitter: twitterCard('How was ZAOstock? | ZAOstock', 'Tell us how it was. Two minutes, and it shapes the next one.'),
};

export default function FeedbackPage() {
  const form = feedbackFormUrl();
  const mailto = `mailto:${SITE.contact}?subject=${encodeURIComponent('ZAOstock feedback')}`;

  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
        <div className="max-w-[760px]">
          <Eyebrow tone="denim">Feedback</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1 mt-3 mb-4">How was ZAOstock?</h1>
          <p className="text-lg text-ink-secondary measure m-0">
            Whether you were on Franklin Street, at Black Moon after, on stage, on the crew, or watching the stream, tell us what worked and what to change. It takes about two minutes, and it shapes the next one.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {form ? (
              <Button href={form} external variant="secondary">
                Open the form in a new tab
              </Button>
            ) : (
              <Button href={mailto} variant="primary">
                Email us how it was
              </Button>
            )}
            <Button href="/live" variant="secondary">
              Watch the replay
            </Button>
          </div>
          <p className="text-sm text-ink-muted mt-6 m-0">
            We only quote what you write if you say we can.
          </p>
        </div>
        {form ? (
          <iframe
            src={`${form}?embedded=true`}
            title="How was ZAOstock? feedback form"
            loading="lazy"
            className="block w-full max-w-[760px] mt-10 h-[1600px] rounded-lg border border-ink-950/10 bg-white"
          >
            Loading the form. If it does not appear, use the button above.
          </iframe>
        ) : null}
      </Section>
    </SiteShell>
  );
}
