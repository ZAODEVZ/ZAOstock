import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { PARTNERS } from '@/content/site';
import { LOGO_SIZE } from './PartnerTile';

// THE 2026-09-16 LOGO AUDIT FINDING: LOGO_SIZE was missing an entry for
// artizen.png (a real, used logoSrc), so PartnerLogo rendered it with no
// explicit width/height - a layout-shift risk none of the other six logos
// had - and carried three dead entries (black-moon.jpg, star-977.jpg,
// coc-concertz.jpg) for files that do not exist in public/partners/, since
// every real logoSrc in PARTNERS is a .png.

describe('LOGO_SIZE', () => {
  it('has a size entry for every logoSrc PARTNERS actually uses', () => {
    const missing = PARTNERS.filter((p) => p.logoSrc && !LOGO_SIZE[p.logoSrc]).map((p) => p.name);
    expect(missing).toEqual([]);
  });

  it('names no file that does not exist on disk', () => {
    const missingFiles = Object.keys(LOGO_SIZE).filter(
      (src) => !existsSync(path.join(process.cwd(), 'public', src)),
    );
    expect(missingFiles).toEqual([]);
  });
});
