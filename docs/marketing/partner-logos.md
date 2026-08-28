# ZAOstock partner logo tracker

Written 2026-08-27 (Thursday), 37 days out. Lane: MARKETING.

**Six in, three due Friday 29 August.** The three ask messages are at the bottom,
one per owner. **DO NOT SEND** from this file - Zaal sends, or the named owner
does.

## Why this is the gate

The vinyl sponsor backdrop behind the performers needs every partner logo, and
Dcoop called that backdrop non-negotiable. The poster prints the week of
1 September and carries the partner strip. The deck's "here is who is already
in" slide is the same set of files. Three missing logos block all three.

Source: gdoc snapshot, Links and Assets tab, "Partner logos: the biggest gap"
(`docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md`).

## Spec, for every logo

- Vector (SVG, EPS or PDF) preferred. Print needs vector.
- If no vector exists: PNG, high resolution, transparent background.
- Both a colour and a single-colour (black or white) version if they have them.
- Drop location: the ZAOstock Drive folder, `Partners/` subfolder. Not a chat
  thread.
- Site copy: `public/partners/<slug>.png` in this repo. The homepage shows a
  partner's logo the moment the file exists and `logoSrc` is set, and hides the
  slot until then (`src/app/page.tsx:99-112`).

## The tracker

Status values: **IN** (file exists in Drive per the 24 Aug standup) · **DUE**
(asked, not received) · **UNDECIDED** (whether they are a partner at all).

| # | Partner | Role | Relationship owner | Logo status | In Drive | In repo `public/partners/` | Wired on site | Ask drafted |
|---|---|---|---|---|---|---|---|---|
| 1 | Black Moon Public House | Indoor evening + after party | Zaal (Steve Peer) | **IN** (2 versions) | yes | no | no | n/a |
| 2 | Star 97.7 | Local radio promotion | Zaal (Paul) | **IN** (2 versions) | yes | no | no | n/a |
| 3 | Wallace Events | Equipment + tenting | Zaal | **IN** (2 versions) | yes | no | no | n/a |
| 4 | WaveWarZ | Live music-battle format | Zaal | **IN** | yes | no | no | n/a |
| 5 | Bomb Squad | Crew, content, merch | Dcoop | **IN** (2 versions) | yes | no | no - **not in the site PARTNERS array** | n/a |
| 6 | COC Concertz | **IS a partner** (Zaal, typed 27 Aug 20:3x) - role line UNSET; not yet on the site list | UNSET | **IN** | yes | no | no - SITE request in DONE.md | n/a |
| 7 | Town of Ellsworth | Parklet venue | Zaal | **DUE Fri 29 Aug** | no | no | no | yes, below |
| 8 | ENTERACT | Production + operational support | FailOften | **DUE Fri 29 Aug** | no | no | no | yes, below |
| 9 | Web3Metal | Partnership integration + community surface | Shawn | **DUE Fri 29 Aug** | no | no | no | yes, below |

Notes on the rows:

- **"Six in" counts COC Concertz.** The gdoc lists eight partners and six logos
  in, and the six include COC Concertz, which is not on the site's partner list
  (`src/app/page.tsx:101-112` has seven names: Town of Ellsworth, Black Moon,
  Star 97.7, Wallace Events, WaveWarZ, ENTERACT, Web3Metal). Bomb Squad was
  resolved as a partner on 24 Aug and is also not on the site list. So the site
  is two partners behind the doc. **COC Concertz IS a ZAOstock partner** (Zaal, typed 27 Aug 20:3x), which
  settles the question the gdoc left open; its role line on the site is UNSET.
