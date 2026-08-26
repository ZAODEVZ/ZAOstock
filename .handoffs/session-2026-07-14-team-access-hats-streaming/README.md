# Session handoff - 2026-07-14 19:54
> from zaostock (main, clean) -> to fresh CC terminal, same mac
> doc: /Users/zaalpanthaki/Desktop/repos/zaostock/.handoffs/session-2026-07-14-team-access-hats-streaming/README.md
> chain: none

## Receiver instructions (read me FIRST, then do exactly this)

You just received a handoff bundle. Do NOT start work yet. Do this:

1. Read ALL sections below (A through E) before responding to anything.
2. Create TaskList entries from section A. These are the "to do" items.
3. Use section B as your "why" - do NOT re-litigate decisions captured there unless new info surfaces.
4. Use section D to know what's still running (background jobs, wakeups, subagents) - should be none.
5. Use section E as your cold-start map for files, skills, memory state.
6. Once integrated, message back: "Ingested handoff team-access-hats-streaming. N tasks queued. Ready."

## A. Tasks to absorb (paste these into your TODO list)

- [ ] **Zaal must set `CRON_SECRET` in Vercel's project env vars** (any random 32+ char string, e.g. `openssl rand -base64 32`). Without it, `/api/cron/deactivate-inactive` 401s harmlessly every day and no one ever gets auto-locked - safe by default, but the inactivity-lockout feature does nothing until this is set. Not something the agent can do (no Vercel dashboard access).
- [ ] Decide the Hats Protocol auth model before any gating code gets written: Hats-only (replaces password), hybrid (password stays primary, hat-holding gates a subset like the lead-only Access panel), or escape-hatch (hat-holding is one way to self-reinstate after inactivity lockout without waiting on a lead). See `/private/tmp/claude-501/.../scratchpad/zao-hats-gate-starter-README.md` (path is session-local scratch, not in the repo - re-paste needed, see Section E) for the full starter doc.
- [ ] Mint the actual hat(s) in the Hats app (app.hatsprotocol.xyz) under the existing ZAO tree, nested `ZAO > ZAOfestivals > ZAOstock`, before any gating code can be wired up - this needs Zaal's wallet + gas, not something the agent can do.
- [ ] Decide whether the Hats gating work becomes its own new repo (`zao-hats-gate`, as discussed) - agent did NOT create this repo, only drafted a starter README. If yes, tell the agent org + name + public/private and it can create it and push the draft as the first commit.
- [ ] Manually delete a stray Gmail draft from an earlier part of this multi-day session, addressed to a fabricated placeholder (`888-462-7808@placeholder.invalid`, meant for Beverly Boy Productions which has no real email on file). No Gmail delete-draft tool exists in the available MCP toolset, so this needs Zaal's manual cleanup in his own Gmail drafts folder.
- [ ] ZAOville (Laurel MD, Jul 25 2026 - now ~11 days out) still needs an actual booking call placed for livestream gear. Real vendors researched and documented (ZAOOS doc 1030, Finding 8, merged): call **Breasia Productions** first (301-490-3155, literally in Laurel, zero travel), fallback **AVALive** (703-531-8406, confirmed $125/week ATEM Mini Pro ISO). This is a phone call only Zaal can place - not something the agent can execute.

## B. Why - decisions + pivots + ruled-out paths

