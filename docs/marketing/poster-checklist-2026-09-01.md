# ZAOstock poster - what it needs, and what is UNSET

Written 2026-08-27 (Thursday). Candy prints the **week of 1 September**, timed
to the 1 September lineup reveal so the poster carries the lineup. Exact print
day: **UNSET**. Lane: MARKETING. Design owner: Candy (with Paper). Print list
owner: Candy.

**One rule above every other line in this file: never print a proposed act.**
The lineup on the poster is five confirmed acts plus the WaveWarZ block. The
four acts from Steve Peer's draft are proposed only (Zaal, typed 2026-08-27
11:58) and do not appear, in any size, anywhere on the sheet.

Status values: **HAVE** (asset or fact exists on disk or in Drive and is
current) · **UNSET** (nobody has decided or supplied it) · **BLOCKED** (waiting
on a named person) · **DO NOT PRINT** (true today but must not appear).

## 1. The lineup

| Item | Status | Source | Note |
|---|---|---|---|
| Werb | **HAVE** - confirmed, already public | `src/app/page.tsx:397,404` | Public since before the reveal. Spelling as on site |
| Lyons Den | **HAVE** - confirmed, already public | `src/app/page.tsx:397,404` | Same. "Lyons Den" on the site; the gdoc also writes "Lions / Lionsden" - **spelling to confirm with the act** |
| Fellenz | **HAVE** - confirmed, gated until 1 Sep | `src/app/team/plan/page.tsx` DAY[0] | Tom Fellenz. Poster form of the name (Tom Fellenz vs Fellenz): UNSET, ask the act |
| Dcoop | **HAVE** - confirmed, gated until 1 Sep | `src/app/team/plan/page.tsx` DAY[0] | Site also writes "DCoop" (`src/app/page.tsx:681`). **One spelling, confirm with Dcoop** |
| Acadia Rising | **HAVE** - confirmed, gated until 1 Sep | `src/app/team/plan/page.tsx` DAY[0] | |
| WaveWarZ block | **HAVE** - confirmed block, 4 to 6 outdoors | `docs/plans/production-plan-2026-10-03.md` section 4; `src/app/program/page.tsx` BLOCKS[1] | Print as a block. Battler names (Stilo, Jango, Lui, Quan; Hurricane MCing) are on the gated team page with no PROPOSED tag, but the roster database is unreadable - **confirm each battler with Zaal before naming them on print** |
| The Crown Vics | **DO NOT PRINT** | Zaal 2026-08-27, `docs/plans/surface-audit-2026-08-27.md` | Proposed only |
| DJ Aquavantes | **DO NOT PRINT** | same | Proposed only. Also the changeover DJ, so "DJs between every act" is a claim about a role, not a name |
| The Somes Sound | **DO NOT PRINT** | same | Proposed only |
| North Creek | **DO NOT PRINT** | same | Proposed only. The evening block prints as "after party at Black Moon", no act |
| Set order / set times | **DO NOT PRINT** | production plan section 2 | No downbeat is printed anywhere until Steve answers; set order is not fixed. Poster carries names, not a schedule |
| Roster still five on print day | **BLOCKED - Zaal** | gdoc Links and Assets "Data we cannot see" | "The artist count has already moved three times in four days." Five is the count on the gated page as of 27 Aug. Re-confirm the morning the file goes to print |
| Name spellings and how each act wants to be credited | **UNSET** | gdoc "What we are missing" | "One usable photo per act, plus how they want their name spelled." Not collected |

## 2. The fixed facts

| Item | Status | Value | Source |
|---|---|---|---|
| Date | **HAVE** | Saturday 3 October 2026 | `src/content/festival.ts` |
| Venue | **HAVE** | Franklin Street Parklet, Ellsworth, Maine | `src/content/festival.ts` |
| Evening venue | **HAVE** | Black Moon Public House, next door, from six | `src/content/festival.ts`, `src/app/program/page.tsx` |
| Admission | **HAVE** | Free to attend | `src/content/festival.ts` |
| Series line | **HAVE** | Part of the 9th Annual Art of Ellsworth, Maine Craft Weekend | `src/app/page.tsx:486,495` |
| Rain or shine | **HAVE** | Tent coverage, Wallace Events | production plan section 4 |
| Start time | **UNSET for print** | 11:00 is on the site as our intent and is **not cleared with the City** | `src/content/festival.ts` comment; production plan section 8 | If the parklet permit caps amplified sound start, this moves. Print "until 6, then Black Moon" without an opening hour, or print 11 only after the City answers. Zaal's call. CITY lane holds the Roddy draft |
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
| COC Concertz | **UNSET** - logo in Drive, partner status undecided | same |
| Town of Ellsworth, ENTERACT, Web3Metal | **BLOCKED** - due Fri 29 Aug | same |
| Heart of Ellsworth | **DO NOT PRINT** | `src/app/page.tsx:102-104` - no logo use until confirmed in writing |
| Sponsor logos | **NONE** | `docs/sponsor/slide-9-tier-ladder.md` | No sponsor is signed; every tier price is UNSET. Nothing to print. If "Presenting" and "Platform" tiers promise "logo on the poster" (`docs/sponsor/deck-2026-10-03.md:216-217`), a sponsor signed after print does not get it - the deck's early-close date is constrained by this print, and that date is UNSET |

## 5. Print production

| Item | Status | Note |
|---|---|---|
| Print day | **UNSET** | "Week of 1 September." The gdoc calls the exact date "the most useful date nobody has yet" |
| Size(s) | **UNSET** | |
| Quantity | **UNSET** | |
| Printer | **UNSET** | The 3 Aug call notes name Eric, a local Ellsworth merch printer, for merch samples - not for the poster. Do not assume |
| Cost | **UNSET** | No figure exists on disk. Budget memory: do not cite old numbers |
| Distribution | **PARTIAL** | Zaal has "3-4 in-person boards" to post on (gdoc, 3 Aug call). Board list UNSET. The maker space was named as one place |
| Digital version | **UNSET** | Needed for the 1 Sep socials and the press release; format and who exports it not decided |
| Final approval | **UNSET** | Who signs off the print file. Recommend Zaal, since the lineup line is his |

## 6. The order things have to happen in

1. Fri 29 Aug - the three logos land in Drive (or do not, and the strip prints
   with six and a decision on COC Concertz).
2. Before the file locks - Zaal re-confirms the five names, the spellings, and
   whether 11:00 prints.
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
- `src/app/team/plan/page.tsx` - the five confirmed acts and the poster card
  53e3ff3a ("Cannot start until set times exist" - superseded: the poster
  carries names, not times, so it can start once names are locked).
- `src/content/festival.ts`, `src/app/page.tsx`, `src/app/program/page.tsx`.
- `docs/brand/README.md`, `public/brand/`.
- `docs/marketing/partner-logos.md`.
