---
decision: 0006
title: Artist phone numbers live only in the form's responses sheet - not the database, not any git repository
decided: 2026-09-10
by: the vault lane, on the zaostock lane's measurement
status: active
supersedes: null
superseded-by: null
---

# 0006. Artist phone numbers stay in the form's responses sheet

On 2026-09-10 the artist details form started asking every act for a day-of
phone number, alongside an email, social handles and who is on stage. Eight
artists gave those numbers to us for one purpose: reaching them on 3 October.
This decides where those numbers are kept, so nobody has to decide it again.

## The decision

**Artist phone numbers live only in the Google responses sheet behind the
artist form.** That sheet is owned by info@thezao.com and is already access
controlled, and it is where the numbers arrive by themselves, with no work
from us.

- **Not in the database.** There is no artist phone column, on purpose. Nothing
  needs a phone number programmatically, and a column that exists gets
  selected eventually: `/api/team/artists` already reads `select('*')`. A
  phone column would flow into that path, and into every `select('*')` written
  after it.
- **Not in any git repository, the private vault included.** A private repo is
  still permanent and replicated. It is pushed to GitHub, cloned onto several
  machines, and read by every agent that works in it. A value committed to it
  cannot really be removed later, because git objects stay fetchable by SHA
  after they are replaced, and one wrong push copies the whole history
  somewhere else. Other people's personal numbers do not go into a store with
  that property.
- **Not in a published CSV of the sheet.** A published-to-web sheet is a URL
  anyone holding it can fetch. "Hard to guess" is not access control.

**The day-of contact list** for 3 October is produced from the sheet at the
time, on paper or on the phone of whoever runs the stage. It does not pass
through git, a deploy or this codebase.

## What was measured, so the next reader can check rather than trust

Measured on 2026-09-10:

- The `artists` table has no phone column. Artist email is in `contact_email`,
  set for one act.
- Every public reader of `artists` selects named columns that include neither
  email nor phone:
  - the lineup API, `src/app/api/events/[slug]/lineup/route.ts`: `id, name, genre, city, bio, photo_url, socials, set_order, status`
  - `getPublicArtists()`, `src/lib/artists.ts`: no `contact_email`
- The one `select('*')` on `artists`, `/api/team/artists`, is gated by the
  team session in code (`getStockTeamMember`). An anonymous GET returns
  `401 {"error":"Unauthorized"}`.
- A scan of `/`, `/press`, `/program`, `/partners` and `/design` for phone-shaped
  strings found none.

## The guard

`src/content/no-phone-numbers.test.ts` fails if any tracked file in this
public repo contains a phone-shaped string. It uses the same pattern as the
older `docs/team`-only check in `registry.test.ts`, extended to every tracked
file. A legitimate public number - a venue's line, a vendor - goes in as a
named exception in that test, never as a loosened pattern. A broad guard gets
deleted the first time it cries wolf; a narrow one with named exceptions stays.
