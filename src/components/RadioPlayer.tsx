'use client';

import { useEffect, useRef, useState } from 'react';

// ONE-TAP RADIO PLAYER. Zaal, 2026-10-01: "can we somehow have the 2 radio
// seshions on the website in a good audio player so peopel can just press on
// them there". The browser's own <audio controls> was on /media already, but it
// is small, looks different in every browser and is fiddly on a phone. This is
// one big play button, a bar you can tap or drag to seek, and the time.
//
// Only one recording plays at a time: starting one pauses any other on the page
// through a window event, so two players never talk over each other.
// preload="none" keeps the page from downloading 15 MB of audio until someone
// actually presses play.

const PLAY_EVENT = 'zaostock:radio-play';

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function RadioPlayer({ src, title, detail }: { src: string; title: string; detail?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const other = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== src) audio.current?.pause();
    };
    window.addEventListener(PLAY_EVENT, other);
    return () => window.removeEventListener(PLAY_EVENT, other);
  }, [src]);

  function toggle() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) {
      window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: src }));
      void a.play();
    } else {
      a.pause();
    }
  }

  function seek(value: number) {
    const a = audio.current;
    if (!a || !Number.isFinite(a.duration)) return;
    a.currentTime = value;
    setTime(value);
  }

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-4 rounded-[14px] border-[1.5px] border-gold-500/60 bg-paper-200 p-4 shadow-hard">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-500 text-onfill transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-denim-300"
      >
        {playing ? (
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <rect x="5" y="4" width="5" height="16" rx="1" />
            <rect x="14" y="4" width="5" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="ml-1">
            <path d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5z" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-bold leading-snug text-ink-950">{title}</p>
        {detail ? <p className="m-0 mt-0.5 text-xs text-ink-muted">{detail}</p> : null}
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={`Seek ${title}`}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-red-500"
            style={{ background: `linear-gradient(to right, var(--color-red-500) ${pct}%, rgba(36,30,21,0.15) ${pct}%)` }}
          />
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-muted">
            {fmt(time)} / {duration ? fmt(duration) : '--:--'}
          </span>
        </div>
      </div>
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />
    </div>
  );
}
