import type { Metadata } from 'next';
import Link from 'next/link';
import { MusicianSubmitForm } from './SubmitForm';

export const metadata: Metadata = {
  title: 'Submit Your Music · ZAOstock',
  description:
    'Submit for the ZAOstock 2026 lineup. Artist name, track ideas, MP3 links, contact. One-month-before-event cutoff (Sep 3, 2026) for final materials.',
  openGraph: {
    title: 'Submit Your Music · ZAOstock 2026',
    description: 'Submit for the lineup. Cutoff for final materials is Sep 3, 2026.',
    url: 'https://zaostock.com/musicians/submit',
    type: 'website',
  },
};

export default function MusicianSubmitPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-24 sm:pb-12">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/musicians" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; Musicians
          </Link>
          <span className="text-xs text-gray-500">Submit your music</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="inline-block rounded-full bg-[#f5a623]/10 px-3 py-1 text-xs text-[#f5a623] font-medium border border-[#f5a623]/30">
            ZAOstock 2026 Lineup Submission
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Submit your music</h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Saturday October 3, 2026. Franklin Street Parklet, Ellsworth Maine. We are taking initial submissions now and reviewing on a rolling basis.
          </p>
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">What we need now</p>
          <ul className="text-sm text-gray-300 space-y-1.5">
            <li>- Artist name + contact email</li>
            <li>- A few track or song ideas you would play (rough is fine)</li>
            <li>- MP3 or audio links (Audius, SoundCloud, Spotify, Dropbox, anything)</li>
            <li>- A short bio</li>
            <li>- Where you would travel from, if applicable</li>
          </ul>
          <p className="text-xs text-gray-500 leading-relaxed">
            We do not need polished masters or full artwork yet. Initial materials are fine for selection. Final materials are due by September 3, 2026 - one month out from the festival.
          </p>
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08]">
          <MusicianSubmitForm />
        </div>

        <div className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">What happens next</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            The music team reviews every submission. We reach out at the email you gave with next steps. Independent and ZAO-vetted only - this is not pay-to-play.
          </p>
          <div className="flex gap-2 pt-2">
            <Link
              href="/musicians"
              className="text-xs bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 rounded-lg px-3 py-2 transition-colors"
            >
              Back to musicians page
            </Link>
            <Link
              href="/cypher"
              className="text-xs bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 rounded-lg px-3 py-2 transition-colors"
            >
              ZAOstock Cypher signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
