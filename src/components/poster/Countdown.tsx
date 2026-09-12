'use client';

import { useEffect, useState } from 'react';
import { countdownState, type CountdownState } from '@/lib/countdown';

// Rendered on the client only. The pages are static, so a server-rendered
// count would be frozen at build time and could be days stale; the server
// renders an empty box of the same height, and the real count fills it in.
// Minutes are the finest unit: a seconds ticker is noise on a poster page.

function unit(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export function Countdown({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const [state, setState] = useState<CountdownState | null>(null);

  useEffect(() => {
    const tick = () => setState(countdownState(Date.now()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // After the street clears it says nothing: no zeros, no counting up.
  if (state?.phase === 'after') return null;

  return (
    <p className={['min-h-[1.5rem] font-mono text-sm font-bold m-0 tabular', onDark ? 'text-onfill' : 'text-ink-950', className].filter(Boolean).join(' ')} aria-live="polite">
      {state === null ? null : state.phase === 'live' ? (
        <span className={onDark ? 'text-gold-400' : 'text-red-700'}>On now on the parklet, until six.</span>
      ) : (
        <>
          <span className={onDark ? 'text-gold-400' : 'text-red-700'}>
            {unit(state.days, 'day', 'days')}, {unit(state.hours, 'hour', 'hours')}, {unit(state.minutes, 'minute', 'minutes')}
          </span>{' '}
          to the doors.
        </>
      )}
    </p>
  );
}
