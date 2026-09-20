import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SUPPORT_TIERS, PRO_TICKET, STRIPE_LINKS, UNLOCK_CHECKOUT_URL, stripeLinkFor, unlockCheckoutUrl } from '@/content/site';

// Card payments were "not live, PayPal link only" on the 15 September call, and
// the fix is two URLs that only exist once someone opens the money doors: a
// Stripe Payment Link per tier, and an Unlock lock on Base for the Pro Ticket.
//
// The risk this file exists for is the half-wired state. A money door that is
// declared but empty is worse than no door: it renders a button that takes a
// supporter to a 404, or worse, to the literal string UNSET. So the rule is that
// an unset rail renders NOTHING, and the only way to read one is through a helper
// that returns null.

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
const TICKETS = 'src/app/tickets/page.tsx';
const DONATE = 'src/app/donate/page.tsx';
const PAGES = [TICKETS, DONATE];

const REAL_STRIPE = 'https://buy.stripe.com/test_aEU5kF3dK2mQ0Ss288';
const REAL_UNLOCK = 'https://app.unlock-protocol.com/checkout?id=3a1f';

describe('an unset rail renders nothing', () => {
  // Supporter's real link landed 2026-09-20 (plink_1UHsQYKEKqFBqu9oZADCzFQ9).
  // Pro Ticket and Unlock stay unset - both still render nothing below.
  it('is still unset for pro and Unlock', () => {
    expect(STRIPE_LINKS.pro).toBe('UNSET');
    expect(UNLOCK_CHECKOUT_URL).toBe('UNSET');
  });

  it('hands back null for the still-unset rails, and the real link for the one that is live', () => {
    expect(stripeLinkFor('pro')).toBeNull();
    expect(stripeLinkFor('supporter')).toBe(STRIPE_LINKS.supporter);
    expect(unlockCheckoutUrl()).toBeNull();
  });

  it('refuses a URL that is not on the checkout host', () => {
    // A dashboard link, a shortened link or a typo is not a checkout. Each of
    // these is a plausible paste, and every one of them must render no button.
    for (const wrong of ['https://dashboard.stripe.com/payment-links/plink_1', 'https://stripe.com/', 'buy.stripe.com/abc', '']) {
      expect(stripeLinkFor('pro', { pro: wrong })).toBeNull();
    }
    for (const wrong of ['https://unlock-protocol.com/checkout', 'https://app.unlock-protocol.com'.replace('app.', ''), '']) {
      expect(unlockCheckoutUrl(wrong)).toBeNull();
    }
  });

  it('hands back null, and never throws, for a tier id that names something on Object.prototype', () => {
    // links[tierId] reaches through the prototype chain: 'toString' finds a
    // function, `url &&` is truthy, and a function has no .startsWith, so the
    // helper THREW instead of returning null. Unreachable while tier ids are a
    // static const and no page reads searchParams, but the documented contract
    // is "returns null so no caller can build an href", and a throw on a
    // checkout page is a 500 the day a tier is routed from a URL segment.
    // Found by the review lane, 2026-09-17.
    for (const id of ['toString', 'constructor', '__proto__', 'hasOwnProperty', 'valueOf']) {
      expect(() => stripeLinkFor(id)).not.toThrow();
      expect(stripeLinkFor(id)).toBeNull();
      expect(stripeLinkFor(id, { pro: REAL_STRIPE })).toBeNull();
    }
  });

  it('hands back the link once it is a real one', () => {
    expect(stripeLinkFor('pro', { pro: REAL_STRIPE })).toBe(REAL_STRIPE);
    expect(unlockCheckoutUrl(REAL_UNLOCK)).toBe(REAL_UNLOCK);
  });
});

describe('every tier keeps its door', () => {
  it('has a STRIPE_LINKS key for every tier, so a rename cannot drop one', () => {
    for (const tier of SUPPORT_TIERS) expect(STRIPE_LINKS).toHaveProperty(tier.id);
    expect(Object.keys(STRIPE_LINKS).sort()).toEqual(SUPPORT_TIERS.map((t) => t.id).sort());
  });

  it('puts the onchain door on the Pro Ticket only', () => {
    // The 1:1 is the scarce thing and the Pro Ticket is the membership; a key for
    // the uncapped tier would be a second thing to mint for no reason.
    for (const p of PAGES) expect(read(p)).toContain('tier.id === PRO_TICKET.id && unlockCheckoutUrl()');
    expect(PRO_TICKET.id).toBe('pro');
  });
});

describe('the pages cannot render a dead door', () => {
  it('reads both rails through the helpers, never the constants', () => {
    for (const p of PAGES) {
      const src = read(p);
      expect(src).toContain('stripeLinkFor(tier.id) ?');
      expect(src).not.toContain('STRIPE_LINKS');
      expect(src).not.toContain('UNLOCK_CHECKOUT_URL');
    }
  });

  it('never hardcodes a checkout URL in a page', () => {
    for (const p of PAGES) {
      expect(read(p)).not.toContain('buy.stripe.com');
      expect(read(p)).not.toContain('unlock-protocol.com');
    }
  });

  it('keeps PayPal, which is the door that actually works today', () => {
    for (const p of PAGES) expect(read(p)).toContain('${PAYPAL_URL}/${tier.amount}');
  });

  it('says nothing about paying by card while no card rail exists', () => {
    // The copy must not promise a card door before one is open. Both button
    // labels live inside their guards, so they are the only mentions allowed.
    for (const p of PAGES) {
      const promises = read(p).split('Pay by card').length - 1;
      expect(promises).toBe(1);
    }
  });
});
