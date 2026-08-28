# Design System - ZAOstock

Written 2026-08-27 by the DESIGN lane, from `/design-consultation` run against
this repo. This file is the contract SITE builds against. It adopts the
**ZAOstock 26 retro-poster identity** delivered by Samantha "Candy" of
CandyToyBox on 2026-08-21 (`docs/brand/README.md`, `docs/brand/tokens.reference.css`)
and extends it with the decisions her package left open: the type scale on the
web, the layout grid, motion, dark mode, and what to do with the old brand.

Every value below is on disk. Where a fact is not on disk it says UNSET.

Credit Candy on any public surface that carries the badge, the icons or this
system (`docs/brand/README.md`, "Credit").

## Product context

- **What this is:** the public website for ZAOstock, a free one-day artist-built
  music festival on the Franklin Street Parklet, downtown Ellsworth, Maine,
  Saturday 3 October 2026, produced by ZAO Festivals, the events arm of The ZAO.
- **Who it's for, in order:** a sponsor or partner deciding whether to say yes;
  a local or visitor deciding whether to come; a musician or visual artist
  deciding whether to apply; the City and the press checking a fact. Every one
  of them arrives from a single email link and needs to be able to forward it.
- **Space:** small-town free street festival plus an online music community.
  Peers a sponsor will compare against: Art of Ellsworth, Maine Craft Weekend,
  Heart of Ellsworth event pages.
- **Project type:** marketing site with forms. The `/team/**` dashboard is an
  internal tool and is out of scope for this system until after 3 October.

## Aesthetic direction

- **Direction:** Retro festival poster. Screen-printed paper, hard ink outlines,
  one loud red, flat colour, no gradients, no glass.
- **Decoration level:** intentional. One grain texture on paper surfaces and
  cards, at low opacity. Nothing else decorative. If a section feels empty it
  needs a photograph or a fact, not a shape.
- **Mood:** a poster stapled to a telephone pole on Main Street that you would
  take home. Warm, hand-made, confident, a little loud. It should read as
  printed before it reads as a website.
- **Reference:** Candy's reference homepage at
  `~/Downloads/ZaoStock for Zaal/website/index.html` (not in this repo, see
  `docs/brand/README.md`). Copy the visual system from it. **Do not copy its
  words** - it carries facts that are wrong or retired (a 501(c)(3) fiscal
  sponsor via Fractured Atlas, a 12-9 PM window, "WebOMetal", "ZaoStock",
  PALOOZA as a park pop-up). Facts come from `src/content/festival.ts`, the
  press kit and the deck, per `docs/design/redesign-2026-08-28.md`.

### What this replaces

The live site is the previous identity: Midnight Navy `#0A1628` / `#0D1B2A`
ground, Festival Yellow `#F5A623` accent, `#FFD700` hover, Space Grotesk plus
JetBrains Mono, an animated radial gradient behind the hero, a noise overlay,
tilt cards and a tag marquee. Measured 2026-08-27 from the served HTML:
`#f5a623` appears 216 times on the homepage alone, and `/sponsor` adds two
off-palette accents (`#22c55e`, `#818cf8`). None of that survives. Candy's
README is explicit that the rebrand **replaces** this look and that mixing the
two reads as a mistake; the migration is all-or-nothing per route.

## Typography

Three families, all on Google Fonts, all loaded through `next/font/google`
exactly as the current two are in `src/app/layout.tsx` (swap, subset latin,
CSS variables). No new loading mechanism.

- **Display:** **Boogaloo**, weight 400 only. Every heading, every big number.
  It is the badge's lettering translated to text, so the site and the poster
  speak in one voice. It is a display face: never below 22px, never for a
  paragraph, never bold (it has no bold; the browser would fake one).
- **Body and UI:** **Rubik** 400/500/600/700/800. Round-cornered grotesque that
  sits naturally next to Boogaloo and stays legible at 14px on a phone in
  sunlight. Buttons and nav are Rubik 700 uppercase with `0.04em` tracking.
- **Eyebrow, label, data:** **Space Mono** 400/700. Eyebrows and small labels
  are Space Mono 700 uppercase `0.12em` tracking. Times in the program and
  every table of figures use Space Mono with `font-variant-numeric: tabular-nums`
  so columns line up.
- **Code:** Space Mono. There is no code on the public site.

### Scale

Candy's tokens give the sizes; the line-heights and the mobile step are the
additions. rem = 16px.

