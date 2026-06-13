import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not found | ZAOstock',
  description: 'That page does not exist.',
};

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-[#0a1628] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#f5a623]">
          ZAO Festivals presents ZAOstock
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Lost the beat.</h1>
        <p className="mt-4 text-gray-300">
          That page does not exist. The festival is October 3, 2026 at the Franklin Street Parklet in
          Ellsworth, Maine.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-6 py-3 text-sm transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/musicians"
            className="border border-white/20 hover:border-[#f5a623]/50 rounded-lg px-6 py-3 text-sm transition-colors"
          >
            Get on the lineup
          </Link>
        </div>
      </div>
    </main>
  );
}
