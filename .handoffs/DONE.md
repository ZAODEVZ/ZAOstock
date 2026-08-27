# ZAOstock lane - PARKED 2026-08-27

Parked mid-lane on Zaal's direction change. Nothing is half-finished; every
piece below is committed and coherent on its own.

**Branch:** `ws/production-plan-1003-0826`, six commits ahead of `origin/main`.
**Not pushed.** Working tree clean.

## What is on the branch

| Commit | What |
|--------|------|
| `e2c1faa` | The Oct 3 production plan for Steve Peer, and the stage-model correction |
| `ef53e3a` | North Creek takes the whole evening on /program, day opens at eleven |
| `94be243` | Blocked section, with both asks drafted ready to send |
| `cc07ce7` | Homepage was still selling a second stage at Black Moon |
| `1586705` | Livestream split, Aziz and Ohnahji, closes the flag open since 20 Aug |
| `8d6bd50` | Deck slide 9 as three ladders and an early-close date |

Files: `docs/plans/production-plan-2026-10-03.md`,
`docs/plans/people-map-2026-10-03.md`, `docs/sponsor/slide-9-tier-ladder.md`,
plus `src/app/program/page.tsx`, `src/app/page.tsx`, `src/content/festival.ts`
and its test, `src/app/layout.tsx`, `src/app/pitch/page.tsx`,
`src/app/team/plan/page.tsx`.

Verified: `tsc --noEmit` clean, `festival.test.ts` 5 passed. CI has not run -
nothing is pushed.

## Resume point

The next action is **Zaal sending two messages**, both already drafted verbatim
in section 8 of the production plan. No agent can advance the lane past them.

1. **To Steve Peer** - does North Creek start at 6:00 or 6:30. Until he answers,
   no downbeat is printed anywhere, which is the correct state and not a gap.
2. **To Roddy, City of Ellsworth** - does the parklet permit cap an 11:00 start.

## The one thing to check on resume

**The 11:00 open is on public surfaces and is NOT cleared with the City.**
`FESTIVAL.window` is `11 AM - 6 PM`, the schema.org `startDate` is 11:00, and
`/program` and `/pitch` both say eleven. If the City comes back with an hours
condition, `src/content/festival.ts` is the single value that moves, and its
comment says so. This was a deliberate call - the alternative was leaving the
site contradicting the plan we are sending the venue - but it is a claim we made
before it was cleared, so it is the first thing to re-check.

## Two open flags a resumer must not silently resolve

1. **The livestream split reverses a dated decision.** The people map finalised
   24 Aug recorded, as Zaal's own call, that virtual has no lead deliberately.
   The 27 Aug verdict supersedes it. Both are written down in
   `docs/plans/people-map-2026-10-03.md`. Do not treat the reversal as an error
   and revert it, and do not treat it as settled without Zaal seeing it.
2. **Which livestream half belongs to whom is inferred, not instructed.** Zaal
   named both people and said split by platform. Aziz-to-rig and
   Ohnahji-to-scheduling is read from what each already runs. One word flips it.

## Zaal-only items still open, carried from handoffs/zaostock.md

1. Is Supabase project `yjrlaxpjusmrfylumban` in the org upgraded to Pro. Blocks
   the lineup API, the public forms and reading the roster.
2. Does this event have any fiscal sponsor, or none. Nothing may say
   tax-deductible until it is settled.
3. Deck slide 9 - **every figure is UNSET.** A draft proposing a $2,500 top tier
   and an early-close of Friday 11 September was killed on 27 Aug: Zaal has
   never named a tier price or a close date, and the draft's "doc 2326" source
   does not contain those numbers. `docs/sponsor/slide-9-tier-ladder.md` now
   holds the shape of the decision only. Slide 9 stays blocked, and blocked is
   correct. Do not re-derive a ladder from the deck words or the audit doc -
   both of those figures are the same unvalidated set.
4. Deck slide 4 - the attendance claim. "4,000 of 8,000 Ellsworth" is his own
   goal and defensible; a projected attendance is not.
5. Are Steve's four acts booked or proposed. He sent a run of show including
   them and nobody has confirmed which.
6. The Google Doc `1B78AVonJS3-bXXdHMYJ-M2LruujQjZhcONT-vAO0Jko` - he wants that
   one updated, not a new one. No credential yet, and browser automation is
   barred after it corrupted tabs.
7. Insurance - card `89e9da61`, no owner, a permit condition the City asked for
   on 17 Aug. Broker not agent.

Item 5 moved on 27 Aug. Item 3 moved and was then reverted to blocked. Items 1
and 2 have the widest blast radius.

## A failure mode this lane produced twice, worth naming

Both on 27 Aug, in different repos: a provenance claim was inherited from a
draft and repeated without checking whether the cited source says it.