| Token | Size | Line-height | Use |
|---|---|---|---|
| display | `clamp(2.75rem, 2rem + 4vw, 5.5rem)` (44-88px) | 1.02 | Homepage H1 only |
| h1 | 3.5rem / 56px (mobile 2.75rem / 44px) | 1.05 | Page H1 |
| h2 | 2.5rem / 40px (mobile 2rem / 32px) | 1.05 | Section title |
| h3 | 1.75rem / 28px | 1.1 | Card and sub-section title |
| h4 | 1.375rem / 22px, Rubik 800 | 1.2 | Tier and list headings |
| body-lg | 1.125rem / 18px | 1.5 | Ledes, first paragraph of a section |
| body | 1rem / 16px | 1.5 | Everything |
| small | 0.875rem / 14px | 1.45 | Notes, captions, table cells |
| eyebrow | 0.75rem / 12px, Space Mono 700, uppercase | 1.2 | Labels. Never smaller |

Headings get `text-wrap: balance`. Body paragraphs get a measure of 60-70
characters (`max-width: 65ch`). Tracking is `-0.01em` on display and h1/h2,
none on body, `0.04em` on buttons, `0.12em` on eyebrows. No letterspacing on
lowercase text anywhere.

## Colour

- **Approach:** balanced, one loud primary. Paper is the ground, ink is the
  text, red is the only thing that asks to be clicked, gold marks, denim links,
  olive is the fourth poster ink and stays rare.

### Primitives (from `docs/brand/tokens.reference.css`, verbatim)

| Token | Hex | Role |
|---|---|---|
| `--red-500` | `#D2402A` | **Primary.** The badge red. Primary CTA, stat values, the accent word in the H1 |
| `--red-300` | `#E8735C` | Red on ink surfaces |
| `--red-600` | `#B93826` | Primary button ground (see Semantic) |
| `--red-700` | `#9C2F1E` | Primary button hover and press |
| `--gold-400` | `#E5AC3B` | Gold badge, focus ring, the "stock" in the wordmark |
| `--gold-300` | `#F2D48A` | Gold tint |
| `--gold-500` | `#C98F2A` | Gold hover |
| `--gold-600` | `#A8721C` | Gold text on paper (the only gold that passes for text) |
| `--denim-400` | `#2E6494` | Links, section eyebrows, denim badge |
| `--denim-300` | `#7FA8C7` | Denim on ink surfaces |
| `--denim-500` | `#245078` | Link hover |
| `--denim-600` | `#1B3C5C` | Link pressed, denim text on paper |
| `--olive-400` | `#7C8A3D` | Fourth ink. Program venue key, success |
| `--olive-300` | `#A4AF6E` | Olive on ink surfaces |
| `--olive-500` | `#636F2F` | Olive text on paper |
| `--paper-100` | `#F2E6D3` | **Page ground** |
| `--paper-200` | `#FAF3E6` | Cards, header, lighter ground |
| `--ink-950` | `#241E15` | **Text.** Borders. Shadows. The inverse surface |

Never `#FFFFFF` for a surface and never `#000000` for text. Those are the two
mistakes that make the poster look like a web page.

### Semantic

- `--surface-page: paper-100`, `--surface-card: paper-200`,
  `--surface-inverse: ink-950`.
- `--text-primary: ink-950`; `--text-secondary: ink-950 at 70% over paper-100`
  (`#625A4E`, 5.5:1); `--text-muted: ink-950 at 66% over paper-100` (`#6A6256`,
  4.9:1) for eyebrows and captions, which are 12px bold and so need the full
  4.5:1. Candy's tokens mix at 62% and 46%; those measure 4.3:1 and 2.8:1 and
  are raised here.
- `--border-hairline: ink-950 at 60%`; `--border-strong: ink-950`.
- `--cta-primary: red-600 #B93826 / text paper-200`, hover and press
  `red-700`. Candy's token puts the primary on red-500; paper on red-500
  measures 4.2:1, under the 4.5:1 a 14-16px bold label needs, and red-600
  measures 5.2:1. Red-500 stays the brand red everywhere it is not carrying
  small text: stat values, the H1 word, badges, the inverse card's shadow.
- `--cta-secondary: paper-200 with ink border`; `--link: denim-400`.
- `--focus-ring: 0 0 0 3px gold-400 at 45%` on every focusable element.
  Never `outline: none` without it.
