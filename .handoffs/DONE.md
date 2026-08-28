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

# ZAOSTOCK-CITY - 2026-08-27

Branch `bettercallzaal/lane-city-0827` (the orca worktree's name; the handoff
said `ws/lane-city-0827` - same base `118f127` on `ws/production-plan-1003-0826`).
**Not pushed.** Writes only inside the CITY write-set plus these lines.

ZAOSTOCK-CITY 1/4 permit status page - `docs/permits/status-2026-08-27.md`. Four rows (parklet permit, 11:00 amplified start, fire permit, insurance certificate), owner, dates, evidence path per row, every unknown marked UNSET (26 markers). Primary source for the certificate condition is Roddy's email 2026-08-17 11:43 (doc 1045 section 3.6). The 25 Aug "paperwork is with the city" confirmation exists only in the stale gdoc snapshot; channel unknown.
ZAOSTOCK-CITY 2/4 John Jagger email - `docs/drafts/email-john-jagger-2026-08-27.md`. Still blocked on expected attendance (UNSET). Additional-insured line was already there. Fire line reworked: "pending with the City" had no filing date behind it; now "seeking from the fire department", and asks the broker whether performer-carries-own-COI is the right structure (doc 1045 3.6). Doc 1045 and the status page added as sources.
ZAOSTOCK-CITY 3/4 Roddy draft - `docs/drafts/roddy-2026-08-27.md`. Asks the 11:00 amplified-sound question (and the cut-off), the three certificate specifics the broker needs (coverage amount, additional insured wording, form and deadline), the fire-performer COI, the Ch.14 umbrella and surety bond, and the liability release. Supersedes Draft 2 in the production plan. No figures Zaal has not typed. Roddy's address deliberately not in the repo.
ZAOSTOCK-CITY 4/4 fiscal sponsor grep - `docs/permits/fiscal-sponsor-grep-2026-08-27.md`. 73 hits in 22 files, every one classified. Site code: all correct negations, PR #49 held. Four live WRONG lines, all outside this write-set - see requests below.

## Requests outside the CITY write-set (another lane owns these)

1. `docs/music/artist-deal-memo-template.md:87` - says ZAOstock carries event liability insurance via ENTERACT "and Fractured Atlas COI for the venue". No Fractured Atlas COI exists, and no policy is bound yet. This goes to artists. Replace with: insurance is being arranged; artist COI requests handled on request once bound.
2. `agents/TEMPLATE.md:16` - the example self-summary still reads "handles ZAOstock fiscal-sponsor mechanics with Fractured Atlas". Every new agent file is built from it. Swap the example.
3. `agents/FailOften.md:23` - live "Current focus" bullet "Fractured Atlas fiscal sponsorship for ZAOstock + ZAO Festivals", unstruck, nine lines below the correction note. Strike it. Lines 53 and 66 (escalation rules about Fractured Atlas wording) are stale but harmless; trim to "sponsor wording" when touching the file.
4. `agents/Zaal.md:71` - "Strategic counsel: FailOften (fiscal sponsor mechanics)" contradicts line 83 of the same file. Drop the parenthetical.
5. `src/app/team/plan/page.tsx:60` - card `6386c0c7` "Fiscal sponsor replacement" - the answer is NONE; the card's premise is stale. Close it or retitle to the commercial-path decision.
6. Low priority: one dated line at the top of `docs/meetings/failoften-agenda-may2026.md` saying its fiscal-sponsor premise died 2026-08-23.

## Zaal-only, from this lane

- **Expected attendance** - one number, UNSET. Unblocks the broker email, deck slide 4 and the City conversation.
- **Send the Roddy draft** (or Draft 2 from the production plan, if already sent, then only section 2 of the new one). 11:00 is live on public surfaces and not cleared.
- **Was the fire permit actually filed?** The record has Dcoop's route from 17 Aug and no filing date. If Dcoop has emailed the fire department, the date goes in the status page row 3.
- **Did the 25 Aug Roddy confirmation come by email?** If so, the thread is where the certificate and the 11:00 question go.