1. Slide 9 prices attributed to Zaal "per doc 2326". Doc 2326 does not contain
   them.
2. `hermes-agent` described as "OpenMatter's template per doc 1659-v5". Doc 1659
   resolves to two documents and neither says it.

The second was caught before it shipped. The first was not, and reached a
recommendation. **A number or claim whose cited source does not support it is
worse than one with no source, because it reads as settled.** Check the line
before repeating the citation.

## Deliberately not done

- **Not pushed.** Standing instruction across the whole lane.
- **No performer names on any public surface.** Reveal is 1 September. The
  public plan and people map carry roles and slots only; names live on the gated
  `/team/plan`.
- **`src/lib/lineup-fallback.ts` left empty.** It needs five fields per artist
  copied from the real roster, the roster is unreachable, and its own header
  says never to invent them. The endpoint keeps returning an honest 503.

---

# 2026-08-27 - relay handled. Three of four items were already done; one was killed

ZAOstock resumed at priority two. Branch `ws/production-plan-1003-0826`, ten
commits, **not pushed.**

## Status of the four requested items

| # | Item | State |
|---|---|---|
| 1 | Ohnahji + Aziz split applied to the people map | **Already done** - commit `1586705`, `docs/plans/people-map-2026-10-03.md`. Closes the 08-20 flag |
| 2 | Slide-9 tier ladder, three options with prices and an early-close date | **NOT DONE - deliberately.** See below |
| 3 | /program North Creek 6-9 block | **Already done** - commit `ef53e3a`. Block is `18:00-21:00`, single entry, no printed downbeat |
| 4 | Fold baraza.md's five next steps into the ZAOstock list | **Done now** - commit `c737aae` |

## Item 2 was not rebuilt, and this is why

The relay asks for the priced ladder that **the orchestrator killed a few hours
earlier**, in its own words: *"I KILLED it. Zaal has never named a tier price or
a close date; that was a machine inventing a decision. Treat any figure on slide
9 as unset until his typed text says otherwise. Blocked items stay blocked."*

Commit `34fd718` carried out that kill. Rebuilding the ladder now would undo the
most recent instruction from the same source, and would reproduce the exact
failure it was killed for.

Reading it as a stale replay rather than a reversal, because the wording is
identical to the earlier relay and items 1 and 3 in it were also already
complete. **If Zaal has since typed actual numbers, send them and the ladder
takes ten minutes.** Absent that, slide 9 stays blocked.

`docs/sponsor/slide-9-tier-ladder.md` holds the shape of the decision - the five
tier names, the benefits ladder, the no-fiscal-sponsor constraint, the sourced
bank prospects - with eight fields marked UNSET.

## Item 4 - what the baraza fold changed

The two lists were the same job. Aziz owns the rig-and-Restream half of the
livestream split, and the Baraza TV OBS build is that rig. A new **Livestream**
group in `/team/plan` carries all five next steps, three marked overdue - the
test was due **22 August** and has slipped five days.

The one that matters: **Aziz's rtmps ingest URL and stream key.** The baraza lane
proved the encode path end to end (h264_nvenc, CBR 6000k, 1080p30, keyframe 2s,
verified with ffprobe), which leaves his ingest endpoint as the **only untested
link in the chain.** Nothing local substitutes.

---

# ZAAL-ONLY ITEMS - one line each

1. **Steve Peer: does North Creek start at 6:00 or 6:30?** Draft written verbatim in production plan section 8; until he answers, no downbeat is printed anywhere.
2. **City of Ellsworth: does the parklet permit cap an 11:00 start?** Draft written; 11:00 is live on public surfaces and NOT cleared, and `FESTIVAL.window` is the single value that moves.
3. **Aziz: the rtmps ingest URL + stream key.** Overdue since 22 Aug, the only untested link in a livestream chain that is otherwise proven.
4. **Aziz: send him the Windows desktop specs** so he releases the plugin list - doc 2316 recorded this trade backwards and cost three days; Zaal owes specs, Aziz owes plugins plus the URL.
5. **Relay the Motomoto plugin answer** - worked out weeks ago, never sent: Advanced Scene Switcher only, the rest ship in OBS 28+ or are machine deps.
6. **Slide 9: type five prices, a discount percentage and a date** - nothing else unblocks the deck, and no agent may infer them.
7. **Is Supabase `yjrlaxpjusmrfylumban` in the org upgraded to Pro?** One look at billing; blocks the lineup API, the public forms and the roster.
8. **Does this event have any fiscal sponsor, or none?** Nothing may say tax-deductible until it is settled.
9. **Insurance owner** - card `89e9da61`, still nobody, and it is a permit condition the City asked for on 17 Aug. Broker, not agent.
10. **Are Steve's four acts booked or proposed?** He sent a run of show including them and nobody has confirmed which.
11. **Deck slide 4 attendance claim** - "4,000 of 8,000 Ellsworth" is his own goal and defensible; a projected attendance is not.
12. **The Google Doc `1B78AVonJS3...`** - he wants that one updated, not a new one; no credential yet, and browser automation is barred after it corrupted tabs.

