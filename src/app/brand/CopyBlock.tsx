'use client';

import { useState } from 'react';

// Same copy-to-clipboard shape as src/app/team/RsvpList.tsx and
// src/app/team/SnapshotButton.tsx - navigator.clipboard.writeText, a
// 2-second "Copied!" flash, nothing new invented here.
export function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <li className="bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard p-5 flex flex-col gap-3 list-none">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-muted m-0">{label}</p>
        <button
          onClick={copy}
          className="text-xs font-bold uppercase tracking-[0.08em] text-denim-400 hover:text-denim-500 underline underline-offset-4"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-ink-secondary whitespace-pre-line m-0">{text}</p>
    </li>
  );
}
