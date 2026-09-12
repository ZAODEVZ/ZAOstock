'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/content/site';

// Six links plus the RSVP button. /team is not in the nav. Hamburger under
// 640px is the only stateful thing in the shell.
//
// The button points at /tickets, NOT straight at FESTIVAL.rsvpUrl. It used to go
// direct to the Luma RSVP, which meant the site-wide primary action skipped past
// the Pro Ticket entirely and it was reachable only by someone who thought to
// open /donate. /tickets leads with the same free RSVP, so the fast path is one
// extra click, and the paid option finally exists in the funnel.
//
// The LABEL stays "RSVP" on purpose. "Tickets" reads as "this costs money" on a
// festival whose whole proposition is free admission.
//
// In the front page's look since 2026-09-10: a cream bar with a hairline, her
// fireside button. The bar is 66px tall; the homepage hero pins itself under
// it (home.module.css --header-h), so keep the height if this changes. The
// white moose sits on night, which stays dark in both modes.
const NAV = [
  { href: '/program', label: 'Program' },
  { href: '/musicians', label: 'Musicians' },
  { href: '/artists', label: 'Artists' },
  { href: '/apply', label: 'Volunteer' },
  { href: '/sponsor', label: 'Sponsor' },
  { href: '/press', label: 'Press' },
];

const RSVP =
  'inline-flex items-center font-sans text-eyebrow font-bold uppercase tracking-[0.12em] px-4 py-2 rounded-pill bg-linear-to-b from-fireside to-ember text-onfill shadow-hard focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-40 h-[66px] bg-paper-100/92 backdrop-blur-[10px] border-b border-gold-500/40">
      <div className="wrap h-full flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 text-ink-950" onClick={() => setOpen(false)}>
          <span className="h-9 w-9 shrink-0 rounded-full bg-night flex items-center justify-center overflow-hidden">
            <Image src={SITE.logo.src} alt="" width={36} height={36} className="h-8 w-8 object-contain" priority />
          </span>
          <span className="font-display text-[21px] leading-none">ZAOstock</span>
        </Link>

        <nav aria-label="Primary" className="hidden sm:flex items-center gap-5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-secondary hover:text-red-700">
              {n.label}
            </Link>
          ))}
          <Link href="/tickets" className={RSVP}>
            RSVP
          </Link>
        </nav>

        <button
          type="button"
          className="sm:hidden flex flex-col justify-center gap-[5px] w-10 h-9 px-2 border-[1.5px] border-ink-950/40 rounded-[8px] bg-transparent focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]"
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
          <div className="flex flex-col gap-3 p-4 bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard-lg">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="font-sans text-sm font-bold uppercase tracking-[0.1em] text-ink-950" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
            <Link href="/tickets" onClick={() => setOpen(false)} className={`${RSVP} self-start`}>
              RSVP
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
