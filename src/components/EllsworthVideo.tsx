'use client';

import { useEffect, useRef } from 'react';
import { shouldAutoplayBgVideo } from '@/lib/should-autoplay-bg-video';

const VIDEO_SRC = '/brand/home/ellsworth.mp4';
const POSTER_SRC = '/brand/home/historic_main_street_storefronts.webp';

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Decorative background video for the "Why Ellsworth" section.
 *
 * The previous markup used autoPlay + preload="none", but autoplay wins
 * over preload="none" - the browser fetched the 1.8 MB mp4 on first load
 * even for visitors who never scrolled to this section (or who were on
 * cell service standing in the street). Now the video has no `src` until
 * the section scrolls into view, and it never loads at all for visitors
 * with Save-Data, a 2g-class connection, or prefers-reduced-motion (the
 * poster still covers every case).
 */
export default function EllsworthVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!shouldAutoplayBgVideo({
      saveData: connection?.saveData,
      effectiveType: connection?.effectiveType,
      reducedMotion,
    })) {
      return;
    }

    const loadAndPlay = () => {
      if (!video.getAttribute('src')) {
        video.src = VIDEO_SRC;
      }
      video.play().catch(() => {
        // Autoplay can still be refused (e.g. low power mode); the poster stays.
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      loadAndPlay();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadAndPlay();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      poster={POSTER_SRC}
      loop
      muted
      playsInline
      preload="none"
    />
  );
}
