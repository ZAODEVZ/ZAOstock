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

export type ReplayProvider = 'twitch' | 'youtube';

export type ReplayPart = {
  part: number;
  /** Where the video lives. Twitch when left out. */
  provider?: ReplayProvider;
  /** Button text. An act's name when each part is one set; "Part N" when left out. */
  label?: string;
  /** Twitch video id (digits only), or the 11-character YouTube video id. */
  id: string;
  title: string;
  /** Running length as the host shows it. */
  length: string;
  /** Roughly when in the day, Eastern. Approximate by construction. */
  window: string;
};

export const REPLAY_PARTS: readonly ReplayPart[] = [
  { part: 1, id: '2890835848', title: 'ZAOstock Music Festival Live', length: '7:15:48', window: 'The whole day, from noon' },
];

/** The line under the player. Says what this list is, so it changes with the list. */
export const REPLAY_NOTE = 'The whole day in one recording, captured from this page as it streamed.';

/** "Part 3", or the part's own label when it has one. */
export function replayPartLabel(p: Pick<ReplayPart, 'part' | 'label'>): string {
  return p.label ?? `Part ${p.part}`;
}

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

// YOUTUBE PARTS. Twitch deletes past broadcasts; YouTube does not. A part with
// provider 'youtube' embeds from youtube-nocookie.com, which is already on the
// frame-src list in next.config.ts, and never autoplays (the default there).

export function replayProvider(p: Pick<ReplayPart, 'provider'>): ReplayProvider {
  return p.provider ?? 'twitch';
}

/** "Twitch" or "YouTube", for button and link labels. */
export function replayHostName(p: Pick<ReplayPart, 'provider'>): string {
  return replayProvider(p) === 'youtube' ? 'YouTube' : 'Twitch';
}

/** The iframe src for a part, whichever host it is on. */
export function replayPartEmbedSrc(p: Pick<ReplayPart, 'provider' | 'id'>): string {
  if (replayProvider(p) === 'youtube') return `https://www.youtube-nocookie.com/embed/${p.id}?rel=0`;
  return replayEmbedSrc(p.id);
}

/** The link that opens a part on its host. */
export function replayPartWatchHref(p: Pick<ReplayPart, 'provider' | 'id'>): string {
  if (replayProvider(p) === 'youtube') return `https://www.youtube.com/watch?v=${p.id}`;
  return replayWatchHref(p.id);
}
