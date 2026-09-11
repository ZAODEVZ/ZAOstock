# Session handoff - 2026-09-03

> from the zaostock lane (MacBook-Air-5), ZAODEVZ/ZAOstock @ main -> to the zj lane
> doc: .handoffs/session-2026-09-03-zaostock-to-zj/README.md
> chain: .handoffs/session-2026-09-01-zaostock-32-days/README.md

## Receiver instructions

You are taking ZAOstock and the insurance thread. Read A through E, absorb
section A into your list, and use B as the why. Section F is the part only Zaal
can do - he asked for it explicitly.

**Verification convention.** Every claim carries the command that produced it and
the time it was run. Do not restate any of it from memory later - re-run it. Two
claims in this estate were false when written on 2026-09-01, and one had already
replicated into a second document before anyone checked.

**Re-measured 2026-09-03 05:40** unless a line says otherwise.

---

## A. Tasks to absorb

- [ ] **The artists table, and it fires in 4 days.** `select status, count(*) from
      artists group by status` returns **9 wishlist, 0 confirmed** - measured
      05:40 today. The reveal gate opens automatically at Ellsworth midnight on
      **Monday 7 September**. Decision 0005 merged on main and is explicit:
      `confirmed` means confirmed IN WRITING, and "an act that is locked but
      unsigned does not go in the table yet." Signatures are due **11
      September**, four days AFTER the reveal. So on the current rules the reveal
      publishes Lyons Den or nothing. **This is Zaal's decision, not a fix** -
      see F1.
- [ ] **The site still sells an evening the insurance email says is not ours.**
      `src/content/site.ts:64-65` still lists "6 - 8 PM Black Moon: DJ set" and
      "8 - 10 PM Black Moon: Live set" inside `DAY`, which renders as ZAOstock's
      own programme. The Holly draft in your lane says the event ends at 6pm
      outdoors and the evening is Black Moon's own booking. **If ZAOstock
      promotes it, that 6pm cutoff becomes a material misstatement to an
      underwriter.** Either the DAY rows come out or the email changes. Do not
      send and leave the site as-is.
- [ ] **A tripwire I wrote now points the wrong way.** `src/lib/event-window.test.ts`
      is on main (#99, merged) and pins `windowLabel === 'Noon - 6 PM'` as the
      *error* against a programme running to 22:00. Under the new position the
      6pm label is **correct** and the DAY evening rows are the problem. The test
      still passes, so it will not trip - but its comment tells the next reader to
      fix the wrong side. Rewrite the comment when the evening question settles.
- [ ] **Five genres and one spelling owed to Holly.** Missing: The Crown Vics
      (Steve), Grass Rug (the band), Acadia Rising (Sen), Lyons Den (**no owner
      recorded anywhere** - its own gap), plus the evening acts if they stay in
      scope. And the repo says **DJ Aquavantes** everywhere while Zaal said
      **Aquaventus** on 2 Sep. One is wrong and it goes on a poster.
- [ ] **Dcoop's fire COI - nine days, nobody moving it.** Assigned to Zaal, due
      2026-08-24, still UNSET. It gates whether the fire act happens at all. The
      Holly draft already commits to forwarding it.

---

## B. Why - decisions and reversals, all from 2026-09-02

- **WaveWarZ is cancelled.** Hurricane performs a set instead. This was the right
  call operationally as well as creatively: Stilo was uncovered 16:00-20:00
  because he was battling then DJing, which the seconds map called "the largest
  single gap on the day." Cancelling removed it.
- **Stilo is not coming in person.** That closed the gap above permanently and
  opened a 2-hour indoor hole, which Steve then said he had covered.
- **The PA may be solved.** Zaal, after seeing Steve: the outdoor PA comes from
  **OPEN X**, a band who also perform. That is a performing act providing
  production equipment - it is worth confirming whether they carry their own
  insurance, which the Holly draft asks.
- **Two acts came back from the dead.** `production-plan:161` records "The Somes
  Sound, North Creek and DJ Aquavantes - OUT, not proposed, gone" (Zaal, 27 Aug
  22:3x). On 2 Sep Steve put **DJ Aquaventus and North Creek** on the evening.
  The repo still says they are out.
- **Then the evening was cut from the event's scope entirely**, per the draft in
  your own lane. Recorded here as *your* lane's position, not mine - I did not
  see that decision made, and it contradicts item 2 in section A. Settle it
  before the email sends.
- **Artists ARE paid, and the memo said the opposite.** The deal memo carried
  "There is no guaranteed performance fee for Year 2 (2026)" and was about to go
  to five acts. Now reads "a fee is agreed privately with each act." Zaal, same
  day: *"Let's not publicly write about artists pay."* **No figure, range or tier
  name goes in this repo or on any public surface.** Amounts live in finance-hq.
