// THE RUN OF SHOW. The times here are the repo's one internal source: OPS_ACTS
// and the ops room are held to them by tests, and each act reads its own time
// on its own backstage page.
//
// PUBLISHED ON /program ONLY. Zaal, 2026-09-28 (grill terminal, #318):
// "Publish times on /program". That reverses his 2026-09-12 "no set times
// listed publicly" for that one page: actTimes() below derives each act's
// range from these slots, so the page and the run sheet cannot drift. Every
// other public surface (artist pages, /live, the reveal copy) still names the
// act, not the slot, and no-public-set-times.test.ts still holds them to it.
// publicSlots() stays clock-free; the time travels separately.
//
// Source: docs/plans/ros-5min-2026-10-03.md (v7) and Zaal's typed verdicts in
// ~/zao-vault/daily/2026-08-27.md and 2026-08-28.md, retimed 2026-09-10
// ("option b": seven-minute changeovers, the 30-minute acts to 33).

export type Venue = 'OUT' | 'IN';

export interface Slot {
  /** 24h. /program renders act ranges from it via actTimes(); nothing renders it raw. */
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
    lede: 'Eight independent acts were on the bill for the parklet stage. The program had the MC between sets with the story of the event and a word from the partners.',
    slots: [
      // THE RUN OF SHOW, RETIMED 2026-09-10 (Zaal: "lets give 7 mins between
      // performers and give the 30 mins people some more time", then "option b"),
      // THEN NUDGED 2026-09-25 (Zaal: "clean up the times... closer to on the
      // 5 min mark") so every set starts on a clean five-minute mark. Hurricane's
      // 15:10 set left a 40-minute hole; it is spread across the day instead.
      //
      // REBALANCED AGAIN 2026-09-27 (Zaal: "can we add more time in between
      // acts we might need it in case acts go long", then "just do some of
      // them deff the first 3", then "lets do another table btu with open x
      // at 33 min"): the first three changeovers move to the next tier that
      // still keeps every start on the 5-minute grid - 7 becomes 12 after a
      // 33-minute set, 5 becomes 10 after a 40-minute one. OPEN X drops from
      // 40 to 33 minutes, so its own following changeover also needs the
      // 33-minute tier (12, not 10). The other four acts are unchanged: four
      // 33-minute acts (Crown Vics, Grass Rug, Acadia Rising, Michael
      // Anderson), three 40-minute acts (DCoop, LyonsDen, Tom Fellenz).
      // Music 12:05 to 17:50, street clears at 18:00: ten minutes of margin.
      //
      // CLOSING REMARKS ADDED 2026-09-27: Tom Fellenz, by text - "should for
      // sure be in your run of show" - Zaal: "Good point thx", then "add your
      // closing remarks at 5:50pm", then "Let's add it as last 10 mins" - the
      // existing 17:50-18:00 margin before the street clears, not a new slot.
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
      { time: '12:00', label: 'Doors. Music from noon.', detail: 'A five-minute welcome on the mic.', tone: 'gap' },
      { time: '12:05', label: 'The Crown Vics', detail: 'Rock n roll dance band.', tone: 'set' },
      { time: '12:38', label: 'Changeover', detail: 'The MC, the six o\u2019clock move, Art of Ellsworth, a partner spot.', tone: 'gap' , crewFacing: true },
      { time: '12:50', label: 'OPEN X', detail: 'Power pop rock.', tone: 'set' },
      { time: '13:23', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '13:35', label: 'Grass Rug', detail: 'Indie jam rock.', tone: 'set' },
      { time: '14:08', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '14:20', label: 'Acadia Rising', detail: 'World Rhythms and Global Fusion.', tone: 'set' },
      { time: '14:53', label: 'Changeover', detail: 'The MC and a partner spot.', tone: 'gap' , crewFacing: true },
      { time: '15:00', label: 'Michael Anderson', detail: 'Solo piano.', tone: 'set' },
      { time: '15:33', label: 'Changeover', detail: 'The MC and our partners.', tone: 'gap' , crewFacing: true },
      { time: '15:40', label: 'DCoop', detail: 'Hip-hop rooted, pulling from reggae, rock, punk, tribal, country, EDM and R&B.', tone: 'set' },
      { time: '16:20', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '16:25', label: 'LyonsDen', detail: 'Native, Electro, Reggae and Hip-hop.', tone: 'set' },
      { time: '17:05', label: 'Changeover', tone: 'gap' , crewFacing: true },
      { time: '17:10', label: 'Tom Fellenz', detail: 'Solo Instrumental Acoustic Guitar. Last act on the outdoor bill.', tone: 'set' },
      { time: '17:50', label: 'Music ends. Closing remarks, the last ten minutes before six.', detail: 'The program had Zaal thanking everyone and sending them to Black Moon next door from six.', tone: 'gap' },
    ],
  },
  {
    start: '18:00',
    end: '22:00',
    venue: 'IN',
    title: 'The evening at Black Moon',
    // SETTLED 2026-09-14 (Zaal), CORRECTED 2026-09-26: the ZAOstock after-party
    // at Black Moon Public House, with North Creek, hosted by Black Moon, from
    // six (poster: 6 to 10 PM). Hosted and underwritten by Black Moon on their
    // own premises and their own licence. Steve's own email (26 Sept, "ZaoFest26
    // Invoices") names the act: "underwrite 'North Creek' for the after party" -
    // he underwrites it, he does not perform it, and every surface that said
    // "a DJ, run by Steve" was wrong on that point. The poster's own "DJ" line
    // is North Creek, the same act - RELAYED, not witnessed directly by this
    // lane (Zaal, 2026-09-27, via the grill lane's cross-session message:
    // "Dj is same as act").
    //
    // Close was 21:00, contradicting this block's own "poster: 6 to 10 PM"
    // four lines away - caught 2026-09-27 and routed to Zaal via Vault
    // (commit ea47f007). DIRECT CONFIRMATION (Zaal, 2026-09-27, Dotfiles'
    // own seat, by picker in Dotfiles' pane): "Yes, 10 PM is right." Close
    // moves to 22:00 and this block's `end` with it.
    //
    // NOTE THE SCOPE LINE: our insurance covers the 12-6pm OUTDOOR event only
    // (Zaal to the broker, 3 September). The evening is Black Moon's, so this
    // block describes their programme, not ours, and should not gain detail we
    // have not been given.
    // Short on purpose: the After-party row right below carries the details,
    // and repeating them here printed the same sentence twice (audit 2026-09-30).
    lede: 'The ZAOstock after-party was billed at Black Moon Public House next door from six. Black Moon\'s flyer and details: zaostock.com/afterparty.',
    slots: [
      { time: '18:00', label: 'After-party', detail: 'The ZAOstock after-party was billed at Black Moon Public House, 142 Main St, on Black Moon\'s own premises. Doors from 6, music 7 to 10 PM, billed: North Creek, Treelock & HiDef, Sam Savage and Oven Baked Beats DJ Aquavantes. All ages.', tone: 'set' },
      { time: '22:00', label: 'Close', detail: 'Around 10 PM. Black Moon keeps its own hours.', tone: 'gap' },
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

/** "17:10" -> "5:10". */
function clock12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')}`;
}

/**
 * Each act's public time range on /program, keyed by label: start is the set's
 * own slot, end is the next slot's start (the changeover or the close). Only
 * the outdoor bill; Black Moon's evening is theirs, not a slot we publish.
 */
export function actTimes(block: Block): Record<string, string> {
  if (block.venue !== 'OUT') return {};
  const out: Record<string, string> = {};
  block.slots.forEach((s, i) => {
    if ((s.tone ?? 'set') !== 'set') return;
    const end = block.slots[i + 1]?.time ?? block.end;
    const pm = Number(end.split(':')[0]) >= 12 ? 'PM' : 'AM';
    out[s.label] = `${clock12(s.time)} to ${clock12(end)} ${pm}`;
  });
  return out;
}
