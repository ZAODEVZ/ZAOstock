# Public forms behind `PUBLIC_FORMS_ENABLED` - 2026-08-27

Lane: SITE. One switch, `src/lib/forms-status.ts`, `PUBLIC_FORMS_ENABLED = false`
since 2026-08-23. Every public form below renders `src/components/FormsUnavailable.tsx`
(a mailto to info@thezao.com) while it is false. The form components and API
routes are untouched and typecheck clean.

## Every form

| Page | Component | POSTs to | Writes | Guards | On DB failure |
|---|---|---|---|---|---|
| `/` (homepage) | `src/app/RSVPForm.tsx` | `/api/events/rsvp` | `rsvps` insert (`name`, `email`, `notes`, `source`, `event_id` resolved from `events.slug = 'zaostock'`) | zod, rate limit, honeypot, 409 on duplicate email per event | 500 `Could not submit right now`, submission dropped |
| `/suggest` | `src/app/suggest/SuggestForm.tsx` | `/api/suggestions` | `suggestions` insert (`name`, `contact`, `suggestion`) | zod, rate limit, honeypot | 500 `Could not submit`, dropped |
| `/apply` | `src/app/apply/ApplyForm.tsx` | `/api/apply` | `volunteers` insert (`name`, `email`, `phone`, `role`, `shift`, `confirmed=false`, `notes` blob) | zod enums match the DB check constraints for `role` and `shift`, rate limit, honeypot | 500 `Could not submit right now`, dropped |
| `/cypher` | `src/app/cypher/CypherForm.tsx` | `/api/cypher` | `artists` update if `contact_email` matches and the claim token proves ownership, else `artists` insert (`status='wishlist'`, `cypher_interested`, `cypher_role`, `socials`, `notes`, `claim_token`, `contact_email`) | zod, rate limit, email-match plus token before any update (write-IDOR closed) | 500 `Could not save signup` / `Could not update signup`, dropped |
| `/musicians/submit` | `src/app/musicians/submit/SubmitForm.tsx` | `/api/musicians/submit` | `artists` insert (`status='wishlist'`, `contact_email`, bio, socials, etc.) | zod, rate limit, honeypot | 500 `Could not submit right now`, dropped |

Not behind the flag, and not public forms: the rider upload routes
(`/api/musicians/rider/*`, token-gated per artist) and everything under
`/api/team/*` (session-gated).

Schema check, 2026-08-27, against `yjrlaxpjusmrfylumban` via `list_tables`
verbose: every column each route writes exists on the target table, and the
`volunteers.role` / `volunteers.shift` check constraints equal the zod enums.
Nothing in the forms needs a migration.

## Can they go live before "the 503" is fixed?

**No - but not for the reason the flag comment gives.** The comment says the
Supabase project is unavailable. It is not (see
`docs/site/supabase-503-2026-08-27.md`). The real block is that production's
`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on Vercel point at
`etwvzrmlxeobinrlytza`, the cowork tracker. Flipping the flag today would send:

- RSVPs to a project with no `events` table: the slug lookup errors, every
  RSVP 500s and is dropped.
- Suggestions into the tracker's `suggestions` table, which has a different
  schema (`docs/AUDIT.md` confirmed the insert fails on it).
- Volunteers, cypher signups and artist submissions into tables that do not
  exist there.

So the order is fixed: **Vercel env vars first, then the flag.** Once
`https://zaostock.com/api/events` returns the 4-row `events` array, the flag
can flip in the same commit as nothing else. The one constant is the whole
change, as the file says.

## Recommended before the flip, not required for it

`src/lib/forms-status.ts` asks that a failed insert be caught and persisted
somewhere before the forms return, so the next outage costs a delay and not an
artist. That is a code change this lane can make (`src/**`), roughly: on
insert error, log the full validated payload at `error` level through
`src/lib/logger.ts` (pino, so Vercel retains it) before returning the 500, and
say "we have your answers, we will follow up" instead of "could not submit".
Not done today because the handoff asked for the list, not the change; it is
a one-PR follow-up if Zaal wants it.

## Verification, once env is fixed

1. `curl https://zaostock.com/api/events` - expect 200, 4 events, `resolvedHost` = `yjrlaxpjusmrfylumban`.
2. Flip `PUBLIC_FORMS_ENABLED` to `true`, deploy.
3. One real RSVP from the homepage with a throwaway email; read it back with
   `select name, email, created_at from rsvps order by created_at desc limit 1`
   on `yjrlaxpjusmrfylumban` (not the tracker - see the memory note on
   confirming the project before any write).
4. Delete the test row.
