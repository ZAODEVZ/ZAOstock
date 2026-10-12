import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// SEO pass 2026-09-29: /design and /meetings were in the sitemap with no page
// linking to them. The footer is on every page, so it is where they live.
describe('Footer', () => {
  const src = readFileSync(path.join(process.cwd(), 'src/components/poster/Footer.tsx'), 'utf8');
  it.each(['/design', '/meetings', '/festivals'])('links %s, which otherwise had few or no inbound links', (href) => {
    expect(src).toContain(`'${href}'`);
  });
});