- **Zero files in the repo.** `public/partners/` holds only a README naming two
  expected files (`black-moon.png`, `star-977.png`). The six Drive files have
  not been copied over. Copying them is a marketing-lane write
  (`public/partners/**` is in this lane's write-set) but the Drive folder is not
  reachable from this worktree, so it did not happen today. Setting `logoSrc`
  is a SITE-lane write (`src/app/page.tsx`) - request logged in
  `.handoffs/DONE.md`.
- **Black Moon's site role still reads "Indoor second stage + official
  after-party."** That is two-stage language dropped on 23 Aug. SITE-lane fix;
  request logged in DONE.md.
- **Heart of Ellsworth is deliberately absent.** Chesnee Barney said on the
  13 Aug call that official-partner status and logo use must clear internally
  first. It appears nowhere until she confirms in writing
  (`src/app/page.tsx:102-104`). Do not ask them for a logo.
- Owners for rows 7-9 are from the gdoc Partners section (Team and Roles tab).
  The Town of Ellsworth contact for the logo specifically is **UNSET** - Roddy
  owns the parklet permits and the CITY lane owns every Roddy draft
  (`docs/drafts/roddy-*.md`), so the Town ask below is written to "the Town
  contact" and Zaal picks the recipient.

## What the three logos unblock, in order

1. The poster partner strip - Candy prints the week of 1 September.
2. The vinyl backdrop - print lead time UNSET, vendor UNSET.
3. Deck slide 8 "Why partner" - the here-is-who-is-in visual.
4. The site partner cards - cosmetic, already handles absence gracefully.

## Ask messages

Three drafts. Same spec in each, tone matched to the relationship. Zaal decides
channel (email, text, in person). Nothing here has been sent.

### Ask 1 - Town of Ellsworth (owner: Zaal; recipient: UNSET)

> Hi [Town contact - UNSET],
>
> Quick asset request for ZAOstock on 3 October. We are printing the festival
> poster the week of 1 September and building the sponsor backdrop for the
> parklet stage, and both carry the partner logos. The Town of Ellsworth is on
> that strip as our venue partner.
>
> Could you send the Town's logo in vector (SVG, EPS or PDF) if one exists, or
> a high-resolution PNG on a transparent background if not? A colour version
> and a plain black or white version would both help, since the backdrop is
> single-colour print.
>
> If there is a usage guideline for the Town seal versus a wordmark, or a
> particular version you would rather we use, tell me and we will use that one.
>
> We need it by Friday 29 August to make the print date. Thank you - and thank
> you again for the parklet.
>
> Zaal

### Ask 2 - ENTERACT (owner: FailOften)

Written as a note **from Zaal to FailOften**, since FailOften owns the
relationship and should make the ask. If Zaal would rather write ENTERACT
directly, the body of Ask 1 works with the name swapped.

> FailOften - one thing I need from ENTERACT by Friday the 29th: their logo.
>
> Vector if they have it (SVG, EPS, PDF), otherwise a high-res transparent PNG.
> Colour plus a plain black or white version if both exist. It goes on the
> poster partner strip (printing week of 1 Sep), the stage backdrop, and the
> partner cards on zaostock.com.
>
> Drop it in the ZAOstock Drive folder under Partners, not in a chat. Six of
> the nine are in; ENTERACT, Web3Metal and the Town are the three left.
>
> If they ask what the placement looks like: partner strip, equal size with the
> other partners, no cash exchanged, "production and operational support" as
> the role line. That role text is theirs to correct.

### Ask 3 - Web3Metal (owner: Shawn)

Written **from Zaal to Shawn**, same reasoning.

> Shawn - need the Web3Metal logo by Friday 29 Aug for the ZAOstock poster and
> backdrop.
>
> Vector preferred (SVG, EPS, PDF), or a high-res PNG with a transparent
> background. Colour and a single-colour version if they have both. Into the
> ZAOstock Drive folder, Partners subfolder.
>
> Placement is the partner strip on the poster (prints week of 1 Sep), the
> stage backdrop, and a partner card on the site with the role line
> "partnership integration and community surface." If they want that line
> worded differently, send the wording with the file.
>
> Three logos left of nine and this is one of them.

## Open, and whose

| Item | Owner | State |
|---|---|---|
| Town of Ellsworth logo | Zaal | DUE Fri 29 Aug, recipient UNSET |
| ENTERACT logo | FailOften | DUE Fri 29 Aug |
| Web3Metal logo | Shawn | DUE Fri 29 Aug |
| Is COC Concertz a ZAOstock partner | Zaal | **YES** - Zaal, typed 27 Aug 20:3x. Role line and site poc still UNSET |
| Copy the six Drive files into `public/partners/` | MARKETING lane, needs Drive access | not done |
| Set `logoSrc` on each partner card, add Bomb Squad and COC Concertz, fix Black Moon role text | SITE lane | requested in DONE.md |
| Backdrop print vendor and lead time | UNSET | UNSET |

## Sources

- `docs/plans/gdoc-1B78AVonJS3-snapshot-2026-08-27.md` - Team and Roles
  "Partners"; What We Need "Things owed, with dates"; Links and Assets "Partner
  logos: the biggest gap" and "What we are missing". Snapshot is the 24 Aug
  state and is marked stale for the ten edits applied 27 Aug; none of those
  ten touched the logo rows.
- `src/app/page.tsx:97-112` - the site PARTNERS array and the logoSrc rule.
- `public/partners/README.md` - the drop zone and its two expected files.
- `docs/plans/people-map-2026-10-03.md:16` - Paper and Candy own poster and
  partner logos as design assets.
- `docs/sponsor/deck-2026-10-03.md:322-324` - the three missing logos block the
  backdrop, the poster and the deck.
