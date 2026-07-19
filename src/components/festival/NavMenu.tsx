'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export interface NavMenuItem {
  href: string;
  label: string;
}

/**
 * Accessible dropdown for the header's grouped nav ("Get Involved"). Opens on
 * hover for mouse users and on click/keyboard for everyone else; closes on
 * Escape, blur-out, or outside click. Keeps the top nav short instead of
 * spilling every persona link across the header.
 */
export function NavMenu({ label, items }: { label: string; items: NavMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={wrapRef}
      className="relative hidden sm:block"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-400 hover:text-[#f5a623] transition-colors"
      >
        {label}
        <span
          aria-hidden
          className={`inline-block text-[8px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      <div
        role="menu"
        className={`absolute right-0 top-full pt-3 z-50 transition-all duration-150 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="min-w-[180px] bg-[#0d1b2a] border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.55)] py-1.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-gray-300 hover:text-[#f5a623] hover:bg-white/[0.04] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
