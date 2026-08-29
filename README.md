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

## License

MIT.
