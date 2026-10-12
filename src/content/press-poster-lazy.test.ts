import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

// THE 2026 LINEUP POSTER IS OFF THE SITE (2026-10-08).
//
// It showed the act that did not play, and Zaal's standing rule (2026-10-05)
// is that this act appears nowhere public. This repo is public, so the file is
// not kept anywhere in it: the copy lives in the private vault at
// projects/zaostock/archive/2026-lineup-poster-1600x2000.png, and git history
// still has it. This test used to hold the poster's lazy-loading (it was 3.3 MB and
// rode every prefetch of /press); with the poster gone, it holds the removal.

const POSTER = '2026-lineup-poster-1600x2000.png';

function filesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) out.push(...filesUnder(full));
    else out.push(full);
  }
  return out;
}

describe('the 2026 lineup poster stays off the public site', () => {
  it('is not served from public/', () => {
    expect(existsSync(path.join(process.cwd(), 'public/brand/posters', POSTER))).toBe(false);
  });

  it('is not kept anywhere in this public repo, docs included', () => {
    expect(existsSync(path.join(process.cwd(), 'docs/brand/archive', POSTER))).toBe(false);
  });

  it('is not referenced by any page, component or content file', () => {
    const hits = filesUnder(path.join(process.cwd(), 'src'))
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('press-poster-lazy.test.ts'))
      .filter((f) => readFileSync(f, 'utf8').includes(POSTER));
    expect(hits).toEqual([]);
  });
});
