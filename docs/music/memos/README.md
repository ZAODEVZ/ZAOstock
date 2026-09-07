# Deal memos, ZAOstock 2026

Nine pre-filled deal memos, one per act on the run of show locked 3 September
2026. Pre-filled by IMan on 7 September so that sending is a send, not a
writing job. Source template: `../artist-deal-memo-template.md`. Set order,
times and lengths from `.handoffs/session-2026-09-03-zaostock-travel-window/README.md`.

**None of these has been sent.** As of 7 September the `artists` table holds
9 wishlist and 0 confirmed, and the reveal gate opened that morning on an
empty bill.

## Before sending, once

Two tokens appear in every memo and must be replaced with real dates:

| Token | Rule |
|---|---|
| `{{SIGN_BY}}` | Before `lineupRevealDate` in `src/content/site.ts`. Decision 0005: only acts confirmed in writing publish, so a signature after the reveal is a signature for nothing |
| `{{PRESS_SHOT_BY}}` | Two clear days before the reveal, so a late photo does not arrive after the lineup is already public |

PR #108 proposes moving the reveal to Friday 18 September. If it merges, a
working pair is sign-by **Monday 14 September** and press shot **Wednesday 16
September**. If it does not, the reveal has already fired and both tokens
should be the earliest date the act can honestly meet. Check the weekday
against a calendar either way. 12 September 2026 is a Saturday.

The three dates already in the memos (rider and travel Friday 18 September,
budget cover Friday 11 September, cancellation cutoff Saturday 19 September)
are unchanged from the template and were verified as real weekdays there.

## The nine

| # | Act | Set | Min | Genre as billed | File | Status |
|---|---|---|---|---|---|---|
| 1 | The Crown Vics | 12:05 PM | 30 | Rock n roll dance band | `2026/the-crown-vics.md` | not sent |
| 2 | OPEN X | 12:40 PM | 40 | Power pop rock | `2026/open-x.md` | not sent |
| 3 | Grass Rug | 1:25 PM | 30 | Jam rock band | `2026/grass-rug.md` | not sent |
| 4 | Acadia Rising | 2:00 PM | 30 | World Rhythms / Global Fusion | `2026/acadia-rising.md` | not sent |
| 5 | Michael Anderson | 2:35 PM | 30 | Solo piano | `2026/michael-anderson.md` | not sent |
| 6 | Hurricane | 3:10 PM | 30 | Hip-hop | `2026/hurricane.md` | not sent |
| 7 | Dcoop | 3:45 PM | 40 | Hip-hop | `2026/dcoop.md` | not sent |
| 8 | Lyons Den | 4:30 PM | 40 | Native / Electro / Reggae / Hip-hop | `2026/lyons-den.md` | not sent |
| 9 | Fellenz | 5:15 PM | 40 | Rock guitar and soundtrack | `2026/fellenz.md` | not sent |

Once a memo is returned signed, save the signed version to
`docs/music/deals/<act>-2026.md` per the template, and set the act's row in
the `artists` table to `confirmed`.

## What is deliberately not here

- Fees. Agreed privately per act, never in this repository.
- Contact details for any act or teammate. This repository is public.
- The two dates above. They are a decision, not a fill-in.
