import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { SUPPORT_TIERS, STRIPE_LINKS, stripeLinkFor, donationLinkFor, DONATION_REF, GIVETH_URL } from './site';

// Zaal, 29 Sep: "combine ticket and donation page", on the EXISTING Stripe
// links, crypto kept. Finance: a gift must be distinguishable from a ticket.
const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

describe('tickets and giving on one page', () => {
  it('gifts reuse the exact tier link, tagged as a donation', () => {
    for (const t of SUPPORT_TIERS) {
      const base = stripeLinkFor(t.id);
      expect(base).toBeTruthy();
      expect(donationLinkFor(t.id)).toBe(`${base}?client_reference_id=${DONATION_REF}`);
    }
    // no new links: the donation URL's host+path is one of the three on file
    const files = new Set(Object.values(STRIPE_LINKS));
    for (const t of SUPPORT_TIERS) expect(files.has(donationLinkFor(t.id)!.split('?')[0])).toBe(true);
  });

  it('refuses a tier with no link rather than inventing one', () => {
    expect(donationLinkFor('nope')).toBeNull();
  });

  it('the /donate page is gone and redirects to the giving section', () => {
    expect(existsSync(path.join(process.cwd(), 'src/app/donate/page.tsx'))).toBe(false);
    expect(read('next.config.ts')).toContain("{ source: '/donate', destination: '/tickets#give'");
    expect(read('src/app/sitemap.ts')).not.toContain("'/donate'");
  });

  it('/tickets carries the #give section with Giveth, and no PayPal', () => {
    const src = read('src/app/tickets/page.tsx');
    expect(src).toContain('id="give"');
    expect(src).toContain('GIVETH_URL');
    expect(GIVETH_URL).toMatch(/^https:\/\/giveth\.io\//);
    expect(src).not.toContain('PAYPAL');
  });

  it('no page still links /donate', () => {
    for (const f of ['src/app/live/page.tsx', 'src/app/tickets/page.tsx', 'src/app/llms.txt/route.ts']) {
      const rendered = read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(rendered, f).not.toMatch(/["'(\s]\/donate\b/);
    }
  });
});