- **Team dashboard inactivity lockout** (the main build this session): reimplements an old idea from Zaal's notes ("kick to inactive if no reply within a week") as an automatic, login-based 3-day lockout instead of a manual weekly-message process. Zaal's own framing when asked: "login to website daily expectation if you miss 3 days you lose access and have to request it again." Built as: daily Vercel Cron (`/api/cron/deactivate-inactive`) flips `team_members.active = false` for anyone whose `last_login_at` (or `created_at` if they've never logged in - grace period) is older than 3 days; login route stamps `last_login_at` on success; a locked-out member sees a generic "Invalid code" (see security note below on why it's generic, not distinct) with an always-offered "Request access" fallback that flags `access_requested_at`; a new lead-only Access panel under the Team tab (`/team`, Team tab) lets leads reinstate someone with one click. This is the first place in the codebase with a real server-side role check (`role === 'lead'`) gating a sensitive action - previously the whole `/team` dashboard just gated on "is any authenticated team member."
  - Shipped in two commits, both pushed directly to `origin/main` (matching this repo's established direct-to-main pattern, not the ZAOOS repo's PR-based pattern): `84fa0a5` (the feature) then `03c0803` (a same-session security-audit fix pass).
  - **Post-ship security audit found and fixed 4 real issues** (ran a `security-reviewer` subagent against the just-merged code, since it touches auth and had gone straight to main unreviewed):
    1. CRITICAL: deactivated members kept a valid session cookie for up to 30 days (nothing rechecked `active` after initial login) - fixed by having `getStockTeamMember()` re-check `active` against the DB on every session read, destroying the session if the member's gone inactive.
    2. HIGH: the cron's `CRON_SECRET` bearer-token check used a plain `!==` string comparison instead of `timingSafeEqual`, inconsistent with every other secret comparison in this codebase - fixed.
    3. HIGH: the login route originally returned a distinct `access_paused` 403 for "valid code but locked out" vs. a generic 401 for "wrong code" - this let an attacker enumerate real team codes by password-guessing and watching for the different response. Fixed by collapsing both to one generic "Invalid code" 401; the frontend now always offers the "Request access" fallback after any failed login instead of showing it conditionally.
    4. MEDIUM: the cron had no exemption for leads - if every lead went inactive for 3+ days, the whole dashboard could lock with literally no one left able to reinstate anyone. Fixed by excluding `role = 'lead'` from the automatic cron (leads can still be manually deactivated by another lead via the PATCH endpoint - just never auto-locked by inactivity).
  - Ruled out: building this as a Telegram/Discord bot sending weekly messages - Zaal's actual answer was that it's purely a "did you log into the website" check, no bot/messaging platform involved.
  - Every commit this session (both the feature and the fix pass) was verified with a real local build using zero env vars set (`env -u SUPABASE_SERVICE_ROLE_KEY -u SESSION_SECRET -u CRON_SECRET -u NEXT_PUBLIC_SUPABASE_URL npm run build`), plus `typecheck`/`lint`/`test`, all clean, before pushing - matches this repo's established verify-before-push discipline from earlier in this multi-day session.
