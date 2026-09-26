// Decision logic for when a decorative background video may load+play.
// Kept pure and DOM-free so the policy is unit-testable in the node
// vitest environment (no jsdom in this repo).

export interface BgVideoConditions {
  /** navigator.connection.saveData - user asked the network for less data. */
  saveData?: boolean;
  /** navigator.connection.effectiveType - e.g. 'slow-2g' | '2g' | '3g' | '4g'. */
  effectiveType?: string;
  /** matchMedia('(prefers-reduced-motion: reduce)').matches */
  reducedMotion?: boolean;
}

const SLOW_EFFECTIVE_TYPES = new Set(['slow-2g', '2g']);

/**
 * A decorative, muted, silent background video should only autoplay when
 * the visitor is actually likely to see it and has not told us to save
 * data or reduce motion. Callers gate the *fetch* (setting `src`) on this,
 * not just playback, because an autoplaying video downloads regardless of
 * preload="none".
 */
export function shouldAutoplayBgVideo(c: BgVideoConditions): boolean {
  if (c.reducedMotion) return false;
  if (c.saveData) return false;
  if (c.effectiveType && SLOW_EFFECTIVE_TYPES.has(c.effectiveType)) return false;
  return true;
}
