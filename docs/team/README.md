# Who is on ZAOstock, and what each person owns

The roster. One folder per position, one file per person, numbered.

If you are new here: read this page, then read
[`ROLES.md`](ROLES.md) for what each position actually decides, then open your
own file. If you do not have one yet, see [Adding yourself](#adding-yourself).

If you are looking for a **gap** rather than a person, it is in
[`OPEN-ROLES.md`](OPEN-ROLES.md). Roles with nobody in them are tracked as
carefully as roles with somebody in them, because those are the ones that get
discovered on the day.

---

## The roster

| # | Position | Person | Owns |
|---|----------|--------|------|
| 01 | Lead | [Zaal Panthaki](01-lead/01-zaal.md) | The event. Breaks every tie |
| 02 | Music and AV | [Dcoop](02-music-and-av/01-dcoop.md) | Artists, set schedule, soundcheck, sound backups |
| 03 | Broadcast and virtual | [Aziz](03-broadcast-and-virtual/01-aziz.md) | Whether the stream is broadcasting |
| 03 | Broadcast and virtual | [Ohnahji](03-broadcast-and-virtual/02-ohnahji.md) | What is on the stream |
| 03 | Broadcast and virtual | [Iman Afrikah](03-broadcast-and-virtual/03-iman.md) | Online operations, the Ops Room, repo audits |
| 03 | Broadcast and virtual | [Motomoto](03-broadcast-and-virtual/04-motomoto.md) | Virtual crew, does not lead a half |
| 04 | Design and brand | [Candy](04-design-and-brand/01-candy.md) | Brand kit, print list, poster, logos |
| 05 | Partnerships and city | [Shawn](05-partnerships-and-city/01-shawn.md) | The Web3Metal partnership |
| 05 | Partnerships and city | [FailOften](05-partnerships-and-city/02-failoften.md) | ENTERACT, production and operational support |
| 05 | Partnerships and city | [Roddy](05-partnerships-and-city/03-roddy.md) | City lane support |
| 06 | Ops and infrastructure | [Adam](06-ops-and-infrastructure/01-adam.md) | Ops infrastructure |
| 07 | Advisors | [Tom Fellenz](07-advisors/01-tom-fellenz.md) | Event ops and brand counsel |
| 07 | Advisors | [Ted Horton](07-advisors/02-ted-horton.md) | Insurance counsel |

Thirteen people. Zaal is lead overall.

**This table is checked by a test.** `src/content/registry.test.ts` fails the
build if a person file exists that is not listed here, or if a row here points
at a file that does not exist. An index nobody can trust is worse than no index,
so this one cannot quietly rot.

---

## How the numbering works

- **Position folders** are numbered `01` to `07`. The number is not a ranking.
  It is a stable identifier so a folder can be renamed without breaking links.
- **People** are numbered inside their folder, in the order they joined that
  position. `03-broadcast-and-virtual/03-iman.md` is the third person in the
  broadcast lane.
- **Numbers are never reused.** If someone leaves, their number retires with
  them. If `01` in a folder leaves, the next person is not `01`, they are the
  next free number. This is the whole reason the scheme survives contact with a
  real team: renumbering a folder every time somebody moves is how an index
  starts lying.
- **If you change position**, you get the next free number in the new folder and
  the old file is deleted. Git keeps the history.

---

## Adding yourself

1. Copy [`_TEMPLATE.md`](_TEMPLATE.md) into your position folder as
   `NN-yourname.md`, where `NN` is the next free number in that folder.
2. Fill it in. The sections that matter are **Owns** and **Hand off to this
   person when**. Everything else can wait.
3. Add your row to the table above.
4. Open a PR. Reviewer is you, or Zaal.

If none of the seven positions fits, add a folder `08-<name>` and a row to
[`ROLES.md`](ROLES.md) in the same PR. Do not file yourself somewhere close
enough. A position that does not exist is useful information.

---

## What must never go in these files

**The repo is public.** Anyone can read every word of this directory.

Never in `docs/team/`:

- Email addresses, phone numbers, home addresses
- Fees, rates, day rates, anything anyone is paid
- Negotiation positions, or what a partner has and has not agreed to
- Performer names before the reveal date in `SITE.lineupRevealDate`

`src/content/registry.test.ts` fails the build if an email address or a phone
number appears anywhere under `docs/team/`. That is a backstop, not a licence to
stop thinking: it catches two shapes and there are more.

Contact handles live in `agents/<Name>.md`, which is also public and already
carries them by choice. The sensitive planning record is the working document,
which is **not** linked from the site and must not be pasted into
`TEAM_DOC_URL`. `src/lib/team-status.test.ts` explains why at length.

---

## Related

- [`ROLES.md`](ROLES.md), what each position decides and where it hands off
- [`OPEN-ROLES.md`](OPEN-ROLES.md), roles with nobody in them
- [`../events/`](../events/), every ZAO event with its links and identifiers
- [`../decisions/`](../decisions/), dated decisions, superseded rather than edited
- [`../plans/people-map-2026-10-03.md`](../plans/people-map-2026-10-03.md), the
  narrative version of this, written 27 August. Richer on reasoning, and the
  source most of this came from
- [`../../agents/`](../../agents/), per-person **bot voice** files. Different
  purpose: those tell a bot how to write as someone. These say who owns what

