# ZAOstock surface audit - 2026-08-27

Every surface that states a ZAOstock fact, what it says, what is true, and
whether it was fixed. 37 days out.

**Two corrections drove most of this**, both typed by Zaal at 11:58 on 2026-08-27:
Steve's four acts are **proposed only**, and ZAOstock has **no fiscal sponsor**.

Status values: **FIXED** (corrected on this branch) · **CORRECT** (checked, no
change) · **UNVERIFIED** (cannot be confirmed from anything on disk) ·
**HISTORY** (a dated record, left alone deliberately).

---

## Public site

| Surface | What it said | What is true | Status |
|---|---|---|---|
| `src/app/program/page.tsx` indoor block | "A live band for the evening, underwritten by the bar" | North Creek is proposed, not booked | **FIXED** - "Live music for the evening, in booking". Names no act, prints no downbeat |
| `src/app/program/page.tsx` grid | 12:00-16:00 live music, two evening entries | 11:00-16:00, one 18:00-21:00 evening block, DJ close | **FIXED** earlier on this branch (`ef53e3a`) |
| `src/app/page.tsx` After Hours | "The bar can also host performances during the 12 PM - 6 PM window, which opens up a second stage there alongside the main stage in the parklet" | One venue at a time since 23 Aug | **FIXED** (`cc07ce7`). The gdoc still flags this as outstanding - it is not |
| `src/content/festival.ts` `window` | `12 PM - 6 PM` | 11 AM - 6 PM, our intent, not City-cleared | **FIXED** (`cc07ce7`), with the caveat in a comment |
| `src/content/festival.ts` `hostsPerformances` | `true` | Black Moon hosts the evening, not a simultaneous stage | **FIXED** - renamed `hostsSimultaneousStage`, set false, test updated |
| `src/app/layout.tsx` `startDate` | `2026-10-03T12:00:00-04:00` | 11:00 | **FIXED** (`cc07ce7`) |
| `src/app/pitch/page.tsx` time | `12 PM - 6 PM Eastern` | 11 AM - 6 PM | **FIXED** (`cc07ce7`) |
| `src/app/pitch/page.tsx` fiscal lines (109, 355, 378) | "no tax-deductible path - ZAOstock has no fiscal sponsor" | Correct | **CORRECT** - PR #49 held |
| `src/app/llms.txt/route.ts` | "ZAOstock has no fiscal sponsor, so there is no tax-deductible path" | Correct | **CORRECT** |
| `src/app/donate/page.tsx` | "not tax-deductible and we cannot issue a receipt" | Correct | **CORRECT** |
| `src/app/page.tsx` lineup teaser | Names Werb and Lyons Den as confirmed | Both confirmed | **CORRECT** |
| Public forms | Off behind `PUBLIC_FORMS_ENABLED` | The write path is down | **CORRECT** |
| `src/lib/lineup-fallback.ts` | Empty; endpoint returns 503 | Roster unreachable | **CORRECT** - an empty fallback is not a lineup |

**Fiscal-sponsor re-verification, as asked.** PR #49 stripped the site and the
site is still clean: every `tax-deductible` string in `src/` is a correct
negation. **No new offender in `src/`.**

---

## Agent context - the worst offenders, and not on the site

| Surface | What it said | What is true | Status |
|---|---|---|---|
| `agents/Zaal.md:83` | **"Always credit Fractured Atlas as ZAOstock's fiscal sponsor (501c3)"** | There is no fiscal sponsor | **FIXED** - now the opposite rule, and says the old one was wrong |
| `agents/FailOften.md:12,21,34,39` | FailOften "owns Fractured Atlas fiscal sponsorship mechanics for ZAOstock" | There are no mechanics to own | **FIXED** - struck, with a dated correction note |

These two are worse than a site typo. **A hard rule in an agent context file is
an instruction**, so every agent that read `agents/Zaal.md` was being told to
reintroduce a claim PR #49 had just removed. That is a loop, not a bug.

---

## Docs and templates

