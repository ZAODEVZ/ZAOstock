'use client';

import { useState } from 'react';
import { REPLAY_PARTS, DEFAULT_REPLAY_PART, REPLAY_NOTE, replayPartEmbedSrc, replayPartWatchHref, replayHostName, replayPartLabel } from '@/content/replay';

const MANY = REPLAY_PARTS.length > 1;

// One player. Only the chosen part's iframe is on the page, so a visitor never
// loads more than one player. With a single recording the part buttons
// are not shown.
export function ReplayPlayer() {
  const [part, setPart] = useState<number>(DEFAULT_REPLAY_PART);
  const current = REPLAY_PARTS.find((p) => p.part === part) ?? REPLAY_PARTS[0];

  return (
    <div className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-4 shadow-hard sm:p-6">
      <div className="aspect-video w-full overflow-hidden rounded-[10px] bg-black">
        <iframe key={current.id} src={replayPartEmbedSrc(current)} className="h-full w-full" allowFullScreen title={current.title} />
      </div>
      <p className="m-0 mt-3 text-sm font-bold text-ink-950">
        {MANY ? `${replayPartLabel(current)}: ` : ''}
        {current.window}. {current.length}.
      </p>
      {MANY && (
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose a part of the recording">
        {REPLAY_PARTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPart(p.part)}
            aria-pressed={p.part === part}
            className={`rounded-pill border-[1.5px] px-[14px] py-[7px] text-sm font-bold ${
              p.part === part ? 'border-red-700 bg-red-700 text-onfill' : 'border-red-700 text-red-700 hover:bg-red-700/10'
            }`}
          >
            {replayPartLabel(p)} <span className="font-mono text-[11px] font-normal">{p.length}</span>
          </button>
        ))}
      </div>
      )}
      <p className="m-0 mt-3 text-xs text-ink-muted">
        {REPLAY_NOTE}{' '}
        <a href={replayPartWatchHref(current)} target="_blank" rel="noopener noreferrer" className="font-bold text-ink-950 underline">
          {MANY ? `Open this part on ${replayHostName(current)}` : `Open it on ${replayHostName(current)}`}
        </a>
        .
      </p>
      <noscript>
        <ul className="m-0 mt-2 list-disc pl-5 text-sm">
          {REPLAY_PARTS.map((p) => (
            <li key={p.id}>
              <a href={replayPartWatchHref(p)}>{p.title}</a> ({p.length})
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
