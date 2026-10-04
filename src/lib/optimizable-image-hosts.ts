/**
 * The one list of https hosts next/image is allowed to optimize, shared by
 * next.config.ts (which enforces it server-side via `images.remotePatterns`)
 * and any component that needs to decide, before rendering, whether a given
 * `next/image` src is safe to use.
 *
 * Two independent copies of this list existed briefly (PR #367 review,
 * 2026-09-27/28): next.config.ts had five hardcoded entries, and
 * ArtistProfileView.tsx had its own six-entry `Set` meant to mirror them "by
 * comment." Nothing enforced they stayed in sync - if a host were ever
 * removed from one and not the other, the component's own safety check would
 * again believe a now-disallowed host was safe, reproducing the exact
 * next/image-throws-for-a-disallowed-host crash (ZAOstock #236) this file
 * exists to prevent. One array, imported by both, makes that drift
 * impossible rather than merely commented against.
 */
export const OPTIMIZABLE_IMAGE_HOSTS = [
  'pbs.twimg.com',
  'i.imgur.com',
  'imgur.com',
  'i.postimg.cc',
  'postimg.cc',
  // Every current artist photo_url that isn't already a relative path is an
  // absolute https://zaostock.com/... URL (self-hosted .webp files) - needed
  // for the artist photo's next/image swap (Polish item 13, doc 2507).
  // next/image validates every absolute src against this list regardless of
  // whether it happens to match the deploying domain.
  'zaostock.com',
] as const;
