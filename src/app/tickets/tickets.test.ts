import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SUPPORT_TIERS, PRO_TICKET, PRO_ROUND, PAYPAL_URL } from '@/content/site';
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
const DONATE = 'src/app/donate/page.tsx';

describe('prices have ONE source', () => {
  // The lineup reveal date was typed as a literal in eight files and drifted,
  // and /donate's own lede was carrying a hardcoded "$50" when this was written.
  // Both pages must read SUPPORT_TIERS from site.ts instead.
  it('no tier price appears in rendered copy on either page', () => {
    for (const p of [TICKETS, DONATE]) {
      for (const tier of SUPPORT_TIERS) {
        expect(code(p)).not.toContain(tier.price);
      }
      expect(code(p)).not.toContain(PRO_ROUND.roundTotal);
      expect(code(p)).not.toContain(PRO_ROUND.countWord);
    }
  });

  it('carries the two tiers Zaal asked for, cheapest first', () => {
    expect(SUPPORT_TIERS.map((t) => t.price)).toEqual(['$20', '$50']);
    expect(SUPPORT_TIERS.map((t) => t.amount)).toEqual([20, 50]);
    expect(PRO_TICKET.price).toBe('$50');
    expect(PAYPAL_URL).toBe('https://paypal.com/paypalme/zaalpanthaki');
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
  it('states admission is free before it names any price', () => {
    const src = read(TICKETS);
    const free = src.indexOf('FESTIVAL.admission');
    const paid = src.indexOf('SUPPORT_TIERS.map');
    expect(free).toBeGreaterThan(-1);
    expect(paid).toBeGreaterThan(-1);
    expect(free).toBeLessThan(paid);
  });

  it('still says in words that paying is not admission', () => {
    const src = read(TICKETS);
    expect(src).toContain('patronage, not admission');
    expect(src).toContain('access is free');
  });

  it('sends the free RSVP at the branded URL, not a raw Luma link', () => {
    const src = read(TICKETS);
    expect(src).toContain('FESTIVAL.rsvpUrl');
    expect(src).not.toContain('luma.com');
    expect(FESTIVAL.rsvpUrl).toBe('https://ticket.zaostock.com');
  });
});

describe('the paid tiers stay deletable', () => {
  // The 2 September agenda may drop them. If it does, exactly one Section comes
  // out of this page - this fails loudly if they get smeared across it instead.
  it('lives in one marked, removable block', () => {
    const src = read(TICKETS);
    expect(src).toContain('delete this whole Section');
    expect(src.split('SUPPORT_TIERS').length - 1).toBeLessThanOrEqual(3);
  });
});

describe('the cap is on the scarce thing only', () => {
  // A 1:1 costs real time, so it is rationed. Nothing about the lower tier is
  // scarce, so capping it would be arbitrary.
  it('caps the tier with the 1:1 and leaves the other uncapped', () => {
    const withOneOnOne = SUPPORT_TIERS.filter((t) => t.gets.some((g) => g.includes('1:1')));
    expect(withOneOnOne).toHaveLength(1);
    expect(withOneOnOne[0].spots).not.toBeNull();
    const uncapped = SUPPORT_TIERS.filter((t) => t.spots === null);
    expect(uncapped.every((t) => !t.gets.some((g) => g.includes('1:1')))).toBe(true);
  });

  it('credits every paying tier by name', () => {
    for (const tier of SUPPORT_TIERS) {
      expect(tier.gets.some((g) => g.toLowerCase().includes('credited'))).toBe(true);
    }
  });

  it('keeps the round-1 cap at the 20 held since the 2026-05-12 standup', () => {
    expect(PRO_ROUND.count).toBe(20);
    expect(PRO_TICKET.spots).toBe('20 spots');
  });
});

describe('the funding goal states its own rule', () => {
  // 20 x $50 = $1,000, so "20 people, $1,000" silently asserted $50 each. Once
  // the $20 tier counts toward the same target that phrasing is simply wrong,
  // and a target whose rule is invisible is the shape that produced the stale
  // lineup date: a number everyone reads and nobody can check.
  it('names the total without implying a headcount or a per-person price', () => {
    expect(PRO_ROUND.goal).toContain(PRO_ROUND.roundTotal);
    expect(PRO_ROUND.goal).not.toContain('20 people');
    expect(PRO_ROUND.goal).not.toContain(PRO_TICKET.price);
  });

  it('says which tiers count, so the rule travels with the number', () => {
    expect(PRO_ROUND.goal.toLowerCase()).toContain('either tier');
    expect(PRO_ROUND.countsRule).toBeTruthy();
  });

  it('renders the goal on both pages rather than a bare figure', () => {
    for (const p of [TICKETS, DONATE]) {
      expect(read(p)).toContain('PRO_ROUND');
    }
  });
});
