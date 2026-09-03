# Session handoff - 2026-09-03

> from the zj lane holding the obsidian seat (MacBook-Air-5), ZAODEVZ/ZAOstock @ main -> to ZOE
> doc: .handoffs/session-2026-09-03-zaostock-travel-window/README.md
> chain: .handoffs/session-2026-09-03-zaostock-to-zj/README.md

## Receiver instructions

You are holding ZAOstock while Zaal travels. Read A through E, absorb section A,
use B as the why. Section F is what only Zaal can do.

**This repo is PUBLIC.** No contact details, phone numbers, emails or dollar
amounts tied to individuals appear below, and none may be added. Names and roles
only. Contact details live in `~/zao-vault`; figures live in
`~/Documents/finance-hq`.

**Verification convention.** Every claim carries the command that produced it and
the time it ran. Do not restate any of it from memory later - re-run it. On
2026-09-01 a brief in this estate carried three claims that were false when
written, and one had replicated into a second document before anyone checked.

**All measurements below: 2026-09-03, late morning EDT.**

---

## THE CLOCK, AND WHY THIS HANDOFF EXISTS

Zaal flies out on the evening of 3 September and is away roughly three days.
That window contains the entire artist signature deadline, and the lineup
reveal fires two days after it, by itself.

| What | When | Measured from |
|---|---|---|
| Artist sign-by | **Sat 5 Sep** | `docs/music/artist-deal-memo-template.md:119` |
| **Lineup reveal fires** | **Mon 7 Sep** | `lineupRevealDate` in `src/content/site.ts:26` |
| PA gate | Fri 11 Sep | production plan |
| Cancellation cutoff | Sat 19 Sep | deal memo |
| Event | Sat 3 Oct | 30 days out |

**The reveal is purely time-based.** `src/lib/lineup-reveal.ts` computes it from
the date in `America/New_York` and nothing else. There is no human gate, no
approval step and no way for it to notice that the lineup is empty. It opens at
Ellsworth midnight on Monday whether or not anyone acted.

    select status, count(*) from artists group by status
    -> 9 wishlist, 0 confirmed          (measured 2026-09-03)

`docs/decisions/0005-confirmed-means-confirmed-in-writing.md` says only acts
confirmed IN WRITING may publish, and both public readers filter on
`status = 'confirmed'`. So on today's data **the reveal publishes an empty
bill**. None of the nine acts in the settled run of show has a row.

**CORRECTED 2026-09-03, after this bundle was first written.** An earlier version
of this paragraph said "Lyons Den is the only publicly announced act." That is
FALSE, and it was inherited from decision 0005 and the previous handoff and
repeated here without being measured - the exact failure the verification
convention above warns about. Measured against the live site:

    curl -s https://zaostock.com/ https://zaostock.com/program https://zaostock.com/press
    -> Lyons Den 10 mentions, Hurricane 14, Stilo 8, Dcoop 4
       Crown Vics, Grass Rug, Acadia Rising, Michael Anderson, Fellenz, OPEN X: 0

So four acts are named publicly, not one. Note that Stilo and Hurricane appear
largely through the WaveWarZ block, which is CANCELLED - so the public site is
advertising a format that is not happening, which is section A item 3.

**Three different things, and they must not be blurred:**

| | State |
|---|---|
| The run of show | REAL. Nine acts, 12:05 to 17:45, settled 2 September |
| The public site | Names four acts, two of them via a cancelled block |
| The `artists` table | **0 confirmed** - and this is the ONLY one the reveal reads |

Monday's problem is therefore narrower than "there is no lineup". The lineup is
known and settled. It has simply never been written into the one place that
publishes it.

### The run of show - settled 2 September, outdoors, 5-minute changeovers

| Time | Act | Length | Genre |
|---|---|---|---|
| 12:05 | The Crown Vics | 30 | NEEDED |
| 12:40 | OPEN X | 30 | modern pop rock |
| 13:15 | Grass Rug | 30 | NEEDED |
| 13:50 | Acadia Rising (Sen) | 30 | NEEDED |
| 14:25 | Michael Anderson | 30 | solo piano |
| 15:00 | Dcoop | 30 | hip-hop |
| 15:35 | Hurricane | 40 | hip-hop |
| 16:20 | Lyons Den | 40 | NEEDED |
| 17:05 | Fellenz | 40 | instrumental guitar |

Ends 17:45. Street clears 18:00. Evening scope is section A item 3.

Nine acts. **Zero of them exist in the `artists` table.** The four marked NEEDED
are the genres owed to the broker.

