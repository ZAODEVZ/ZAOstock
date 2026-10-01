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
 * ON THE RADIO. Both files already ship in public/brand/audio and play on
 * /brand; /media plays them too. Zaal, 2026-09-29: "include ... a link to
 * the star 97.7 interview". The 30-second spot ran on Star 97.7 from 21 Sep
 * to 2 Oct (vault projects/zaostock-star-977-radio-commercial-2026-09-17.md).
 */
export type RadioItem = { title: string; detail: string; src: string };

/** The station's own site, linked from the radio cards (a signed media partner). */
export const STAR_977_URL = 'https://star977fm.com/';

export const RADIO: readonly RadioItem[] = [
  {
    // Zaal, 2026-10-01 (relayed by the orchestration seat): station Star 97.7,
    // also streamed on Twitch (VOD https://www.twitch.tv/videos/2888849470);
    // file from his Downloads, "Zaostock Update 10-1.mp3", 6:19.
    title: 'Zaal on Star 97.7, 1 October 2026',
    detail: 'A festival update live on air, two days out. 6:19.',
    src: '/brand/audio/zaostock-radio-update-2026-10-01.mp3',
  },
  {
    title: 'Zaal on Star 97.7, 10 September 2026',
    detail: 'The full interview about the festival. 7:39.',
    src: '/brand/audio/zaostock-radio-interview-2026-09-10.mp3',
  },
  {
    title: 'The ZAOstock radio spot',
    detail: 'The 30-second ad that ran on Star 97.7 in the weeks before the festival.',
    src: '/brand/audio/zaostock-commercial-30s.mp3',
  },
];

/**
 * EVERY ZAOSTOCK EDITION of The ZAO's daily newsletter, newest first. Each URL
 * was fetched on 2026-09-29 (HTTP 200, og:title read). The poidh bounty
 * editions (Days 264-266) are left out on purpose (Zaal: ignore poidh), and
 * Days 269-270 are not listed because their URLs were not found; add them
 * when they are, never by guessing a slug.
 */
export type Edition = { title: string; date: string; url: string };

export const NEWSLETTER: readonly Edition[] = [
  { title: 'Day 272: set times are up, and 4 days to go', date: '2026-09-29', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-272' },
  { title: 'Day 271: the story of ZAO Festivals, told out loud', date: '2026-09-28', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-271' },
  { title: 'Day 268: the Maine artists on the ZAOstock bill', date: '2026-09-25', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-268-the-maine-artists-on-the-zaostock-bill' },
  { title: 'Day 267: 9 days out, everything you need to know', date: '2026-09-24', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-267-9-days-out-everything-you-need-to-know' },
  { title: 'Day 263: 13 days until ZAOstock', date: '2026-09-21', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-263-13-days-until-zaostock' },
  // Day 260 removed 2026-09-30: the edition 404s on Paragraph (see zao-media.ts).
  { title: 'Day 259: LyonsDen is playing ZAOstock', date: '2026-09-17', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-259-1' },
  { title: 'Day 258: DCoop is playing ZAOstock', date: '2026-09-15', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-258' },
  { title: 'Day 246: thirty days out', date: '2026-09-04', url: 'https://paragraph.com/@thezao/year-of-the-zabal-day-246' },
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
