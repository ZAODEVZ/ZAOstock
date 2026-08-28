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

## PRODUCTION lane - 2026-08-27, branch bettercallzaal/lane-production-0827, commit 808a2c2

ZAOSTOCK-PRODUCTION (1) every act tagged confirmed / WaveWarZ / PROPOSED: ledger in production plan section 2, names only where already public; Steve's four PROPOSED on plan, people map, /program comments. Out of my write-set, needs the site lane: /team/plan DAY block tags four rows correctly but the 21:00 "Stilo DJing" row carries no status tag - add one (the plan records it as confirmed on our side per the DJ's own message, gdoc snapshot 27 Aug).
ZAOSTOCK-PRODUCTION (2) 11:00 open shown as intent-not-cleared with Roddy Ehrlenbach (City of Ellsworth Parks/Rec) named: plan schedule row + section 8 status table, festival.ts and /program comments, and a public Things-to-know line on /program ("our intent, with the City for confirmation"). Public copy names the City, not Roddy - a city official's name on the public page was my call to keep out; the plan and the code carry it. Comments say the question is unsent and the city lane owns it (docs/drafts/roddy-2026-08-27.md, not verified from here).
ZAOSTOCK-PRODUCTION (3) 18:00-21:00 IN BOOKING block and 21:00 DJ close: already on /program and the plan from the earlier session; tightened to "no act or start time confirmed yet" on /program and IN BOOKING / North Creek PROPOSED on the plan's indoor table. No downbeat printed anywhere.
ZAOSTOCK-PRODUCTION (4) docs/drafts/steve-followup-2026-08-27.md drafted, DO NOT SEND: booked which (one line per act), Somes Sound PA vs own gear, North Creek 6:00 vs 6:30 gated on the first answer, plus the 11:45-6 DJ window rider. No figures. Supersedes Draft 1 in plan section 8, which is marked so.
ZAOSTOCK-PRODUCTION (5) changeover-cover gap explicit: six changeover rows read "cover UNSET - DJ Aquavantes PROPOSED", supply row 8 (the DJ) Confirmed -> PROPOSED, new UNCOVERED line in what-we-supply, new UNCOVERED row in section 8 status table, people map row rewritten as a real gap. Public /program no longer promises "a DJ covering every changeover".
ZAOSTOCK-PRODUCTION verify: tsc --noEmit clean; festival.test.ts 5 passed; /secure CLEAN (no secrets, no unpublished names, no new figures); /review one Dead-Code hit fixed (stale "it is booked" comment on /program). Prettier warns on both src files but did so at HEAD before I touched them (repo files use single quotes, config wants double) - not reformatted, not mine. Branch is bettercallzaal/lane-production-0827 (worktree was created with that name, not ws/lane-production-0827), based exactly on ws/production-plan-1003-0826. Committed, not pushed.

## PRODUCTION lane Round 2 - 2026-08-27, commit 44ea4dc, plan section 8 (Blocked is now section 9)

