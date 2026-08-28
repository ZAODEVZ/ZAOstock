# Design audit - zaostock.com - 2026-08-27 (before-state)

Mode: standard, 13 routes. Evidence: served HTML from `curl` (see `README.md`
in this directory for why there are no screenshots). Calibrated against
`DESIGN.md`, which adopts Candy's ZAOstock 26 identity; the live site is the
pre-rebrand identity, so every colour and type finding below is "the old
brand", not a mistake inside the old brand.

## Headline

- **Design score: D+.** Solid bones (one H1 per page, sensible viewport meta,
  `motion-reduce` present on the homepage), pulled down by two brands, stale
  facts on public pages, a homepage that will not settle, and no images.
- **AI slop score: C.** Not purple, not gradient-buttoned, and the copy has a
  voice. But it centres a lot, rounds everything the same, and the homepage is
  fourteen H2s of equal weight.

## First impression

Read from the served text, not a render, so this is what a screen reader or a
crawler gets rather than what a sponsor sees.

- The site communicates **effort and community** - 1,199 words on the
  homepage, fourteen sections, a team, partners, a crowdfunding round, three
  sponsor tracks - and **uncertainty about what it wants you to do first**.
- I notice the H1 is `ZAO stock` split across two elements, that the primary
  mark (the red badge) is nowhere in the HTML, and that there are **zero `<img>`
  tags on any of the thirteen routes**. A music festival with no photograph.
- The first three things the eye would go to, from source order: the H1, the
  fact strip (`12 PM - 6 PM`), the `$50 Pro Ticket` button. The third is not
  the action a sponsor or the City needs.
- One word: **crowded**.

## Inferred design system (what is actually served)

- **Fonts:** Space Grotesk (display, via `next/font`), JetBrains Mono (eyebrows,
  labels). Two families. Fine in itself; neither is in the delivered brand.
- **Colours, homepage, by occurrence in the HTML:** `#f5a623` 216, `#0d1b2a` 53,
  `#ffd700` 17, `#0a1628` 9, `#0f1f33` 6, `#1a4d3a` 2. `/sponsor` adds
  `#22c55e` 16 and `#818cf8` 16 - a green and an indigo that appear nowhere
  else. Dark navy ground, amber accent, cool greys (`text-slate-*`,
  `text-gray-*`) throughout. Warm accent on cool neutrals.
- **Heading scale:** every route has exactly one H1. `/program` has an H1 and no
  H2 at all (256 words under one heading). `/` has 14 H2s and 2 H3s.
- **Radius:** `rounded-xl` 44 times on `/sponsor`, 56 on `/ellsworth`, 18 on
  `/donate`; `rounded-full` for pills. One radius on everything.
- **Motion:** `animate-` 6 on `/`; `transition-all` 12 on `/donate`, 1 on `/`;
  `backdrop-blur` on every route (the sticky bar). The homepage components in
  source are an animated radial gradient (22s loop), a noise overlay, tilt
  cards, a tag marquee and a pulsing scroll cue.
- **Alignment:** `text-center` 17 on `/sponsor`, 17 on `/donate`, 11 on
  `/sponsor/deck`, 6 on `/`.

## Findings

Impact: high drops a category one grade, medium half a grade, polish none.

### F-001 - Two identities are live at once. HIGH · Colour, Hierarchy
The delivered brand (`docs/brand/`, 2026-08-21) is paper, ink, red, gold,
denim, olive, Boogaloo and Rubik. The site is navy, amber, Space Grotesk. The
badge that every poster and the deck will carry does not appear in the HTML.
Candy's README says the two must not mix; right now the site is 100% the old
one, which is at least consistent, but the email that goes out points at a
poster and a site that do not match. **Fix:** the redesign. There is no
CSS-only version of this.

### F-002 - The homepage still sells the pre-23-August day. HIGH · Content
Served text on `/`: `Time 12 PM - 6 PM` and "The bar can also host performances
during the 12 PM - 6 PM window, which opens up a second stage there alongside
the main". `/pitch`, `/sponsor/deck` and `/onepagers/overview` list Black Moon
as "Indoor second stage + official after-party". The one-venue-at-a-time
decision (23 Aug), the noon start (Zaal, 27 Aug) and the 6pm walk next door
are on this branch and the marketing branch but not on `main`. Meanwhile
`src/content/festival.ts` on this branch reads `11 AM - 6 PM`, which is also
wrong now. **Fix:** noon everywhere, one venue, per the spec.

### F-003 - Numbers disagree with the deck. HIGH · Content
`/sponsor` and `/sponsor/deck` say `795` WaveWarZ battles and `90+` weekly
sessions; the deck (27 Aug) says 1,452 and 100+. `/musicians` says "Target
200-400 in person, 1K+ via livestream"; Zaal locked 200-250 and 1,000 on
27 Aug. `/sponsor/deck` and `/pitch` price three tiers at `$500+`, `$1,000+`,
`$5,000+`; the deck says every price is UNSET and the ladder was killed on
27 Aug. A sponsor who reads the site and then the deck sees two stories.
**Fix:** one source, `src/content/festival.ts`, extended; see the spec.

