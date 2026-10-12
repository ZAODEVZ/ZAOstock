'use client';

import { useState } from 'react';

// Share this page: the phone's own share sheet where there is one, otherwise
// copy the link. Zaal, 2026-10-03: "add more cta buttons on the live page".
export function ShareButton({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Cancelled share sheet or blocked clipboard: nothing to do.
    }
  }

  return (
    <button type="button" onClick={share} className={className}>
      {copied ? 'Link copied' : 'Share this page'}
    </button>
  );
}