- **Success** olive-400, **warning** gold-500, **error** red-500, **info**
  denim-400. Always paired with a word or an icon, never colour alone, and
  always as a chip fill with ink or paper text on it, never as text.

### Contrast (WCAG 2 relative luminance, computed from the hexes on 2026-08-27)

| Pair | Ratio | Verdict |
|---|---|---|
| ink-950 on paper-100 | 13.4:1 | AAA. Body text |
| paper-200 on ink-950 | 15.0:1 | AAA. Inverse card |
| paper-200 on red-600 | 5.2:1 | AA. Primary button |
| paper-200 on red-500 | 4.2:1 | Fails AA for a button label. Red-500 is not a text ground |
| denim-400 on paper-100 | 5.1:1 | AA. Links |
| text-secondary (70% ink) on paper-100 | 5.5:1 | AA. Ledes, secondary copy |
| text-muted (66% ink) on paper-100 | 4.9:1 | AA. Eyebrows, captions |
| ink-950 on gold-400 | 8.1:1 | AAA. Gold badge |
| gold-600 on paper-100 | 3.3:1 | Large text only. The H1 accent word at 44px+ |
| gold-400 on paper-100 | 1.7:1 | Never as text |
| olive-400 on paper-100 | 3.1:1 | Large text and UI only |
| olive-500 on paper-100 | 4.4:1 | Still under 4.5; olive is a chip fill with ink text (4.4:1 on olive-400, 3:1 on olive-500), not a text colour |
| red-300 on ink-950 | 5.5:1 | AA. Red on the inverse card |

### Dark mode

**Not for 3 October.** The identity is paper-first and the reference site has no
dark theme. Ship one look, set `color-scheme: light` on `html`, and give `body`
an explicit `background: var(--surface-page)` so the OS theme cannot leak in.
If dark mode is ever built: ground becomes ink-950, text paper-200, red steps
to red-300, denim to denim-300, gold stays gold-400, shadows become paper-200
offsets. Surfaces stay flat; no elevation by lightness.

## Spacing

- **Base unit:** 4px.
- **Density:** comfortable.
- **Scale:** 1(4) 2(8) 3(12) 4(16) 5(24) 6(32) 7(48) 8(64), plus 9(96) for the
  gap between the hero and the first section on desktop.
- Section padding 48px top and bottom on desktop, 32px on mobile, separated
  by a 1px hairline, never by a change of background colour. Related items 8-16px
  apart; unrelated sections 48px+.

## Layout

- **Approach:** grid-disciplined, poster-flat. Asymmetry comes from a
  `1.3fr 1fr` two-column split (text left, artefact right) and the hero's
  `1fr 360px` split with the badge on the right. Nothing overlaps.
- **Grid:** 12 columns, gutter `clamp(20px, 5vw, 64px)`, gap 16-24px.
- **Breakpoints:** 375 (mobile), 640 (Candy's `--sm`), 960 (Candy's `--lg`),
  1200 content max. Two breakpoints in the reference; keep it to two.
- **Max content width:** 1200px. Body text never wider than 65ch.
- **Border radius:** sm 8px (inputs, icons), md 14px (cards, strips), lg 18px
  (dialogs, the hero badge frame), pill 999px (buttons, badges). Nested radius =
  outer minus gap.
- **Borders and depth:** every card and button has a 2-2.5px ink border. Depth
  is a **hard offset shadow**, `3px 3px 0 ink` at rest, `5px 5px 0 ink` for
  dialogs and the hero badge, no blur ever. Pressing a button moves it 2px
  down-right and removes the shadow, which is the whole press animation.
- **Header:** sticky, paper-200 at 92% with 8px blur, 2px ink bottom border,
  36px round badge crop plus Boogaloo wordmark on the left, six links plus one
  gold RSVP badge on the right, hamburger under 640px.
- **Images:** every image has `width` and `height`, `loading="lazy"` below the
  fold, the badge served as a resized WebP/AVIF at most 720px wide (source is
  1122x1402, 2.2MB; do not ship the source).

## Motion

- **Approach:** minimal-functional. The poster does not move.
- **Easing:** one curve, `cubic-bezier(.2,.8,.2,1)`, for everything. Enter
  ease-out, exit ease-in, move ease-in-out are all served by it at these
  durations.
- **Duration:** fast 120ms (press, hover), base 180ms (background, colour), and
  nothing longer. No page transitions.
