'use client';

import { useSearchParams } from 'next/navigation';

// `tier` is UNVERIFIED display state - Stripe's redirect can carry
// ?tier=pro, but the site has no way to confirm what was actually bought
// (see the page's own comment on why: no secret key, no webhook, no
// server route). Nothing here gates on it or treats it as proof of
// purchase - it only changes which paragraph renders, and the page must
// still read sensibly with no param at all.
//
// Pro Ticket 1:1 booking mechanism is an OPEN QUESTION as of 2026-09-20 -
// do not invent a booking link. Zaal has a Cal.com booker
// (cal.com/bettercallzaal/zabal-games-workshop-slot) but that is the
// ZABAL Gamez workshop slot, not a ZAOstock thing, and pointing Pro
// buyers at it would be wrong. Until there's a real answer, this says
// he'll be in touch by email.
export function ThanksTierBlock() {
  const params = useSearchParams();
  const tier = params.get('tier');

  if (tier !== 'pro') return null;

  return (
    <section className="space-y-2">
      <h2 className="font-display font-normal text-h3 text-ink-950">Your 1:1</h2>
      <p className="text-base text-ink-950 leading-relaxed measure">
        Zaal will be in touch by email to set up your 1:1 - no need to book anything yourself right now.
      </p>
    </section>
  );
}
