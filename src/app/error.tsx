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
    <main className="min-h-[100dvh] bg-paper-100 text-ink-950 flex items-center justify-center px-6">
      <div className="max-w-md">
        <p className="font-mono text-eyebrow font-bold uppercase tracking-[0.12em] text-denim-400">
          ZAO Festivals presents ZAOstock
        </p>
        <h1 className="mt-4 font-display font-normal text-[2.75rem] leading-[1.05] tracking-[-0.01em] sm:text-h1">Off-key for a sec.</h1>
        <p className="mt-4 text-lg text-ink-secondary">
          Something went wrong on our end. The festival is still on: October 3, 2026 at the
          Franklin Street Parklet in Ellsworth, Maine.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="zs-btn zs-btn--primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="zs-btn zs-btn--secondary"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
