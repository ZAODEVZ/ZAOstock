# ZAOstock 26 — brand assets and design system

**Designed by Samantha "Candy" — CandyToyBox.** Delivered 2026-08-21 as the
"ZaoStock — 2026 Rebrand Package". Everything in this directory and in
`public/brand/` is her work. Credit her on any surface it appears on
(`.claude/rules/credit-attribution.md`).

The full editable design system lives at
`https://claude.ai/design/p/713470f8-bba5-4ce7-a400-2812c579c2af` — that is the
source of truth for the system itself. This directory is the copy the repo can
build against.

## Why this is committed rather than linked

It arrived as a folder in `~/Downloads` and sat there for two days. Nothing in
this repo referenced it — grep for `zaostock26`, `badge_official` or `D2402A`
returned nothing on 2026-08-23. A design system that exists on one laptop is one
`rm` from gone, and cannot be built against
(`.claude/rules/vanishing-dependencies.md`).

## THIS IS A REBRAND, NOT AN ADDITION

Candy's README is explicit: the retro-poster identity **replaces the prior
Midnight Navy / Festival Yellow look**.

**The live site has not been migrated.** Treat every existing colour and mark on
zaostock.com as the old brand until someone does that work deliberately. Do not
mix the two — a page carrying half of each reads as a mistake rather than a
transition.

## The logo

| File | What it is | Use |
|---|---|---|
| `public/brand/logos/zaostock26_badge_official.png` | **The red badge. This is the primary mark.** Circular, retro-poster, ZAO dove on a guitar neck, "OCTOBER 3RD MAINE", "WHOLE DAY OF ART, PEACE & MUSIC" | Default everywhere |
| `public/brand/logos/zaostock26_badge_bw_final.png` | Mono / black-and-white variant | Single-colour print, stamps, anywhere colour cannot reproduce |

There is no separate "red logo" file — **red IS the official badge.** If someone
asks for the red one, it is `zaostock26_badge_official.png`.

Lockup variants (colour / mono / arrangement) are shown in Candy's
`ZAOstock Logo Lockups.html`, which lives in her delivery folder rather than
here because it is a viewer, not an asset.

## Palette

From Candy's `tokens.css`, kept verbatim at `tokens.reference.css`.

| Token | Hex | |
|---|---|---|
| `--red-300` | `#E8735C` | |
| **`--red-500`** | **`#D2402A`** | **the badge red — the brand's primary** |
| `--red-600` | `#B93826` | |
| `--red-700` | `#9C2F1E` | |
| `--gold-300` | `#F2D48A` | |
| `--gold-400` | `#E5AC3B` | |
| `--gold-500` | `#C98F2A` | |
| `--gold-600` | `#A8721C` | |
| `--denim-300` | `#7FA8C7` | |
| `--denim-400` | `#2E6494` | |
| `--denim-500` | `#245078` | |
| `--denim-600` | `#1B3C5C` | |
| `--olive-300` | `#A4AF6E` | |
| `--olive-400` | `#7C8A3D` | |
| `--olive-500` | `#636F2F` | |
| `--paper-100` | `#F2E6D3` | ground |
| `--paper-200` | `#FAF3E6` | ground, lighter |
| `--ink-950` | `#241E15` | text |

Note the ground is **paper**, not white, and the text is **ink**, not black.
That is what makes it read as a printed poster rather than a web page. Using
`#fff` and `#000` against these will look wrong even though the hexes are
"close".

## Icons

Three, in `public/brand/icons/`, all in the same hand-drawn poster style:

- `location-lighthouse-07.png` — place / Maine
- `community-hands-06.png` — community
- `good-vibes-dove-06.png` — the dove, which is also the mark in the badge

## The rest of Candy's package, not committed here

Her folder also contains a **complete working homepage** — plain HTML/CSS/JS, no
build step, at `website/index.html`. It is not in this directory because this
repo is a Next.js app and dropping a parallel static site into it would create
exactly the two-sources problem the rebrand is meant to end.

**It should not be thrown away either.** It is the reference implementation of
the new identity, and whoever rebuilds the site should read it before starting.
It currently lives only in `~/Downloads/ZaoStock for Zaal/`.

**Open question for Zaal:** commit her static site somewhere (its own repo, or a
`reference/` directory here), or hand it to whoever builds the real site? Right
now the answer is "it is in Downloads", which is not an answer.

## Credit

Samantha (Candy), CandyToyBox — design system, badge, icons, and the reference
homepage. Any public surface using these carries her credit.
