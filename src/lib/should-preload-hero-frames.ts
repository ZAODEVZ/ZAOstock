// The hero scrub is 80 frames, 5.3 MB in all (see HomeHero.tsx). Twelve are
// fetched eagerly so the first screen is alive; the remaining 68 (~4.5 MB)
// were preloaded on window load for EVERY visitor - including people on
// Data Saver or a 2g connection who may never scroll the hero at all.
//
// This gate is the same idea as the reduced-motion branch already in
// HomeHero: when the network itself says "conserve", the bulk fetch should
// not happen. The scrub still works - frames are fetched on demand as the
// visitor scrolls and cached progressively - it just is not warmed ahead
// of time on a connection that asked us not to.

export interface HeroConnectionLike {
  saveData?: boolean;
  effectiveType?: string;
}

export function shouldPreloadHeroFrames(conn: HeroConnectionLike | undefined): boolean {
  if (!conn) return true; // no Network Information API: keep current behavior
  if (conn.saveData) return false;
  const t = conn.effectiveType;
  if (t === 'slow-2g' || t === '2g') return false;
  return true;
}
