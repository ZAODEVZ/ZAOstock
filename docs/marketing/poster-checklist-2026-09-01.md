# ZAOstock poster - what it needs, and what is UNSET

Written 2026-08-27 (Thursday). Candy prints the **week of 1 September**, timed
to the 1 September lineup reveal so the poster carries the lineup. Exact print
day: **UNSET**. Lane: MARKETING. Design owner: Candy (with Paper). Print list
owner: Candy.

**One rule above every other line in this file: never print a proposed act.**
The lineup on the poster is four confirmed acts plus the WaveWarZ block
(was five until Zaal, typed 27 Aug 20:4x: Werb is no longer fully confirmed). The
four acts from Steve Peer's draft are proposed only (Zaal, typed 2026-08-27
11:58) and do not appear, in any size, anywhere on the sheet.

Status values: **HAVE** (asset or fact exists on disk or in Drive and is
current) · **UNSET** (nobody has decided or supplied it) · **BLOCKED** (waiting
on a named person) · **DO NOT PRINT** (true today but must not appear).

## 1. The lineup

| Item | Status | Source | Note |
|---|---|---|---|
| Werb | **DO NOT PRINT** until confirmed | Zaal, typed 27 Aug 20:4x | **Not fully confirmed** - Zaal wants him for WaveWarZ. Still named as confirmed on the live site (`src/app/page.tsx:397,404`); SITE flagged. Back to HAVE the moment Zaal says confirmed |
| Lyons Den | **HAVE** - confirmed, already public | `src/app/page.tsx:397,404`; Zaal, typed 27 Aug 21:2x | Placed in the running order after Dcoop at 21:2x; the 20:4x flag is closed. Spelling confirmed: Lyons Den |
| Fellenz | **HAVE** - confirmed, gated until 1 Sep | `src/app/team/plan/page.tsx` DAY[0] | Spelling confirmed: Fellenz (Zaal 27 Aug) |
| Dcoop | **HAVE** - confirmed, gated until 1 Sep | `src/app/team/plan/page.tsx` DAY[0] | Spelling confirmed: Dcoop (Zaal 27 Aug) |
| Acadia Rising | **HAVE** - confirmed, gated until 1 Sep | `src/app/team/plan/page.tsx` DAY[0] | Lane observation, not a Zaal verdict: also absent from the 20:4x order. Worth the same question as Lyons Den |
| Sen | **UNSET for print** | Zaal, typed 27 Aug 20:4x running order; gdoc Aug 3 ("2 Maine musicians confirmed... Sen is one of them") | In Zaal's order, not on the gated confirmed list. **Question for Zaal: is Sen confirmed for print?** Spelling as typed |
| JANGO, Jadyn, Hurricane as acts | **DO NOT PRINT** | Zaal, typed 27 Aug 20:4x: "dream additions... if time" | JANGO and Hurricane already print inside the WaveWarZ block. As separate acts they are not booked |
| WaveWarZ block | **HAVE** - confirmed block, 4 to 6 outdoors | `docs/plans/production-plan-2026-10-03.md` section 4; `src/app/program/page.tsx` BLOCKS[1] | Print as a block with the names. Battlers cleared for public (Zaal, typed 27 Aug 19:3x): Stilo, Jango, Lui, Quan; Hurricane MCing |
| The Crown Vics | **DO NOT PRINT** | Zaal 2026-08-27, `docs/plans/surface-audit-2026-08-27.md` | Proposed only |
| DJ Aquavantes | **DO NOT PRINT** | Zaal, typed 27 Aug 20:0x: "No DJ Aquavantes" | Out. With him goes the "DJ in every changeover" line - do not print it as a feature |
| The Somes Sound | **DO NOT PRINT** | same | Proposed only |
| North Creek | **DO NOT PRINT** | same | Proposed only. The evening block prints as "after party at Black Moon", no act |
| Set order / set times | **DO NOT PRINT** | Zaal, typed 27 Aug 20:0x; PRODUCTION owns the grid | Zaal's running order is noted in section 1b below; times come from PRODUCTION's ros-v2 when it lands. Poster carries names, not a schedule |
| Roster still four on print day | **BLOCKED - Zaal** | gdoc Links and Assets "Data we cannot see" | "The artist count has already moved three times in four days." Five is the count on the gated page as of 27 Aug. Re-confirm the morning the file goes to print |
| Name spellings | **HAVE** - Lyons Den, Dcoop, Fellenz (Zaal, typed 27 Aug 19:3x); Acadia Rising as on the site | Zaal, typed 27 Aug 19:3x | Photos still uncollected (gdoc "What we are missing") |

