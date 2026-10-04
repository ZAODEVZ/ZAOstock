import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { GIVETH_URL } from './site';

// Zaal, 29 Sep: "combine ticket and donation page". Then, same day: #give is
// crypto only (Giveth); card support is the tiers above it.
const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

describe('tickets and giving on one page', () => {
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
