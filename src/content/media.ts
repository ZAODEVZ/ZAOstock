import { LINEUP_NAMES } from './site';

// THE /media PAGE'S CONTENT. Zaal, 2026-09-29: "can we add this to a media
// page, can we add a social media page for zaostock website where we can embed
// different things from different artists".
//
// Two lists, both hand-kept and both tested (media.test.ts):
// - PRESS: coverage by other outlets. Only pieces that were fetched and read.
// - ARTIST_EMBEDS: specific videos an act wants on the page, keyed by the
//   identity name in LINEUP_NAMES. YouTube only for now, played through
//   youtube-nocookie.com, because Instagram, Facebook and X embeds load their
//   own tracking scripts on every visit. Those platforms appear as plain links
//   from each act's own socials instead. Add a row when an act (or Zaal) sends
//   a video link; an act with no row simply shows its links.

export type PressItem = {
  outlet: string;
  title: string;
  /** ISO date the piece was published. */
  date: string;
  url: string;
  /** One line on what the piece says about ZAOstock, in our words. */
  summary: string;
};

export const PRESS: readonly PressItem[] = [
  {
    outlet: 'The Ellsworth American',
    title: 'Art and soul: Art of Ellsworth, part of Maine Craft Weekend, set for Oct. 1-4',
    date: '2026-09-22',
    url: 'https://www.ellsworthamerican.com/lifestyle/arts/art-and-soul-art-of-ellsworth-part-of-maine-craft-weekend-set-for-oct-1/article_ef9677d1-b581-4015-b30a-34e1fe02fee0.html',
    summary: 'ZAOstock is listed in the Art of Ellsworth weekend roundup: Saturday, noon to six, Franklin Street Parklet, free and all ages.',
  },
];

/**
 * Acts that have confirmed they have NO social media. An empty socials field
 * in the database cannot tell "none" from "not asked yet", so every audit
 * would re-flag them; this list is the record that the answer is "none".
 * Michael Anderson: Zaal, 2026-09-29, "Micheal Anderson doesn't have social media".
 */
export const NO_SOCIALS: readonly string[] = ['Michael Anderson'];

export type Embed = { kind: 'youtube'; id: string; title: string };

export const ARTIST_EMBEDS: Readonly<Record<string, readonly Embed[]>> = {};

export function embedsFor(name: string): readonly Embed[] {
  return ARTIST_EMBEDS[name] ?? [];
}

export const MEDIA_ACTS = LINEUP_NAMES;