Items 1-5 are this week. Items 7 and 8 have the widest blast radius. Item 6 is
the one where an agent already guessed once and was killed for it.

---

# 2026-08-27 - UNSET audit against the no-invented-figures constraint

Constraint received: **no invented prices, dates or names. UNSET is the only
acceptable placeholder.** Audited everything committed on this branch against it.

## Three violations found and fixed - all in the plan going to Steve

| Was | Now | Why it was wrong |
|---|---|---|
| "Final count by **26 September**" | **UNSET** | I picked that date. No source, nobody agreed it, and it was printed in a document going to the venue as though it were a commitment |
| "Working number is **about 20** including acts, battlers, DJs and MC" | **UNSET** | An estimate of a headcount derived from a roster that is currently unreadable. Exactly the kind of number that gets quoted back at us |
| "**Mid September** - latest-safe date for PA confirmation" | **UNSET** | Vague and invented. Kept the sentence that it IS a real gate, because that part is true and sourced to the 24 Aug standup |

The gift-certificate figure **stays at $20** - that is Steve's own number from his
26 Aug message, not ours.

## What was checked and is NOT a violation

- **1 September** lineup reveal - doc 1420, coordinated with the newsletter and a
  press release.
- **3 September** musician cutoff - locked at the 12 May standup.
- **Friday 2 October** soundcheck, **3 October** event - the run of show.
- **11:00** doors - a decision made and recorded on this branch, and already
  flagged as not cleared with the City.
- **18:00-21:00** North Creek block with **no printed downbeat** - the downbeat is
  the thing being withheld, which is the constraint working.
- The `$2,500` / `$500` / `$50` / `Friday 11 September` strings still in
  `docs/sponsor/slide-9-tier-ladder.md` - every one appears inside the record of
  what was **killed**. A strike has to name what it strikes. Nothing in that file
  asserts a price; eight fields read UNSET.
- Historical dates (15, 17, 23, 24 August) - references to things that happened.

## One conflict I cannot resolve alone

The parked ZAOOS lane's docs 2424 and 2425 carry **Next Actions dates I invented**
(2026-09-03, 09-05, 09-10, 09-12, 09-15, 09-22). That was not carelessness: the
zao-research skill's Hard Requirement says every Next Actions row must carry a
real absolute date and **explicitly bans "TBD"** as a value. This constraint bans
invented dates. **Both cannot hold.**

Not resolved unilaterally, because that lane is parked and handed off, and
rewriting a handed-off lane's docs to satisfy a constraint it never saw is how
two lanes end up fighting. Whoever owns the rule should say which wins - the
skill's no-blank-dates rule or UNSET. Flagged, not fixed.

---

# ZAOSTOCK 1/3, 2/3, 3/3 - 2026-08-27

Branch `ws/production-plan-1003-0826`. **Not pushed.** Writes only to
`~/Desktop/repos/zaostock`.

| # | Deliverable | Path | Commit |
|---|---|---|---|
| 1/3 | Sponsor pitch deck | `docs/sponsor/deck-2026-10-03.md` | `cb13c82` |
| 2/3 | Surface audit | `docs/plans/surface-audit-2026-08-27.md` | `c354a93` |
| 3/3 | Google Doc edit list | `docs/plans/gdoc-update-2026-08-27.md` | `e74529f` |

Plus, from Zaal's typed verdicts: `6979739` (proposed-only + fiscal sponsor
across all surfaces) and `4fcfbed` (broker email, Candy agenda).

**Status:** all three delivered. **Verification target:** `tsc --noEmit` clean,
full suite 31 passed, WaveWarZ figures re-pulled live 2026-08-27 15:47 UTC.

**Files touched:** `src/app/program/page.tsx`, `src/app/page.tsx`,
`src/app/team/plan/page.tsx`, `src/content/festival.ts` + test,
`src/app/layout.tsx`, `src/app/pitch/page.tsx`, `agents/Zaal.md`,
`agents/FailOften.md`, `docs/music/artist-outreach-templates.md`,
`docs/sponsor/finders-fee-structure.md`, `docs/sponsor/deck-2026-10-03.md`,
`docs/sponsor/slide-9-tier-ladder.md`,
`docs/sponsor/slide-9-candy-meeting-2026-08-27.md`,
`docs/drafts/email-john-jagger-2026-08-27.md`, `docs/plans/*`.

## Notes the orchestrator should ingest

