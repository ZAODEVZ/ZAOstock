'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';

// The hero background video is 1.8 MB on a page people open on cell service,
// standing in the street the video shows. Browsers fetch a <video src> even
// when CSS hides it, and they fetch one present in the prerendered HTML before
// any client code runs - so the server render must not contain the video at
// all. Gate the mount, not the display: the server and constrained clients
// render the still poster, and the video mounts only after hydration on a
// client that passes the checks.

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
  // The server snapshot says "do not load": prerendered HTML ships the
  // poster only, so no browser can fetch the mp4 before hydration. After
  // mount the client snapshot evaluates the constraints and unconstrained
  // clients swap the poster for the video.
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
    () => false,
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
