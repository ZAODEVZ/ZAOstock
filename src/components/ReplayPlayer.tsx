'use client';

import { useState } from 'react';
import { REPLAY_PARTS, DEFAULT_REPLAY_PART, replayEmbedSrc, replayWatchHref } from '@/content/replay';

// One player, six parts. Only the chosen part's iframe is on the page, so a
// visitor never loads six Twitch players at once.
export function ReplayPlayer() {
  const [part, setPart] = useState<number>(DEFAULT_REPLAY_PART);
  const current = REPLAY_PARTS.find((p) => p.part === part) ?? REPLAY_PARTS[0];

  return (
    <div className="rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-4 shadow-hard sm:p-6">
      <div className="aspect-video w-full overflow-hidden rounded-[10px] bg-black">
        <iframe key={current.id} src={replayEmbedSrc(current.id)} className="h-full w-full" allowFullScreen title={current.title} />
      </div>
      <p className="m-0 mt-3 text-sm font-bold text-ink-950">
        Part {current.part} of {REPLAY_PARTS.length}: {current.window}. {current.length}.
      </p>
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
            Part {p.part} <span className="font-mono text-[11px] font-normal">{p.length}</span>
          </button>
        ))}
      </div>
      <p className="m-0 mt-3 text-xs text-ink-muted">
        The stream reconnected a few times, so the day is in six parts. Times are approximate.{' '}
        <a href={replayWatchHref(current.id)} target="_blank" rel="noopener noreferrer" className="font-bold text-ink-950 underline">
          Open this part on Twitch
        </a>
        .
      </p>
      <noscript>
        <ul className="m-0 mt-2 list-disc pl-5 text-sm">
          {REPLAY_PARTS.map((p) => (
            <li key={p.id}>
              <a href={replayWatchHref(p.id)}>{p.title}</a> ({p.length})
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