ZAOSTOCK-PRODUCTION R2 1/10 changeovers: 15 min verified in the grid. Zero-slack point kept (5x45 + 5x15 = 11:00-16:00 exactly, WaveWarZ fixed). Overrun rule PROPOSED (an act that runs over loses its own changeover). Shared backline UNSET, Dcoop, decided from the AV spec (STREAM lane file) not by guess.
ZAOSTOCK-PRODUCTION R2 2/10 rain, schedule side (8.2): light rain runs as printed under the Wallace tent; heavy rain or wind moves the day into Black Moon. Threshold UNSET, caller UNSET (proposed Zaal + Steve), time UNSET (proposed Friday soundcheck + 08:00 Sat look). Black Moon daytime capacity is Steve's number, not written on our side. CITY owns docs/permits/rain-plan-2026-10-03.md - please match the tiers.
ZAOSTOCK-PRODUCTION R2 3/10 before 11:00 (8.3): 06:00 load-in through 10:45 stage manager's walk, one row per line with who. UNSET: load-in crew, sound operator, First Aid lead, stage manager, merch (vendor question on Roddy's list), DJ check at 10:30 only if booked. Vehicle access + circuits are Roddy's, unanswered.
ZAOSTOCK-PRODUCTION R2 4/10 light 16:00-18:00 (8.4): sunset 18:12, civil dusk 18:41 for Ellsworth Oct 3 - my NOAA arithmetic, flagged in the plan as not a typed figure. Lighting owner UNSET; Bomb Squad has gear (AV List), unasked. Power for lights goes on the AV spec (STREAM) and Roddy's circuits question.
ZAOSTOCK-PRODUCTION R2 5/10 the 18:00 move (8.5): minute by minute 17:30-18:30. Hurricane walks the crowd on the host mic; Stilo DJs the transition out of WaveWarZ (standup 24 Aug, real); indoor music must be on the house PA because the outdoor rig is being struck at 18:00. UNSET: who strikes (open item 1), door person (proposed Steve/Katina), street pointer, indoor DJ setup (AV List blank), Steve's MC scope (agreed in principle 17 Aug, never defined).
ZAOSTOCK-PRODUCTION R2 6/10 no-show per slot (8.6): Set 1 drops -> open at noon; Sets 2-5 -> DJ extends if booked, else Steve's local-act reserve, else the grid holds with a gap; battler drops -> Stilo/Hurricane rebracket; changeover DJ not booked -> MC + phone playback, marked UNCOVERED; North Creek not booked -> Stilo opens at 18:00 (real fallback). Order of fallbacks PROPOSED.
ZAOSTOCK-PRODUCTION R2 7/10 nobody eats (8.7): performers eat at Black Moon the hour after their set on Steve's $20 certificate (count UNSET); battlers before 16:00; Stilo 18:15-21:00; crew in shifts during sets on a rota the stage manager writes - crew vendor and budget UNSET, CITY holds the vendor/Chamber ask. The ZAOville $25/25 meal figure is NOT used - not this event's, not typed.
ZAOSTOCK-PRODUCTION R2 8/10 daytime audience (8.8): whether sets 1-2 are placed for the Art of Ellsworth / Maine Craft Weekend family crowd is UNSET (Dcoop + Zaal). PROPOSED and free: the MC names both at 11:00 and every changeover and points to the craft fair and shops. Whether Steve MCs the daytime is tied to his undefined scope.
ZAOSTOCK-PRODUCTION R2 9/10 content capture (8.9): the WHEN is written - 10:45 empty street, 11:00 doors, first song of every act, every changeover as a 15-min interview window, all of WaveWarZ, the 17:55 walk, the room at 18:15, the last song. Shooter UNSET (the crew who would is performing). STREAM owns what/who/where (ArDrive) - please match these times in your row.
ZAOSTOCK-PRODUCTION R2 10/10 the night has an end (8.10): last call and music-off are Black Moon's licence hours, UNSET; noise cut-off is on Roddy's list, unasked; outdoor strike deadline UNSET (City may want the street back by a time - Roddy); load-out crew UNSET; Black Moon locks up (Steve/Katina, real); last parklet walk = stage manager, UNSET.
ZAOSTOCK-PRODUCTION R2 verify: tsc --noEmit clean, festival.test.ts 5 passed, all "section 8" cross-refs in my write-set renumbered to 9. No figure typed by me except the sunset arithmetic, which is labelled as mine. Committed, not pushed. Requests out of write-set: CITY match the rain tiers in 8.2; STREAM match the capture times in 8.9; SITE tag the 21:00 Stilo row on /team/plan (carried from Round 1).

## PRODUCTION lane Round 3 - 2026-08-27, commit e49d5e3

