# Per-person AI agent context files

Source-of-truth markdown profiles the ZAOstock bots load when answering on a teammate's behalf or summarizing their work. Each file captures the voice, current focus, and rules a bot must respect when speaking as that person.

> **This folder is about VOICE, not ownership.** It tells a bot how to write as
> someone. For who owns what on the event, who decides what, and which roles
> have nobody in them, see [`docs/team/`](../docs/team/).

> ### Every file in here is stale
> 
> The staleness rule below says a bot refuses a file older than 90 days. Every
> file carries `last-validated: 2026-05-06`, which expired on **4 August 2026**.
> As of 1 September that is the whole folder, by the folder's own rule, and
> nothing announces it. Re-validate before trusting any of these for bot output.

## How these files are used

- **Bot voice**: when the bot drafts a tweet, reply, or note attributed to person X, it loads `<X>.md` and conditions output on it.
- **Self-portrait template**: `TEMPLATE.md` is the canonical structure. Iman starts the pattern by writing `Iman.md` first; everyone else copies the shape.
- **Versioning**: files live in this repo so updates flow through normal PR review. No hidden `active=true` gates.

## File list

Corrected 1 September 2026. The previous version of this table said Zaal.md
needed a draft when it was the only fully written file in the folder, and
described Iman.md as done when it is still the empty seed.

| File | Owner | Status | Roster entry |
|---|---|---|---|
| TEMPLATE.md | n/a | seed structure | n/a |
| Zaal.md | Zaal Panthaki | **written**, stale since 4 Aug | [01-lead/01-zaal.md](../docs/team/01-lead/01-zaal.md) |
| Iman.md | Iman Afrikah | **still the empty template** | [03-broadcast-and-virtual/03-iman.md](../docs/team/03-broadcast-and-virtual/03-iman.md) |
| FailOften.md | FailOften | placeholders unfilled | [05-partnerships-and-city/02-failoften.md](../docs/team/05-partnerships-and-city/02-failoften.md) |
| Shawn.md | Shawn (Web3Metal) | placeholders unfilled | [05-partnerships-and-city/01-shawn.md](../docs/team/05-partnerships-and-city/01-shawn.md) |
| Adam.md | Adam | placeholders unfilled | [06-ops-and-infrastructure/01-adam.md](../docs/team/06-ops-and-infrastructure/01-adam.md) |

Everyone on the roster who does not appear above has no agent file yet, which
is fine. An agent file is opt-in; a roster entry is not.

## Conventions

- Write in second person ("you do X") so the bot can read these as instructions.
- Keep each file under 300 lines.
- "Hard rules" section is the bot's non-negotiables (e.g. "never use emojis", "never sign messages with my full name").
- Every file ends with a `last-validated:` date. Bot will refuse to use a file that's been stale > 90 days.

## Adding a new person

0. Make sure you have a roster entry in [`docs/team/`](../docs/team/) first. That
   one is the record of what you own; this one is optional and only about voice.
1. Copy `TEMPLATE.md` to `<Name>.md`.
2. Fill all sections. Empty sections OK if section header includes `_intentionally blank_`.
3. Open PR. Reviewer = the person themselves (or Zaal as fallback).
4. Merge once approved.
