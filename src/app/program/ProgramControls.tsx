'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'zaostock_sunlight_mode';

export function ProgramControls() {
  const [sunlight, setSunlight] = useState<boolean>(false);
  const [activeVenue, setActiveVenue] = useState<'ALL' | 'OUT' | 'IN'>('ALL');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const enabled = saved === 'true';
        setSunlight(enabled);
        applySunlightMode(enabled);
        return;
      }
    } catch {
      // localStorage may fail in private browsing
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-contrast: more)');
      if (media.matches) {
        setSunlight(true);
        applySunlightMode(true);
      }
      const listener = (e: MediaQueryListEvent) => {
        setSunlight(e.matches);
        applySunlightMode(e.matches);
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  function applySunlightMode(enable: boolean) {
    const el = document.getElementById('program-schedule-container');
    if (el) {
      if (enable) {
        el.classList.add('sunlight-active');
      } else {
        el.classList.remove('sunlight-active');
      }
    }
  }

  function toggleSunlight() {
    const next = !sunlight;
    setSunlight(next);
    applySunlightMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore
    }
  }

  function handleFilter(venue: 'ALL' | 'OUT' | 'IN') {
    setActiveVenue(venue);
    const outSection = document.getElementById('b-1200');
    const inSection = document.getElementById('b-1800');

    if (venue === 'OUT') {
      if (outSection) outSection.style.display = 'block';
      if (inSection) inSection.style.display = 'none';
      outSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (venue === 'IN') {
      if (outSection) outSection.style.display = 'none';
      if (inSection) inSection.style.display = 'block';
      inSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      if (outSection) outSection.style.display = 'block';
      if (inSection) inSection.style.display = 'block';
    }
  }

  return (
    <div
      role="toolbar"
      aria-label="Program view and outdoor contrast controls"
      className="my-6 p-4 rounded-md border-[1.5px] border-gold-500/60 bg-paper-200 shadow-hard flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-sans text-eyebrow font-extrabold uppercase tracking-[0.16em] text-ink-muted mr-1">
          Stage view:
        </span>
        <button
          type="button"
          onClick={() => handleFilter('ALL')}
          aria-pressed={activeVenue === 'ALL'}
          className={`font-sans text-xs uppercase tracking-[0.06em] font-bold px-3 py-1.5 rounded-pill border-[1.5px] transition-all cursor-pointer ${
            activeVenue === 'ALL'
              ? 'bg-ink-950 text-paper-200 border-ink-950 shadow-none'
              : 'bg-paper-100 text-ink-950 border-ink-950/30 hover:bg-paper-200'
          }`}
        >
          All Stages
        </button>
        <button
          type="button"
          onClick={() => handleFilter('OUT')}
          aria-pressed={activeVenue === 'OUT'}
          className={`font-sans text-xs uppercase tracking-[0.06em] font-bold px-3 py-1.5 rounded-pill border-[1.5px] transition-all cursor-pointer ${
            activeVenue === 'OUT'
              ? 'bg-gold-500 text-ink-950 border-ink-950 shadow-none'
              : 'bg-paper-100 text-ink-950 border-ink-950/30 hover:bg-paper-200'
          }`}
        >
          Outdoors (12-6pm)
        </button>
        <button
          type="button"
          onClick={() => handleFilter('IN')}
          aria-pressed={activeVenue === 'IN'}
          className={`font-sans text-xs uppercase tracking-[0.06em] font-bold px-3 py-1.5 rounded-pill border-[1.5px] transition-all cursor-pointer ${
            activeVenue === 'IN'
              ? 'bg-denim-400 text-paper-200 border-denim-400 shadow-none'
              : 'bg-paper-100 text-ink-950 border-ink-950/30 hover:bg-paper-200'
          }`}
        >
          Indoors (From 6pm)
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSunlight}
          aria-pressed={sunlight}
          aria-label={sunlight ? 'Disable outdoor sunlight contrast mode' : 'Enable outdoor sunlight contrast mode for glare reduction'}
          className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] font-bold px-3.5 py-1.5 rounded-pill border-[1.5px] cursor-pointer transition-all ${
            sunlight
              ? 'bg-gold-400 text-ink-950 border-ink-950 shadow-hard'
              : 'bg-paper-100 text-ink-950 border-ink-950/40 hover:bg-paper-200'
          }`}
        >
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full border border-ink-950 transition-colors ${
              sunlight ? 'bg-red-600' : 'bg-transparent'
            }`}
            aria-hidden="true"
          />
          {sunlight ? 'Sunlight Mode: ON' : 'Sunlight Mode'}
        </button>
      </div>
    </div>
  );
}
