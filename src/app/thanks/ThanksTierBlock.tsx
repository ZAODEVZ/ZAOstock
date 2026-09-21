'use client';

import { useSearchParams } from 'next/navigation';
import { FESTIVAL } from '@/content/festival';

// `tier` is UNVERIFIED display state - Stripe's redirect can carry
// ?tier=pro, but the site has no way to confirm what was actually bought
// (see the page's own comment on why: no secret key, no webhook, no
// server route). Nothing here gates on it or treats it as proof of
// purchase - it only changes which paragraph renders, and the page must
// still read sensibly with no param at all.
//
// Booking link is deliberately Zaal's existing generic Cal.com event
// (cal.com/bettercallzaal/30min), chosen over building a dedicated event
// type - his call, 2026-09-20. Because the link is generic, the two
// things a dedicated event type would carry structurally have to be
// carried by this copy instead, and neither is decorative:
//   - the date: the link has no end date, so nothing stops a booking
//     into November unless the copy says "before the event"
//   - "mention your Pro Ticket": the link is shared with every other
//     booking on his calendar, so this line is the only signal he has for
//     matching a booking back to a sale (needed around FESTIVAL.date to
//     confirm all Pro buyers claimed their 1:1)
export function ThanksTierBlock() {
  const params = useSearchParams();
  const tier = params.get('tier');

  if (tier !== 'pro') return null;

  return (
    <section className="space-y-2">
      <h2 className="font-display text-h3 text-ink-950">Your 1:1</h2>
      <p className="text-base text-ink-950 leading-relaxed measure">
        Book a slot that suits you:{' '}
        <a
          href="https://cal.com/bettercallzaal/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="text-denim-400 hover:text-denim-500 underline underline-offset-4"
        >
          cal.com/bettercallzaal/30min
        </a>
        . Please book before {FESTIVAL.shortDate}, and mention your Pro Ticket when you do.
      </p>
    </section>
  );
}
