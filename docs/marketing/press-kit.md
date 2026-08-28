# ZAOstock press kit

This file is the content for the `/press` route, which does not exist yet.
SITE renders it; MARKETING owns the words. Everything below the line is
publishable as written. Everything above it is instructions.

Written 2026-08-27 (Thursday). Lane: MARKETING.

## Notes for SITE (not rendered)

- Route: `zaostock.com/press`. The Google Doc already tells The Ellsworth
  American to look there.
- Render the sections in order. Markdown is fine - `[slug]/page.tsx` already
  renders one-pager bodies with `react-markdown` + `remark-gfm`.
- Image files referenced are in `public/brand/`. Give each a direct download
  link. Do not add any image that is not in the repo.
- Facts come from `src/content/festival.ts` where they exist there. If SITE
  would rather import them than repeat them, the strings match.
- Two sections have a hold and must not render before the date on them: the
  lineup (1 September) and WaveWarZ figures (re-pull before publishing).
- Music starts at noon (Zaal, typed 27 Aug 19:3x). `src/content/festival.ts` still
  reads 11 AM - 6 PM; SITE moves it back to noon. This file says noon.
- Contact address is `info@thezao.com` - settled by Zaal, typed 27 Aug 21:2x. The overview
  one-pager (`zaal@thezao.com`) and llms.txt (a Gmail address) should move to
  it; SITE request logged.
- Do not add sponsor tiers, prices, attendance, or the words tax-deductible.

---

# ZAOstock - press

**Saturday 3 October 2026. Franklin Street Parklet, downtown Ellsworth, Maine.
Free to attend.**

## In one paragraph

ZAOstock is a free, one-day, artist-built music festival on Franklin Street in
downtown Ellsworth, Maine. From noon, independent artists play the outdoor
parklet stage, then two hours of
WaveWarZ, a live music-battle format where two artists go head to head and the
audience decides. At six the whole street walks next door into Black Moon
Public House for the evening. It is part of the 9th Annual Art of Ellsworth
during Maine Craft Weekend, and it is produced by ZAO Festivals, the events arm
of The ZAO, an independent music community with members in more than twenty
countries.

## Fast facts

| | |
|---|---|
| Date | Saturday 3 October 2026 |
| Where | Franklin Street Parklet, Ellsworth, Maine; Black Moon Public House next door from six |
| Cost | Free to attend |
| Music starts | Noon |
| Format | Independent artists outdoors, WaveWarZ live battles, then indoors at Black Moon with a DJ set and live music to close |
| Weather | Rain or shine, under tent cover from Wallace Events |
| Series | 9th Annual Art of Ellsworth, Maine Craft Weekend |
| Produced by | ZAO Festivals, the events arm of The ZAO |
| Schedule | zaostock.com/program |
| Contact | info@thezao.com |

## The day

- **Outdoors, Franklin Street Parklet, noon until six.** Independent artists back
  to back.
- **WaveWarZ, four to six, outdoors.** Live music battles. Stilo, Jango, Lui
  and Quan go head to head, Hurricane on the mic, and the audience decides, in
  the street and online.
- **Six onward, indoors at Black Moon Public House.** Live music for the
  evening: a DJ set as the street walks in, then live music to close.

One venue at a time. The day does not split across two rooms.

## The lineup

**HOLD until 1 September.** Two names are public now.

Lyons Den is confirmed. The full lineup is announced on 1 September.

*(On 1 September, replace with the confirmed acts as Zaal confirms them
that day, plus the WaveWarZ block. Never list an act marked proposed.)*

## WaveWarZ

WaveWarZ is a live music-battle format. Two artists play head to head and the
audience picks the winner, in person and online. It runs online and comes to
the ZAOstock stage on 3 October.

**HOLD - re-pull before publishing.** As of 27 August 2026: 1,452 battles run.

## Partners

Partners give time, venue and infrastructure, not money. Each has a confirmed
agreement and a named point of contact on the ZAO team.

