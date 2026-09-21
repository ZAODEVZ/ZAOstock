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
// A "real" Unlock checkout URL must state a lock on Base mainnet (8453) -
// see unlockCheckoutUrl's own doc comment for why this is an allowlist, not
// a denylist. The short id= form (no network stated at all) is exercised
// separately below, where it is refused by default.
const REAL_UNLOCK =
  'https://app.unlock-protocol.com/checkout?paywallConfig=' +
  encodeURIComponent(JSON.stringify({ locks: { '0xLOCK': { network: 8453 } } }));
const SHORT_ID_UNLOCK = 'https://app.unlock-protocol.com/checkout?id=3a1f';

// Tier ids that are deliberately live today - the only exemption from "an
// unset rail renders nothing" below. Marking a tier live is a one-line,
// visible edit here, same job the old hardcoded-UNSET assertion did, but
// this version still covers every tier NOT in the set - including ones
// added after this was written (src/content/site.ts's SUPPORT_TIERS), so a
// new tier is exercised by this test the day it exists rather than silently
// skipped. Issue #258.
const LIVE_TIERS = new Set(['supporter', 'pro']);

describe('an unset rail renders nothing', () => {
  // Both tiers went live 2026-09-20 - supporter (plink_1UHsQYKEKqFBqu9oZADCzFQ9)
  // then pro (plink_1UHtB3KEKqFBqu9owZalGOH0). With every current SUPPORT_TIERS
  // entry in LIVE_TIERS, the loop below has nothing left to iterate - it would
  // pass trivially and stop meaning anything. `future-tier` keeps this test
  // actually exercising the null path regardless of how many real tiers are
  // live, independent of what SUPPORT_TIERS happens to contain today.
  it('is still unset for Unlock and for a tier id that does not exist yet', () => {
    expect(UNLOCK_CHECKOUT_URL).toBe('UNSET');
    expect(stripeLinkFor('future-tier')).toBeNull();
  });

  it('hands back null for every tier that is not deliberately live', () => {
    for (const tier of SUPPORT_TIERS) {
      if (LIVE_TIERS.has(tier.id)) continue;
      expect(stripeLinkFor(tier.id)).toBeNull();
    }
    expect(unlockCheckoutUrl()).toBeNull();
  });

  it('hands back the real link for a tier marked live', () => {
    for (const id of LIVE_TIERS) expect(stripeLinkFor(id)).toBe(STRIPE_LINKS[id]);
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

describe('unlockCheckoutUrl refuses a testnet lock', () => {
  // Real shapes, confirmed against unlock-protocol/unlock's own blog examples
  // 2026-09-21 - a checkout URL's paywallConfig names each lock's network
  // (chain id) explicitly. 8453 = Base mainnet, the rail The ZAO decided on;
  // 84532 = Base Sepolia, the testnet Zaal was ruled to test on first.
  const baseMainnetUrl =
    'https://app.unlock-protocol.com/checkout?paywallConfig=' +
    encodeURIComponent(JSON.stringify({ locks: { '0xLOCK': { network: 8453 } } }));
  const baseSepoliaUrl =
    'https://app.unlock-protocol.com/checkout?paywallConfig=' +
    encodeURIComponent(JSON.stringify({ locks: { '0xLOCK': { network: 84532 } } }));

  it('accepts a checkout URL whose lock is on Base mainnet', () => {
    expect(unlockCheckoutUrl(baseMainnetUrl)).toBe(baseMainnetUrl);
  });

  it('refuses a checkout URL whose lock is on Base Sepolia (or any non-mainnet network)', () => {
    // This is the exact hazard flagged by two peer lanes 2026-09-21: same
    // https://app.unlock-protocol.com/ prefix as a real link, so only the
    // paywallConfig's own network field can tell them apart.
    expect(unlockCheckoutUrl(baseSepoliaUrl)).toBeNull();
    // Not just the one named testnet - any network that is not exactly Base
    // mainnet is refused, including Ethereum mainnet (1) and Goerli (5).
    for (const network of [1, 5, 11155111]) {
      const url =
        'https://app.unlock-protocol.com/checkout?paywallConfig=' +
        encodeURIComponent(JSON.stringify({ locks: { '0xLOCK': { network } } }));
      expect(unlockCheckoutUrl(url)).toBeNull();
    }
  });

  it('refuses if even one lock in a multi-lock config is off Base mainnet', () => {
    const mixed =
      'https://app.unlock-protocol.com/checkout?paywallConfig=' +
      encodeURIComponent(JSON.stringify({ locks: { '0xA': { network: 8453 }, '0xB': { network: 84532 } } }));
    expect(unlockCheckoutUrl(mixed)).toBeNull();
  });

  it('refuses an unparseable paywallConfig rather than guessing', () => {
    const malformed = 'https://app.unlock-protocol.com/checkout?paywallConfig=%7Bnot-json';
    expect(unlockCheckoutUrl(malformed)).toBeNull();
  });

  // This is an ALLOWLIST: every path below defaults to refuse, not just the
  // one explicit-wrong-network case above. A first version of this guard
  // (2026-09-21) got this backwards - it refused only what it could see and
  // dislike, so a lock that simply omitted `network` (a legal Unlock config;
  // the field is "recommended", not required) slipped through as accepted.
  // Caught by a peer lane running the actual function against real inputs,
  // not by reading the comment. Each case below is one of the holes that
  // run found, pinned so none of them reopens silently.
  it('refuses a lock with no network field at all, even though that is a legal Unlock config', () => {
    const noNetwork =
      'https://app.unlock-protocol.com/checkout?paywallConfig=' +
      encodeURIComponent(JSON.stringify({ locks: { '0xLOCK': {} } }));
    expect(unlockCheckoutUrl(noNetwork)).toBeNull();
  });

  it('refuses a paywallConfig with no locks map, or an empty one', () => {
    const noLocks = 'https://app.unlock-protocol.com/checkout?paywallConfig=' + encodeURIComponent(JSON.stringify({}));
    const emptyLocks =
      'https://app.unlock-protocol.com/checkout?paywallConfig=' + encodeURIComponent(JSON.stringify({ locks: {} }));
    expect(unlockCheckoutUrl(noLocks)).toBeNull();
    expect(unlockCheckoutUrl(emptyLocks)).toBeNull();
  });

  it('refuses the short id= form by default - nothing is on the confirmed-mainnet allowlist yet', () => {
    // The id= form names no network at all, so it can only be trusted once
    // Zaal has confirmed by hand that a specific id points at a real Base
    // mainnet lock, added deliberately to KNOWN_MAINNET_CONFIG_IDS in
    // site.ts. That set is empty today, so every id= URL is refused - this
    // is the fixed behavior, not the gap the first version left open.
    expect(unlockCheckoutUrl(SHORT_ID_UNLOCK)).toBeNull();
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

  it('keeps PayPal on /donate, the fuller "other ways to give" page', () => {
    expect(read(DONATE)).toContain('${PAYPAL_URL}/${tier.amount}');
  });

  it('drops PayPal from /tickets - card only, Zaal live, 2026-09-21: "no paypal"', () => {
    const src = read(TICKETS);
    expect(src).not.toContain('PAYPAL_URL');
    // The removed button's exact JSX pattern, not the bare phrase "Chip in" -
    // that survives in the page's own headline copy ("Chip in if you can")
    // and section eyebrow, which are not the PayPal button.
    expect(src).not.toContain('Chip in {tier.price}');
    // /tickets still points PayPal-seekers at /donate in its own FAQ copy,
    // so the word "PayPal" surviving in prose (not a button) is correct.
    expect(src).toContain('PayPal for fiat or Giveth for crypto, at /donate');
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