## 1b. The running order, as Zaal typed it - v3 (Zaal, typed 27 Aug 21:2x: Lyons Den added after Dcoop)

Noted for context. **Not for print** - the poster carries names, not times,
and PRODUCTION owns the grid: take times from its ros-v2 when it lands.
Supersedes the 20:0x order.

| Slot | Act | Print? |
|---|---|---|
| 1 | The Crown Vics, ~30 min | **DO NOT PRINT** - proposed until Steve confirms |
| 2 | Sen, ~30 min | **UNSET** - confirm with Zaal |
| 3 | Dcoop, ~30 min | yes |
| 4 | Lyons Den, ~30 min (Zaal, typed 27 Aug 21:2x) | yes |
| 5 | Fellenz, ~30 min | yes |
| then | WaveWarZ - Stilo, Jango, Lui, Quan; Hurricane MC | names yes |
| if time | JANGO, Jadyn, Hurricane - "dream additions" | **DO NOT PRINT** |
| evening | Stilo DJ indoors, then one of Steve's acts to close (20:0x) | Stilo yes; closer **DO NOT PRINT** |

Not in this order but still printing as confirmed: **Acadia Rising** (lane
observation). Lyons Den was added to the order at 21:2x. **Werb** is out of
the order and out of print until confirmed. No DJ Aquavantes anywhere.

## 2. The fixed facts

| Item | Status | Value | Source |
|---|---|---|---|
| Date | **HAVE** | Saturday 3 October 2026 | `src/content/festival.ts` |
| Venue | **HAVE** | Franklin Street Parklet, Ellsworth, Maine | `src/content/festival.ts` |
| Evening venue | **HAVE** | Black Moon Public House, next door, from six | `src/content/festival.ts`, `src/app/program/page.tsx` |
| Admission | **HAVE** | Free to attend | `src/content/festival.ts` |
| Series line | **HAVE** | Part of the 9th Annual Art of Ellsworth, Maine Craft Weekend | `src/app/page.tsx:486,495` |
| Rain or shine | **HAVE** | Tent coverage, Wallace Events | production plan section 4 |
| Start time | **HAVE** | **Music starts at noon. Print noon.** | Zaal, typed 27 Aug 19:3x | The 11:00 question is gone. `src/content/festival.ts` still reads 11 AM - 6 PM; SITE and PRODUCTION lanes move it back (request in DONE.md). Knock-on for PRODUCTION: noon on 45/15 is four slots for five confirmed acts |
| End of outdoor block | **HAVE** | 6 PM | `src/content/festival.ts` |
| URL | **HAVE** | zaostock.com | site |
| RSVP URL | **HAVE** | ticket.zaostock.com | `src/content/festival.ts` rsvpUrl | Whether to print it, or a QR, is UNSET |
| Short links | **UNSET** | gdoc lists "live and proposed" short links | gdoc Links and Assets "Short links" | Which are live is not verifiable from this repo |

## 3. Brand and art