### F-004 - `/press` is a 404 and the paper has been told to look there. HIGH · Content
`docs/marketing/press-kit.md` (marketing lane) is written for `/press`; the
Google Doc already sends The Ellsworth American to it. Served: `Not found |
ZAOstock`, "Lost the beat." **Fix:** build `/press` first among the new routes.

### F-005 - Fourteen equal sections. MEDIUM · Hierarchy
The homepage runs hero, facts, countdown, Black Moon, join, lineup, doors,
location, stats, team, partners, Pro Ticket, sponsors, in one rhythm at one
weight, 1,199 words. Nothing tells a first-time visitor which three matter.
**Fix:** the spec cuts the homepage to seven sections and pushes the rest to
their own routes.

### F-006 - Continuous animation with no purpose. MEDIUM · Motion, Performance
An animated gradient on a 22-second loop, a marquee, tilt-on-hover cards and a
pulsing scroll cue, all on the page a sponsor opens first. `motion-reduce`
variants exist, which is good, but the default experience moves constantly and
communicates nothing. `transition-all` is used 12 times on `/donate`. **Fix:**
delete `AnimatedGradient`, `TagMarquee`, `TiltCard`, `ScrollEyebrow`; list
transitioned properties explicitly.

### F-007 - Off-palette accents on the sponsor page. MEDIUM · Colour
`#22c55e` and `#818cf8`, sixteen uses each, only on `/sponsor`. Two colours
that exist on one page look like a template's defaults. **Fix:** gone with
F-001; the new palette has olive and denim for exactly this job.

### F-008 - Centred text and one radius. MEDIUM · Layout, AI slop
`text-center` 17 times on `/sponsor` and `/donate`; `rounded-xl` on 44 and 56
elements respectively. Everything the same shape at the same alignment reads
as generated. **Fix:** DESIGN.md's radius hierarchy (8/14/18/pill) and
left-aligned body text with one centred hero at most.

### F-009 - No images, no mark, no people. MEDIUM · Hierarchy, Content
Zero `<img>` on thirteen routes. Team tiles, past-event cards and the hero all
render as colour blocks and initials. The badge exists in `public/brand/` and
is not used. **Fix:** the badge in the hero and footer on every page; ZAOville
and ZAO-CHELLA stills on `/festivals` when selected (deck slide 3 asset gap).

### F-010 - The homepage would not reach idle in three renderers. HIGH · Performance as design
Recorded in `README.md` beside this file. Two of the three were the user's own
Chrome. Whether the cause is the animation loop, the analytics beacon or an
embed, a page that a real browser cannot settle is a page a phone on a
Franklin Street sidewalk will struggle with. **Fix:** F-006 plus a re-test
after the redesign; the after-state must include a `perf` reading.

### F-011 - Sticky bar and skip link use raw hex. POLISH · Consistency
`focus:bg-[#f5a623]` on the skip link, `#0a1628/85` on the sticky bar. Once
tokens exist these become `bg-cta-primary`. **Fix:** part of the theme move.

### F-012 - `/program` has no H2s. POLISH · Typography
One H1, 256 words, four time blocks rendered without headings. Fine visually,
poor for a screen reader and for the "share one link" goal. **Fix:** H2 per
venue block in the spec.

## Grades

| Category | Weight | Grade | Why |
|---|---|---|---|
| Visual hierarchy | 15% | D | F-001 high, F-005 medium, F-009 medium |
| Typography | 15% | B | Two families, one H1 per page; F-012 polish only |
| Spacing and layout | 15% | C | F-008 medium; scale otherwise consistent |
| Colour and contrast | 10% | D | F-001 high, F-007 medium |
| Interaction states | 10% | not measured | Needs a render |
| Responsive | 10% | not measured | Needs a render |
| Content and microcopy | 10% | D | F-002, F-003, F-004 high |
| AI slop | 5% | C | F-008 medium; no gradients, no icon circles, copy has a voice |
| Motion | 5% | D | F-006 medium, F-010 high |
| Performance feel | 5% | D | F-010 high |

Weighted over the measured categories: **D+**. AI slop standalone: **C**.

## Quick wins (under 30 minutes each, before the redesign lands)

1. `src/content/festival.ts` window to `Noon - 6 PM`, `date` stays
   `12:00:00-04:00`, JSON-LD `startDate` in `layout.tsx` back to `12:00`. This
   branch currently says 11 AM and the live site says 12 PM for the wrong
   reason.
2. `/musicians` EntryPage copy: `200-250 in person, 1,000 online`.
3. `/sponsor`, `/sponsor/deck`: WaveWarZ `795` to `1,452 (27 Aug 2026)` and
   `90+` to `100+`, with a re-pull note in the source.
4. `/sponsor/deck`, `/pitch`: strip the three prices; tier names stay.
5. `/press`: render `docs/marketing/press-kit.md` through the existing
   `react-markdown` path used by `/onepagers/[slug]`.

## Baseline for regression

```json
{
  "date": "2026-08-27",
  "url": "https://zaostock.com",
  "designScore": "D+",
  "aiSlopScore": "C",
  "categoryGrades": {"hierarchy":"D","typography":"B","spacing":"C","color":"D","interaction":"unmeasured","responsive":"unmeasured","content":"D","aiSlop":"C","motion":"D","performance":"D"},
  "findings": ["F-001","F-002","F-003","F-004","F-005","F-006","F-007","F-008","F-009","F-010","F-011","F-012"]
}
```
