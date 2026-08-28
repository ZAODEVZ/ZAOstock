# Partner logo strip - spec for SITE

Written 2026-08-28 (Friday). Lane: MARKETING; SITE implements. Judgment calls
below are proposals for SITE and DESIGN to accept or change; the facts (which
partners, what exists) are not.

## Which logos, in order

The order is `src/content/site.ts` PARTNERS as of 28 Aug, which is venue and
host first, then the format and support partners. Bomb Squad is a partner
(24 Aug standup) and is not on the site list yet; it takes slot 9 when SITE
adds it.

| # | Partner | File (slug) | Logo exists | Where today |
|---|---|---|---|---|
| 1 | Town of Ellsworth | `town-of-ellsworth` | no - due Fri 29 Aug, ask to Roddy | - |
| 2 | Black Moon Public House | `black-moon` | yes, 2 versions | Drive `Partners/` |
| 3 | Star 97.7 | `star-977` | yes, 2 versions | Drive `Partners/` |
| 4 | Wallace Events | `wallace-events` | yes, 2 versions | Drive `Partners/` |
| 5 | WaveWarZ | `wavewarz` | yes | Drive `Partners/` |
| 6 | COC Concertz | `coc-concertz` | yes | Drive `Partners/` |
| 7 | ENTERACT | `enteract` | no - due Fri 29 Aug | - |
| 8 | Web3Metal | `web3metal` | no - due Fri 29 Aug | - |
| 9 | Bomb Squad | `bomb-squad` | yes, 2 versions (logo + transparent emblem) | Drive `Logos/BS-logo.png`, `Logos/bmbsqd-emblem-removebg-preview.png` |

`public/partners/` holds only a README today. MARKETING copies the Drive files
in once it has Drive access; SITE sets `logoSrc` per row. Heart of Ellsworth
is not on the strip until confirmed in writing (`site.ts` comment).

## Files

- Path: `public/partners/<slug>.svg` preferred; `public/partners/<slug>.png`
  otherwise. One file per partner is what `logoSrc` expects; if a partner
  supplies colour and mono, keep the mono as `<slug>-mono.svg|png` for the
  print strip and use one on the site.
- PNG: transparent background, at least 400px tall (2x of the largest render
  below), trimmed to the mark with no padding.
- SVG: no embedded raster, no external fonts, viewBox set, width and height
  attributes present so the `<img>` can carry them (DESIGN.md: every image has
  width and height).
- Keep each under 60 KB. Do not ship a partner's source file.

## Rendering on the site

Proposal, matched to DESIGN.md's poster-flat system:

- Each partner is a `Card` (paper-200, 2px ink border, 14px radius, hard
  offset shadow) with the logo above the name and role, both in Space Mono.
  Text tiles stay as they are today when no file exists; a logo never replaces
  the name.
- Logo box: fixed height **48px** at 960px and up, **40px** under 960; width
  auto, `max-width: 160px`, `object-fit: contain`, centred. Height-locked so
  wordmarks and badges read at the same visual weight.
- Grid: 4-up at 960 and above, 2-up from 640 to 960, 1-up under 640 - the
  `InfoStrip` breakpoints. Nine partners on a 4-up grid leaves one empty slot
  in the last row; SITE may centre the last row or run 3-up. Do not add a tenth
  tile to fill it.
- Colour: render the partner's colour logo as supplied. Do not grayscale;
  the ink-on-paper system already makes them read as one strip, and a
  desaturated Town seal is a courtesy no one asked for.
- `alt="<Partner name> logo"`, `loading="lazy"`, `width` and `height` from
  the file.
- No hover state on the logo; the card's 1px lift is enough. No link out unless
  the partner asks.

## The print strip (poster and backdrop) - for Candy, not SITE

Different rules, noted here so the two do not drift:

- Vector only. Print needs vector; PNG is a fallback for the site, not for
  the sheet.
- Single-colour ink versions for the backdrop (single-colour print). Colour
  on the poster if the design allows.
- Same order as above. Equal height, not equal width.
- Nine slots if Bomb Squad is on the sheet; six logos print if the three due
  Friday miss (Zaal to Candy, `docs/drafts/msg-candy-2026-08-27.md`).
- No sponsor logos: nobody is signed.

## What SITE needs to do, in order

1. Add Bomb Squad to `src/content/site.ts` PARTNERS (role "crew, content and
   merch", poc Dcoop - both from the gdoc Partners list).
2. Render the logo box per the rules above, keyed on `logoSrc`.
3. Set `logoSrc` for each partner as its file lands in `public/partners/`.
4. Leave the text tile as the fallback; never a broken image, never a
   placeholder box.

## Sources

- `src/content/site.ts` PARTNERS and the gating comment (origin/main 28 Aug)
- `public/partners/README.md`
- `docs/marketing/partner-logos.md` - the tracker, Drive locations, the three asks
- `DESIGN.md` - Layout, Components (`Card`, `InfoStrip`), Images
- `docs/design/redesign-2026-08-28.md` Home section 6
- gdoc snapshot, Links and Assets "Every visual asset we have" (Bomb Squad files)
