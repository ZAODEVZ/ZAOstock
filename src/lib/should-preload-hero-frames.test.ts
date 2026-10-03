import { describe, it, expect } from 'vitest';
import { shouldPreloadHeroFrames } from './should-preload-hero-frames';

describe('shouldPreloadHeroFrames - 4.5 MB of hero frames respect a constrained connection', () => {
  it('skips the bulk preload when Data Saver is on', () => {
    expect(shouldPreloadHeroFrames({ saveData: true, effectiveType: '4g' })).toBe(false);
  });

  it('skips the bulk preload on 2g and slow-2g', () => {
    expect(shouldPreloadHeroFrames({ saveData: false, effectiveType: '2g' })).toBe(false);
    expect(shouldPreloadHeroFrames({ saveData: false, effectiveType: 'slow-2g' })).toBe(false);
  });

  it('preloads on ordinary connections', () => {
    expect(shouldPreloadHeroFrames({ saveData: false, effectiveType: '4g' })).toBe(true);
    expect(shouldPreloadHeroFrames({ saveData: false, effectiveType: '3g' })).toBe(true);
  });

  it('keeps current behavior when the Network Information API is absent', () => {
    expect(shouldPreloadHeroFrames(undefined)).toBe(true);
  });
});
