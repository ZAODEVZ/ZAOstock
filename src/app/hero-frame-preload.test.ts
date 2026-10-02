import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The hero scrub must not download frames nobody will ever see.
 *
 * Measured on the built home page, iPhone 13 emulation, 2026-10-01, without
 * scrolling at all - just load and wait 10 seconds:
 *
 *   frames fetched : 80 of 80
 *   frame bytes    : 5.09 MB
 *   page total     : 8.05 MB
 *
 * So 63% of the page arrives for a visitor who reads the headline and leaves.
 * The brief's first priority is exactly this visitor: somebody on a phone, on
 * cell service, trying to find out when a band plays.
 *
 * The cause is in HomeHero.tsx. `preload(0, EAGER)` fetches the first twelve
 * frames immediately, which is the point. Then `rest()` fires on `load` and
 * fetches frames 12..80 all at once, unconditionally - so the "first screen is
 * the shell plus one frame" claim in that file's own comment is not what the
 * code does. Nothing about scrolling is involved: the rest of the sequence is
 * downloaded whether or not the visitor ever moves.
 *
 * The fix is to load frames as the scrub approaches them, not in one batch
 * after load. This is a source-level guard because the regression is a
 * scheduling decision in an effect - running the app is what shows 5 MB, and
 * nothing else in the suite looks at how the hero schedules its fetches.
 */
const HERO = join(process.cwd(), 'src', 'app', 'HomeHero.tsx');

describe('hero frame preloading', () => {
  const src = readFileSync(HERO, 'utf8');

  it('does not fetch the whole frame sequence on window load', () => {
    // The batch call is the bug. It sits in two pieces:
    //     const rest = () => preload(EAGER, FRAMES.length);
    //     ... window.addEventListener('load', rest, { once: true });
    // so the assertion looks for the batch range itself, not for a single
    // expression - the definition and the listener are ~100 chars apart and
    // a regex spanning them in the wrong order silently matches nothing.
    expect(src).not.toMatch(/preload\(\s*EAGER\s*,\s*FRAMES\.length\s*\)/);
    expect(src).not.toMatch(/addEventListener\(\s*'load'[\s\S]{0,300}?\brest\b/);
  });

  it('fetches the next frames near the frame the visitor is on', () => {
    // A window around the current index is the shape that actually helps:
    // whatever the scrub is heading towards is already in cache.
    expect(src).toMatch(/preloadWindow|cacheAround/);
  });

  it('keeps the first frames eager', () => {
    // The opening frames ARE seen without scrolling - the hero is above the
    // fold. Dropping them would trade this bug for a worse one.
    expect(src).toMatch(/preload\(\s*0\s*,\s*EAGER\s*\)/);
  });

  it('still gives reduced-motion visitors a still frame', () => {
    // Never trade one regression for another. A visitor who asked for less
    // motion must not be made to pay for the sequence either.
    expect(src).toMatch(/prefers-reduced-motion/);
    expect(src).toMatch(/heroStill/);
  });
});
