'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';

// The hero background video is 1.1 MB (re-encoded 2026-09-28; was 1.8 MB) on a
// page people open on cell service, standing in the street the video shows.
// Browsers fetch a <video src> even when CSS hides it, so the old markup made
// reduced-motion visitors pay for a video they never saw. Gate the mount, not
// the display: when motion is reduced or the connection is constrained, render
// the still poster and never fetch the mp4 at all.

export type ConnectionInfo = {
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType?: string;
};

export function shouldLoadVideo({ reducedMotion, saveData, effectiveType }: ConnectionInfo): boolean {
  if (reducedMotion) return false;
  if (saveData) return false;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return false;
  return true;
}

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
};

export default function HeroVideo() {
  // Server snapshot says "load" so SSR markup matches the unconstrained
  // common case; the client snapshot re-evaluates constraints before the
  // browser starts fetching the mp4.
  const load = useSyncExternalStore(
    () => () => {},
    () => {
      const conn = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
      return shouldLoadVideo({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        saveData: conn?.saveData === true,
        effectiveType: conn?.effectiveType,
      });
    },
    () => true,
  );

  if (!load) {
    return (
      <Image
        src="/brand/home/historic_main_street_storefronts.webp"
        alt=""
        width={680}
        height={694}
        unoptimized
        className="heroVideoStill"
      />
    );
  }

  return (
    <video
      src="/brand/home/ellsworth.mp4"
      poster="/brand/home/historic_main_street_storefronts.webp"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
    />
  );
}
