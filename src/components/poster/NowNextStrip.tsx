'use client';

import { useEffect, useState } from 'react';
import { nowNextState, type NowNextState } from '@/content/live-strip';
import { Card, Eyebrow } from './primitives';

// Client-only, same reasoning as Countdown.tsx: the page is static, so a
// server-rendered value would be frozen at build time. Ticks every 30s -
// nothing here needs finer than that.

export function NowNextStrip({ className }: { className?: string }) {
  const [state, setState] = useState<NowNextState | null>(null);

  useEffect(() => {
    const tick = () => setState(nowNextState(Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (state === null) {
    // Same min-height either way, so nothing jumps when the real value lands.
    return <Card className={['min-h-[5.5rem]', className].filter(Boolean).join(' ')}>{null}</Card>;
  }

  if (state.phase === 'before' || state.phase === 'after') {
    return (
      <div aria-live="polite">
        <Card className={className}>
          <p className="font-sans font-extrabold text-ink-950 text-lg leading-tight m-0">{state.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <Card className={className}>
        <Eyebrow>On now</Eyebrow>
        <p className="font-sans font-extrabold text-ink-950 text-xl leading-tight mt-1 mb-0">{state.onNow ?? 'Between sets'}</p>
        {state.onNext ? (
          <p className="font-sans text-sm text-ink-secondary mt-2 mb-0">
            Up next: <span className="font-extrabold text-ink-950">{state.onNext}</span>
          </p>
        ) : null}
      </Card>
    </div>
  );
}
