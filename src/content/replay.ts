// THE FESTIVAL, RECORDED. Zaal, 2026-10-04 00:0x (seat pane): "lets emebed this
// video everyhwer i just renamed all of them on twitch for zaofestivals".
//
// The 3 October stream reconnected five times, so Twitch stored the day as six
// past broadcasts on twitch.tv/zaofestivals. Ids, titles and lengths read from
// twitch.tv/zaofestivals/videos?filter=archives on 2026-10-04 (seat in Chrome,
// and this lane in a headless browser). The clock windows are derived from the
// measured stream starts (about 12:01, 12:05, 12:25, 14:28 and 15:32) and the
// 18:07 end, so they are approximate and say so.
//
// TWITCH EXPIRES PAST BROADCASTS, AND THESE DID. Measured 2026-10-12 against
// Twitch's own API: all six zaofestivals ids above (2890837517, 2890841510,
// 2890850258, 2890857550, 2890969100, 2891031137) return "video does not
// exist", so /live and /media were showing six dead players. The one public
// recording left is twitch.tv/videos/2890835848 on bettercallzaal, "ZAOstock
// Music Festival Live", 26148 s: the whole day in one piece, captured from the
// /live page itself, so the stage sits inside the page. It will expire too.
// The permanent fix is the per-act sets on YouTube (iman-desk #64); when those
// exist, swap this list for them. replay.test.ts keeps the shape honest.

export type ReplayPart = {
  part: number;
  /** Twitch video id, digits only. */
  id: string;
  title: string;
  /** Running length as Twitch shows it. */
  length: string;
  /** Roughly when in the day, Eastern. Approximate by construction. */
  window: string;
};

export const REPLAY_PARTS: readonly ReplayPart[] = [
  { part: 1, id: '2890835848', title: 'ZAOstock Music Festival Live', length: '7:15:48', window: 'The whole day, from noon' },
];

/** The part that opens first. */
export const DEFAULT_REPLAY_PART = 1;

const COUNT_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/** "in one recording" or "in six parts": page copy follows the list, so it cannot go stale. */
export function replayPartsPhrase(count: number = REPLAY_PARTS.length): string {
  if (count === 1) return 'in one recording';
  return `in ${COUNT_WORDS[count] ?? String(count)} parts`;
}

export function replayEmbedSrc(id: string): string {
  return `https://player.twitch.tv/?video=${id}&parent=zaostock.com&parent=localhost&autoplay=false`;
}

export function replayWatchHref(id: string): string {
  return `https://www.twitch.tv/videos/${id}`;
}
