import { NextRequest, NextResponse } from 'next/server';
import { stripeLinkFor } from '@/content/site';

/**
 * GET /t/<tier> - a short, postable URL for a Stripe Payment Link
 * (zaostock.com/t/supporter, zaostock.com/t/pro). Built for the newsletter
 * rather than ticket1.zaostock.com / ticket2.zaostock.com, which Zaal
 * originally wanted: Stripe's custom-domain feature is ONE subdomain shared
 * by the whole account (Checkout, Payment Links, the customer portal), it
 * is a paid add-on, and Stripe's own docs say Payment Links using it "stop
 * working" if the subscription lapses. A redirect this repo owns does not
 * have that failure mode.
 *
 * Deliberately a route handler, not a next.config.ts redirect: this way
 * STRIPE_LINKS stays the single source of truth (no second hardcoded
 * Stripe URL to drift), the existing buy.stripe.com host guard in
 * stripeLinkFor is inherited for free, and an unwired tier 404s by itself
 * today and starts working the moment its link is pasted into
 * STRIPE_LINKS - no second edit, no window where it redirects somewhere
 * dead.
 *
 * TEMPORARY REDIRECT ONLY - 307, never 301/308. A permanent redirect is
 * cached by browsers and intermediaries indefinitely, so if a Stripe link
 * is ever regenerated, everyone who already clicked the old short link
 * keeps landing on the dead URL with no way to fix it from this side. This
 * is the most likely way this feature hurts later - "permanent looks more
 * correct" is exactly the edit someone makes months from now, so it is
 * flagged here rather than left to be rediscovered.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ tier: string }> }) {
  const { tier } = await params;
  const url = stripeLinkFor(tier);

  if (!url) {
    return new NextResponse('Not found', { status: 404 });
  }

  return NextResponse.redirect(url, 307);
}