- **Hats Protocol gating** (second half of Zaal's original ask, not built): Zaal wants dashboard access eventually token-gated by a Hats Protocol hat, nested under his existing ZAO tree structure (`ZAO > ZAOfestivals > ZAOstock`). This is explicitly **not buildable yet** - nothing is minted on-chain, and minting requires Zaal's own wallet and gas, which the agent cannot do on his behalf. Zaal asked to "move hats to a new repo, clipboard the start of it" - the agent drafted a starter README (scope, current state, what's needed, open questions, rough wagmi/viem/SIWE architecture) and delivered it as copy-paste text, but did **not** create an actual new GitHub repo (no name/org/visibility was given, and repo creation wasn't explicitly confirmed - see Section A). The draft only exists in this session's scratchpad, not in any repo yet.
- **`/zaoville` page request**: turned out to already exist, live, and complete (hero, lineup, series lineage, gear list, rider CTA, already in `sitemap.ts`) - no build needed. The actual ask resolved to: draft a short copy-paste message to DCoop pointing him at the live page so he can share it. Delivered inline in chat, not sent (per this session's standing pattern of drafting-not-sending outreach).
- **ZAOville livestream vendor research** (carried over from earlier in this session, closed out first): ZAOOS doc 1030 got a new Finding 8 with real, verified DC/Maryland-area AV rental vendors (Breasia Productions, AVALive, Red Star Pictures) for the Jul 25 event, since prior research in that doc was Ellsworth/Maine-specific and didn't help ZAOville at all. Shipped via the established worktree -> commit -> push -> PR -> squash-merge -> `zao-tracker` -> cleanup pattern: `bettercallzaal/ZAOOS#1364`, merged, tracker task `research-doc-1030` fired. A `zao-ask` ping to Zaal was attempted but the tool needs a question-ID the agent didn't have on hand - skipped in favor of just reporting in chat (see Section A for the still-outstanding actual phone call).

## C. Git state

- Repo: `zaostock`, branch `main`, local == `origin/main` at `03c0803`, clean tree except this handoff doc itself (untracked, about to be committed if Zaal wants it kept).
- This session used three short-lived worktrees (`/tmp/zaostock-inactivity`, `/tmp/zaostock-inactivity-fixes`, plus the unrelated `/tmp/zaoos-zaoville-stream` in the ZAOOS repo) - all merged via fast-forward push to `origin/main` and removed (`git worktree remove --force` + `git branch -D`) immediately after. None remain.
- `bettercallzaal/ZAOOS`: PR #1364 merged and squashed into `main`, source branch `ws/zaoville-streaming-vendors` deleted server-side by the squash-merge, worktree cleaned up locally.

## D. In-flight

- Background bash jobs: none pending.
- Subagents pending: none - the one subagent this session (`security-reviewer`) ran to completion and its findings are all fixed and merged.
- Scheduled wakeups: none.
- Open AskUserQuestion: none - all three rounds this session (Hats scope, garbled-message clarification, zaoville page vs. dcoop message split) were answered and acted on.

## E. Cold-start map (read if you are confused)

- Files touched this session (all in `zaostock` unless noted):
  - New: `src/app/api/cron/deactivate-inactive/route.ts`, `src/app/api/team/request-access/route.ts`, `src/app/team/AccessPanel.tsx`, `vercel.json`.
  - Modified: `src/app/api/team/login/route.ts`, `src/app/api/team/members/route.ts` (added PATCH), `src/app/team/Dashboard.tsx`, `src/app/team/LoginForm.tsx`, `src/lib/env.ts` (added `CRON_SECRET`), `src/lib/auth/session.ts` (active-status recheck), `.env.example`.
  - Supabase migration applied directly to the live `zaostock` project (project ref `yjrlaxpjusmrfylumban`): `add_team_inactivity_tracking` - added `last_login_at`, `access_requested_at`, `deactivated_at` columns to `team_members`.
  - `bettercallzaal/ZAOOS` repo: `research/events/1030-zaostock-livestream-media-production/README.md` (Finding 8 added, merged PR #1364).
  - Session scratchpad only (not in any repo): `zao-hats-gate-starter-README.md` - the Hats repo draft, delivered inline in chat, needs to be re-pasted or re-created if a fresh session needs it since scratchpad paths are session-local.
- Skills/tools invoked: `security-reviewer` subagent (1x, found the 4 issues in Section B), `AskUserQuestion` (3x), Supabase MCP (`mcp__supabase__*`, against the zaostock project directly - not the ZAOcowork tracker project).
- Memory writes: none new this session.
- Last-known mental model: the inactivity-lockout feature is code-complete, audited, and live - it just needs `CRON_SECRET` set in Vercel to actually start enforcing anything. Hats gating is genuinely blocked on Zaal (mint a hat, decide the auth model) and has no code yet, just a design doc. The "focus on streaming" arc from earlier in this session is functionally done except for the actual phone call to Breasia/AVALive, which only Zaal can place.

## Inline copy-paste block (for fast receiver paste)

```
Ingest the bundle at /Users/zaalpanthaki/Desktop/repos/zaostock/.handoffs/session-2026-07-14-team-access-hats-streaming/README.md and follow receiver instructions at the top. 6 tasks to absorb.
```
