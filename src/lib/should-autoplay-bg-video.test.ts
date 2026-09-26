import { describe, expect, it } from 'vitest';
import { shouldAutoplayBgVideo } from './should-autoplay-bg-video';

describe('shouldAutoplayBgVideo', () => {
  it('allows autoplay on a normal connection', () => {
    expect(shouldAutoplayBgVideo({})).toBe(true);
    expect(shouldAutoplayBgVideo({ effectiveType: '4g' })).toBe(true);
    expect(shouldAutoplayBgVideo({ effectiveType: '3g' })).toBe(true);
  });

  it('never autoplays when the user asked to save data', () => {
    expect(shouldAutoplayBgVideo({ saveData: true })).toBe(false);
    expect(shouldAutoplayBgVideo({ saveData: true, effectiveType: '4g' })).toBe(false);
  });

  it('never autoplays on slow connections', () => {
    expect(shouldAutoplayBgVideo({ effectiveType: 'slow-2g' })).toBe(false);
    expect(shouldAutoplayBgVideo({ effectiveType: '2g' })).toBe(false);
  });

  it('never autoplays when the user prefers reduced motion', () => {
    expect(shouldAutoplayBgVideo({ reducedMotion: true })).toBe(false);
    expect(shouldAutoplayBgVideo({ reducedMotion: true, effectiveType: '4g', saveData: false })).toBe(false);
  });
});