| Surface | What it said | What is true | Status |
|---|---|---|---|
| `docs/music/artist-outreach-templates.md:73-78` | Send-ready copy offering sponsors "tax-deductible recognition" through New Media Commons, a fiscally sponsored project of Fractured Atlas, 501(c)(3) | No fiscal sponsor, no tax-deductible path | **FIXED** - paragraph removed. This was paste-ready and going to artists |
| `docs/sponsor/finders-fee-structure.md:44` | Fees recognised via "the appropriate fiscal infrastructure for tax-deductible support" | No such path | **FIXED** |
| `docs/sponsor/finders-fee-structure.md:46+` | Per-deal flow routed gross → NMC infrastructure cost → project budget | Flow does not touch NMC | **FIXED** - rewritten, and the 10/15/25 ladder marked **UNSET** per Zaal: "None of that's formalized or finalized" |
| `docs/sponsor/slide-9-tier-ladder.md` | Three priced ladders, $2,500 top, early close 11 Sep | Zaal has typed no price and no date | **FIXED** (`34fd718`) - eight fields UNSET |
| `docs/plans/production-plan-2026-10-03.md` open item 4 | "Does North Creek start at 6:00 or 6:30" | The prior question is whether it is booked at all | **FIXED** - now asks which of the four are booked; downbeat demoted to a follow-on |
| `docs/plans/production-plan-2026-10-03.md` supply table | North Creek "Confirmed, underwritten" | Proposed | **FIXED** |
| `docs/plans/production-plan-2026-10-03.md` dates | "26 September" headcount, "about 20", "mid September" PA date | All invented by an agent | **FIXED** (`5c6f90a`) - UNSET |
| `docs/plans/people-map-2026-10-03.md` | Livestream split, Aziz and Ohnahji | Applied 27 Aug; reverses a dated 24 Aug call, both recorded | **CORRECT**, with the reversal flagged in-file |
| `docs/audit/2026-05-12-public-surfaces.md` | "501(c)(3) Funding via NMC / Fractured Atlas ... KEEP" | Superseded | **HISTORY** - a dated record of what was believed in May. Its *guidance* is now wrong; its *record* is accurate. Not rewritten |
| `docs/meetings/failoften-agenda-may2026.md` | Fiscal-sponsorship questions for FailOften | Superseded | **HISTORY** |
| `docs/standup/2026-05-12-tue-agenda.md` | "Fiscal sponsor framing locked" | Superseded | **HISTORY** |

---

## Deck

| Surface | What it said | What is true | Status |
|---|---|---|---|
| `content/pitch-pack/deck-words.md` fact sheet | Hours 12-6; "Stages **CONFLICT**"; 8 artists confirmed; after-party 6-8 with Steve's hip-hop crew | 11-6; one venue at a time; five confirmed; 18:00-21:00 in booking | **HISTORY** - doc 2325 is dated 2026-08-20 and is the *words* source. Superseded facts are corrected in the new deck rather than backported. Anyone drawing from 2325 must read the new deck first |
| `docs/sponsor/deck-2026-10-03.md` | New. Twelve slides | Slides 4, 9, 10 blocked on Zaal | **FIXED** - built today |
| Deck WaveWarZ figures | Docs carry July numbers (1,245 / 1,289 battles) | 1,452 battles, 913.9 SOL, measured 2026-08-27 15:47 UTC | **FIXED** - re-pulled live from the public API |

---

## Socials drafts

| Surface | Status |
|---|---|
| Lineup reveal post, 1 September | **UNVERIFIED** - no draft exists on disk in this repo. The reveal is the biggest attention moment of the year and there is nothing written for it |
| Any ZAOstock social draft | **UNVERIFIED** - nothing in this repo. Drafts live in the clipboard store and the socials sheet, neither of which is on disk here. **Not written blind**, because writing a lineup post needs a lineup |

---

## What could not be verified from anything on disk

1. **Whether the AV spec landed.** The gdoc owed it Thursday 26 August. Nothing in this repo records either outcome.
2. **Whether the insurance conversation happened.** The gdoc had Zaal talking to a local bank contact on Tuesday 25 August. No record of the two things needed from it: the coverage amount the City requires, and whether the City must be named as additional insured.
3. **Set lengths for Dcoop and Acadia Rising.** Still the only placeholders in the grid.
4. **Whether the three missing partner logos arrived** (Town of Ellsworth, ENTERACT, Web3Metal), due Friday 29 August.
5. **Whether Aziz sent the rtmps ingest URL and key.** Overdue since 22 August; the only untested link in the livestream chain.
6. **Attendance or awareness figure** for deck slide 4. Zaal's to type.
7. **Five sponsor prices, a discount and a close date** for slide 9. Zaal's to type.

## Sources

- Zaal, typed 2026-08-27 11:58, relayed: the four acts are proposed only; no fiscal sponsor
- `docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md` - the Aug 24 doc state
- Repo-wide scan for `tax.deduct|501\(c\)|501c3|fiscal sponsor`, 2026-08-27
- `wavewarz.info/api/public/stats`, fetched 2026-08-27 15:47 UTC
- Commits on `ws/production-plan-1003-0826`: `ef53e3a`, `cc07ce7`, `34fd718`, `5c6f90a`, `6979739`
