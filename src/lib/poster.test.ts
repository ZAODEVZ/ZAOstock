import { describe, expect, it, afterEach, beforeEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, existsSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { getPosterFiles } from './poster';

const REAL_POSTERS_DIR = path.join(process.cwd(), 'public', 'brand', 'posters');

// Every case here uses a throwaway mkdtemp root, NEVER public/brand/posters.
// The first version of this test wrote fake files into the real directory
// and its afterEach rmSync'd them by fixed name - the day Candy's real
// poster lands there, that afterEach deletes it and the "empty" case starts
// failing forever after. Standing rule is never delete; this fixes the test
// to be structurally unable to touch a real file, not just careful about it.
describe('getPosterFiles', () => {
  let root: string;
  let realDirSnapshot: string[] | 'absent';

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'zaostock-poster-test-'));
    realDirSnapshot = existsSync(REAL_POSTERS_DIR) ? readdirSync(REAL_POSTERS_DIR) : 'absent';
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    // The real guarantee: whatever was (or wasn't) in the real directory
    // before this test is exactly what's there after it, whether this test
    // is running today (the directory doesn't exist) or the week Candy's
    // poster is live there.
    const after = existsSync(REAL_POSTERS_DIR) ? readdirSync(REAL_POSTERS_DIR) : 'absent';
    expect(after).toEqual(realDirSnapshot);
  });

  it('returns null on an empty root - the control for "neither file exists"', () => {
    expect(getPosterFiles(root)).toBeNull();
  });

  it('returns null with only the social crop present, not the print file', () => {
    writeFileSync(path.join(root, 'event-poster-social-1080x1350.jpg'), 'fake-jpeg-bytes');
    expect(getPosterFiles(root)).toBeNull();
  });

  it('finds both once they exist, whatever the print extension is', () => {
    writeFileSync(path.join(root, 'event-poster-social-1080x1350.jpg'), 'fake-jpeg-bytes');
    writeFileSync(path.join(root, 'event-poster-print.png'), 'fake-png-bytes');
    expect(getPosterFiles(root)).toEqual({
      printUrl: '/brand/posters/event-poster-print.png',
      printExt: 'PNG',
      socialUrl: '/brand/posters/event-poster-social-1080x1350.jpg',
    });
  });

  it('a poster already in place survives being read twice and survives test cleanup', () => {
    writeFileSync(path.join(root, 'event-poster-social-1080x1350.jpg'), 'the-real-poster-social');
    writeFileSync(path.join(root, 'event-poster-print.jpg'), 'the-real-poster-print');

    const first = getPosterFiles(root);
    const second = getPosterFiles(root);
    expect(first).toEqual(second);
    expect(existsSync(path.join(root, 'event-poster-print.jpg'))).toBe(true);
    expect(existsSync(path.join(root, 'event-poster-social-1080x1350.jpg'))).toBe(true);
  });

  it('calling with the default (no root) argument never throws, whether or not the real directory exists', () => {
    // The one call this suite makes against the real path - read-only,
    // exercising the actual default used by /design, never writing.
    expect(() => getPosterFiles()).not.toThrow();
  });
});
