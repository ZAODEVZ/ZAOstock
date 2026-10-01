'use client';

import { useEffect, useRef, useState } from 'react';
import s from './home.module.css';

/**
 * Ellsworth background video with deferred, cellular-conscious loading.
 *
 * WHY THIS EXISTS:
 * `ellsworth.mp4` is 1,819,337 bytes (~1.82 MB). When rendered as an unconditional
 * `<video autoPlay>` tag in the server-rendered DOM, mobile browsers on cellular
 * networks buffer and download the full 1.82 MB stream immediately on initial page
 * load even with `preload="none"`, consuming >55% of the total homepage weight before
 * the visitor ever reaches section #ellsworth.
 *
 * This component:
 * 1. Sets the static poster frame as the CSS background on `.ellBg`, ensuring
 *    instant visual delivery with zero layout shift.
 * 2. Defers video element mounting until the section scrolls within 300px of the
 *    viewport using IntersectionObserver.
 * 3. On mobile viewports (< 768px), `Save-Data: on`, or `prefers-reduced-motion`,
 *    keeps the lightweight WebP poster frame active (~80 KB), preventing unnecessary
 *    cellular bandwidth drain for festival-goers on the street while preserving full
 *    visual design.
 */
export function EllsworthBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // Check constraints: reduced motion, data-saver mode, or mobile viewport.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSaveData = Boolean((navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData);
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isSaveData || isMobile) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setShouldLoadVideo(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={s.ellBg} aria-hidden="true">
      {shouldLoadVideo ? (
        <video
          src="/brand/home/ellsworth.mp4"
          poster="/brand/home/historic_main_street_storefronts.webp"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        />
      ) : null}
      <div className={s.ellBgFade} />
    </div>
  );
}
