'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import s from './home.module.css';

// THE BALLOON FLIGHT DOWN FRANKLIN STREET. Candy's hero (her site build,
// sent to the design team on 2026-09-10; Zaal: "this is what the site should
// look like"): forty frames scrubbed by scroll, the headline fading out of the
// way as the rider comes close, then back on the way up.
//
// Ported, not copied: the frames are plain files in /public (hers were
// base64-inlined into one 2.6 MB page), and anyone who asks the system for
// reduced motion gets a still frame and a headline that never fades.
//
// EIGHTY FRAMES since 2026-09-13, from the v11 build Candy and attabotty made
// together (Zaal: "Both"). The forty we had were the same flight at half the
// sampling, so the scrub stepped; these are 640x360 and it runs smooth.
//
// They are 5.3 MB in all, so they are NOT all preloaded up front: the opening
// dozen are fetched immediately, the rest once the page has loaded, which keeps
// the first screen at the shell plus one 78 KB frame.

const FRAMES = Array.from({ length: 80 }, (_, i) => `/brand/home/flight/${String(i).padStart(2, '0')}.webp`);
const EAGER = 12;
const FADE_START = 0.32;
const FADE_END = 0.58;

export function HomeHero({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // A still frame, and a headline that never fades.
      section.current?.classList.add(s.heroStill);
      return;
    }
    const done = new Set<number>();
    const preload = (from: number, to: number) => {
      for (let i = Math.max(0, from); i < Math.min(FRAMES.length, to); i += 1) {
        if (done.has(i)) continue;
        done.add(i);
        const im = new window.Image();
        im.src = FRAMES[i];
      }
    };
    preload(0, EAGER);
    // Keep a window around wherever the scrub currently is, instead of
    // fetching the whole sequence once the page has loaded. Measured on the
    // built page, iPhone 13, load and wait 10s with NO scrolling: the old
    // code fetched all 80 frames, 5.09 MB, for a visitor who only ever saw
    // the headline. The frames are 640x360 and ~65 KB each, so 68 unseen ones
    // was most of the page - 8.05 MB total, of which 63% was never on screen.
    //
    // AHEAD is the lead: scroll position changes faster than a request
    // completes on a phone, so caching only what is already showing would
    // stall the very frames the visitor is about to reach.
    const AHEAD = 10;
    const cacheAround = (idx: number) => {
      preload(idx - 2, idx + AHEAD);
      // If they scroll the other way, the frames behind them are worth having.
      if (idx > AHEAD) preload(idx - AHEAD, idx);
    };
    let current = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = section.current;
      if (!el || !img.current || !content.current || !bar.current) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const idx = Math.min(FRAMES.length - 1, Math.floor(progress * FRAMES.length));
      if (idx !== current) {
        current = idx;
        img.current.src = FRAMES[idx];
        cacheAround(idx);
      }
      bar.current.style.width = `${progress * 100}%`;
      const op = progress > FADE_START ? Math.max(0, 1 - (progress - FADE_START) / (FADE_END - FADE_START)) : 1;
      content.current.style.opacity = String(op);
      content.current.style.transform = `translateY(${(1 - op) * -22}px) scale(${1 - (1 - op) * 0.04})`;
      content.current.style.pointerEvents = op < 0.05 ? 'none' : 'auto';
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={section} className={s.hero} id="hero">
      <div className={s.heroSticky}>
        {/* eslint-disable-next-line @next/next/no-img-element -- the src is swapped per frame on scroll */}
        <img ref={img} className={s.scrubImg} src={FRAMES[0]} alt="A balloon coming down over Franklin Street" />
        <div className={s.vignette} />
        <div className={`${s.dots} ${s.halftone} ${s.anim} ${s.d0}`} />
        <div className={`${s.vtag} ${s.anim} ${s.d1}`}>Downeast&nbsp;Maine</div>
        <div ref={content} className={s.heroContent}>
          {children}
        </div>
        <div className={s.runway} />
        <div className={s.progress}>
          <div ref={bar} className={s.progressBar} />
        </div>
      </div>
    </header>
  );
}
