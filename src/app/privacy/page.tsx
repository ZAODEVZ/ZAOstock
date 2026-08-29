import { Metadata } from 'next';
import { OG_IMAGE } from '@/lib/meta';
import { SiteShell, Section, Eyebrow } from '@/components/poster';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What ZAOstock collects when you RSVP, volunteer, or submit an artist form, and how it is used.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy | ZAOstock',
    description: 'What ZAOstock collects and how it is used.',
    url: 'https://zaostock.com/privacy',
    images: [OG_IMAGE],
  },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <Section first className="pt-12 sm:pt-16">
      <div className="max-w-[760px] space-y-8">
        <div className="space-y-2">
          <Eyebrow tone="denim">Privacy</Eyebrow>
          <h1 className="font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1">Privacy</h1>
          <p className="text-lg text-ink-secondary measure">
            Plain language, no legal boilerplate. This is what ZAOstock actually collects and what happens to it.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">What we collect</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            If you RSVP, apply to volunteer, sign up for the cypher, submit an artist form, or fill out an
            artist rider, we collect what you actually type into that form - typically your name and email,
            sometimes a phone number, social links, or a message. We don&apos;t collect anything beyond what
            the form asks for. This site uses Vercel Analytics for anonymous traffic counts (page views, not
            you personally) - it doesn&apos;t use cookies or track you across other sites. We don&apos;t run
            ad scripts or third-party tracking pixels of any kind.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">What it&apos;s used for</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            Coordinating the event - confirming your RSVP, reaching out about a volunteer shift, following up
            on an artist submission, or reviewing a suggestion. It goes into ZAOstock&apos;s own team
            dashboard, visible to the small volunteer team running the event. We don&apos;t sell it, rent it,
            or share it with advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">The mobile app &amp; push notifications</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            If you&apos;re a signed-in team member using the ZAO Festivals app and you allow notifications, we
            store a device push token so we can notify you about tasks assigned to you. It&apos;s tied to your
            team account, not shared with anyone outside the team, and only used to send you notifications about
            your own work. You can turn this off anytime in your device&apos;s notification settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Where it lives</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            In a Supabase-hosted database used to run this site and its team dashboard. Access is
            restricted to the site&apos;s own backend - team members log in separately, and it&apos;s not a
            publicly browsable database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display font-normal text-h3 text-ink-950">Removing your info</h2>
          <p className="text-base text-ink-950 leading-relaxed measure">
            Email{' '}
            <a href="mailto:info@thezao.com?subject=ZAOstock%20data%20request" className="text-denim-400 hover:text-denim-500 underline underline-offset-4">
              info@thezao.com
            </a>{' '}
            and we&apos;ll remove what you submitted. This is a small, volunteer-run community event, not a
            company with a dedicated privacy team - if something&apos;s unclear or you want to know exactly
            what we have on file, just ask.
          </p>
        </section>
      </div>
      </Section>
    </SiteShell>
  );
}
