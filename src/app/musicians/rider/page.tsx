import type { Metadata } from 'next';
import Link from 'next/link';
import { RiderForm } from './RiderForm';

export const metadata: Metadata = {
  title: 'Artist Rider · ZAOstock',
  description:
    'Confirmed for the ZAOstock lineup? Complete your performance & participation rider - schedule, equipment, backing tracks, merch, interview, and retreat.',
  robots: { index: false, follow: false },
};

export default function RiderPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-16">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/musicians" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; Musicians
          </Link>
          <span className="text-xs text-gray-500">Performance Rider</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-3">
          <p className="inline-block rounded-full bg-[#f5a623]/10 px-3 py-1 text-xs text-[#f5a623] font-medium border border-[#f5a623]/30">
            Confirmed artists
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Performance &amp; Participation Rider
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Thanks for being part of the lineup. This is the official rider and information packet.
            Complete the sections that apply so we can run a smooth, organized event for everyone.
            If you haven&apos;t been confirmed yet, start at{' '}
            <Link href="/musicians/submit" className="text-[#f5a623] hover:underline">
              /musicians/submit
            </Link>{' '}
            instead.
          </p>
        </div>

        <RiderForm />

        <p className="text-[11px] text-gray-600 leading-relaxed border-t border-white/[0.08] pt-4">
          The host is not responsible for lost, stolen, or damaged property. Questions about your
          rider? Email{' '}
          <a href="mailto:info@thezao.com" className="text-gray-400 hover:text-[#f5a623]">
            info@thezao.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
