import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { PRO_TICKET, PAYPAL_URL } from '@/content/site';
import { FESTIVAL } from '@/content/festival';

// /tickets exists because ticket.zaostock.com 302s to a free Luma RSVP, so the
// $50 Pro Ticket had no front door. These tests pin the two things that would
// quietly break that fix.

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');
/** Comments may name the price when explaining themselves; rendered copy may not. */
const code = (p: string) =>
  read(p)
    .split('\n')
    .filter((l) => !l.trim().startsWith('//') && !l.trim().startsWith('*') && !l.trim().startsWith('/*'))
    .join('\n');
const TICKETS = 'src/app/tickets/page.tsx';
const DONATE = 'src/app/donate/page.tsx';

describe('the Pro Ticket price has ONE source', () => {
  // The lineup reveal date was typed as a literal in eight files and drifted,
  // and /donate's own lede was carrying a hardcoded "$50" when this was written.
  // Both pages must read PRO_TICKET from site.ts instead.
  it('appears in no rendered copy on either page', () => {
    for (const p of [TICKETS, DONATE]) {
      expect(code(p)).not.toContain(PRO_TICKET.price);
      expect(code(p)).not.toContain(PRO_TICKET.roundTotal);
      expect(code(p)).not.toContain(PRO_TICKET.countWord);
    }
  });

  it('still carries the values Zaal typed', () => {
    expect(PRO_TICKET.price).toBe('$50');
    expect(PRO_TICKET.amount).toBe(50);
    expect(PRO_TICKET.spots).toBe('20 spots');
    expect(PAYPAL_URL).toBe('https://paypal.com/paypalme/zaalpanthaki');
  });
});

describe('/tickets leads with free', () => {
  it('states admission is free before it mentions any price', () => {
    const src = read(TICKETS);
    const free = src.indexOf('FESTIVAL.admission');
    const pro = src.indexOf('PRO_TICKET.price');
    expect(free).toBeGreaterThan(-1);
    expect(pro).toBeGreaterThan(-1);
    expect(free).toBeLessThan(pro);
  });

  it('sends the free RSVP at the branded URL, not a raw Luma link', () => {
    const src = read(TICKETS);
    expect(src).toContain('FESTIVAL.rsvpUrl');
    expect(src).not.toContain('luma.com');
    expect(FESTIVAL.rsvpUrl).toBe('https://ticket.zaostock.com');
  });

  it('keeps the Pro Ticket in one deletable block', () => {
    // The 2 September agenda may drop the Pro Ticket. If it does, exactly one
    // Section comes out of this page - this test fails loudly if it is smeared
    // across the page instead.
    const src = read(TICKETS);
    const hits = src.split('PRO_TICKET.').length - 1;
    expect(hits).toBeLessThanOrEqual(6);
    expect(src).toContain('delete this whole Section');
  });
});