- **Allowed:** button press translate, card hover 1px lift, colour change on
  hover, the countdown's numbers changing, the mobile nav opening.
- **Removed:** the animated hero gradient (22s loop), the tilt cards, the tag
  marquee, the scroll eyebrow pulse, the sticky action bar's slide. Measured
  2026-08-27: three headless renderers (gstack browse, Playwright, the Chrome
  extension) failed to reach idle on the live homepage; the redesign has zero
  continuous animation so that cannot recur.
- `prefers-reduced-motion: reduce` disables the two allowed transforms. Only
  `transform`, `opacity`, `background-color` and `color` are ever transitioned;
  never `all`.

## Components (the `zs-*` set, from `styles.css`)

Twelve primitives cover every public page. SITE implements them once as React
components using the same names and the tokens above; the page spec references
them by name.

| Component | Notes |
|---|---|
| `Button` primary / secondary / ghost, sm / md / lg | Pill, ink border, hard shadow. Primary red. Secondary paper. Ghost is an underlined denim text link |
| `Badge` gold / denim / outline | Space Mono, pill, 2px ink border |
| `Card` and `Card interactive` | paper-200, ink border, 14px radius, grain at 0.4, hover lifts 1px |
| `Stat` | Boogaloo value in red, Space Mono label |
| `SectionHeader` | denim eyebrow, Boogaloo h2, Rubik lede, max 760px |
| `Eyebrow` | Space Mono 12px 700 uppercase muted |
| `InfoStrip` | 4-up hairline grid, 2-up under 960, 1-up under 640 |
| `BorderedList` | dt/dd rows in a hairline frame |
| `Field` and `Input` | paper ground, ink border, gold focus glow, error text in red under the field |
| `Dialog` | scrim ink at 55% with 4px blur, 18px radius, 5px shadow |
| `Header` / `Footer` | as above |
| `Grain` | the `u-grain` after-element, paper surfaces only |

## Anti-patterns this system forbids

Purple or any gradient. Icons in coloured circles. A three-up grid of
icon-title-blurb cards. Centred body text. One radius on everything. Blobs,
waves, floating shapes. Emoji. Coloured left borders. "Welcome to", "Unlock",
"all-in-one". Equal-height section rhythm. Dark ground. Pure white. Pure black.

## Decisions log

| Date | Decision | Rationale |
|---|---|---|
| 2026-08-21 | Retro-poster identity, palette, three families, badge as primary mark | Candy's delivered rebrand package; `docs/brand/README.md` names it the source of truth |
| 2026-08-27 | Adopt Candy's system wholesale rather than propose a new one | A delivered system with a reference implementation beats a new proposal 37 days out; the consultation's job became closing its gaps |
| 2026-08-27 | Reject the reference homepage's copy | It carries a fiscal-sponsor claim (there is none), a 12-9 window, "WebOMetal", "ZaoStock", and past-event descriptions that contradict the deck |
| 2026-08-27 | No dark mode for 3 October | Paper-first identity, no dark reference, and one look is one less thing to verify |
| 2026-08-27 | Zero continuous animation | Live homepage failed to reach idle in three renderers; the poster is static by nature |
| 2026-08-27 | Gold-600 for the H1 accent word, not gold-400 | gold-400 on paper is 1.7:1; the reference uses it as text and it fails. Gold-600 is 3.3:1, large text only |
| 2026-08-27 | Primary button ground red-600, not red-500 | Paper on red-500 measures 4.2:1; a 14px bold label needs 4.5:1; red-600 measures 5.2:1 |
| 2026-08-27 | Secondary and muted text at 70% and 66% ink, not 62% and 46% | Candy's mixes measure 4.3:1 and 2.8:1 on paper; the raised values pass AA at 12px bold |
| 2026-08-27 | Fonts via `next/font/google`, tokens via Tailwind 4 `@theme` in `globals.css` | Glue-first: no new framework, no component library, theme is config |
| 2026-08-27 | ICM brand boxes UNSET | Both `useicm.com` URLs in the brief timed out from curl and WebFetch on 2026-08-27; nothing from them is in this file |

Agent defaults, not yet confirmed by Zaal or Candy: the dark-mode deferral, the
gold-600 substitution, the red-600 button ground, the raised text mixes, the h4
in Rubik 800, the 96px hero gap. Everything else is
Candy's or on disk.