ZAOSTOCK-PRODUCTION R3 done. docs/plans/zaal-only-PRODUCTION.md: 12 lines now + 8 later (33 lines total in the file), each answerable by a number, name, date or yes/no, each citing the file it unblocks. Four messages, all DO NOT SEND: docs/drafts/msg-steve-peer-2026-08-27.md (clipboard reply of 26 Aug folded in and corrected for 11:00 and the DJ's status, + booked-which, Somes Sound PA, North Creek time, DJ window rider, crew meal), msg-dcoop-2026-08-27.md (his set length, Acadia's, AV cover for his set, shared backline), msg-acadia-rising-2026-08-27.md (set length), msg-dj-aquavantes-2026-08-27.md (booked? knows the job? - flagged to go after Steve's answer or via Steve, contact UNSET). People: Steve Peer, Dcoop, Acadia Rising (Sen Wilde), DJ Aquavantes. steve-followup-2026-08-27.md marked superseded. No new figures. Nothing sent. Committed, not pushed. Note for the orchestrator: the drafts name two not-yet-public confirmed acts (Dcoop, Acadia Rising) in a public repo, as /team/plan already does - if that is a problem it is a repo-visibility call, not a lane one.

## PRODUCTION lane verify round - 2026-08-27

ZAOSTOCK-PRODUCTION MERGE-READY bettercallzaal/lane-production-0827 7 commits, conflicts: none. Base ws/production-plan-1003-0826 = origin = 118f127, unmoved; rebase reported up to date. tsc --noEmit clean; vitest 7 files, 31 passed; /secure CLEAN on the whole branch diff (no secrets, no contact details, no figure beyond Steve's $20, all names inside the allowed list; Roddy Ehrlenbach appears in comments and the plan only, never in rendered copy); /review: markdown tables intact across all my files, section 8/9 cross-refs consistent, no stale noon claim in my write-set. One finding NOT fixed because it crosses the write-set boundary: src/content/festival.ts `date` is still 2026-10-03T12:00:00-04:00 and it feeds the homepage CountdownTimer (src/app/page.tsx:248), so the clock hits zero an hour after the 11:00 doors while layout.tsx schema startDate already says 11:00. The one-line fix is mine (festival.ts) but src/content/festival.test.ts locks the value to 12:00 and is the SITE lane's - request: site lane updates the test expectation to T11:00:00-04:00, then this lane (or site) flips festival.ts in the same commit. Left unchanged so the suite stays green.

## PRODUCTION lane - Zaal's 19:3x verdicts - 2026-08-27, commit 84408bf

ZAOSTOCK-PRODUCTION noon-revert: MUSIC STARTS AT NOON applied to every file in my write-set. /program back to noon (metadata x2, grid start 12:00, header copy, the "11 AM is our intent" line removed); festival.ts window '12 PM - 6 PM' (date was already T12:00, so the countdown finding from the verify round is moot); production plan grid rebuilt from 12:00 on 45/15 = four slots, five confirmed acts - the fifth act's placement is UNSET (Zaal) with four options in section 2: (1) it opens the evening indoors at 18:15/18:30, which also gives the in-booking block a confirmed act; (2) three sets at 30 + two at 45 + four 15-min changeovers = noon to four exactly, zero slack - the two unconfirmed lengths are asked in the Dcoop and Acadia drafts; (3) 10-min changeovers on a shared backline, buys 20 min, not a slot; (4) one act to reserve. The 11:00 question to Roddy is WITHDRAWN unsent; Draft 2's 11:00 paragraphs marked dead, its insurance + Ch.14 items stand (city lane's). Rain call YES and overrun rule YES folded into 8.1/8.2 as decided-by-Zaal; names for open roles moved to a "waits" section in zaal-only and the people map, dropped from every question. Drafts corrected (Steve rider is "noon through to 6", not 11:45). zaal-only list rewritten: 12 now (fifth act is line 2; three new no-slot items: noon intro length, sponsor mic break, fire spinning), 4 later, names under waits.
ZAOSTOCK-PRODUCTION ros-5min: docs/plans/ros-5min-2026-10-03.md - 06:00 to close, 217 five-minute rows, outdoors and indoors as two columns, 42 numbered questions (who answers, what it unblocks) listed first in day order and attached to the row where each bites. Six things with no slot anywhere, surfaced for the grill: the fifth act (Q15), a spoken noon intro (Q13 - the working doc had 15 min, the grid has 0), a sponsor mic break (Q18 - doc had 10 min), the "WaveWarZ story" segment (Q21), the fire spinning (Q27 - permit filed, nowhere in the day), Fellenz's indoor 30 (Q35). 12:00-16:00 is 240 min with zero slack, so every minute of those comes out of a set. Verify: tsc clean; markdown tables intact (0 bad rows across plan, ros, zaal-only, people map).
ZAOSTOCK-PRODUCTION RED TEST, needs the SITE lane: src/content/festival.test.ts:16 expects '11 AM - 6 PM'; festival.ts now says '12 PM - 6 PM' per Zaal. Suite is 30/31 until that one line reads `expect(FESTIVAL.window).toBe('12 PM - 6 PM');`. Not touched - outside my write-set. Same lane, same verdict, other 11:00 surfaces outside my write-set: src/app/layout.tsx:47 startDate T11:00:00 -> T12:00:00; src/app/pitch/page.tsx:231 '11 AM - 6 PM Eastern' -> '12 PM - 6 PM Eastern'; src/app/team/plan/page.tsx:166-179 (comment, the DAY row '11:00 - 16:00' and its 'DJ in every gap', the MONDAY line about the 11:00 open) -> noon, four slots, fifth act unplaced, DJ proposed. src/app/zaoville/page.tsx:73 is a different event, leave it.
ZAOSTOCK-PRODUCTION FEED FOR THE DECK lane: the facts a slide may state as of 19:3x - Saturday 3 October; outdoors on the Franklin Street Parklet NOON to 6 (not 11); 45-minute sets, 15-minute changeovers, four daytime slots; WaveWarZ 16:00-18:00 outdoors; everything moves next door into Black Moon Public House at 18:00; evening live block 18:00-21:00 IN BOOKING (no act, no downbeat - do not name North Creek as booked); DJ to close from 21:00; free to attend; tent coverage rain or shine (Wallace Events). Five confirmed acts, only Werb and Lyons Den public before the 1 Sept reveal. Do NOT say "a DJ covering every changeover" - that DJ is proposed, not booked. Stale lines in docs/sponsor/deck-2026-10-03.md right now: line 111 (11:00-16:00 + DJ promise), line 129 (11:00 intent box - delete, 11:00 is withdrawn), line 319 (the permit-cap question - dead), line 334. Anything numeric the deck needs beyond that (attendance, prices, tiers) is still UNSET and not mine.

## PRODUCTION lane - Q16, no DJ - 2026-08-27, commit 5c0a4e9

ZAOSTOCK-PRODUCTION ros-v2: docs/plans/ros-5min-2026-10-03.md regenerated - 217 five-minute rows, 42 questions, no DJ anywhere. Every changeover and both WaveWarZ voting windows are "MC + sponsor spots"; 11:00 becomes the MC mic check with the sponsor scripts on the desk; v1 Q16 marked answered, Q11 now asks sponsor spots per changeover (how many, live or recorded), Q25 asks whether Hurricane reads them in the voting windows. Production plan rebuilt to match (grid, ledger, section 1, "No DJ" paragraph to Steve, supply row 8 "Not needed", section 4 cover row Decided with the MC name waiting, open item 4 = three acts, 8.6 fallbacks without a DJ, section 9). Steve's remaining three acts stay PROPOSED until Steve confirms; The Crown Vics' position, if any, is Zaal's plan and is labelled so. People map: the daytime MC is now the load-bearing open role. msg-dj-aquavantes WITHDRAWN; msg-steve-peer tells Steve not to hold his DJ; zaal-only line 8 is now the sponsor-spot format question. Tables intact, no src change.
ZAOSTOCK-PRODUCTION REQUEST for SITE (/program, src/app/program/page.tsx - Zaal routed this to you rather than me): nothing on the page is now false - the daytime block already says "45 minutes each with short changeovers between sets" and names no DJ. Optional copy that is now true and sponsor-friendly: "45 minutes each, with our MC and our partners between sets". The code comment block still describes Aquavantes as one of "four" proposed acts and says "the gaps are uncovered until Steve confirms him" - replace with: no DJ (Zaal 27 Aug), changeovers are MC plus sponsor spots, Steve's three acts PROPOSED until he confirms. Still outstanding from the noon revert: festival.test.ts:16 -> '12 PM - 6 PM'; layout.tsx:47 startDate T12:00; pitch/page.tsx:231; /team/plan lines 166-179 (that DAY row also says "DJ in every gap" and names Aquavantes - drop both).
ZAOSTOCK-PRODUCTION REQUEST for DECK (schedule slide, docs/sponsor/deck-2026-10-03.md line 111 area): the schedule a slide may state - noon to 6 outdoors on the Franklin Street Parklet; four 45-minute sets with 15-minute changeovers; EVERY CHANGEOVER IS THE MC PLUS SPONSOR SPOTS - four gaps of 15 minutes, plus two voting windows inside WaveWarZ, so a sponsor is named on the mic six times across the afternoon (this is now a sellable line, and it replaces "a DJ covering every changeover", which must go); WaveWarZ 16:00-18:00; the move to Black Moon at 18:00; evening 18:00-21:00 in booking, no act named; DJ to close from 21:00. How many spots per changeover and whether they are live or recorded is Zaal's (zaal-only line 8) - print "sponsor spots in every changeover", not a count. Delete the 11:00 intent box (line 129) and the permit-cap question (line 319); 11:00 is withdrawn.

## PRODUCTION lane - grill round 2 - 2026-08-27, commit 325b858

ZAOSTOCK-PRODUCTION round2-applied with ros-v2: Q1 - 06:00 call gone; Friday night crew + soundcheck is the first row of the schedule and of ros-5min, vital crew 08:00, everyone 10:00 (plan section 2, 6, 8.3; ROS now runs 08:00 to close, 193 rows). Q8 - "Friday covers every act; Saturday morning is line-check only" is the contract wording in plan section 4 and section 6. Q21 - the WaveWarZ story (Hurricane with Stilo) sits at 16:00 inside the block in the grid and the ROS; length UNSET (zaal-only line 8), the proposed bracket behind it compressed to fit and labelled so. Set lengths - every daytime set row in the plan and the ROS reads "length UNSET, 45 is the frame"; nothing assumes 30 or 45; zaal-only line 2 asks for the five numbers by act name (Werb, Fellenz, Lyons Den, Dcoop, Acadia Rising) and the fifth-act question (line 3) is now conditional on their sum. The Dcoop and Acadia set-length drafts are ON HOLD, not withdrawn - their other questions stand. Friday load-in times and Saturday act call time added under "later". Tables intact. No src change, suite state unchanged (30/31, the site lane's window assertion). 13 commits ahead, not pushed. For SITE and DECK: the schedule facts in my two earlier request lines still hold, with one addition - do not print "45-minute sets" as a fact anywhere; print "sets from noon, 15-minute changeovers" until Zaal's lengths land.

## PRODUCTION lane - grill round 3 - 2026-08-27, commit 8bc73ca

ZAOSTOCK-PRODUCTION round3-applied: Zaal's 20:0x order (relayed with round 3) is in the grid and ros-v3 - The Crown Vics 12:05-12:35 (PROPOSED act, slot is Zaal's plan), Fellenz 15:00-15:45 closes the block, 12:00-12:05 open on the mic implied by the 12:05 downbeat (content UNSET), Acadia Rising PROPOSED second at 12:50 ("maybe Sen after Crown Vics"), Werb / Lyons Den / Dcoop in an order Zaal types (not by energy - written into 8.8), all four open lengths UNSET. THE FIT, in his numbers: 12:50-14:45 = 115 min for four acts + three 15-min changeovers = 17 min of music each - does not fit; four ways it gives, UNSET, in plan section 2 and zaal-only line 5 (one act opens the evening indoors / Crown Vics not confirming returns 45 min / 10-min changeovers / his lengths fit). Steve as MC: NONE - supply row 9 "Not needed", ZAO crew holds the mic all day, daytime and evening MC UNSET (names wait). First Aid: no dedicated person - named contact UNSET + prepared kit (section 4, 8.3, people map); CITY holds the permit side. zaal-only now: 1 send Steve, 2 Acadia second y/n, 3 order of three, 4 four lengths, 5 the fit, 6 PA date, 7 headcount, 8 crew meal, 9 story length, 10 sponsor-spot format, 11 the 12:00-12:05 words, 12 sponsor break y/n. ros-v3: 193 rows, 42 questions, tables intact. 15 commits ahead, not pushed.
ZAOSTOCK-PRODUCTION ros-v3 REQUEST for DECK (re-issued; supersedes my "four 45-minute sets" line - DECK may un-hold): the schedule slide may state, without act names - Saturday 3 October; outdoors on the Franklin Street Parklet, doors NOON; live sets from 12:05 with 15-minute changeovers between them; EVERY CHANGEOVER IS THE MC PLUS SPONSOR SPOTS (three changeovers in the daytime block plus two voting windows inside WaveWarZ = five sponsor reads on the mic across the afternoon; print "sponsor spots in every changeover", not a count - the count is Zaal's, zaal-only 10); outdoor block closes 15:45; WaveWarZ 16:00-18:00, opening with the WaveWarZ story; everything walks next door into Black Moon Public House at 18:00; evening 18:00-21:00 in booking, no act, no downbeat; DJ to close from 21:00. Do NOT print set lengths, a set count, "45-minute sets", a DJ, or any act name (Crown Vics is Steve's proposed act; Fellenz and the rest are not public until 1 Sept). Delete the 11:00 intent box and the permit-cap question.
ZAOSTOCK-PRODUCTION ros-v3 REQUEST for SITE (/program, src/app/program/page.tsx): the 12:00-16:00 block copy should read, no names, no count: "Independent artists on the parklet stage from 12:05, with our MC and our partners between sets. Lineup announced once every set is locked." The BLOCKS start stays '12:00' (doors). Comment block: replace the "four proposed acts / gaps uncovered until Steve confirms him" paragraph with: no DJ (Zaal 27 Aug 20:0x); changeovers are the MC plus sponsor spots; Steve's three acts PROPOSED until he confirms; running order is Zaal's plan and is not public. Still outstanding: festival.test.ts:16 -> '12 PM - 6 PM' (suite is red by that one line); layout.tsx:47 startDate T12:00; pitch/page.tsx:231 '12 PM - 6 PM Eastern'; /team/plan DAY block - noon, no DJ, no Aquavantes, "First Aid lead" row becomes "First Aid contact + kit, no dedicated person (Zaal)", "Sound cover for WaveWarZ" stays, and drop "Steve MCs".

## PRODUCTION lane - standing rule applied - 2026-08-27 20:5x

ZAOSTOCK-PRODUCTION RULE-ACK: the 20:45 RULE line is in ~/.zao/orca-board.log (line 4410, "RULE unknown-relay-tag sent to 8 panes"), so this rule is acted on. Audit of every relay this pane received, against the log and ~/zao-vault/handoffs/: BRIEF 18:51, 18:57, 19:02 for term_47301b19 match production.md (Rounds 1-3 and the verify round) - VERIFIED. Nothing else for this pane is logged.
ZAOSTOCK-PRODUCTION UNKNOWN-RELAY "[orchestrator relay - Zaal typed at 19:3x, all real] (1) MUSIC STARTS AT NOON - the 11:00 open is OFF; revert every 11:00 change ... (2) Rain call ... YES. (3) Overrun rule: YES. (4) Names for open roles: NOT NOW ... (5) ... build docs/plans/ros-5min-2026-10-03.md" - ACTED ON BEFORE THE RULE, commits 84408bf + d1db435. Not in the log, not in the vault.
ZAOSTOCK-PRODUCTION UNKNOWN-RELAY " Q16: DJ Aquavantes is NOT going to be there - no DJ; changeovers are MC plus sponsor spots. Booking status of The Crown Vics and the evening act is still Steve's to confirm ... Rebuild ros-5min and the production plan, then push a request line to SITE ... and to DECK" - carried NO relay tag at all. ACTED ON BEFORE THE RULE, commits 5c0a4e9 + 91c74ea. Not in the log, not in the vault.
ZAOSTOCK-PRODUCTION UNKNOWN-RELAY "[orchestrator relay - Zaal typed at 20:1x, grill round 2] Q1: crew on site the NIGHT BEFORE for soundcheck; Saturday vital crew at 08:00, everyone by 10:00 ... Q8 ... Q21 ... Set lengths: he will type them per act" - ACTED ON BEFORE THE RULE, commits 325b858 + 2584191. Not in the log, not in the vault.
ZAOSTOCK-PRODUCTION UNKNOWN-RELAY "[orchestrator relay - Zaal typed at 20:2x, grill round 3] Set lengths: not given yet; his only hint: 'Maybe Sen after Crown Vics' ... Steve as MC: NONE ... First Aid: NO dedicated person ... your REQUEST for DECK still says 'four 45-minute sets' - that predates his 20:0x order (Crown Vics 12:05-12:35, Fellenz 15:00-15:45 ...)" - ACTED ON BEFORE THE RULE, commits 8bc73ca + c0c5fdc. Not in the log, not in the vault. Note: this one cites a "20:0x order" this pane never received in any form.
ZAOSTOCK-PRODUCTION UNKNOWN-RELAY "requests. Constraint last: write-set only, commit only, no push." - truncated, NOT acted on (reported BLOCKED at the time). Not in the log, not in the vault.
ZAOSTOCK-PRODUCTION PROVENANCE: a warning banner is now at the top of production-plan, ros-5min, zaal-only-PRODUCTION and people-map naming every attribution that rests on the four unverified relays. Content NOT reverted on this lane's own judgment, for two reasons: (a) the deck pane's DONE.md (~/Desktop/repos/zaostock/.handoffs/DONE.md, 20:38, lines 443-445) shows the SITE lane applied the same "no DJ / MC plus sponsor spots / three acts proposed / First Aid contact + kit" content, so a one-lane revert diverges the lanes; (b) if the verdicts are real, a revert destroys typed decisions. Evidence for the questions being real: ~/.zao/clipboard/clip-20260827-190136-zaal-block-evening-2026-08-27.html (19:01) carries the grill items these relays answer (item 2 names, item 11 rain/overrun/Steve-as-MC). Evidence for the answers: none on disk. ORCHESTRATOR DECIDES: (1) CONFIRM - say so in a logged relay or the vault brief and I strip the banners; or (2) REVERT - on this branch `git reset --hard 30a093b` (the verify-round head, everything after it is the unverified rounds; branch is unpushed) and the same instruction to SITE and DECK. The last verified state is MERGE-READY 30a093b, 7 ahead, tests 31/31.

## PRODUCTION lane - relays confirmed, ros-v4 - 2026-08-27, commit 08ce4de

ZAOSTOCK-PRODUCTION CONFIRMED-ACK: orca-board.log line 4411 (20:46 RETRO-LOG) lists 19:3x and 20:0x-20:4x PRODUCTION relays as sent by the orchestrator; ~/zao-vault/daily/2026-08-27.md lines 852-858 carry the full text. The five UNKNOWN-RELAY lines above are resolved: four were real and are now traceable, the truncated fifth was the tail of the 20:4x running-order relay. Provenance banners removed from production-plan, ros-5min, zaal-only-PRODUCTION, people-map. No revert.
ZAOSTOCK-PRODUCTION ros-v4: built from the daily, not the relays, and the daily had more - (a) a 5-minute intro at noon; (b) ~30 min per act, order Crown Vics / Sen / Dcoop / Fellenz, Fellenz before WaveWarZ; (c) Zaal assumes 5-minute changeovers vs the 15 rule - back to him as zaal-only line 2 / ROS Q1, it moves every row after 12:35; (d) evening = Stilo DJ 18:00-19:30 (decided) then ONE OF STEVE'S ACTS CLOSES from 19:30 (PROPOSED - which, is zaal-only 7 and Steve's open item 4); (e) Werb not fully confirmed, wanted for WaveWarZ (site already pulled him); (f) Lyons Den confirmed and NOT in the order - flagged back (zaal-only 3); (g) dream if time: JANGO, Jadyn, Hurricane. The arithmetic flipped: on 30-min sets the afternoon has a 70-100 minute OPEN STRETCH before 16:00 (14:50-16:00 at 15-min changeovers, 14:20 at 5), not a shortfall - Lyons Den, Werb and the dream acts are the three claims on it, all UNSET. ROS: 193 rows, 33 questions. Plan sections 2, 3, 5, 8.5-8.7, 9 rebuilt; ledger re-tagged. Tables intact. 18 commits ahead, not pushed.
ZAOSTOCK-PRODUCTION ros-v4 REQUEST for SITE (/program): the two indoor blocks change - 18:00-19:30 "DJ set" (no name; our DJ, decided) and 19:30-late "Live music to close, in booking" (no act, no name). Drop the 18:00-21:00 block and the "21:00 DJ to close" block. Daytime block: "Independent artists on the parklet stage from 12:05, with our MC and our partners between sets. Lineup announced once every set is locked." - no count, no lengths. Werb: already unconfirmed on your surfaces (57654c1), matches. Still outstanding: festival.test.ts:16 '12 PM - 6 PM'; layout.tsx:47 T12:00; pitch/page.tsx:231; /team/plan DAY block evening rows to the same two blocks.
ZAOSTOCK-PRODUCTION ros-v4 REQUEST for DECK (schedule slide): noon doors with a short welcome; live sets from 12:05, sponsor spots in every changeover (count is Zaal's - print "in every changeover"); WaveWarZ 16:00-18:00 opening with the WaveWarZ story; everything walks into Black Moon at 18:00; DJ set 18:00-19:30; live music to close from 19:30, in booking. No act names, no set count, no set lengths, no "45-minute sets", no DJ between sets. Werb must not appear as confirmed anywhere in the deck.

## PRODUCTION lane - msgs-v2 and close - 2026-08-27 21:2x, commit 1815fb9

ZAOSTOCK-PRODUCTION msgs-v2: every draft this lane owns re-checked against ~/zao-vault/daily/2026-08-27.md from "Grill round 4" down (relay matched: orca-board.log 21:14 "RELAY msgs-v2 round"). Files touched: docs/drafts/msg-dcoop-2026-08-27.md (45-or-30 questions -> confirmations of Zaal's ~30 order, his slot ~13:35; AV-cover name dropped per "names not now"; backline question kept, tied to the 5-minute changeover assumption; ON HOLD lifted), docs/drafts/msg-acadia-rising-2026-08-27.md (second at ~12:50 for ~30, confirmation; ON HOLD lifted), docs/drafts/msg-steve-peer-2026-08-27.md (~30-minute sets from 12:05 with MC + sponsor spots; crew line no longer implies a first-aid person; attendance deliberately absent), docs/drafts/msg-dj-aquavantes-2026-08-27.md and steve-followup-2026-08-27.md (withdrawn/superseded - bodies marked STALE, not corrected, never send). Not touched: email-john-jagger-2026-08-27.md (CITY's; the 200-250 / 1,000 attendance figure is theirs to fill). Verdicts with no line in any of my drafts: COC Concertz partner, Werb status, Lyons Den placement, rain/overrun rules, Aziz test - nothing to fix. All DO NOT SEND. Nothing sent.
ZAOSTOCK-PRODUCTION CLOSE (convention 10): shipped - production plan (sections 1-9, ros-v4 basis), people map, zaal-only-PRODUCTION (12 lines, line 2 changeovers 5/10/15 first), ros-5min v4 (193 rows, 33 questions), four drafts (DO NOT SEND), every request line above for SITE and DECK. Held - nothing off disk: no pending relays, no monitors, no open question that is not in zaal-only-PRODUCTION.md or ros-5min Q1-Q33; no /handoff bundle needed. Branch bettercallzaal/lane-production-0827 in worktree ~/orca/workspaces/zaostock/lane-production-0827, based on ws/production-plan-1003-0826 @ 118f127, 20 commits ahead, tree clean, NOT pushed. Known red: src/content/festival.test.ts:16 expects '11 AM - 6 PM' (SITE's one-line flip); everything else 30/31 and tsc clean. Resume: claude --resume in that cwd, or read this file top to bottom. Ready to close.

## PRODUCTION lane - reopened for 21:2x, ros-v5, closed again - 2026-08-27, commit 7eb25d9

ZAOSTOCK-PRODUCTION ros-v5 (relay matched: orca-board.log 21:27 "RELAY 21:2x verdicts to PRODUCTION"): (1) Lyons Den fourth after Dcoop - order Crown Vics 12:05 / Sen 12:45 / Dcoop 13:20 / Lyons Den 13:55 / Fellenz 14:35-15:05, ~30 each, Fellenz before 16:00. (2) Changeovers mixed 5/10 - the split is Zaal's; the assignment is PROPOSED: 10 after Crown Vics (first gap, biggest fresh crowd, the 6pm-move message must land early), 5 after Sen, 5 after Dcoop, 10 after Lyons Den (sets up the closer and WaveWarZ, sponsors named before the most-photographed block). Swapping any of them moves the end by at most 10 min. Open stretch is now ~40 min (15:05-15:45): one of JANGO / Jadyn / Hurricane, or Werb - zaal-only 5. Plan 8.1 rewritten: a 5-minute gap is only physically real with a shared backline (Dcoop's question, zaal-only 12). Files: production plan (sections 2, 8.1, 8.6, 9, ledger, sources), people map, zaal-only (2-6, 11-12 rewritten), ros-5min v5 (193 rows, 33 questions), msg-dcoop (his slot 13:20-13:50; Lyons Den after him; the two 5s are either side of his set), msg-acadia-rising (12:45-13:15). Tables intact. Still DO NOT SEND.
ZAOSTOCK-PRODUCTION ros-v5 REQUEST for SITE (/program): no public fact changes from v4 - daytime block still "Independent artists on the parklet stage from 12:05, with our MC and our partners between sets. Lineup announced once every set is locked."; DJ set 18:00-19:30; live music to close from 19:30, in booking. Do not print the order, the 5/10 gaps, or a set count. Werb stays unconfirmed. Still outstanding: festival.test.ts:16 '12 PM - 6 PM'.
ZAOSTOCK-PRODUCTION ros-v5 REQUEST for DECK (schedule slide): no public fact changes from v4. One sellable line is now sharper, if a sponsor slide wants it: "two ten-minute event moments in the afternoon, each with a sponsor spot, plus the WaveWarZ voting windows" - print it as "sponsor spots in the changeovers and the battle voting windows"; no counts, no times per gap, no act names, no "45-minute sets".
ZAOSTOCK-PRODUCTION CLOSE (convention 10, second time): shipped as above plus ros-v5. Held - nothing off disk; no pending relays, no monitors; every open question is in zaal-only-PRODUCTION.md (12 lines, line 2 the 5/10 assignment) or ros-5min Q1-Q33; no /handoff bundle needed. Branch bettercallzaal/lane-production-0827, worktree ~/orca/workspaces/zaostock/lane-production-0827, base ws/production-plan-1003-0826 @ 118f127, 22 commits ahead, tree clean, NOT pushed. Known red: festival.test.ts:16 (SITE's). Ready to close.
