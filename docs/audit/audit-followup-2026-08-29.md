# Audit follow-up - 2026-08-29, evening

Companion to `docs/audit/project-audit-2026-08-29.md`, which reviewed the
28 August audit and correctly recorded every item and its owner. This file
carries the part that document did not: the findings from that audit which
appear in none of the three worklists, plus one status correction so a line
that has started travelling does not travel further.

Everything below was read against `a599518` (PR #60) and against production on
the evening of 29 August. Line numbers are from that commit. Exploit detail is
deliberately absent because this repository is public; every item names the
file, the line and the consequence, which is enough to fix it.

## Status correction: the dashboard retirement is decided, not shipped

`docs/audit/project-audit-2026-08-29.md` gets this right and says item 03 is
"rotate all codes off the formula before the env fix redeploys". A summary
going out alongside it states the retirement as landed in PR #60 and concludes
that the rotation is therefore moot. **On `main` it is not landed.** Measured:

| Claim | State at `a599518` |
|---|---|
| "the 4-letter code login is retired" | `src/app/api/team/login/route.ts` present and calling `findTeamPasswordMatch()` |
| "the routes answer 410" | 28 routes under `src/app/api/team/`, zero `410` responses anywhere |
| "the roster is out of the tree" | `scripts/team-codes.mjs` still tracked, roster and formula included |
| `/team` points elsewhere | `src/app/team/page.tsx` still renders `LoginForm` then `Dashboard`; 34 components present |
| in flight | no open PR, no remote branch carrying the change |
| live | `https://zaostock.com/team` returns 200 and still contains "4-letter" |

Why it matters this week and not next: **the Vercel env fix is what makes the
dashboard reachable again.** Today it answers because production points at a
project with no matching tables, not because the login is off. If the env
lands and the rotation is skipped on the strength of "the logins are off", the
dashboard returns with codes derivable from a formula published in this public
repository.

Either order is fine. Rotate first, or ship the retirement first. Doing neither
because the record reads as done is the failure mode to avoid.

The same summary also undersells its own work. Items 07 and 08 are described as
"gone with the dashboard"; they were properly fixed in code, and the fix
survives whether or not the dashboard is retired:

- `src/lib/auth/verify-team-password.ts:5` - `promisify(scrypt)`, so hashing
  runs on the libuv pool rather than blocking the event loop.
- every row is checked every time, so the `Array.find` short-circuit that made
  response time a function of roster position is gone.
- `src/app/api/team/request-access/route.ts:4` imports the shared helper
  instead of carrying its own copy of the comparison.

## The six with no owner

Ordered by what they cost on 3 October, not by severity label.

| # | Finding | Where | Owner |
|---|---|---|---|
| 1 | The uptime check is not a pager | `.github/workflows/uptime.yml` | unowned |
| 2 | The roster is enumerable without a session | `src/app/team/m/[slug]/page.tsx`, `src/app/api/team/circles/route.ts` | unowned, and a product call |
| 3 | Detail pages still read whole tables | `src/lib/artists.ts:71`, `src/lib/members.ts:78` | half owned |
| 4 | Upload URLs trust client-declared size and type | `musicians/rider/upload-url:20-21`, `team/attachments/upload-url:20-21` | unowned, Supabase setting |
| 5 | Wallet nonces are per-instance | `src/lib/auth/wallet-nonce.ts:9` | unowned |
| 6 | CSP is report-only with nowhere to report | `next.config.ts` | unowned |

### 1. The uptime check is not a pager

The workflow asks for `cron: '*/10 * * * *'`. GitHub is not honouring it.
Scheduled runs on 29 August: 14:15, 08:56, 01:59; on 28 August: 18:54, 06:23.
Gaps of five to twelve hours. It notifies by opening an issue, and #55 has been
open since 26 August with one comment, through a three-day outage nobody was
woken for.

The workflow's own header is honest about this: "If Oct 3 needs a real pager,
this is not it." On 3 October the site is the schedule and the map for everyone
standing on Franklin Street, and a twelve-hour detection gap on that day is the
whole event.

**Fix.** A webhook from the `if: failure()` branch to the channel the crew is
actually in. GitHub's scheduler cannot be made to honour ten minutes on a
public repo, so if show-day coverage has to be tight, run the check from
somewhere else for that week.

### 2. The roster is enumerable without a session

Rotating the codes fixes the credential. It does not fix the input to the
formula.

- `src/app/team/m/[slug]/page.tsx:34` - public, `force-dynamic`, renders a
  "More of the crew" list of eight links to other member pages. Walk the links
  and you have the roster.
- `src/app/api/team/circles/route.ts` GET - session may be null by design, and
  the response carries every active member's name.
- `src/app/robots.ts` - `Disallow: /team/m/` is not access control, and it
  publishes the path it is trying to hide.

Both surfaces return nothing today only because production is on the wrong
database. Both come back with the env fix, in the same deploy as the rotated
codes.

**Fix.** Decide whether member profiles are a public feature. If yes, drop the
crew list or gate it behind a session and return circle member names only to a
signed-in caller. If no, put the route behind auth. This is a product call, not
a code one, which is why it is listed rather than patched here.

### 3. Detail pages still read whole tables

`react cache()` was the right call and it fixed the real problem: three
identical reads of `team_members` inside one page render, and two of `artists`.
Page-level revalidate is already on the SITE list and covers the rest of the
caching half.

What is not on any list is the shape underneath. Both helpers read every row
and filter in JavaScript:

    src/lib/artists.ts:71   getArtistBySlug  -> getPublicArtists() -> all.find(...)
    src/lib/members.ts:78   getMemberBySlug  -> getPublicMembers() -> all.find(...)

They are written that way for a real reason: **slug is computed in JavaScript
from the name**, so there is nothing to filter on in the query. That makes it a
schema gap rather than a lazy query, and it folds naturally into the schema
export already planned.

It matters because the Supabase egress quota refills **21 September**, twelve
days before the festival, and show day is the traffic spike. Confirming the
billing tier is already on the open list; this is the other half of the same
concern.

### 4. Upload URLs trust client-declared size and type

Both upload routes validate a size and a type in zod, then mint a signed
Supabase upload URL that enforces neither. The declared values and the real
file never meet.

    musicians/rider/upload-url   :20 mime_type any string   :47 createSignedUploadUrl
                                 :21 size_bytes <= 500 MB       enforces neither
    team/attachments/upload-url  :20 mime_type any string   :47 createSignedUploadUrl
                                 :21 size_bytes <= 25 MB        enforces neither

This is a different concern from role-scoping the attachments and artists
routes, which is already on the SITE list; that is about which entity a caller
may read, this is about what lands in the bucket. Both routes are token or
session gated, so it is hardening rather than an open door.

**Fix.** Set the file size limit and the allowed MIME types on the
`stock-attachments` bucket in Supabase, where they are enforced at upload
rather than described at request time. Not a code change.

### 5. Wallet nonces are per-instance

`src/lib/auth/wallet-nonce.ts:9` holds issued nonces in a module-level `Map`. A
nonce issued by one instance is invisible to the instance that receives the
signature, so wallet login fails with no useful signal to the person trying.

The file is candid that the store is best effort, and the reasoning written
down is about **expiry**: a nonce only needs to survive a few seconds. That is
true, and it is not the failure mode. The failure mode is **distribution**, and
it does not improve with a shorter TTL.

Low urgency while codes are the primary path. Worth fixing before anyone is
told to rely on wallet sign-in.

**Fix.** One small table with a nonce, an expiry and a used flag. The same
change fixes the login throttle, which has the identical shape.

### 6. CSP is report-only with nowhere to report

`next.config.ts` ships one `Content-Security-Policy-Report-Only` header and
zero `report-uri` or `report-to` directives. The policy is evaluated by every
visitor's browser and the violations go nowhere.

The project audit says "leave Report-Only through 3 October; enforce after",
which is the right call for the date. The gap is that without a collector there
is no way to learn whether it has run clean, so the decision to enforce in
October will have no more evidence behind it than the decision to wait.

**Fix.** Add a reporting endpoint now so there is a fortnight of data by the
time the October decision comes up. Or drop the header until someone is ready
to do that, so it is not mistaken for a live control.

## In this PR

- `src/lib/api/redact.ts` and its test. `GET /api/team/artists` stripped
  `claim_token` inline; `POST` returned the freshly inserted row from
  `select('*')` untouched, so the two paths on one route disagreed about
  whether the field was safe to serve. Both now call the same helper and a test
  pins it.
- This document.

Nothing else here is patched on purpose. Item 2 is a product decision, items 4
and 6 are settings rather than code, and items 3 and 5 want a schema change and
a store that should be chosen by whoever owns the migration.

## Method

Read against `origin/main` at `a599518` in a throwaway worktree. Uptime cadence
and issue state from the GitHub Actions and Issues APIs. `zaostock.com/team`,
`/api/events`, `/api/events/zaostock/lineup`, `/api/team/circles` and
`/team/m/zaal` fetched live on the evening of 29 August. No login was attempted
against production and no query was run against any database.
