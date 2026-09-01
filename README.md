# zaostock

The dashboard + public site for **ZAOstock 2026**, a one-day artist-built music festival in downtown Ellsworth, Maine on Saturday, October 3, 2026.

Run by [The ZAO](https://zaoos.com).

## Stack

- Next.js 16 (App Router) + Turbopack
- React 19
- Tailwind v4
- Supabase (Postgres + RLS)
- iron-session (4-letter team codes)
- Tiptap (WYSIWYG bio editor)
- Vercel (hosting)

## Before you change anything

Four things that have each already cost this project real time. None of them
throws an error when you get it wrong, which is why they are on the front page.

**The lineup reveal is TWO edits, in two systems.** The mobile app reads the
Supabase `artists` table. The website reads `PUBLIC_LINEUP`, compiled into the
bundle. The database reveals itself the moment the date passes; the website
needs a human and a deploy. Do one without the other and nothing fails, the two
surfaces just disagree in public.
**Read [`docs/events/REVEAL-RUNBOOK.md`](docs/events/REVEAL-RUNBOOK.md) first.**

**Dates and prices have one source, and it is `src/content/`.** The reveal date
was typed as a literal in eight files and drifted. Never type a date, a price or
a tier name into a page; read it from `src/content/site.ts`. Tests scan the
rendered surfaces and fail if a literal reappears.

**Event slugs are aliased, never duplicated.** The `events` table says
`zaostock`; the app calls `zaostock-2026`. That resolves through
`src/lib/event-slugs.ts`. Getting a slug wrong does not throw, it 404s or writes
a row with a null `event_id` that looks like it saved. Never add a second events
row for an alias. See
[`docs/decisions/0003-event-slug-aliases.md`](docs/decisions/0003-event-slug-aliases.md).

**This repo is public.** No email addresses, phone numbers, fees, negotiation
positions, or performer names before the reveal, anywhere in `docs/team/`. The
build enforces the first two. The working document is not linked from the site
and must not be pasted into `TEAM_DOC_URL`; `src/lib/team-status.test.ts`
explains why at length.

> **Working on a branch here?** This clone's fetch refspec is narrowed to
> `+refs/heads/main:refs/remotes/origin/main`, so `origin/<your-branch>` never
> updates locally and `git push --force-with-lease` fails with "stale info".
> Pass the lease explicitly: `--force-with-lease=<branch>:<sha>`.

## Who is on this, and what they own

**[`docs/team/`](docs/team/)** is the roster. One folder per position, one file
per person, numbered. Start at [`docs/team/README.md`](docs/team/README.md).

- [`docs/team/ROLES.md`](docs/team/ROLES.md) - what each position decides without asking, and where it hands off
- [`docs/team/OPEN-ROLES.md`](docs/team/OPEN-ROLES.md) - roles with **nobody in them**, tracked as carefully as the filled ones
- [`docs/decisions/`](docs/decisions/) - dated decisions, superseded rather than edited

Adding yourself is four steps and they are written at the bottom of the roster.
The roster is checked by `src/content/registry.test.ts`, so a person file with
no roster row fails the build rather than going quietly missing.

## Every ZAO event, in one place

**[`docs/events/`](docs/events/)** has one file per festival with its links, its
public route, and the **slug the database and the mobile app resolve against**.

| Event | Where | When | Slug |
|---|---|---|---|
| [ZAO-PALOOZA](docs/events/01-zao-palooza-2024.md) | New York City | 2024 | `zao-palooza` |
| [ZAO-CHELLA](docs/events/02-zao-chella-2024.md) | Miami | December 2024 | `zao-chella` |
| [ZAOville](docs/events/03-zaoville-2026.md) | Laurel, Maryland | July 2026 | `zaoville` |
| [ZAOstock](docs/events/04-zaostock-2026.md) | Ellsworth, Maine | 3 October 2026 | `zaostock` |

The slug is the part that bites. Getting it wrong does not throw, it 404s or
writes a row with a null event id. See
[`docs/decisions/0003-event-slug-aliases.md`](docs/decisions/0003-event-slug-aliases.md).

## Run locally

```bash
npm install
cp .env.example .env.local        # fill in Supabase + SESSION_SECRET
npm run dev                        # http://localhost:3000
```

## Origin

Spun out of [ZAOOS](https://github.com/bettercallzaal/ZAOOS) on 2026-04-29.
ZAOOS is the lab; once a thing earns its own users + brand + lifecycle, it graduates.
ZAOstock is the first feature graduate.

## Public surface

24 public routes. The ones people actually land on:

- `/` - festival landing page
- `/program` - day-of schedule, one venue at a time (parklet until six, then Black Moon)
- `/pitch`, `/sponsor`, `/sponsor/deck` - the sponsor conversation
- `/musicians`, `/musicians/submit`, `/musicians/rider` - the musician funnel
- `/artists` - call for visual artists
- `/apply` - volunteer signup
- `/donate` - donations
- `/onepagers/overview` - public festival brief
- `/circles` - the 8 working circles
- `/cypher` - cypher signup
- `/ellsworth`, `/acadia`, `/festivals`, `/zaoville`, `/event-organizers`,
  `/suggest`, `/artist/<slug>`, `/onepagers/<slug>`, `/privacy`

Behind a login:

- `/team` - team dashboard (4-letter code, or wallet)
- `/team/m/<slug>` - public member profile
- `/team/help` - dashboard help docs

There is also an API surface consumed by the **ZAO Festivals mobile app**, which
does not live in this repo - see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
before changing any response shape under `/api`.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - how the app is put together
- [`CONTRIBUTING.md`](CONTRIBUTING.md) - setup, pre-push checks, commit style
- [`docs/CANONICAL-REPO.md`](docs/CANONICAL-REPO.md) - **read this if you found
  another zaostock repo.** `bettercallzaal/zao-stock` is archived and dead
- [`docs/brand/`](docs/brand/) - the ZAOstock 26 design system
- [`docs/team/`](docs/team/) - **the roster**: who owns what, what each position decides, and which roles are open
- [`docs/events/`](docs/events/) - **every ZAO event**, with links, routes and database slugs
- [`docs/decisions/`](docs/decisions/) - dated decisions, numbered, superseded rather than edited
- [`agents/`](agents/) - per-person **bot voice** files. Different thing from `docs/team/`: those say who owns what, these say how a bot writes as someone

## License

MIT.
