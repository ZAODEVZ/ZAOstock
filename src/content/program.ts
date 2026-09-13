// THE RUN OF SHOW. The times here are the repo's one internal source: OPS_ACTS
// and the ops room are held to them by tests, and each act reads its own time
// on its own backstage page.
//
// THEY ARE NOT RENDERED PUBLICLY. Zaal, 2026-09-12: "no set times listed
// publicly. Not on the site, not in posts, not in the reveal copy. Name the
// act, not the slot." That reversed his 2026-09-10 call to point artists at
// /program, so /program now publishes the ORDER and the day's boundaries, and
// publicSlots() is what the page is allowed to show. Day boundaries survive:
// noon and six are not a slot for any act, and people have to know when to come.
//
// Source: docs/plans/ros-5min-2026-10-03.md (v7) and Zaal's typed verdicts in
// ~/zao-vault/daily/2026-08-27.md and 2026-08-28.md, retimed 2026-09-10
// ("option b": seven-minute changeovers, the 30-minute acts to 33).

export type Venue = 'OUT' | 'IN';

export interface Slot {
  /** 24h. Internal: the page never renders it. */
  time: string;
  label: string;
  detail?: string;
  tone?: 'set' | 'gap' | 'open' | 'battle';
  /** Changeovers and the like: real rows, but nothing for the public to read. */
  crewFacing?: true;
}

export interface Block {
  start: string;
  end: string;
  venue: Venue;
  title: string;
  lede: string;
  slots: Slot[];
}

export const BLOCKS: Block[] = [
  {
    start: '12:00',
    end: '18:00',
    venue: 'OUT',
    title: 'Live sets',
    lede: 'Eight independent acts back to back on the parklet stage. Between sets the MC keeps the day moving with the story of the event and a word from the partners.',
    slots: [
      // THE RUN OF SHOW, RETIMED 2026-09-10 (Zaal: "lets give 7 mins between
      // performers and give the 30 mins people some more time", then "option b").
      // Hurricane's 15:10 set left a 40-minute hole; it is spread across the
      // day instead. Seven-minute changeovers, the four 30-minute acts now 33,
      // the 40-minute acts unchanged. Music 12:05 to 17:46, street clears at
      // 18:00: fourteen minutes of margin on the whole afternoon.
      //
      // THIS GRID IS THE ONE PUBLIC SOURCE OF SET TIMES (Zaal, 2026-09-10:
      // public everywhere at once, /program canonical, the artist form points
      // here rather than repeating them). OPS_ACTS and the ops room are held to
      // it by tests.
      //
      // Who is PLAYING and when, and nothing more: none of them has
      // countersigned, and the word "confirmed" appears against no act here.
      // The API reveal is a separate gate that still reads only
      // status='confirmed'.
      { time: '12:00', label: 'Doors. Music starts at noon.', detail: 'A five-minute welcome on the mic.', tone: 'gap' },
      { time: '12:05', label: 'The Crown Vics', detail: 'Rock n roll dance band.', tone: 'set' },
      { time: '12:38', label: 'Changeover', detail: 'The MC, the six o\u2019clock move, Art of Ellsworth, a partner spot.', tone: 'gap' , crewFacing: true },
      { time: '12:45', label: 'OPEN X', detail: 'Power pop rock.', tone: 'set' },
      { time: '13:25', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '13:32', label: 'Grass Rug', detail: 'Jam rock band.', tone: 'set' },
      { time: '14:05', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '14:12', label: 'Acadia Rising', detail: 'World Rhythms and Global Fusion.', tone: 'set' },
      { time: '14:45', label: 'Changeover', detail: 'The MC and a partner spot.', tone: 'gap' , crewFacing: true },
      { time: '14:52', label: 'Michael Anderson', detail: 'Solo piano.', tone: 'set' },
      { time: '15:25', label: 'Changeover', detail: 'The MC and our partners.', tone: 'gap' , crewFacing: true },
      { time: '15:32', label: 'DCoop', detail: 'Hip-hop.', tone: 'set' },
      { time: '16:12', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '16:19', label: 'Lyons Den', detail: 'Native, Electro, Reggae and Hip-hop.', tone: 'set' },
      { time: '16:59', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '17:06', label: 'Fellenz', detail: 'Rock guitar and soundtrack. Closes the outdoor block.', tone: 'set' },
      { time: '17:46', label: 'Music ends. The street clears at six.', detail: 'Black Moon next door hosts their own evening from six.', tone: 'gap' },
    ],
  },
  {
    start: '18:00',
    end: '21:00',
    venue: 'IN',
    title: 'The evening at Black Moon',
    // SETTLED 2026-09-07. North Creek, roughly 6 to 9, underwritten by Black Moon
    // on their own premises and their own licence. Source is Steve Peer's own mail
    // of 26 August: "underwrite 'North Creek' for the after party. 6 - 9pm (approx.)
    // on the indoor stage."
    //
    // This page previously published 18:00-22:00 as a two-hour DJ set then a live
    // set. That was the older plan and it overran the evening by an hour against
    // what the venue owner who is paying for it actually described.
    //
    // NOTE THE SCOPE LINE: our insurance covers the 12-6pm OUTDOOR event only
    // (Zaal to the broker, 3 September). The evening is Black Moon's, so this
    // block describes their programme, not ours, and should not gain detail we
    // have not been given.
    lede: 'At six the street clears. Black Moon next door hosts their own evening, North Creek from 6 to 9 - their stage, their licence, underwritten by them.',
    slots: [
      { time: '18:00', label: 'North Creek', detail: 'The after-party, hosted and underwritten by Black Moon on their own stage.', tone: 'set' },
      { time: '21:00', label: 'Close', detail: 'Approximate. Black Moon keeps its own hours.', tone: 'gap' },
    ],
  },
];

/**
 * What /program may show: the order, with the changeovers folded away and no
 * clock on any row. `time` is deliberately absent from the returned shape, so
 * a page cannot render one by reaching for it.
 */
export function publicSlots(block: Block): Array<{ label: string; detail?: string; tone: NonNullable<Slot['tone']> }> {
  return block.slots
    .filter((s) => !s.crewFacing)
    .map((s) => ({ label: s.label, detail: s.detail, tone: s.tone ?? 'set' }));
}
