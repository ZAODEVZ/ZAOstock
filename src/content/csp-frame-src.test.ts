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

/**
 * Whether frame-src lets this URL be framed, read the way CSP reads a source:
 * a bare origin allows any path on it; a source with a path allows exactly
 * that path, or anything under it when the source path ends in "/". The query
 * string is never part of the match. Card 10409 narrowed www.google.com to
 * the map's own paths, so an origin-only comparison no longer says enough.
 */
export function frameAllowed(url: string, sources: string[] = allowed): boolean {
  const u = new URL(url);
  return sources.some((src) => {
    const s = new URL(src);
    if (s.origin !== u.origin) return false;
    if (s.pathname === '/' && !src.endsWith('/')) return true; // origin only
    return s.pathname.endsWith('/') ? u.pathname.startsWith(s.pathname) : u.pathname === s.pathname;
  });
}

function tsxFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) tsxFiles(full, out);
    else if (entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

/** Every https URL (origin plus literal path) written inside an <iframe ...> tag in src. */
function literalIframeOrigins(): { file: string; origin: string; url: string }[] {
  const found: { file: string; origin: string; url: string }[] = [];
  for (const file of tsxFiles(path.join(ROOT, 'src'))) {
    const text = readFileSync(file, 'utf8');
    for (const tag of text.matchAll(/<iframe\b[\s\S]*?\/>/g)) {
      for (const m of tag[0].matchAll(/https:\/\/[A-Za-z0-9.-]+[A-Za-z0-9._~/-]*/g)) {
        found.push({ file: path.relative(ROOT, file), origin: new URL(m[0]).origin, url: m[0] });
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
    expect(literals.filter((l) => !frameAllowed(l.url))).toEqual([]);
  });
});

describe('frame-src: the map is allowed by path, not by the whole host (card 10409)', () => {
  it('lists www.google.com only with the map paths', () => {
    expect(allowed).not.toContain('https://www.google.com');
    expect(allowed).toContain('https://www.google.com/maps');
    expect(allowed).toContain('https://www.google.com/maps/embed');
  });

  it('allows the map URL and its redirect target, and nothing else on the host', () => {
    expect(frameAllowed('https://www.google.com/maps?q=Ellsworth&output=embed')).toBe(true);
    expect(frameAllowed('https://www.google.com/maps/embed?origin=mfe&pb=x')).toBe(true);
    expect(frameAllowed('https://www.google.com/search?q=x')).toBe(false);
    expect(frameAllowed('https://www.google.com/')).toBe(false);
  });

  // evaluator-b2 on #482 (comment 6333007399): with the exact-path match
  // turned into a prefix match, every case above still passed. These two fail
  // under a prefix match, so they pin "a path source matches that path only".
  it('does not treat a path source as a prefix', () => {
    expect(frameAllowed('https://www.google.com/maps/foo')).toBe(false);
    expect(frameAllowed('https://www.google.com/mapsx')).toBe(false);
  });

  it('still reads a bare origin as allowing every path on it', () => {
    expect(frameAllowed('https://player.twitch.tv/?video=1')).toBe(true);
    expect(frameAllowed('https://evil.example/maps')).toBe(false);
  });
});