- Town of Ellsworth - parklet venue
- Black Moon Public House - the evening, and the official after party
- Star 97.7 - local radio promotion
- Wallace Events - event equipment and tenting
- WaveWarZ - the live music-battle format
- ENTERACT - production and operational support
- Web3Metal - partnership integration and community surface
- COC Concertz - community partnership

*(SITE: mirror `src/app/page.tsx` PARTNERS so this list cannot drift. COC
Concertz is a partner per Zaal, typed 27 Aug 20:3x; add it and Bomb Squad there. "Community
partnership" is from `src/app/llms.txt/route.ts`; the role line is otherwise UNSET.)*

## The ZAO

The ZAO is an independent community of musicians and digital creators. Its
principle, in order: music first, community second, technology third. ZAO
Festivals is its events arm.

Previous festivals:

- **ZAO-PALOOZA** - New York City, during NFT NYC, 2024. Twelve artists.
- **ZAO-CHELLA** - Miami, Wynwood, during Art Basel, December 2024. The
  first live WaveWarZ battle.
- **ZAOville** - Laurel, Maryland, July 2026, co-hosted with DCoop.

ZAOstock is the first in Maine. The ZAO's founder lives in Ellsworth.

## Why Ellsworth

Ellsworth is the gateway to Acadia National Park. Over four million people
drove through in 2025. Downtown has just received National Historic Register
designation. The Heart of Ellsworth ran 28 events in 2025 with more than 50
sponsors. ZAOstock plugs into that calendar rather than competing with it.

ZAOstock is also measuring what a free street festival does for downtown
businesses - an ordinary Saturday against 3 October - and will publish the
comparison combined across the businesses that take part.

## Assets

Official mark, designed by Samantha "Candy" of CandyToyBox. Credit her when
the mark is used.

- ZAOstock 2026 badge, colour (the primary mark): `/brand/logos/zaostock26_badge_official.png`
- ZAOstock 2026 badge, black and white: `/brand/logos/zaostock26_badge_bw_final.png`

Artist photos and stage photos: not yet available. Ask.

## For press

Interviews with the organiser are available in person in Ellsworth or by
video. Artist interviews are arranged with each artist's agreement. Photo
passes for 3 October: ask by email.

info@thezao.com

---

## Sources (not rendered)

| Claim | Source |
|---|---|
| Date, venue, free, Black Moon next door | `src/content/festival.ts` |
| Music starts at noon | Zaal, typed 27 Aug 19:3x |
| Battlers and MC | Zaal, typed 27 Aug 19:3x; `src/app/team/plan/page.tsx` DAY[1] |
| The day, one venue at a time, WaveWarZ four to six | `src/app/program/page.tsx` BLOCKS |
| Evening shape: DJ set from six, live music to close; no changeover DJ | Zaal, typed 27 Aug 20:0x (running order; no DJ Aquavantes). PRODUCTION's ros-v2 supersedes when it lands |
| Tent, Wallace Events | `docs/plans/production-plan-2026-10-03.md` section 4 |
| Art of Ellsworth, Maine Craft Weekend | `src/app/page.tsx:486,495` |
| ZAO Festivals, events arm of The ZAO | gdoc Start Here (`docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md`) |
| 20+ countries, music first / community / technology | `src/app/onepagers/overview/page.tsx` PILLARS |
| Lyons Den public | `src/app/page.tsx:397`. Werb is also on that line but is not fully confirmed (Zaal, typed 27 Aug 20:4x); not repeated here |
| WaveWarZ 1,452, 27 Aug | `docs/sponsor/deck-2026-10-03.md` slide 6 |
| Partners | `src/app/page.tsx:101-112, 546-548` |
| PALOOZA, CHELLA, ZAOville | deck slide 3; `src/app/llms.txt/route.ts` |
| Founder lives in Ellsworth | deck slide 4 |
| Acadia 4M, Historic Register, Heart of Ellsworth 28 events / 50+ sponsors | `src/app/page.tsx:261-264` |
| The measurement | production plan section 7 |
| Badge files, Candy credit | `docs/brand/README.md` |
| info@thezao.com | deck slide 12 |