---

## A. Tasks to absorb

- [ ] **Send the artist deal memos. This is the whole critical path.** PR #104
      merged today moved sign-by to Sat 5 Sep so a signature can land before the
      gate. Unsent memos means no signatures, means an empty reveal on Monday.
      Template: `docs/music/artist-deal-memo-template.md`. Sending is Zaal's tap
      (see F).
- [ ] **Get Lyons Den into `artists` as `confirmed` once a signature exists.**
      It has no row, and no owner is recorded anywhere - every other act traces
      to someone (Steve, Sen, Dcoop, Zaal), so if a signature needs chasing
      nobody knows who calls them. That is the real gap; it is NOT that Lyons Den
      is the only public act, which was a false claim in the first version of
      this bundle. Ultimately all nine acts need rows. The
      ZAOstock database IS writable from a terminal session (probe run
      2026-09-03), so this is one insert the moment a signature exists - not a
      blocker in itself.
- [ ] **Reconcile the site with the insurance email.** The reply to the broker
      sent 2026-09-03 10:22 says the event is noon-6pm outdoors and that the
      live battle format is off the programme. `curl -s https://zaostock.com/`
      still returns WaveWarZ 11 times, "head to head", and 6-8pm / 8-10pm at
      Black Moon inside `DAY` (`src/content/site.ts`, the `DAY` const). Zaal is
      confirming the evening over the weekend and asked to hold the site until
      then. **If the weekend lands differently from the email, one short
      correction goes to the broker.** Do not quietly change one side only.
- [ ] **The fire performer certificate.** Assigned 2026-08-24, still UNSET nine
      days later, and it gates whether the fire act happens. A drafted request
      is sitting unsent in Zaal's Gmail. The sent broker email already commits
      to forwarding it. `docs/permits/status-2026-08-27.md:85` has the structure:
      the performer carries his own policy and issues a certificate naming ZAO;
      we do not buy fire cover.
- [ ] **Four genres and one spelling, owed to the broker this week.** Missing
      genres: The Crown Vics, Grass Rug, Acadia Rising, Lyons Den. And the repo
      AND the organizing doc both say **DJ Aquavantes** while Zaal said
      **Aquaventus** on 2 Sep. Neither file settles it - the only primary source
      is a JPG attachment on Steve's 20 August lineup draft, so it needs Steve
      directly. Note the current running order contains no DJ at all, so decide
      whether the act is in before spelling it.

---

## B. Why - decisions, reversals and one mistake of mine

- **The reveal is a DECISION, not a bug.** Decision 0005 deliberately makes the
  automatic gate safe by refusing to publish anyone who has not signed,
  "automatically, on a date nobody has to be awake for." The empty bill is that
  rule working correctly against a table nobody has filled. Do not "fix" it by
  loosening the status rule.

- **I created half the reveal conflict, and it is worth understanding.** In #101
  on 2 September I moved the memo sign-by from 5 September to 11 September. The
  reasoning was sound as far as it went: memos were going out the week of the
  8th, and nobody returns a signed memo on the 5th for something received on the
  8th. What it missed was `lineupRevealDate` - 11 September sits four days AFTER
  the gate opens. The reveal would have published nothing while every act was
  still comfortably inside its own deadline. **Nobody would have been late.** No
  error, no failed check, nothing to notice. #104 fixes it and writes the rule
  into the file: a date in that memo is only correct RELATIVE to
  `lineupRevealDate` - check the weekday AND check it against the reveal.

- **"Friday 12 September" has now been proposed twice in that one file, and 12
  September 2026 is a Saturday.** Once by the zaostock lane setting memo dates,
  once by Zaal answering a picker. Check the weekday every time.

- **The evening is Black Moon's afterparty, not ZAOstock's programme** - Zaal,
  2026-09-03. That is what removed the liquor exposure from our own policy:
  event ends 6pm outdoors, we never occupy a licensed premises, we serve and
  sell nothing. It is also why the site's `DAY` evening rows are now a
  contradiction rather than a detail.

- **Black Moon will NOT add ZAO as an additional insured on their policy** -
  Zaal, 2026-09-03. Under the old plan (event moving indoors at 6pm) that would
  have been expensive, because nothing would have covered us inside. Ending at
  6pm outdoors is what made it moot.

- **The broker asked for the fire certificate as a CONDITION, not a courtesy.**
  Her words: the carrier "will want to see a certificate of insurance from the
  performer naming Zao/you as an additional insured." The City approving the
  fire spinning (Roddy, 27 Aug) is a separate thing and does not satisfy it.

