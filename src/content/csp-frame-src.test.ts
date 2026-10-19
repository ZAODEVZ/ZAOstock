import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { REPLAY_PARTS, replayPartEmbedSrc, replayEmbedSrc } from '@/content/replay';
import { feedbackEmbedUrl } from '@/content/site';

// The Content-Security-Policy header in next.config.ts is Report-Only today,
// so a host missing from frame-src breaks nothing yet. The day it is enforced,
// every iframe whose host is not on the list goes blank with no build error.
// On 2026-10-12 the list was missing player.twitch.tv (the replay on /live and
// /media) and www.google.com (the map on /ellsworth). These tests read the
// real header and the real embed URLs, so a new embed has to be added to the
// list before it can merge.

const ROOT = process.cwd();
const config = readFileSync(path.join(ROOT, 'next.config.ts'), 'utf8');
const directive = config.match(/"frame-src ([^"]+)"/)?.[1] ?? '';
const allowed = directive.split(/\s+/).filter((s) => s.startsWith('https://'));

function tsxFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) tsxFiles(full, out);
    else if (entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/** Every https origin written literally inside an <iframe ...> tag in src. */
function literalIframeOrigins(): { file: string; origin: string }[] {
  const found: { file: string; origin: string }[] = [];
  for (const file of tsxFiles(path.join(ROOT, 'src'))) {
    const text = readFileSync(file, 'utf8');
    for (const tag of text.matchAll(/<iframe\b[\s\S]*?\/>/g)) {
      for (const url of tag[0].matchAll(/https:\/\/[A-Za-z0-9.-]+/g)) {
        found.push({ file: path.relative(ROOT, file), origin: url[0] });
      }
    }
  }
  return found;
}

describe('CSP frame-src covers every iframe the site renders', () => {
  it('finds the frame-src directive in next.config.ts', () => {
    expect(directive).toContain("'self'");
    expect(allowed.length).toBeGreaterThan(0);
  });

  it('allows the host of every replay part', () => {
    expect(REPLAY_PARTS.length).toBeGreaterThan(0);
    for (const part of REPLAY_PARTS) {
      expect(allowed).toContain(new URL(replayPartEmbedSrc(part)).origin);
    }
  });

  it('allows the Twitch player, whichever provider the current parts use', () => {
    expect(allowed).toContain(new URL(replayEmbedSrc('1')).origin);
  });

  it('allows the feedback form when it is embedded', () => {
    const src = feedbackEmbedUrl();
    if (src) expect(allowed).toContain(new URL(src).origin);
  });

  it('allows every host written literally in an iframe tag', () => {
    const literals = literalIframeOrigins();
    // The scan must find the two iframes known to carry a literal URL, or an
    // empty result would pass for the wrong reason.
    const origins = literals.map((l) => l.origin);
    expect(origins).toContain('https://www.youtube-nocookie.com');
    expect(origins).toContain('https://www.google.com');
    expect(literals.filter((l) => !allowed.includes(l.origin))).toEqual([]);
  });
});
