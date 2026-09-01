---
decision: 0001
title: The team dashboard is retired, the working document is the tool
decided: 2026-08-29
by: Zaal
status: active
supersedes: null
superseded-by: null
---

# 0001. The team dashboard is retired

Zaal, 29 August 2026: "we aren't really running the team like that any more ...
remove this form of passwords and just move this stuff all into the document."

## What this means in the code

`TEAM_DASHBOARD_RETIRED = true` in `src/lib/team-status.ts`. While that is true:

- every `/api/team/*` route answers 401
- the six login, token and wallet routes answer 410
- the inactivity cron does nothing
- `/team`, `/team/plan`, `/team/onepager` and `/team/help` show a pointer to the
  document
- `/team/m/<slug>` is a 404

## What this decision did NOT do

**It did not touch the database.** Every table keeps every row: sponsors,
budget, artists, volunteers, RSVPs, notes. That is deliberate, so nothing is
lost before an export. It also means retired routes are not retired data, and
whether any of it is reachable depends on Supabase row level security, not on
this code.

`npm run check:exposure` answers that question directly. Run it before anyone
concludes the retirement closed the door.

## Stage two, not yet done

Once Zaal confirms the export, delete the components and routes. The flag is
stage one.

