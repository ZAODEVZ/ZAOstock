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
// TWITCH EXPIRES PAST BROADCASTS. When these are highlighted or exported
// somewhere permanent, swap the ids here; replay.test.ts keeps the shape honest.

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
  { part: 1, id: '2890837517', title: 'ZAOstock Music Festival Live Stream 1', length: '3:25', window: 'Just before the music, about noon' },
  { part: 2, id: '2890841510', title: 'ZAOstock Music Festival Live Stream 2', length: '9:25', window: 'About 12:05 PM' },
  { part: 3, id: '2890850258', title: 'ZAOstock Music Festival Live Stream 3', length: '7:22', window: 'About 12:15 PM' },
  { part: 4, id: '2890857550', title: 'ZAOstock Music Festival Live Stream 4', length: '2:00:50', window: 'About 12:25 to 2:25 PM' },
  { part: 5, id: '2890969100', title: 'ZAOstock Music Festival Live Stream 5', length: '1:04:03', window: 'About 2:30 to 3:30 PM' },
  { part: 6, id: '2891031137', title: 'ZAOstock Music Festival Live Stream 6', length: '2:30:51', window: 'About 3:30 PM to the close at 6' },
];

/** The part that opens first: the first long one, where the afternoon gets going. */
export const DEFAULT_REPLAY_PART = 4;

export function replayEmbedSrc(id: string): string {
  return `https://player.twitch.tv/?video=${id}&parent=zaostock.com&parent=localhost&autoplay=false`;
}

export function replayWatchHref(id: string): string {
  return `https://www.twitch.tv/videos/${id}`;
}
