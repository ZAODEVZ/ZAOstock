import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

// THE 3.3 MB POSTER NOBODY ASKED FOR.
//
// Found 2026-09-30, on the deployed site, by measuring rather than reading:
// the largest single item on /program on a throttled phone connection was
// /brand/posters/2026-lineup-poster-1600x2000.png (3,479,356 bytes) - larger
// than the page's own HTML and larger than every script and stylesheet on it.
// That file is a press-kit download, and /program never displays it.
//
// HOW IT GOT THERE, because the fix is only obvious once this is:
//
// 1. /press is a navigation link in the site header AND the footer
//    (src/components/poster/Header.tsx, Footer.tsx). Next prefetches the RSC
//    payload of every <Link> in the viewport, so on ANY page - /, /program,
//    /terms, /privacy, all 37 of them - the browser fetches /press's payload.
//
// 2. That payload carries the press page's markup, including the poster's
//    <img src=".../2026-lineup-poster-1600x2000.png">.
//
// 3. An <img> with no `loading` attribute is EAGER. React emits a preload for
//    it as soon as the markup exists, whether or not the visitor is going to
//    ever see the element, let alone the page. Prefetched markup counts.
//
// The causal chain was verified, not assumed. Blocking only the /press RSC
// prefetch at the network layer (every other request untouched) took the
// poster from fetched to not-fetched, on the same build, same browser:
//
//     A: baseline (unmodified)      /press RSC prefetches=2   POSTER fetched=1
//     B: /press prefetch blocked    /press RSC prefetches=1   POSTER fetched=0
//
// A red control ruled out the obvious wrong answer first: the poster also
// appears in the MusicEvent JSON-LD in the root layout, and on a page that
// never links to /press. Pointing that JSON-LD `image` at a different real
// image changed nothing - the poster was still fetched, 1 per page, on /,
// /program, /terms and /tickets. So the JSON-LD was not the cause, and this
// test deliberately does not touch it.
//
// WHY A TEST AND NOT JUST A COMMENT. Every other large asset on the site is
// either preload="none" (the audio and the video), next/image with an explicit
// size, or loading="lazy" already. The one that was not is the one that cost
// 3.3 MB, which is exactly the argument for making it a rule rather than a
// patch. This check is the rule.

const read = (p: string) => readFileSync(path.join(process.cwd(), p), 'utf8');

/**
 * Every <img> tag in a file that points at the poster.
 *
 * Two traps, both hit while writing this test, both worth recording:
 *
 *  1. The poster path also appears in the `<a href download>` immediately
 *     above each image, so a window of text around the filename is not a tag.
 *
 *  2. THE BIG ONE: this repo's own convention is a `{/* eslint-disable-next-line
 *     @next/next/no-img-element ... *\/}` comment sitting directly above every
 *     raw <img>, and the prose in those comments mentions "<img>". A plain
 *     /<img\b[^>]*?poster[^>]*?\/>/s then starts matching inside a COMMENT -
 *     and `[^>]*?` happily runs past the real tag's start, because a comment
 *     may contain no ">" at all until the real tag ends. The regex silently
 *     found zero real tags and the test failed for the wrong reason.
 *
 * So: strip JSX/JS comments first, then match whole <img> elements. Stripping
 * comments is safe here because no assertion is about a comment.
 */
function posterImgs(src: string): string[] {
  const code = src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')  // {/* ... */}
    .replace(/\/\*[\s\S]*?\*\//g, ' ')      // /* ... */
    .replace(/^\s*\/\/.*$/gm, ' ');         // // ...
  return [...code.matchAll(/<img\b[^>]*?\/>/gs)].map((m) => m[0]).filter((tag) => tag.includes('2026-lineup-poster-1600x2000.png'));
}

/** The poster's real size in the repo - if this file is ever replaced, the
 *  number in the PR description changes and so should this. */
const POSTER_BYTES = 3_479_356;

describe('the press poster is not on every page', () => {
  it('is the multi-megabyte file this is about', () => {
    const stat = readFileSync(path.join(process.cwd(), 'public/brand/posters/2026-lineup-poster-1600x2000.png'));
    expect(stat.byteLength).toBe(POSTER_BYTES);
    expect(POSTER_BYTES).toBeGreaterThan(1_000_000);
  });

  // THE FIX. A poster image inside a press-kit card is a thumbnail of a
  // download: it is never above the fold on a page the visitor did not
  // navigate to, and it is the largest file in the repo.
  it('is lazy on /press, so its markup arriving in a prefetched payload cannot fetch it', () => {
    const imgs = posterImgs(read('src/app/press/page.tsx'));
    expect(imgs.length, 'the poster thumbnail <img> is on /press').toBeGreaterThan(0);
    for (const img of imgs) expect(img).toContain('loading="lazy"');
  });

  // /brand shows the same poster twice, and it is a brand library page where
  // a visitor has usually arrived deliberately. It already lazy-loads its
  // images (src/app/brand/page.tsx, loading="lazy"); this holds the line so a
  // future edit cannot quietly re-open the same hole on the second page that
  // carries the file.
  it('is lazy in the /brand library too', () => {
    const imgs = posterImgs(read('src/app/brand/page.tsx'));
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) expect(img).toContain('loading="lazy"');
  });

  // The JSON-LD in the root layout carries the poster on EVERY page by
  // design (Search Console's Events report needs an image). It is metadata
  // for crawlers, not something a visitor sees, and the red control proved
  // it is not what downloads the file - so the fix must leave it alone
  // rather than paper over the real cause by editing the wrong line.
  it('leaves the MusicEvent JSON-LD image alone - that was ruled out by control', () => {
    const src = read('src/content/event-jsonld.ts');
    expect(src).toContain('2026-lineup-poster-1600x2000.png');
  });
});
