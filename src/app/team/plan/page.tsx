import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZAOstock Team - The Plan',
  description: 'Everything open for October 3, in one place.',
  robots: { index: false, follow: false },
};

// One page for the whole team, so nobody has to hold the state in their head.
//
// NOT indexed (robots noindex), but NOT login-gated either - same pattern as
// /team/help. Anyone with the link can read it, including partners and the
// city. So it deliberately carries NO money figures, NO vendor pricing, and NO
// personal contact details. Work and owners only. Keep it that way.
//
// Source of truth is the cowork board; this is a curated read of it, refreshed
// by hand. Card ids are included so a board write can find the row.

type Lane = 'cannot-recover' | 'blocks-announce' | 'promotion' | 'day-of' | 'livestream';

interface Item {
  title: string;
  owner: string;
  when: string;
  card?: string;
  note?: string;
  overdue?: boolean;
}

const LANES: { id: Lane; label: string; why: string; items: Item[] }[] = [
  {
    id: 'cannot-recover',
    label: 'Cannot be recovered later',
    why: 'These have a window that closes. Everything else can slip a week; these cannot.',
    items: [
      {
        title: 'The artist roster',
        owner: 'Zaal',
        when: 'this week',
        note: 'Three acts confirmed. More confirmations expected. Contracts, set times, the poster and the reveal all wait on this list.',
      },
      {
        title: 'Event insurance - it is a permit condition, not diligence',
        owner: 'UNASSIGNED',
        when: 'was due 21 Aug',
        card: '89e9da61',
        overdue: true,
        note: 'Brokers already researched and ranked. This is a phone call, not a decision.',
      },
      {
        title: 'Sound and PA - confirm what Steve’s offer actually covers',
        owner: 'Zaal',
        when: 'was due 1 Aug',
        card: '7d0cf2b0',
        overdue: true,
        note: 'Gear, channel count, setup and strike, operator, power, cancellation. Four backups exist on the record.',
      },
      {
        title: 'Fiscal sponsor replacement',
        owner: 'UNASSIGNED',
        when: '26 Aug',
        card: '6386c0c7',
        note: 'Sponsor money has nowhere to land until this is chosen.',
      },
      {
        title: 'Artist contracts, carrying the Friday soundcheck clause',
        owner: 'UNASSIGNED',
        when: '24 Aug',
        card: '34ae259d',
        note: 'Friday night is contractual. Checks happen at whichever stage the act plays.',
      },
      {
        title: 'Local-business baseline - a normal Saturday, before the day',
        owner: 'Zaal',
        when: 'before 3 Oct',
        note: 'After the event you cannot go back and find out what a normal Saturday looked like. Black Moon first.',
      },
    ],
  },
  {
    id: 'blocks-announce',
    label: 'Blocks the announcement',
    why: 'The lineup reveal is the biggest attention moment of the year. These gate it.',
    items: [
      { title: 'Pitch deck v1 - three variants', owner: 'Zaal', when: 'was due 21 Aug', card: '8556d703', overdue: true, note: 'Words are written. Assembly is the remaining step.' },
      { title: 'Sponsor tiers and discount authority', owner: 'Zaal', when: 'was due 21 Aug', card: 'b80026fc', overdue: true, note: 'Gated on the deck.' },
      { title: 'Brand kit for ZAOstock and The ZAO, plus print deliverables', owner: 'Samantha', when: '30 Aug', card: '801d6743' },
      { title: 'The poster', owner: 'Zaal to delegate', when: 'was due 20 Aug', card: '53e3ff3a', overdue: true, note: 'Cannot start until set times exist, which cannot exist until the roster does.' },
      { title: 'Artist house - Arbor Camp', owner: 'Zaal', when: '24 Aug', card: '9e2ad6a8', note: 'Housing is the remaining nut.' },
      { title: 'Transport with Bendigo', owner: 'Zaal', when: '15 Sep', card: 'b24c0323' },
    ],
  },
  {
    id: 'promotion',
    label: 'Promotion surfaces',
    why: 'All cheap, all overdue, all independent of each other. Good delegation candidates.',
    items: [
      { title: 'Photos onto zaostock.com', owner: 'Zaal', when: 'was due 20 Aug', card: '27dfa999', overdue: true },
      { title: 'Partner section: Star 97.7 and Black Moon logos', owner: 'Zaal', when: 'was due 20 Aug', card: 'fbcf1d46', overdue: true },
      { title: 'Black Moon logo onto partner surfaces', owner: 'Zaal', when: 'was due 23 Aug', card: '80cdef1b', overdue: true },
      { title: 'Facebook event', owner: 'Zaal', when: 'was due 21 Aug', card: 'cc314651', overdue: true },
      { title: 'Facebook page', owner: 'Zaal', when: 'no date', card: '161567c3' },
      { title: 'Star 97.7 radio appearance with Paul', owner: 'UNASSIGNED', when: '5 Sep', card: '236edf76' },
      { title: 'Heart of Ellsworth org video onto the site', owner: 'Zaal', when: '24 Aug', card: 'b090e2bf' },
      { title: 'Follow up with Colleen', owner: 'Iman', when: 'no date', card: 'f105182b' },
    ],
  },
  {
    id: 'day-of',
    label: 'Day-of operations',
    why: 'Not urgent this week, but each one needs a name against it before late September.',
    items: [
      { title: 'First Aid contact + kit, no dedicated person (Zaal, 27 Aug)', owner: 'Zaal', when: 'no date', card: '71716c06' },
      { title: 'Stage managers, parklet and Black Moon - both unnamed. Sequential, not simultaneous, so one person could cover both', owner: 'UNASSIGNED', when: 'before 3 Oct' },
      { title: 'Sound cover for the WaveWarZ block, since Stilo is battling in it', owner: 'UNASSIGNED', when: 'before 3 Oct' },
      { title: 'Livestream and virtual - SPLIT, no longer one lead. Aziz owns the rig and Restream, Ohnahji owns scheduling and guests. Motomoto in the crew, does not lead a half', owner: 'Aziz + Ohnahji', when: 'closed 27 Aug', card: 'bb2b9326', note: 'Supersedes the 24 Aug call that virtual has no lead deliberately. Which half goes to which is read from the vault, not from Zaal - one word flips it. See docs/plans/people-map-2026-10-03.md.' },
      { title: 'Fire permit for the fire spinning', owner: 'Zaal', when: 'was due 21 Aug', card: 'c03f74b5', overdue: true },
      { title: 'LiDAR venue scan for the Decentraland build', owner: 'Zaal', when: 'no date', card: 'ca119cdf' },
    ],
  },
  {
    id: 'livestream',
    label: 'Livestream - the Baraza OBS rig',
    why: 'This was tracked as its own lane and it is not one. Aziz owns the rig half of our livestream split, and the Baraza TV OBS build IS that rig. Its blockers are ZAOstock blockers. Source: ~/zao-vault/handoffs/baraza.md, and the test slipped its 22 Aug date.',
    items: [
      {
        title: 'Aziz: the rtmps ingest URL + stream key (Cloudflare Live Input) - THE blocker',
        owner: 'Zaal to chase Aziz',
        when: 'was due 22 Aug',
        card: '654b9aba',
        overdue: true,
        note: 'Nothing local substitutes. The encode path is proven end to end - h264_nvenc CBR 6000k 1080p30 verified with ffprobe - so the ONLY untested link left is Aziz\u2019s ingest endpoint. If one thing gets chased this week, this is it.',
      },
      {
        title: 'Zaal: send Aziz the Windows desktop specs',
        owner: 'Zaal',
        when: 'was due 22 Aug',
        overdue: true,
        note: 'Aziz\u2019s own words: "If you can send me the specs for your device, I can share with you some plugins that you will need." Doc 2316 recorded this exchange BACKWARDS and cost three days of both sides waiting. Zaal owes specs; Aziz owes the plugin list and the ingest URL. Do not re-litigate the direction.',
      },
      {
        title: 'Relay the plugin answer to Motomoto - already worked out, never sent',
        owner: 'Zaal',
        when: 'was due 22 Aug',
        overdue: true,
        note: 'The only true third-party plugin is Advanced Scene Switcher. obs-websocket v5 and Browser Source ship inside OBS 28+. 64-bit VLC and Python 3.12 + requirements.txt are machine deps, not plugins. Do not re-derive this - relay it.',
      },
      {
        title: 'Aziz: export Baraza_TV_v2.json from the origin machine',
        owner: 'Zaal to chase Aziz',
        when: 'before any test',
        note: 'The repo does not ship the v2 scene collection, and baraza-obs-launch.bat forces that collection name in user.ini, which breaks on a fresh machine. Now known to gate the whole macro layer, not just scene parity. The ask is already in baraza-tv PR #5.',
      },
      {
        title: 'Run the 10-minute test, then mark baraza-tv PR #5 ready for review',
        owner: 'Zaal + Aziz',
        when: 'after the ingest URL lands',
        note: 'Per obs/WINDOWS-SETUP.md section 7, confirming playback on Aziz\u2019s Cloudflare side. PR #5 goes ready-for-review once Zaal approves the ask-Aziz framing. Two smaller fixes ride along: repoint the "Camera" VLC source off the dead E:/ card path, and the ADVSS reader path fix so the dashboard panel stops reading configFound:false.',
      },
    ],
  },
];