ZAOSTOCK-CITY 5/4 fiscal-sponsor fixes, write-set extended by the orchestrator to exactly four files. `docs/music/artist-deal-memo-template.md:87` now says insurance is being arranged through a broker as a permit condition, no fiscal sponsor, no Fractured Atlas COI, with a dated correction note. `agents/Zaal.md:71` FailOften's counsel is ENTERACT and the commercial path. `agents/FailOften.md` line 23 struck, lines 53 and 66 reworded to sponsor wording with the old text quoted. `agents/TEMPLATE.md:16` example self-summary no longer seeds the claim. Requests 1-4 above are closed; request 5 (`src/app/team/plan/page.tsx:60`, card `6386c0c7`) and 6 (the May agenda banner) stay open for another lane.

---

# ZAOSTOCK-CITY R2 - 2026-08-27 - rain, food, first aid, Chamber

Same branch, same write-set (all four pages under `docs/permits/`; the two new
drafts live inside their pages because `docs/drafts/` is limited to roddy-* and
the Jagger email). **Not pushed.**

ZAOSTOCK-CITY R2 1/4 rain plan, permit side - `docs/permits/rain-plan-2026-10-03.md`. No rain date exists (3 Oct is fixed inside Art of Ellsworth / Maine Craft Weekend). "Tent coverage via Wallace, rain or shine" has been public since May with no scope in writing and no City approval on record. Site Lead = Zaal is the only decision on record; thresholds (doc 1032) and the 7/3/24-hour cadence (doc 1040 - Sat 26 Sep, Wed 30 Sep, Fri 2 Oct) are research, adopted: UNSET. Black Moon posted occupancy: UNSET. New question for Roddy: is the concert-series tent (Thursdays through 1 Oct, same parklet) still up on 3 Oct and can we use it. Schedule side left to PRODUCTION.
ZAOSTOCK-CITY R2 2/4 food - `docs/permits/food-vendor-2026-10-03.md`. Two problems: crew (review item 7) and an audience vendor. Crew: Black Moon certificates confirmed, but $20 (Steve, 26 Aug, production plan) and about $25 (Aug 3 recap / Katina) both on record - which is current: UNSET. Vendor: UNSET; City side (allowed, fee, permit, cap) is Roddy's unreached 24 Aug question; State side has a real date - Maine DHHS temporary food licence must be filed by Thu 3 Sep 2026 for any vendor without a licence, so only already-licensed local restaurants are in reach. Chamber ask drafted to Peter Farragher, section 3.
ZAOSTOCK-CITY R2 3/4 first aid lead - `docs/permits/first-aid-lead-2026-10-03.md`. Chapter 14 has no first-aid clause; the Fire Chief may require fire/EMS presence at our expense inside the same Mass Gathering review (doc 1070), which only binds if the umbrella exemption fails - doc 1070 reads that it probably does. Standby EMS if required: $1,500-2,000+ (doc 1070 range) against about $1.5K on hand. Mutual-aid confirmation due 15 Aug: not done. Certification named on record: none. Source order: Ellsworth Fire Department, Heart of Ellsworth, the Chamber, the hospital, the standup. Ask drafted to the Fire Department, section 4, with a one-line Chamber add-on.
ZAOSTOCK-CITY R2 4/4 Chamber status - `docs/permits/chamber-status-2026-08-27.md`. Peter Farragher (Member Services), Kaitlen Workman (Director of Operations), Heather (role and surname UNSET, "ask when writing"). All three "new", uncontacted, no follow-up date as of the 25 Aug CRM check; not re-read today. Owed: the deck and a specific ask, same day to all three. Trigger "the moment the deck exists" is half-met - deck in markdown, slide 9 UNSET. Is The ZAO a member of the Ellsworth Area Chamber (Zaal's membership on record is Bar Harbor): UNSET.

## Requests outside the CITY write-set

7. PRODUCTION: Black Moon posted occupancy (one number from Steve or Katina), and the day-of go/no-go time once the 11:00 answer lands.
8. SITE: a weather-policy line stated up front, not one bullet on `/program` - doc 1040 shows every comparable Maine event does this.
9. Whoever holds the CRM: re-read the three Chamber rows and Kaitlen/Peter/Heather follow-up dates; the status page is the 25 Aug state.

## Zaal-only, from R2

- Adopt or replace the weather cadence and thresholds, and name a second decision-maker.
- Which gift-certificate figure is current, $20 or $25.
- Is a food vendor wanted at all. If yes, Roddy's vendor question goes in the next message to him.
- Send the Fire Department ask (attendance line is literally UNSET in it).
- Does the deck go to the Chamber with slide 9 blank, or wait.

ZAOSTOCK-CITY R3 done. `docs/plans/zaal-only-CITY.md`: 12 lines ranked by clock, 4 under "later", each one answer (a number, a name, yes/no) with the file it unblocks. Five paste-ready messages, DO NOT SEND, consolidated from every draft today: `docs/drafts/msg-roddy-2026-08-27.md` (11:00, certificate specifics, vendors/capacity/power/load-in, weather and the concert-series tent, fire, Ch.14), `msg-peter-farragher-2026-08-27.md` (sponsors, one food spot, a first-aider), `msg-kaitlen-workman-2026-08-27.md` (co-promotion), `msg-heather-2026-08-27.md` (asks her role first), `msg-john-jagger-2026-08-27.md` (unchanged body, still blocked on attendance). The Fire Department ask stays in `docs/permits/first-aid-lead-2026-10-03.md` section 4 - not on the R3 person list. Paths `docs/plans/zaal-only-CITY.md` and `docs/drafts/msg-*` are outside the R1 write-set and named by the R3 brief. No new documents beyond these two outputs.

ZAOSTOCK-CITY noon-revert. Zaal typed 19:3x: music starts at noon, as permitted; attendance 200-250 in person / 1,000 online. Done: the 11:00 question is out of `docs/drafts/msg-roddy-2026-08-27.md` (section 1 now confirms noon-to-six and asks only the noise cut-off; certificate specifics, site questions and STREAM's power blockquote kept); `docs/permits/status-2026-08-27.md` row 2 closed at noon with the history kept; attendance filled into both Jagger files (no longer blocked, holds until Zaal sends), the Fire Department draft, the rain, first-aid and Chamber pages; `docs/plans/zaal-only-CITY.md` line 1 answered, line 2 reworded. Nothing sent. **Request outside the write-set - SITE lane:** `src/content/festival.ts` `FESTIVAL.window` is still `11 AM - 6 PM`, `src/app/layout.tsx` schema.org `startDate` is still 11:00, `/program` and `/pitch` still say eleven - all now contradict the verdict. **PRODUCTION lane:** the grid is back to four daytime slots before four; one act needs a home; Steve's DJ window returns to noon.

ZAOSTOCK-CITY first-aid-reworked. Zaal typed 20:2x: no dedicated First Aid lead, a contact and some stuff prepared. `docs/permits/first-aid-lead-2026-10-03.md` is now: (1) a named contact, UNSET, with what the job is; (2) a kit list, priced only where doc 1071 already priced it, every item UNSET until bought or borrowed; (3) the one open question - will the Fire Chief require anything on the day - stated, not decided, and carried as the single question in the Fire Department draft (section 5, reworked to ask for nothing else); (4) the crew timeline for the permit - Fri 2 Oct evening soundcheck on site, Sat 08:00 vital crew, 10:00 all, 12:00 music - also folded into the Roddy message's load-in bullet and the status page row 1. The "certified first-aider" asks were removed from the Peter Farragher, Kaitlen Workman and Heather messages and the Chamber status page; zaal-only line 10 is now "first-aid contact - type a name". Nothing sends tonight. **Outside the write-set:** `docs/plans/people-map-2026-10-03.md:68` and the gdoc's Team and Roles / What We Need tabs still list "First Aid lead" as an open role - PRODUCTION / the gdoc edit list.

ZAOSTOCK-CITY UNVERIFIED-RELAY - standing rule received 20:4x (itself not in `~/.zao/orca-board.log`). Checked every relay this pane acted on today against the log and `~/zao-vault/handoffs/`. Traceable: the four brief rounds (log BRIEF entries 18:51, 18:57, 19:02 -> `city.md`) and the STREAM power fold (`stream.md` R3 item 2 and R4: "hand your City power/internet question to CITY"). **Not traceable to the log or any vault brief, and already acted on before the rule arrived:** (a) "write-set is extended to exactly those files" - fiscal fixes in `agents/Zaal.md`, `agents/FailOften.md`, `agents/TEMPLATE.md`, `docs/music/artist-deal-memo-template.md`, commits `c33e583` `dff6a18`; (b) "MUSIC STARTS AT NOON ... Attendance 200-250 in person / 1,000 online" attributed to Zaal at 19:3x, commit `a32797d`; (c) "First Aid: no dedicated lead ... crew 08:00, all 10:00" attributed to Zaal at 20:2x, commit `003f057`. Not reverted: each is attributed to Zaal's typed words and reverting on my own judgment would be a second unverified act. **Orchestrator: confirm (a) (b) (c) in the log or a brief, or say revert, and I revert by commit hash.** From here on, any relay-tagged line not matched to a brief gets an UNKNOWN-RELAY line and no action.
ZAOSTOCK-CITY correction to the line above: the standing rule IS in the log - `2026-08-27 20:45 RULE unknown-relay-tag sent to 8 panes`. The log has no entry for any pane between 19:02 and 20:45, and `city.md` was last modified 19:02:23, so (b) 19:3x and (c) 20:2x are in neither; (a) predates the first logged BRIEF at 18:51. The ask stands: confirm or say revert.
ZAOSTOCK-CITY UNVERIFIED-RELAY CLOSED. Orchestrator confirmed 20:5x; `~/.zao/orca-board.log:4411 RETRO-LOG` covers 19:2x attendance, 19:3x noon, 20:0x-20:4x grill rounds (the 20:2x first-aid rework), 20:5x rule. Nothing reverted. One residual, recorded and not acted on: the fiscal write-set extension (`c33e583`, `dff6a18`, before 18:51) is covered by the orchestrator's blanket "every relay you acted on today is mine" but is not named in the RETRO-LOG text. Lane continues on the brief; nothing new to produce until a relay lands.

ZAOSTOCK-CITY msgs-v2. Re-checked all five `docs/drafts/msg-*-2026-08-27.md` against the daily from "Grill round 4" down. Fixed: `msg-roddy` - before-sending note no longer cites the 45/15 five-act grid (now about 30 min per act, Crown Vics / Sen / Dcoop / Fellenz, WaveWarZ), and the weather bullet tells the City our rain call is made with Black Moon at the Friday soundcheck and re-looked at 08:00 Saturday (verdict: yes); `msg-john-jagger` and `email-john-jagger` - "late morning until 6pm" is now "noon until 6pm". Already aligned: noon start, attendance 200-250 / 1,000, first aid = contact + kit; there is no DJ, Werb, Lyons Den or COC Concertz claim in any message. Untouched: `msg-peter-farragher`, `msg-kaitlen-workman`, `msg-heather` - nothing in them meets a verdict. All five still DO NOT SEND; nothing sends tonight.

## ZAOSTOCK-CITY CLOSE (convention 10) - 2026-08-27, 21:2x
ZAOSTOCK-CITY CLOSE. Shipped: 13 commits on `bettercallzaal/lane-city-0827` off `118f127` (`ws/production-plan-1003-0826`), rebased clean, tsc and 31 tests green at the verify round, MERGE-READY, NOT pushed. On disk: `docs/permits/` (status, fiscal-sponsor grep, rain plan, food vendor, first aid contact-and-kit, Chamber status), `docs/plans/zaal-only-CITY.md` (12 lines, line 1 answered), five paste-ready messages in `docs/drafts/msg-*-2026-08-27.md` (Roddy, Peter Farragher, Kaitlen Workman, Heather, John Jagger) plus the Jagger reasoning file and the superseded Roddy draft, four fiscal-sponsor fixes in `agents/` and the artist deal memo. Held: nothing off disk - every relay acted on is recorded above and confirmed by RETRO-LOG; no monitors, no open question this pane alone knows. Nothing was sent. Open for others, all already filed as request lines above: SITE (public surfaces still say 11:00, verdict is noon), PRODUCTION (Black Moon occupancy, go/no-go time, people-map "First Aid lead"), the gdoc edit list (Team and Roles / What We Need tabs), the `/team/plan` fiscal card `6386c0c7`. Zaal-only, smallest first: a first-aid contact's name (line 10), send the Roddy message tomorrow (line 2), the gift-certificate figure (line 7). Resume: `claude --resume a757a231-9af1-40f0-be9b-9b02184f756f` in this worktree. Safe to close.
ZAOSTOCK-CITY UNKNOWN-RELAY "mit only, no push, nothing sends." - untagged fragment received after CLOSE, 21:2x; no instruction in it, not matched to a brief or the log; no action taken. Lane remains closed.

ZAOSTOCK-CITY REOPENED for round 22:20 (`~/zao-vault/handoffs/zaostock-lanes/city-round-2220.md`, logged 22:24). Note: the earlier relay pointed at `city.md` and said the round was at its bottom; `city.md` was unchanged (mtime 19:02:23). Nothing was acted on until the round file arrived. The 22:15 `RELAY CITY+PRODUCTION steve-roddy-in` and the daily's tail carried the same facts.
ZAOSTOCK-CITY roddy-in. `docs/permits/status-2026-08-27.md`: row 1 Roddy IN (Zaal talked to him 27 Aug; written confirmation still UNSET); row 3 fire spinning CONFIRMED by Roddy 27 Aug (the Fire Department's own open-flame paperwork stays Dcoop's, filing date UNSET); row 4 the City must be named additional insured for the day - stated, not asked; coverage amount is the one question left. Both Jagger files: question 2 is now the statement, the fire line says the City has confirmed it, attendance 200-250 / 1,000 stands; marked FIRST send tomorrow (Zaal sends; the Gmail draft was placed by the orchestrator, nothing left this pane). `msg-roddy`: additional insured stated, fire spinning thanked for; coverage amount, form and date remain. Fire Department draft says Roddy confirmed the act. zaal-only: line 6 moot, line 5 reworded to the Fire Department paperwork, line 13 added (Arbor Camp name + headcount).
ZAOSTOCK-CITY arbor-camp. NEW `docs/drafts/msg-arbor-camp-2026-08-27.md`, DO NOT SEND: a couple of places, possibly multiple units, three nights Thursday 1 to Sunday 4 October, for artists; positioned as content made on site plus socials, programme and stage thank-you. Rates, unit count and names UNSET - the clipboard research's names, inventory and ask ladder are referenced, not used. Nothing sent, nothing pushed, nothing left the machine.
ZAOSTOCK-CITY fold note: `origin/ws/fold-2026-08-27` (`6f0d200`, PR #56) contains this branch through `d2d1f8d`; the commits after it (`04c82b8` and tonight's) are not in the fold and stay local until the orchestrator folds again.

## ZAOSTOCK-CITY CLOSE (convention 10) - 2026-08-27, 22:3x
ZAOSTOCK-CITY CLOSE. Shipped tonight on `bettercallzaal/lane-city-0827` (off `118f127`, not pushed): the roddy-in updates across the status page, both Jagger files, the Roddy message, the Fire Department draft and the zaal-only list; the new Arbor Camp draft. Held: nothing off disk. First thing tomorrow, in order: Zaal sends the Jagger email (Gmail draft exists, `msg-john-jagger` is the text), then the Roddy message, then the Chamber three; Arbor Camp waits on a name and a headcount (zaal-only line 13). Resume: `claude --resume a757a231-9af1-40f0-be9b-9b02184f756f` in this worktree. Safe to close.
ZAOSTOCK-CITY correction: commit `a9dde32` carried only the status page, the Arbor Camp draft and the DONE lines - the edit script stopped at the Jagger block (wrapping mismatch) before writing the Jagger files, the Roddy message, the Fire Department draft and the zaal-only list. Those five land in the next commit; the roddy-in line above is true as of that commit, not `a9dde32`.