- **Decision 0005 is the sharpest thing that landed.** It is why the reveal
  problem is a decision and not a bug - the code deliberately refuses to publish
  people who have not signed, "automatically, on a date nobody has to be awake
  for."
- **7 September is Labor Day.** Found in the 1 Sep recording, worked out live by
  Zaal, Paper and Zach, and recorded nowhere in the repo or the vault. It is the
  reveal day AND the Arbor Camp visit day. A federal holiday is a poor day for
  press pickup.
- **12 September is a Saturday, and that slip has now been caught twice in one
  file.** I made it first setting memo dates; zj caught the same slip again when
  Zaal answered "Friday 12 September" for the sign-by. **Check the weekday every
  time a date is set in the deal memo.**
- **Red main blocks every PR in this repo, and it happened twice this week.** #85
  was lint, #103 was the ops-room drift stamp. #101 sat unmergeable all day for a
  reason that had nothing to do with it. If a PR will not merge, check main first.

---

## C. Git state

- Branch `main`, clean except the untracked prior handoff folder.
- HEAD `692cb81` - Merge PR #101.
- **Merged today:** #97 people map DJ reversal, #98 confirmed-means-written,
  #99 window tripwire, #100 stale run of show, #101 deal memo dates, #103 ops-room
  rebuild.
- **Open: #102 only** - "Ops Room: the closing two hours are not booked, and the
  board said they were."
- ZAOOS: **PR #3401** open, two meeting recaps, docs **2464** and **2465**.

## D. In-flight

Nothing running. No background jobs, no wakeups, no pending subagents.

## E. Cold-start map

**Files I touched:** `docs/music/artist-deal-memo-template.md` (four expired
dates, four stale slot rows, the fee clause), `docs/plans/people-map-2026-10-03.md`
(DJ premise reversed), `src/lib/event-window.test.ts` (new).
In ZAOOS: `research/events/2464-*`, `research/events/2465-*`,
`research/events/_meetings-index.md`.
In the vault: `projects/zaostock-steve-in-person-2026-09-02.md`,
`projects/zaostock-insurance-holly-followup-2026-09-02.md`,
`projects/zaostock-steve-peer-consolidated-ask-2026-09-02.md` (superseded),
`projects/zaostock-insurance-reply-2026-09-02.md` (**superseded, do not send**),
`decisions/zaostock-no-stage-or-tent-setup.md`.

**Skills invoked:** `/meeting` twice - Craig multitrack, three tracks then four.
Both produced recaps on ZAOOS PR #3401.

**Memory writes:** none this session.

**Last-known mental model.** The repo is healthier than it was: six PRs merged,
main green, the deal memo no longer carries four expired dates or a false fee
clause. The *event* is where the risk is. The bill changed four times on 2
September and the database has never once matched it. The single automatic thing
on the board fires Monday against a table that has been wrong for a month.

**The running order as of 2026-09-02 evening**, outdoors, 5-minute changeovers:

| Time | Act | Len | Genre |
|---|---|---|---|
| 12:05 | The Crown Vics | 30 | needed |
| 12:40 | OPEN X | 30 | modern pop rock |
| 13:15 | Grass Rug | 30 | needed (Portland ME) |
| 13:50 | Acadia Rising (Sen) | 30 | needed |
| 14:25 | Michael Anderson | 30 | solo piano |
| 15:00 | Dcoop | 30 | hip-hop |
| 15:35 | Hurricane | 40 | hip-hop |
| 16:20 | Lyons Den | 40 | needed |
| 17:05 | Fellenz | 40 | instrumental guitar |

Ends 17:45. Street clears 18:00. Evening scope is section A item 2.

---

## F. What only Zaal can do

He asked for this list directly. Each is one message or one sentence.

1. **The reveal.** Three options, all his: reveal Lyons Den only (honest, and
   what the site already says); move `lineupRevealDate` past the signature date
   (one constant, eight surfaces read it); or get signatures before Monday over a
   holiday weekend. **Doing nothing means the reveal publishes an empty bill.**
2. **Is the evening ZAOstock's or Black Moon's?** This decides the insurance
   email, the site's DAY rows and the tripwire. One sentence.
3. **Aquaventus or Aquavantes.** One spelling.
4. **Chase four genres** - Steve for The Crown Vics, Sen for Acadia Rising, the
   band for Grass Rug, and whoever owns Lyons Den.
5. **Dcoop's fire certificate.** Nine days. If it does not come, the fire act
   does not happen and that is a cleaner outcome than carrying the exposure.
6. **Today, 3 September, is the DHHS temporary food licence deadline** - 30 days
   out, no late applications. If no vendor is coming, nothing to do; it simply
   closes.
