import { describe, expect, it, afterEach } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import path from 'path';
import { getPosterFiles } from './poster';

const DIR = path.join(process.cwd(), 'public', 'brand', 'posters');
const SOCIAL = path.join(DIR, 'event-poster-social-1080x1350.jpg');
const PRINT = path.join(DIR, 'event-poster-print.jpg');

/**
 * Candy's file has not landed yet, so the control here is the important
 * case: prove the check can find a poster that IS there, not just confirm
 * it stays quiet about one that isn't (the exact false-negative shape
 * MISTAKES.md calls surface-cannot-report-state).
 */
describe('getPosterFiles', () => {
  afterEach(() => {
    rmSync(SOCIAL, { force: true });
    rmSync(PRINT, { force: true });
  });

  it('returns null today - neither file exists yet', () => {
    expect(existsSync(SOCIAL)).toBe(false);
    expect(getPosterFiles()).toBeNull();
  });

  it('returns null with only the social crop present, not the print file', () => {
    mkdirSync(DIR, { recursive: true });
    writeFileSync(SOCIAL, 'fake-jpeg-bytes');
    expect(getPosterFiles()).toBeNull();
  });

  it('finds both once they exist, whatever the print extension is - the control', () => {
    mkdirSync(DIR, { recursive: true });
    writeFileSync(SOCIAL, 'fake-jpeg-bytes');
    writeFileSync(PRINT, 'fake-jpeg-bytes');
    expect(getPosterFiles()).toEqual({
      printUrl: '/brand/posters/event-poster-print.jpg',
      printExt: 'JPG',
      socialUrl: '/brand/posters/event-poster-social-1080x1350.jpg',
    });
  });
});
