'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/content/site';

// Seven links plus the Replay button. /team is not in the nav. Hamburger under
// 640px is the only stateful thing in the shell.
//
// PAST TENSE, 2026-10-04: ZAOstock 2026 happened on 3 October, so the RSVP button
// is gone (RSVP is over). The button now reads "Replay" and goes to /live, the
// recording of the day. The nav LINK to /tickets stays: that page is now where
// you support the artists.
//
// In the front page's look since 2026-09-10: a cream bar with a hairline, her
// fireside button. The bar is 66px tall; the homepage hero pins itself under
// it (home.module.css --header-h), so keep the height if this changes. The
// white moose sits on night, which stays dark in both modes.
const NAV = [
  // Festival-week order (Zaal, 2026-09-30: "theres a press page but not a
  // media page at the top ... make sure our nav bar and all pages are up to
  // date"): what an attendee needs this week. Sponsor and Press moved to the
  // footer; Volunteer now opens the sign-up sheet (/apply stays live).
  { href: '/program', label: 'Program' },
  { href: '/artists', label: 'Artists' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/afterparty', label: 'After-party' },
  { href: '/live', label: 'Live' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/media', label: 'Media' },
];

const REPLAY =
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

        {/* lg, not sm: at 768-820px (iPad portrait) seven links plus the button measured
            828-831px wide and pushed it off-screen (live, 2026-09-29). Tablets
            get the menu button like phones; the full row starts at 1024. */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-5">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-ink-secondary hover:text-red-700">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Replay stays outside the hamburger on every width - it is the
              site-wide primary action (see the comment above), so a mobile
              visitor should never have to open the menu to find it. */}
          <Link href="/live" className={REPLAY}>
            Replay
          </Link>

          <button
            type="button"
            className="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-9 px-2 border-[1.5px] border-ink-950/40 rounded-[8px] bg-transparent focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)]"
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
      </div>

      {open ? (
        <nav
          id="site-nav-mobile"
          aria-label="Primary"
          className="lg:hidden wrap pb-4"
        >
          <div className="flex flex-col gap-3 p-4 bg-paper-200 border-[1.5px] border-gold-500/60 rounded-[14px] shadow-hard-lg">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="font-sans text-sm font-bold uppercase tracking-[0.1em] text-ink-950" onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