| Item | Status | Source | Note |
|---|---|---|---|
| Primary mark | **HAVE** | `public/brand/logos/zaostock26_badge_official.png` | The red badge. This IS the logo; there is no separate red file |
| Mono mark | **HAVE** | `public/brand/logos/zaostock26_badge_bw_final.png` | For single-colour print |
| Palette | **HAVE** | `docs/brand/tokens.reference.css`, `docs/brand/README.md` | Ground is paper (#F2E6D3), text is ink (#241E15), primary red #D2402A. Not white, not black |
| Icons | **HAVE** | `public/brand/icons/` | lighthouse, hands, dove - three, hand-drawn poster style |
| Vector source of the badge | **UNSET** | `docs/brand/README.md` | Only PNGs are in the repo. Candy holds the editable system. Print wants vector - confirm Candy is printing from her source, not from the repo PNG |
| Design credit | **HAVE** | `docs/brand/README.md` | Credit Candy (CandyToyBox) on any surface the system appears on |
| Artist photos / press shots | **UNSET** | gdoc "What we are missing" | Unowned. Only matters if the poster design uses photos |
| Brand kit and print deliverables | **BLOCKED - Samantha (Candy)** | `src/app/team/plan/page.tsx` card 801d6743 | Due 30 Aug |

## 4. Partner strip

| Item | Status | Source |
|---|---|---|
| Black Moon, Star 97.7, Wallace Events, WaveWarZ, Bomb Squad | **HAVE** in Drive, not in repo | `docs/marketing/partner-logos.md` |
| COC Concertz | **HAVE** in Drive - partner confirmed (Zaal, typed 27 Aug 20:3x) | same |
| Town of Ellsworth, ENTERACT, Web3Metal | **BLOCKED** - due Fri 29 Aug | same |
| Heart of Ellsworth | **DO NOT PRINT** | `src/app/page.tsx:102-104` - no logo use until confirmed in writing |
| Sponsor logos | **NONE** | `docs/sponsor/slide-9-tier-ladder.md` | No sponsor is signed; every tier price is UNSET. Nothing to print. If "Presenting" and "Platform" tiers promise "logo on the poster" (`docs/sponsor/deck-2026-10-03.md:216-217`), a sponsor signed after print does not get it - the deck's early-close date is constrained by this print, and that date is UNSET |

## 5. Print production

| Item | Status | Note |
|---|---|---|
| Print day | **UNSET** | "Week of 1 September." The gdoc calls the exact date "the most useful date nobody has yet" |
| Size(s) | **UNSET** | |
| Quantity | **HAVE** - 100 | Zaal, typed 27 Aug 21:2x |
| Printer | **UNSET** | The 3 Aug call notes name Eric, a local Ellsworth merch printer, for merch samples - not for the poster. Do not assume |
| Cost | **UNSET** | No figure exists on disk. Budget memory: do not cite old numbers |
| Distribution | **PARTIAL** | Zaal has "3-4 in-person boards" to post on (gdoc, 3 Aug call). Board list UNSET. The maker space was named as one place |
| Digital version | **UNSET** | Needed for the 1 Sep socials and the press release; format and who exports it not decided |
| Final approval | **UNSET** | Who signs off the print file. Recommend Zaal, since the lineup line is his |

## 6. The order things have to happen in

1. Fri 29 Aug - the three logos land in Drive (or do not, and the strip prints
   with six).
2. Before the file locks - Zaal re-confirms the four names are still four, and
   answers the Werb and Sen questions in section 1 (Lyons Den placed 21:2x).
   Spellings and the noon start are settled (27 Aug 19:3x).
3. Sat 30 Aug - Candy's brand kit and print deliverables (card 801d6743).
4. Tue 1 Sep - reveal. The poster's digital version is the reveal image if it
   is ready; if not, the reveal uses the badge and text.
5. Week of 1 Sep - print. Exact day UNSET.
6. After print - Zaal posts the boards.

## Sources

- `docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md` - Things owed ("Poster
  print - Candy - print week of Sep 1", "Set Aug 24. Backs into the Sep 1
  reveal"); Links and Assets ("The poster, final. Paper and Candy. And the
  print date"); Improvements tab call notes on boards and Eric.
- `docs/plans/production-plan-2026-10-03.md` - sections 2, 4, 6, 8.
- `docs/plans/surface-audit-2026-08-27.md` - the proposed-only correction.
- `src/app/team/plan/page.tsx` - the confirmed acts as of 27 Aug morning (five then; Werb moved out at 20:4x) and the poster card
  53e3ff3a ("Cannot start until set times exist" - superseded: the poster
  carries names, not times, so it can start once names are locked).
- `src/content/festival.ts`, `src/app/page.tsx`, `src/app/program/page.tsx`.
- `docs/brand/README.md`, `public/brand/`.
- `docs/marketing/partner-logos.md`.