// One venue at a time, not two stages alternating - corrected 23 Aug. Doors
// were moved to 11:00 on 26 Aug for a fifth 45/15 slot; Zaal reverted that on
// 27 Aug: MUSIC STARTS AT NOON. 12:00-16:00 at 45/15 is four slots; four acts
// confirmed, Werb not fully (20:4x). No DJ - the MC and partner spots cover
// changeovers (20:0x). Full reasoning and Steve's supply list live in
// docs/plans/production-plan-2026-10-03.md.
const DAY = [
  { time: '12:00 - 16:00', what: 'Artists, outdoors on the parklet. 45 min sets, 15 min changeovers, our MC plus partner spots between sets - no DJ (Zaal 27 Aug 20:0x)', who: 'Fellenz, Lyons Den, Dcoop, Acadia Rising - four CONFIRMED. Werb NOT fully confirmed (Zaal 27 Aug 20:4x), wanted for WaveWarZ. Four slots at noon start; running order is Zaal’s plan and not public' },
  { time: '16:00 - 18:00', what: 'WaveWarZ, still outdoors', who: 'Stilo, Jango, Lui, Quan battling. Hurricane MCing' },
  { time: '18:00 - 21:00', what: 'The after party, indoors at Black Moon. IN BOOKING - no confirmed act', who: 'North Creek PROPOSED ONLY (Zaal 27 Aug), along with Crown Vics and The Somes Sound - Steve’s three, until he confirms. Downbeat 18:00 or 18:30 also unconfirmed' },
  { time: '21:00 on', what: 'DJ to close, indoors', who: 'Stilo DJing - CONFIRMED on our side, per the message from the DJ (gdoc snapshot 27 Aug). Moved off the old 18:00-20:00 block' },
];

