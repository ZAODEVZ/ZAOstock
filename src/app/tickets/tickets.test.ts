import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SUPPORT_TIERS, PRO_TICKET } from '@/content/site';
import { FESTIVAL } from '@/content/festival';

// /tickets exists because ticket.zaostock.com 302s to a free Luma RSVP, so the
// paid tiers had no front door. These tests pin the things that would quietly
// break that fix, and the thing that would quietly turn a free festival into a
// paywalled one.

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
/** Comments may name a price when explaining themselves; rendered copy may not. */
const code = (p: string) =>
  read(p)
    .split('\n')
    .filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*') && !l.trim().startsWith('/*'))
    .join('\n');
const TICKETS = 'src/app/tickets/page.tsx';

describe('prices have ONE source', () => {
  // The lineup reveal date was typed as a literal in eight files and drifted,
  // and /donate's own lede was carrying a hardcoded "$50" when this was written.
  // Both pages must read SUPPORT_TIERS from site.ts instead.
  it('no tier price appears in rendered copy on either page', () => {
    for (const p of [TICKETS]) {
      for (const tier of SUPPORT_TIERS) {
        expect(code(p)).not.toContain(tier.price);
      }
    }
  });

  it('carries the three tiers Zaal asked for, cheapest first', () => {
    expect(SUPPORT_TIERS.map((t) => t.price)).toEqual(['$1', '$20', '$50']);
    expect(SUPPORT_TIERS.map((t) => t.amount)).toEqual([1, 20, 50]);
    expect(PRO_TICKET.price).toBe('$50');
  });

  it('every tier can actually be paid, and the amount matches the price', () => {
    for (const tier of SUPPORT_TIERS) {
      expect(tier.amount).toBe(Number(tier.price.replace('$', '')));
      expect(tier.gets.length).toBeGreaterThan(0);
    }
  });
});

describe('the festival stays free', () => {
  // Two prices under a heading that says "Tickets" is exactly the shape a reader
  // mistakes for a paywall. The free line must come first on the page, and the
  // page must keep saying admission is not what is being sold.
  it('states admission was free before it names any price', () => {
    // Past tense 2026-10-04: the page leads with "free to attend", in the past.
    const src = read(TICKETS);
    const free = src.indexOf('was free to attend');
    const paid = src.indexOf('SUPPORT_TIERS.map');
    expect(free).toBeGreaterThan(-1);
    expect(paid).toBeGreaterThan(-1);
    expect(free).toBeLessThan(paid);
  });

  it('still says in words that paying is not admission', () => {
    const src = read(TICKETS);
    expect(src).toContain('no ticket, no gate');
    expect(src).toContain('access was free');
  });

  it('no longer offers an RSVP (ZAOstock is over), and never links a raw Luma page', () => {
    // Was: the free RSVP card pointed at FESTIVAL.rsvpUrl. RSVP is over, so the
    // card is gone; FESTIVAL.rsvpUrl itself stays in festival.ts as the record.
    const src = code(TICKETS);
    expect(src).not.toContain('FESTIVAL.rsvpUrl');
    expect(src).not.toMatch(/>\s*RSVP free|'Do I need the RSVP'/);
    expect(src).not.toContain('luma.com');
    expect(FESTIVAL.rsvpUrl).toBe('https://ticket.zaostock.com');
  });
});

describe('the Pro Ticket checkout URL stays in sync across both pages', () => {
  // /donate had the old plain "Pay by card" link for Pro long after /tickets
  // moved to the embedded Stripe Buy Button (#265 only touched /tickets) -
  // same $50 tier, two different checkout experiences depending which page a
  // visitor landed on. Caught in a full-site review, 2026-09-21.
  //
  // REWRITTEN AGAIN 2026-09-24. Zaal reversed the 2026-09-23 "bring the
  // embed back" call for /tickets specifically, pointing at a live
  // screenshot of the new 4-card grid: "this UI isnt great lets just do
  // the [RSVP FREE pill] style" - the embedded <stripe-buy-button> was
  // overflowing its Card once every tier had a Buy Button id on file, in
  // that narrow grid. /tickets now renders every paid tier through the
  // plain stripeLinkFor() button only, same style as Free's RSVP button.
  // /donate keeps the embedded widget - its cards are roughly half-page
  // wide, not a 4-across grid, and nobody has reported that layout
  // overflowing. This is a DELIBERATE divergence in which WIDGET renders,
  // not the #265 kind of drift: what #265 actually guards against, and
  // what this test now pins directly, is that both pages read the SAME
  // checkout URL for a given tier from the SAME helper - so the money
  // never goes anywhere different depending which page you're on, even
  // though the two pages are now allowed to look different getting there.
  it("both pages read every paid tier's checkout URL from the same stripeLinkFor helper, no special case", () => {
    for (const p of [TICKETS]) {
      const src = code(p);
      expect(src).toContain('stripeLinkFor(tier.id)');
      expect(src).not.toMatch(/tier\.id === PRO_TICKET\.id\s*\?\s*\n?\s*<StripeBuyButton/);
    }
    expect(code(TICKETS)).not.toContain("from '@/components/StripeBuyButton'");
  });
});

describe('no tier promises what nothing on file delivers', () => {
  // Zaal, 2026-09-29, picked option B of ZAOOS doc 2578: money keeps a free
  // day free. The 1:1, "credited on the festival page" (no such list exists)
  // and the spot counts came off, and the round goal with them.
  it('promises no 1:1 and no credit on a page', () => {
    for (const tier of SUPPORT_TIERS) {
      expect(tier.gets.some((g) => g.includes('1:1'))).toBe(false);
      expect(tier.gets.some((g) => g.toLowerCase().includes('credited'))).toBe(false);
    }
  });

  it('every tier gets the same thing, so "Only the amount" stays true', () => {
    const gets = SUPPORT_TIERS.map((t) => t.gets.join('|'));
    expect(new Set(gets).size).toBe(1);
  });

  it('advertises no spot counts', () => {
    expect(SUPPORT_TIERS.every((t) => t.spots === null)).toBe(true);
  });

  it('keeps the $50 tier on the pro id the Stripe link is keyed on', () => {
    expect(PRO_TICKET.id).toBe('pro');
    expect(PRO_TICKET.name).toBe('Backer');
  });
});
