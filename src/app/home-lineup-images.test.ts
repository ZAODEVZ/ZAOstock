import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The lineup panels on the home page must not fetch their images eagerly.
 *
 * Measured on the live site (2026-10-01, zaostock.com/): the three panel
 * images were the only <img> on the page without loading="lazy", so a mobile
 * visitor on cell service downloaded all three before scrolling:
 *
 *   /brand/elements/acoustic_guitar_yellow.webp          40 KB
 *   /brand/home/electric_guitar_blue_semihollow.webp     83 KB
 *   /brand/home/vintage_microphone_with_cable.webp       37 KB
 *                                                          ----
 *                                                           160 KB
 *
 * plus /brand/home/flight/00.webp (77 KB) from HomeHero, all four in the
 * initial payload. The same microphone file served through /_next/image at
 * w=640&q=75 is 15 KB, so routing these through next/image and marking them
 * lazy cuts both the bytes and the eager-fetch cost.
 *
 * This is a source-level check: the regression was a raw <img> in JSX, so the
 * cheapest reliable guard is to assert the file does not go back to one.
 */
const PAGE = join(process.cwd(), 'src', 'app', 'page.tsx');

describe('home page lineup panels', () => {
  it('renders panel images through next/image, not a raw img', () => {
    const src = readFileSync(PAGE, 'utf8');
    // No eslint-disable for no-img-element left behind in the lineup block.
    expect(src).not.toMatch(/eslint-disable-next-line @next\/next\/no-img-element/);
    // next/image is already imported at the top of the file; the panel must use it.
    expect(src).toMatch(/<Image[\s\S]{0,240}src=\{p\.img\}/);
  });

  it('keeps the decorative alt so the images stay out of the a11y tree', () => {
    const src = readFileSync(PAGE, 'utf8');
    expect(src).toMatch(/<Image[\s\S]{0,240}src=\{p\.img\}[\s\S]{0,120}alt=""/);
  });

  it('does not mark the panels priority - they are below the fold', () => {
    const src = readFileSync(PAGE, 'utf8');
    const m = src.match(/<Image[\s\S]{0,320}src=\{p\.img\}[\s\S]{0,200}\/>/);
    expect(m).not.toBeNull();
    expect(m![0]).not.toMatch(/\bpriority\b/);
  });
});