const MONDAY = [
  'Sound: what Steve’s PA offer covers, and a named backup started in parallel',
  'The city: what form the insurance certificate takes, and whether the Art of Ellsworth exemption covers our permit window',
  'The daytime is FULL, not half empty - one venue at a time from noon gives four slots; four acts confirmed and Werb in confirmation. Steve’s offer to fill blanks is a reserve, not a need',
  'Who covers sound during WaveWarZ, since Stilo is battling in it',
  'Stage manager for the parklet and one for Black Moon after six',
  'Who asks Black Moon for the normal-Saturday baseline, and by when',
  'Livestream: has Aziz sent the rtmps ingest URL and key? Everything else in the OBS rig is proven and this is the only untested link',
];

function Pill({ overdue }: { overdue?: boolean }) {
  if (!overdue) return null;
  return (
    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-rose-400/40 bg-rose-400/10 text-rose-300 flex-shrink-0">
      Overdue
    </span>
  );
}

export default function TeamPlanPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a1628] text-white pb-16">
      <header className="sticky top-0 z-40 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/team" className="text-xs text-gray-400 hover:text-[#f5a623]">
            &larr; Team
          </Link>
          <span className="text-xs text-gray-500">Oct 3, 2026</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <div className="space-y-3">
          <p className="inline-block rounded-full bg-[#f5a623]/10 px-3 py-1 text-xs text-[#f5a623] font-medium border border-[#f5a623]/30">
            Everything open, in one place
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">The Plan</h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Ordered by what cannot be recovered later, not by due date. If you only read one
            section, read the first one.
          </p>
        </div>

        <section className="bg-[#0d1b2a] rounded-xl border border-white/[0.08] overflow-hidden">
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold px-5 pt-5 pb-3">
            The day
          </p>
          <div className="divide-y divide-white/[0.06]">
            {DAY.map((d) => (
              <div key={d.time} className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <p className="text-sm font-mono font-bold text-white tabular-nums sm:w-32 flex-shrink-0">
                  {d.time}
                </p>
                <div className="min-w-0">
                  <p className="text-sm text-white">{d.what}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.who}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {LANES.map((lane) => (
          <section key={lane.id} className="space-y-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">{lane.label}</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl">{lane.why}</p>
            </div>
            <div className="space-y-2">
              {lane.items.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#0d1b2a] rounded-lg border border-white/[0.08] p-3.5"
                >
                  <div className="flex items-start gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white flex-1 min-w-0">{item.title}</p>
                    <Pill overdue={item.overdue} />
                  </div>
                  {item.note && <p className="text-xs text-gray-500 mt-1.5">{item.note}</p>}
                  <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
                    <span className={item.owner === 'UNASSIGNED' ? 'text-rose-300' : 'text-gray-400'}>
                      {item.owner}
                    </span>
                    <span className="text-gray-600">{item.when}</span>
                    {item.card && <span className="text-gray-700">{item.card}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-[#0d1b2a] rounded-xl p-5 border border-white/[0.08] space-y-3">
          <p className="text-xs text-[#f5a623] uppercase tracking-wider font-bold">
            What Monday has to settle
          </p>
          <ul className="text-sm text-gray-300 space-y-2">
            {MONDAY.map((m) => (
              <li key={m} className="flex gap-2">
                <span className="text-gray-600 flex-shrink-0">-</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-gray-600">
          Six items above have no owner. An unassigned item is not waiting on anybody, which means
          it is not moving.
        </p>

        <div className="flex gap-4 text-sm">
          <Link href="/program" className="text-[#f5a623] hover:text-[#ffd700]">
            The program
          </Link>
          <Link href="/team" className="text-[#f5a623] hover:text-[#ffd700]">
            Team dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
