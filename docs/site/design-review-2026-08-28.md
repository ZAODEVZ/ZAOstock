# Design review - zaostock.com on ws/site-fix-0828 (2026-08-28, 20:3x)

Run by the SITE terminal against the local dev build of this branch
(`next dev --webpack -p 3117`, commit `2909765` plus the SITE pane's
uncommitted `site.ts`), with Playwright 1.58 headless Chromium at 375 and
1280 wide, full page, five routes: `/`, `/program`, `/partners`, `/press`,
`/sponsor`. Screenshots in `.gstack/design-reports/screenshots/` (gitignored).
The gstack `browse` binary hung for three minutes on this Mac (its Playwright
browsers were missing from `~/Library/Caches/ms-playwright`; installed
chromium-1208 to fix it) and the Playwright MCP wants a Chrome extension, so
the numbers below come from a 60-line Playwright script, not from `$B`.

DESIGN.md (2026-08-27) is the contract. Nothing here proposes a redesign;
the identity, tokens, type scale and components are as specified.

## First impression (1280, home)

The site communicates a printed poster for a small-town festival: paper
ground, ink outlines, one red, the badge on the right. The eye goes to the
badge, then `ZAOstock`, then the red RSVP. One word: stapled. It reads as
designed, not generated: no gradients, no icon circles, no centred body text.

## Measured

| Route | 375 scrollWidth | 1280 scrollWidth | Console errors | Fonts |
|---|---|---|---|---|
| `/` | 375 | 1280 | 0 | Rubik, Boogaloo, Space Mono |
| `/program` | 375 | 1280 | 0 | same |
| `/partners` | 375 | 1280 | 0 | same |
| `/press` | 375 | 1280 | 0 | same |
| `/sponsor` | 375 | 1280 | 0 | same |

Heading scale on every route: H1 56px (home display 83px), H2 40px, H3 22px,
matching the DESIGN.md table. No skipped levels. Every `<img>` carries width
and height. No element extends past the viewport at either width. The only
"small target" hits are the header text links (16px tall by design, hamburger
under 640) and the skip link (1x1 until focused).

## Findings

| # | Impact | Route | Finding | Owner | Status |
|---|---|---|---|---|---|
| 1 | High | `/partners`, `/press`, `/` strip | Three partner logos are wired to `.jpg` files: Star 97.7 renders a white rectangle on the paper card, Black Moon renders the black-disc version. The strip spec asks for transparent marks; keyed PNGs of all six are in `public/partners/*.png` (under 60 KB, 400px tall). | SITE terminal | fixed in 1c01302: logoSrc points at the PNGs, jpgs removed |
| 2 | Medium | `/` partners | Home strip is still nine text tiles on a 4-up grid, leaving Bomb Squad alone on row three. Render `PartnerTile` (logos now exist) on a 3-up grid: nine tiles, three rows, no orphan. | SITE terminal | fixed in 1c01302: PartnerTile, 3-up, link to /partners |
| 3 | Medium | `/press` kit | Partner names truncated at 1280 on the 3-up logo rows ("Black Moon Public Hou..."). | SITE terminal | fixed: 2-up rows, names wrap |
| 4 | Medium | `/sponsor` | Still "Five ways in" with "Ask" in five cards. The 28 Aug brief wants the four deliverables and "packages on request", plus attendance 200-250 / about 1,000. `DELIVERABLES` and `ATTENDANCE` already exist in the pane's `site.ts`. | SITE terminal | fixed in 1c01302: four surfaces, packages on request, attendance stats |
| 5 | Polish | `/program` | Nothing structural. The venue key on the right of the hero is two cards; on 375 they stack under the lede, fine. | - | none |
| 6 | Polish | all | The Next dev "N" indicator appears bottom-left in every screenshot; dev only. | - | none |

AI-slop check: no purple, no gradient, no three-up icon grid (the "Pick a
door" cards carry an eyebrow and no icon), no centred body, one radius scale
(8/14/18/pill), no blobs, no emoji, no coloured left borders, no "Welcome to".
Grade: A. Design score: A- with findings 1 to 4 landed; the remaining gap is photography, which does not exist yet.

## What this branch changes, by route

- `/program`: run of show v7 - noon intro, about 30 minutes per act, MC
  changeovers, the 15:05 stretch marked Open, WaveWarZ 16:00-18:00 with the
  story at 16:00, DJ set 18:00-20:00, live set 20:00-22:00 at Black Moon. Only
  Lyons Den and the WaveWarZ battlers named; "Lineup reveal 1 September".
- `/partners`: new. Six logos, three "Logo coming" tiles, sponsor pointer.
- `/press`: the kit block - both badges with download, six partner logos with
  download, contact.
- Footer: Partners link.
