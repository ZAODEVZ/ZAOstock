/**
 * WHEN AN ACT GOES PUBLIC - per artist, not on a date.
 *
 * Until 2026-09-10 this file held `lineupIsPublic()`, a date gate: nothing was
 * public before the lineup reveal on 13 September, everything confirmed was
 * public after it. Zaal retired the reveal that morning: "stop making a whole
 * reveal date - we will just post about each of them individually starting on
 * Saturday with their bio and photo." And the rule that comes with it:
 * nobody is posted without their bio and photo in hand.
 *
 * So the gate is the row, and it clears itself act by act. An act is public
 * when, and only when, all three hold:
 *
 *   - status is 'confirmed' - confirmed in writing (decision 0005)
 *   - bio is non-empty
 *   - photo_url is non-empty
 *
 * The case this exists for: on 2026-09-10 Dcoop was confirmed with a bio and
 * NO photo. Under the old gate he would have published photo-less the moment
 * the date passed. Under this one he waits until his photo is in the row.
 *
 * Both public readers use this one predicate - the lineup API the ZAO Festivals
 * app calls, and getPublicArtists() behind /artist/<slug> - so the site and the
 * app cannot publish different acts.
 */
export type PublishCandidate = {
  status?: string | null;
  bio?: string | null;
  photo_url?: string | null;
};

const filled = (v: string | null | undefined) => typeof v === 'string' && v.trim().length > 0;

export function isPublishable(row: PublishCandidate): boolean {
  return row.status === 'confirmed' && filled(row.bio) && filled(row.photo_url);
}
