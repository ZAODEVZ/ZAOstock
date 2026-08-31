'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/content/site';

// Six links plus the gold RSVP badge. /team is not in the nav. Hamburger under
// 640px is the only stateful thing in the shell.
//
// The badge points at /tickets, NOT straight at FESTIVAL.rsvpUrl. It used to go
// direct to the Luma RSVP, which meant the site-wide primary action skipped past
// the Pro Ticket entirely and it was reachable only by someone who thought to
// open /donate. /tickets leads with the same free RSVP, so the fast path is one
// extra click, and the paid option finally exists in the funnel.
//
// The LABEL stays "RSVP" on purpose. "Tickets" reads as "this costs money" on a
// festival whose whole proposition is free admission.
const NAV = [
  { href: '/program', label: 'Program' },
  { href: '/musicians', label: 'Musicians' },
  { href: '/artists', label: 'Artists' },
  { href: '/apply', label: 'Volunteer' },
  { href: '/sponsor', label: 'Sponsor' },
  { href: '/press', label: 'Press' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 bg-paper-200/92 backdrop-blur-[8px] border-b-2 border-ink-950">
      <div className="wrap flex items-center justify-between gap-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 text-ink-950" onClick={() => setOpen(false)}>
          <Image src={SITE.badge.src} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover border-2 border-ink-950" priority />
          <span className="font-display text-[19px] tracking-[-0.01em]">ZAOstock</span>
        </Link>

        <nav aria-label="Primary" className="hidden sm:flex items-center gap-5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="font-sans text-xs font-bold uppercase tracking-[0.04em] text-ink-secondary hover:text-ink-950">
              {n.label}
            </Link>
          ))}
          <Link
            href="/tickets"
            className="inline-flex items-center font-mono text-eyebrow font-bold uppercase tracking-[0.04em] px-3.5 py-1.5 rounded-pill border-2 border-ink-950 bg-gold-400 text-ink-950 hover:bg-gold-500 focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]"
          >
            RSVP
          </Link>
        </nav>

        <button
          type="button"
          className="sm:hidden flex flex-col justify-center gap-[5px] w-10 h-9 px-2 border-2 border-ink-950 rounded-sm bg-transparent focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 bg-ink-950" />
          <span className="block h-0.5 bg-ink-950" />
          <span className="block h-0.5 bg-ink-950" />
        </button>
      </div>

      {open ? (
        <nav
          id="site-nav-mobile"
          aria-label="Primary"
          className="sm:hidden wrap pb-4"
        >
          <div className="flex flex-col gap-3 p-4 bg-paper-100 border-2 border-ink-950 rounded-md shadow-hard-lg">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="font-sans text-sm font-bold uppercase tracking-[0.04em] text-ink-950" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
            <Link
              href="/tickets"
              onClick={() => setOpen(false)}
              className="inline-flex self-start items-center font-mono text-eyebrow font-bold uppercase tracking-[0.04em] px-3.5 py-1.5 rounded-pill border-2 border-ink-950 bg-gold-400 text-ink-950"
            >
              RSVP
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
