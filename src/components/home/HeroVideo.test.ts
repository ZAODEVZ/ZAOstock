import { describe, it, expect } from 'vitest';
import { statSync } from 'node:fs';
import path from 'node:path';
import { shouldLoadVideo } from './HeroVideo';

describe('shouldLoadVideo', () => {
  it('loads the video for an unconstrained client', () => {
    expect(shouldLoadVideo({ reducedMotion: false, saveData: false })).toBe(true);
    expect(shouldLoadVideo({ reducedMotion: false, saveData: false, effectiveType: '4g' })).toBe(true);
  });

  it('never loads the video under reduced motion', () => {
    expect(shouldLoadVideo({ reducedMotion: true, saveData: false })).toBe(false);
  });

  it('never loads the video when the client asks to save data', () => {
    expect(shouldLoadVideo({ reducedMotion: false, saveData: true })).toBe(false);
  });

  it('never loads the video on a 2g-class connection', () => {
    expect(shouldLoadVideo({ reducedMotion: false, saveData: false, effectiveType: '2g' })).toBe(false);
    expect(shouldLoadVideo({ reducedMotion: false, saveData: false, effectiveType: 'slow-2g' })).toBe(false);
  });
});

describe('hero video asset', () => {
  it('stays under 1.9 MB - the page is opened on cell service', () => {
    const size = statSync(path.join(process.cwd(), 'public/brand/home/ellsworth.mp4')).size;
    expect(size).toBeLessThan(1.9 * 1024 * 1024);
  });
});
