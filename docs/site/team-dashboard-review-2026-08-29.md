# The /team dashboard: how it worked, and why it is retired (2026-08-29)

Zaal, 29 August: "we aren't really running the team like that right now / any
more ... we don't have most of those people on our team active right now, we
should message them all and remove this form of passwords and just move this
stuff all into the document." This is the review he asked for, then what
changed in code (stage one), then what is still in the database and what
stage two removes.

## How it worked

- **Login.** `/team` showed a form for a 4-letter code. The code was scrypt-hashed per member in `team_members.password_hash`; `findTeamPasswordMatch` swept every row on each attempt. A match set an iron-session cookie (30 days) or, for the mobile app, a sealed bearer token (`/api/team/mobile-login`). Wallet login (SIWE-style nonce + signature, ERC-1271 aware) was a second door into the same session. `/api/team/request-access` let a paused member ping a lead. A daily cron (`/api/cron/deactivate-inactive`) paused anyone who had not logged in for 3 days.
- **What a session unlocked.** 26 routes under `/api/team/*` over 20 tables: members and profiles (roster, bios, photos, scopes, push tokens), artists pipeline (statuses, riders, attachments, claim tokens for the public `/artist/<slug>` pages), sponsors CRM with contact log and budget entries, volunteers and RSVPs, todos, goals, timeline, meeting notes, comments, activity log, circles, one-pagers with visibility flags. One role check in all of it (leads on member PATCH); every other write was open to any of the 29 codes.
- **Pages.** `/team` (dashboard: kanban, CRM, budget, roster, notes, activity rail, onboarding), `/team/plan` (a static "everything open" page, hand-edited by lanes), `/team/onepager` (print), `/team/help`, `/team/m/<slug>` (public member profiles, no login). 76 components.
- **Public surfaces that read the same tables.** `/artist/<slug>` (artists), `/onepagers` (one-pagers marked public), `/circles`, `/api/events` and the lineup API (events, artists; used by the ZAO Festivals mobile app), the public forms (`/apply`, `/musicians/submit`, `/musicians/rider`, `/suggest`, RSVP) which write volunteers, artists, suggestions, rsvps.
- **Where the data lives.** The real Supabase project `yjrlaxpjusmrfylumban`. Production has been pointed at the cowork project since mid-July, so nothing in the dashboard has been reachable from the site for six weeks; the roster of 29 and whatever was entered before July are still in the real project's tables.

## What the roster says about usage

The tracked roster (27 names; the database has 29) was assembled in May around six circles. The people doing ZAOstock in August are Zaal, Candy, Iman, Dcoop, FailOften, Thy Revolution (Mickey), Aziz and Ohnahji on the stream, Steve at Black Moon, Roddy at the City, and the acts. Coordination has run through the Organizing Doc, the vault, Discord and Telegram, not the dashboard. Twenty-plus codes were minted for people who never logged in, using a formula that sat in this public repo (Iman's audit, item 03).

## Stage one, this PR

- `src/lib/team-status.ts`: `TEAM_DASHBOARD_RETIRED = true`. `getStockTeamMember()` returns null while it is set, so every `/api/team/*` route answers 401 with no code change per route.
- The six credential routes (`login`, `mobile-login`, `request-access`, `wallet-login`, `wallet-nonce`, `link-wallet`) answer 410 Gone with a one-line message.
- The inactivity cron returns `{ skipped }`.
- `/team`, `/team/plan`, `/team/onepager`, `/team/help` render one notice: "This moved into the document", with a mailto for the link (the document's URL stays out of the public repo). `/team/m/<slug>` is a 404. All `noindex`; `robots.txt` disallows `/team`.
- `scripts/team-codes.mjs` deleted and the `codes` npm script removed: the roster and the code formula are out of the tracked tree. (Git history keeps them; that is why rotation would have mattered if the logins stayed on. With the logins off, the codes are dead.)
- `/team/plan` content exported to `docs/plans/team-plan-export-2026-08-29.md` for the document.
- Nothing in the database is touched. The public `/api/events` and lineup routes, the artist pages (confirmed-only, held to 1 September) and the forms guard are unchanged.

## What replaces it

Three tools, one rule each (Zaal, 29 Aug: "a workflow to cleanly work with people using Discord, Google Docs and Google Calendar"), written up in the Organizing Doc under "How we work" and in `~/zao-vault/notes/team-workflow-2026-08-29.md`:

- **The Organizing Doc** is the single working document: one tab per area, decisions typed in the tab they belong to, the "Start Here" tab is the front door. If it is not in the doc, it is not decided.
- **Discord** is where the talking happens: one channel per lane, threads per item, a weekly written check-in in the standup channel. Voice for anything longer than three messages.
- **Google Calendar** is the schedule: the Monday 11:30 ET standup, the AV and design meetings, and every deadline as an all-day event on the shared ZAOstock calendar. The public side stays on luma.com/zao.

## Stage two, after Zaal confirms the export

1. From the Supabase dashboard on the real project, export CSVs of `sponsors`, `contact_log`, `budget_entries`, `artists`, `volunteers`, `rsvps`, `meeting_notes`, `todos`, `timeline`, `goals`, `onepagers`. Anything worth keeping goes into the doc's tabs.
2. Delete `src/app/team/**` (except the notice), the 26 `/api/team/*` routes, the cron, `src/lib/auth/*` session and wallet code, the members and circles helpers, and the push-token path. Keep: `/api/events`, `/api/events/[slug]/lineup`, the public forms and their routes, `/artist/<slug>`, one-pagers (make the overview static).
3. Decide the forms: either back on against the real project with a plain email notification to info@thezao.com on each submission (no dashboard needed to read them), or permanently the mailto they are today. Zaal's call; the email path is a small route change.
4. Mobile app (`bettercallzaal/zao-festivals`): it loses team login and push tokens; its public screens (events, lineup) keep working. Tell Iman before the routes are deleted.
5. Drop the tables only after the CSVs are in the doc, and only from the real project.

## Message to the old roster

Draft on Zaal's clipboard page (he sends). Says: the dashboard and codes are gone; the Organizing Doc, Discord and the calendar are how we work; if you are in for 3 October, reply with what you want to take on; thank you either way.