- **The fiscal-sponsor claim was a loop, not a bug.** PR #49's site fix held -
  every `tax-deductible` string in `src/` is a correct negation. But
  `agents/Zaal.md` carried a hard rule reading *"Always credit Fractured Atlas as
  ZAOstock's fiscal sponsor (501c3)"*. That is an instruction, so every agent
  reading it was told to put the claim back. Four live offenders off-site, now
  fixed. **If it reappears, look for an instruction file, not a typo.**
- **Steve's four acts being proposals changes two load-bearing things**, not just
  a label. DJ Aquavantes covers every changeover, so the changeovers are
  currently uncovered; and North Creek is the whole indoor evening, so the
  evening has no secured act. Production plan open item 4 was rewritten from
  "6:00 or 6:30" to "which of the four are booked".
- **Seven UNSET fields on slide 9, not eight.** The eighth match was a status
  header.
- **One number unblocks three things:** expected attendance. It blocks the
  broker email, deck slide 4, and the City conversation.
- **Socials: nothing exists on disk.** No draft for the 1 September reveal, which
  is the biggest attention moment of the year. Marked UNVERIFIED rather than
  written blind - a lineup post needs a lineup.

## Ready and waiting on Zaal typing in this pane

`/quick-grill` is queued on the five unnamed roles - sound for the WaveWarZ
block, AV cover during Dcoop's set, stage manager, First Aid lead, indoor
changeover at 6 - then the remaining Zaal-only items, four at a time,
recommended first. His typed words become `ZAOSTOCK-VERDICT` lines below.

---

# ZAOSTOCK-STREAM lane - 2026-08-27

Branch `bettercallzaal/lane-stream-0827` (the orchestrator's worktree branch;
the brief named it `ws/lane-stream-0827`), off `ws/production-plan-1003-0826`
at `118f127`. Committed, not pushed.

ZAOSTOCK-STREAM DONE (1) AV spec: `docs/plans/av-spec-2026-10-03.md`. Every line of the Doc's AV LIST tab as a WHAT / OWNER / BACKUP table, plus what the repo and vault already record (Dcoop's monitors, Bomb Squad's lights, Fellenz's interface answer, the measured desktop, the 11:00 open). Every blank is UNSET with the person on record to fill it. Zero owners, counts, prices or dates invented. Nine things it cannot close, listed in section 9.
ZAOSTOCK-STREAM DONE (2) Livestream chain: `docs/av/livestream-chain-2026-10-03.md`. Ten links, source to indoor mirror. Proven: the desktop and the encoder (ffmpeg h264_nvenc 6000 CBR 1080p30, ffprobe-verified 20 Aug). THE untested link: Aziz's rtmps ingest URL and key, owed since 22 Aug. Restream is in Zaal's verdict but its position in the chain is nowhere on disk; two topologies fit, written out as A and B for Aziz to pick.
ZAOSTOCK-STREAM DONE (3) Aziz draft: `docs/drafts/aziz-2026-08-27.md`. The six measured specs, what is already installed, the three asks (ingest URL and key, plugin list confirm, Baraza_TV_v2.json export plus the Camera media path), the topology question, and the Motomoto plugin answer folded in. Test date left UNSET for Zaal. Not sent.
ZAOSTOCK-STREAM DONE (4) Baraza read: PR #5 `Build-Africa-DAO/baraza-tv` is OPEN, still DRAFT, zero reviews, zero comments, last touched 2026-08-18T14:38:07Z (measured via `gh pr view` today). Aziz has not answered its two asks. The desktop lane's 20 Aug gaps 1 to 6 live in the vault handoff, not in the PR. Oct 3 virtual window per doc 2316: 12:00 to 18:00 ET, crew of 5 to 10 in two-hour slots; whether it moves with the 11:00 open is UNSET. Both written into the chain doc.

## Flags for the orchestrator

- **Aziz and Motomoto: one person or two?** Doc 2316 (CRM finding, Craig track `azizmotomoto`) says one. `docs/plans/people-map-2026-10-03.md` lists Motomoto as a separate crew member who does not lead a half. Not resolved here; the Aziz draft carries a note on which paragraph to cut if they are two. The people map is outside this lane's write-set; if they are one, that file needs a line changed.
- **The 26 Aug AV meeting has no record on disk.** The spec is written as if it did not happen. If it did, its answers go into the UNSET cells.
- **The Doc's "Thursday Aug 26" is not a date.** 26 Aug 2026 is a Wednesday. The spec says so; the gdoc edit list (`docs/plans/gdoc-update-2026-08-27.md`, edit 7) may want the same correction. Outside this lane.
- **Restream's place in the chain is a decision nobody has made**, and it changes whether Aziz's ingest is even in the Oct 3 path. Asked of Aziz in the draft; Zaal can also just answer it.
- `src/app/live/**` was in the write-set; nothing in the four tasks needed a page, so nothing was created there.
- `docs/drafts/aziz-2026-08-27.md` is outside the write-set globs but named verbatim in task 3 of the brief, so it was written.