- **WaveWarZ is cancelled and Stilo is not coming in person** (2 Sep). Together
  those removed the largest single coverage gap on the day and opened a two-hour
  indoor hole, which is what the evening question is about.

- **The PA comes from OPEN X, a band who also perform** (Zaal, 2 Sep). That
  closes the 11 September PA gate early and removes the hired-equipment question
  from the insurance, since it is not a rental.

- **Red main blocks every PR in this repo, and it happened twice this week.**
  #85 was lint, #103 was the ops-room drift stamp. #101 sat unmergeable an entire
  day for a reason that had nothing to do with its contents. **If a PR will not
  merge, check main first.**

- **The cowork CRM is READ-ONLY from an MCP session** (`ERROR: 25006: cannot
  execute INSERT in a read-only transaction`). The ZAOstock project database is
  writable. That asymmetry decides where work can actually land.

---

## C. Git state

Measured with `git status --short`, `git log --oneline`, `gh pr list`.

- Branch `main`, ahead 0, behind 0, working tree clean apart from untracked
  `.handoffs/` folders.
- HEAD `cf57537` - Merge PR #102.
- **PR queue is EMPTY.** CI green on main.
- No diff to apply.

**Merged 2026-09-03:** #97 people map, #98 decision 0005, #99 window tripwire,
#100 stale run of show, #101 deal memo dates, #102 ops room closing hours,
#103 ops-room rebuild (unblocked a red main), #104 sign-by before the reveal.

## D. In-flight

- Background jobs: none. Subagents: none. Scheduled wakeups: none.
- Open AskUserQuestion: none.
- **One question Zaal has not answered**, and it decides what this receiver may
  do alone: may the receiver write `artists` rows and send memos while he is
  away, or does everything stop at draft? **Until he says otherwise, assume
  draft-only for anything outward** - the standing rule is that outbound
  messages are Zaal's tap. Repo and database work inside the estate is fine.

## E. Cold-start map

**Files touched this session** (in ZAODEVZ/ZAOstock):
`docs/music/artist-deal-memo-template.md` (sign-by, the three-settings banner,
the 25-minute contradiction), `public/ops/index.html` (ops-room rebuild).
In `~/zao-vault`: `handoffs/needs-zaal.md`, `handoffs/IN-FLIGHT.md` (rebuilt to
one row per live lane), `archive/in-flight-2026-09-02.md` (the 97 rows it
replaced).

**Not in this repo, deliberately:** the broker correspondence, the stakeholder
sheets and the CRM import all carry contact details and live in Drive and the
vault.

**Skills invoked:** `/handoff` (this bundle).

**Memory writes:** none this session.

**Last-known mental model.** The repo is the healthiest it has been: eight PRs
merged today, empty queue, green CI, every public surface up. The risk has moved
entirely into the event. The single automatic thing on the board fires Monday
against a table that has been wrong for a month, and the person who can fix it
is on a plane. Everything in section A is one message or one insert; none of it
is hard, and all of it is time-boxed by a date nobody can move.

**Open questions for the receiver:**
- The write authority question in section D. Ask before acting outward.
- Whether the evening stays Black Moon's after the weekend, which decides both
  the site and whether the broker needs a correction.

---

## F. What only Zaal can do

1. **Send the deal memos.** Nothing else on this list matters if this does not
   happen - it is the only path to a signature before Monday.
2. **Say whether the receiver may act while he is away**, or whether everything
   waits for him. One sentence, and it unblocks or blocks all of section A.
3. **Name an owner for Lyons Den.** Every other act in the run of show traces to
   someone who can reach them - Steve, Sen, Dcoop or Zaal. Lyons Den traces to
   nobody, so no signature can be chased while Zaal is away.
4. **Confirm the evening** - Black Moon's afterparty or ZAOstock's programme.
   This decides the site, the tripwire and whether the broker gets a correction.
5. **Ask Steve for the DJ spelling** and whether that act is in the running order
   at all.
6. **Chase the fire certificate.** Nine days. If it does not come, the fire act
   does not happen, and that is a cleaner outcome than carrying the exposure.

---

## Inline copy-paste block

```
Read .handoffs/session-2026-09-03-zaostock-travel-window/README.md in
ZAODEVZ/ZAOstock and follow the receiver instructions at the top. 5 tasks.
The lineup reveal fires automatically on Monday 7 September against a table
with 0 confirmed artists - start there.
```
