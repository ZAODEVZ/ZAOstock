import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy | ZAOstock',
  description: 'What ZAOstock collects when you RSVP, volunteer, or submit an artist form, and how it is used.',
  openGraph: {
    title: 'Privacy | ZAOstock',
    description: 'What ZAOstock collects and how it is used.',
    url: 'https://zaostock.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-16">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; ZAOstock
          </Link>
          <span className="text-xs text-gray-500">Privacy</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Privacy</h1>
          <p className="text-sm text-gray-400">
            Plain language, no legal boilerplate. This is what ZAOstock actually collects and what happens to it.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#f5a623]">What we collect</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            If you RSVP, apply to volunteer, sign up for the cypher, submit an artist form, or fill out an
            artist rider, we collect what you actually type into that form - typically your name and email,
            sometimes a phone number, social links, or a message. We don&apos;t collect anything beyond what
            the form asks for. This site uses Vercel Analytics for anonymous traffic counts (page views, not
            you personally) - it doesn&apos;t use cookies or track you across other sites. We don&apos;t run
            ad scripts or third-party tracking pixels of any kind.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#f5a623]">What it&apos;s used for</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Coordinating the event - confirming your RSVP, reaching out about a volunteer shift, following up
            on an artist submission, or reviewing a suggestion. It goes into ZAOstock&apos;s own team
            dashboard, visible to the small volunteer team running the event. We don&apos;t sell it, rent it,
            or share it with advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#f5a623]">The mobile app &amp; push notifications</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            If you&apos;re a signed-in team member using the ZAO Festivals app and you allow notifications, we
            store a device push token so we can notify you about tasks assigned to you. It&apos;s tied to your
            team account, not shared with anyone outside the team, and only used to send you notifications about
            your own work. You can turn this off anytime in your device&apos;s notification settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#f5a623]">Where it lives</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            In a Supabase-hosted database used to run this site and its team dashboard. Access is
            restricted to the site&apos;s own backend - team members log in separately, and it&apos;s not a
            publicly browsable database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#f5a623]">Removing your info</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Email{' '}
            <a href="mailto:info@thezao.com?subject=ZAOstock%20data%20request" className="text-[#f5a623] hover:text-[#ffd700] underline">
              info@thezao.com
            </a>{' '}
            and we&apos;ll remove what you submitted. This is a small, volunteer-run community event, not a
            company with a dedicated privacy team - if something&apos;s unclear or you want to know exactly
            what we have on file, just ask.
          </p>
        </section>

        <div className="text-center pt-4">
          <Link href="/" className="text-sm text-[#f5a623] hover:text-[#ffd700]">
            Back to ZAOstock
          </Link>
        </div>
      </div>
    </div>
  );
}
