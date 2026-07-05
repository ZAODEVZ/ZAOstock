'use client';

import { useEffect } from 'react';
import Link from 'next/link';

// Root error boundary. Catches any unhandled exception during render of a
// public route so visitors get a branded page and a way back instead of
// Next.js's bare white 500. Keep this dependency-free and client-only.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the server/console log stream for debugging.
    console.error('[error-boundary]', error);
  }, [error]);

  return (
    <main className="min-h-[100dvh] bg-[#0a1628] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[#f5a623]">
          ZAO Festivals presents ZAOstock
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Off-key for a sec.</h1>
        <p className="mt-4 text-gray-300">
          Something went wrong on our end. The festival is still on — October 3, 2026 at the
          Franklin Street Parklet in Ellsworth, Maine.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#f5a623] hover:bg-[#ffd700] text-black font-bold rounded-lg px-6 py-3 text-sm transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-white/20 hover:border-[#f5a623]/50 rounded-lg px-6 py-3 text-sm transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
