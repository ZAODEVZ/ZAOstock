/**
 * The act after this one on the bill, for the "Next act" link under an artist
 * page (ZAOOS doc 2507, item 11: an artist page had no way on to the next act,
 * only the header's generic "Artists" item). Wraps from the last act to the
 * first, so the link never dead-ends. Null when the act is not on the roster
 * or is the only act, so the page shows no link rather than one to itself.
 */
export function nextAct<T extends { slug: string }>(roster: readonly T[], slug: string): T | null {
  const i = roster.findIndex((a) => a.slug === slug);
  if (i === -1 || roster.length < 2) return null;
  return roster[(i + 1) % roster.length];
}
