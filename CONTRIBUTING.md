# Contributing

Working on zaostock? Here's the actual workflow, not boilerplate.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in Supabase + SESSION_SECRET
npm run dev                  # http://localhost:3000
```

You'll need real values for `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (from the
project's Supabase dashboard) and a real `SESSION_SECRET` (any random string 32+ characters - both
of these throw a clear error at first use if missing, not a silent failure).

## Before you push

CI runs `typecheck`, `lint`, and `build` on every push/PR to `main` (`.github/workflows/ci.yml`) - but
run them locally first so you're not waiting on CI to find something obvious:

```bash
npm run typecheck
npm run lint
npm run build
```

There's no automated test suite yet - `tsc` + `eslint` + a real production build are the actual safety
net right now. If you're touching anything security-sensitive (auth, RLS, the API routes under
`src/app/api/team/*`), verify the change by hand against the real behavior, not just that it compiles.

## Commit style

Conventional commits, matching the existing git history: `type(scope): description` or
`type: description` (`fix`, `feat`, `chore`, `research`). Keep the body focused on *why*, not a
restatement of the diff - the diff already shows what changed.

## Database changes

This project's Supabase RLS policies are scoped to `service_role` only (not `public`/`anon`) - every
DB access goes through `getSupabaseAdmin()` server-side, gated by the app's own session check. Keep it
that way: a new table or policy that isn't `TO service_role` reopens a real vulnerability that was
fixed here before (a full-database-read/write hole via a leaked anon key).

## Team/admin routes

Every route under `src/app/api/team/*` must call `getStockTeamMember()` and reject `null` before doing
anything else. Public form endpoints (RSVP, apply, cypher, musicians/submit, musicians/rider,
artist-profile) go through `rateLimitPublicForm()` (`src/lib/api/rate-limit.ts`) and `parseJsonBody()`
(`src/lib/api/parse-json.ts`) - use both for any new public-facing POST/PATCH route, not just the
zod schema.
