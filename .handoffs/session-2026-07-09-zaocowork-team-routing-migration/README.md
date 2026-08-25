# Session handoff - 2026-07-09 17:20
> from zaostock (main, clean) -> to fresh CC terminal, same mac
> doc: /Users/zaalpanthaki/Desktop/repos/zaostock/.handoffs/session-2026-07-09-zaocowork-team-routing-migration/README.md
> chain: none

## Receiver instructions (read me FIRST, then do exactly this)

You just received a handoff bundle. Do NOT start work yet. Do this:

1. Read ALL sections below (A through E) before responding to anything.
2. Create TaskList entries from section A. These are the "to do" items.
3. Use section B as your "why" - do NOT re-litigate decisions captured there unless new info surfaces.
4. Use section D to know what's still running (background jobs, wakeups, subagents) - should be none.
5. Use section E as your cold-start map for files, skills, memory state.
6. Once integrated, message back: "Ingested handoff zaocowork-team-routing-migration. N tasks queued. Ready."

## A. Tasks to absorb (paste these into your TODO list)

- [ ] Run the team-routing SQL (below, from ZAOcowork PR #124) in the ZAOcowork Supabase SQL editor - unblocks the `/admin` Users panel, which currently 500s with `column team_members.primary_team does not exist`. ~5 min.
  ```sql
  ALTER TABLE team_members ADD COLUMN IF NOT EXISTS primary_team  TEXT;
  ALTER TABLE team_members ADD COLUMN IF NOT EXISTS secondary_team TEXT;
  -- backfill the two known leads (from PR #124 body, verbatim)
  UPDATE team_members SET primary_team = 'ZAO Devz' WHERE lower(legacy_owner) = 'iman';
  UPDATE team_members SET primary_team = 'WaveWarZ' WHERE lower(legacy_owner) = 'samantha';
  ```
- [ ] Relay the root-cause answer to Zaal's question "we had this before tho why is it not working now" (see Section B) - it's answered but was never actually said back to him before this session moved on to other work.
- [ ] Decide with Zaal whether to formalize the above as `supabase/migrations/019_team_routing.sql` inside `ZAODEVZ/ZAOcowork`. That repo is not cloned locally - would need a fresh clone or worktree first.

## B. Why - decisions + pivots + ruled-out paths

- **zaostock repo health check** (first ask this session): local `main` == `origin/main` == `9673950`, clean tree. No action needed, not revisited.
- **zaostock SEO audit (doc 990, ZAO OS V1)**: ran the full `/zao-research` v2 pipeline. Hit a doc-number collision (988 was taken by a concurrent session; renumbered to 990) and a research-index-guard block (added the missing row to `research/business/README.md`); both resolved without incident. Findings worth remembering: zaostock.com shows zero Google/Bing indexing footprint, `sitemap.ts` is missing 3 live routes (`/festivals`, `/musicians/rider`, `/team/onepager`), `robots.ts` blocks the public `/team/m/` profile pages (contradicts their own stated purpose), no schema.org/JSON-LD anywhere, and - the standout finding - a real, decade-old Indiana charity music festival is *also* called "ZAOSTOCK," so any bare-word external copy should say "ZAOstock 2026" or "ZAOstock Maine," never the bare brand. PR merged: https://github.com/bettercallzaal/ZAOOS/pull/1132. Tracker task fired: `research-doc-990`.
- **ZAOcowork `team_members.primary_team does not exist` bug**: root-caused fully this session. Commit `27f1fe0f` (2026-07-07T17:37:28Z, "feat(admin): team routing - primary/secondary team pickers (doc 989)") added `primary_team`/`secondary_team` to `SELECT_COLUMNS` in `team.ts` unconditionally - no schema-tolerant fallback like `getRoleByLegacyOwner` has elsewhere in the same file. The originating PR, `ZAODEVZ/ZAOcowork#124`, explicitly said in its own body: "DO THIS FIRST (run in Supabase SQL editor, THEN merge)... NOT auto-merged. Held on purpose - merging before the SQL runs breaks the live team read." It was merged anyway at `2026-07-07T21:11:44Z`, roughly 4 hours after that warning was written, without the SQL apparently ever being run against the live database. **This is why Zaal's "we had this before" framing doesn't hold up on the evidence**: the feature never worked in production - it shipped same-day (2026-07-07) with a prose-only merge gate that nobody enforced. Zaal was told this reasoning was being chased down but never actually got the final answer before the session moved to other work - that's the main thing this handoff exists to close out.
  - Ruled out: treating this as "migration was simply never authored" (the flat first-pass answer) - wrong, the SQL exists, it's just never been run. Don't re-litigate that framing.
  - My earlier hand-authored stopgap SQL (a guessed `019_team_routing.sql` with an index but no backfill) is **superseded** by the real PR #124 SQL captured in Section A - use that one, not the earlier guess.
- **`/meeting` on `space_2026-07-09T01-15-11-660Z.mp4`**: this turned out to be a duplicate. The exact same recording was already fully processed as `research/events/994-zabal-gamez-poidh-fireside-unlock-jul8/` (merged `ZAOOS#1137`, 2026-07-08) - full recap + transcript already written. Caught this via the meeting skill's mandatory Pass E entity cross-check (grepping "Mauro" turned up the existing doc) - reinforces that cross-check should never be skipped, it's what prevented a duplicate recap doc. Diarization needed two passes: auto-detect over-clustered to 32 "speakers" on what's really a 4-person call (Zaal, Kenny, Rev/Thy Revolution, Mauro); forcing `ZAO_DIARIZATION_NUM_SPEAKERS=4` fixed it. Since the recap doc already existed, only Phase 4 distribution was actually run this session: 8 actions pushed to the ZAO Devz cowork tracker, 8 Bonfire KG episodes posted, Telegram block printed, next-actions clipboard page opened. The proposed memory write (`project_zao_poker_mauro.md`) turned out to already exist and be indexed - no new write needed. Also corrected in passing: the product is **POIDH**, not "POID" - Whisper mis-transcribed it throughout the raw audio.

## C. Git state

- Branch: `main` (ahead 0, behind 0, dirty 0 files, untracked 0 files)
- Push status: in sync with `origin/main`
- No uncommitted diff - this session made zero local edits inside the `zaostock` repo itself (all reads only). All actual writes this session landed in the separate `ZAO OS V1` repo (docs 990 and the doc-994 distribution, both already merged/posted) and are not reflected in `zaostock`'s git state.

## D. In-flight

- Background bash jobs: none pending - the two backgrounded jobs this session (audio transcription, diarization) both completed and were consumed.
- Subagents pending: none.
- Scheduled wakeups: none.
- Open AskUserQuestion: none - both this session's questions (meeting distribution targets, handoff receiver/targets) were answered.

## E. Cold-start map (read if you are confused)

- Files touched this session:
  - `zaostock` repo: read-only (`layout.tsx`, `robots.ts`, `sitemap.ts`, `next.config.ts`, `package.json`, `README.md`, several `page.tsx` metadata exports) - no edits.
  - `ZAO OS V1` repo (via an isolated worktree, now merged): `research/business/990-zaostock-seo-audit/README.md` (new), `research/business/README.md` (index row added).
  - `ZAO OS V1` memory dir: `project_zao_poker_mauro.md` - verified pre-existing and already indexed in `MEMORY.md`, no new write made.
- Skills invoked: `zao-research` (1x, produced doc 990 + PR #1132 + tracker task `research-doc-990`) - `meeting` (1x, detected duplicate of doc 994, ran only Phase 4 distribution) - `clipboard` (2x, meeting next-actions page + this handoff's boot block).
- Memory writes: none new this session (one candidate write turned out to already exist).
- Last-known mental model: `zaostock` the Next.js repo itself is untouched and healthy this session - all the real work was cross-repo (ZAO OS V1 research + ZAOcowork diagnosis). One concrete unresolved thread remains: the ZAOcowork `/admin` panel is still broken in production because the required SQL from PR #124 has still never been run. Everything else opened this session (SEO audit, meeting recap distribution) is closed out.
- Open questions for the receiver: does Zaal want the PR #124 SQL run right now (needs Supabase SQL editor or MCP access to the ZAOcowork project - not the same Supabase project as zaostock), and does he want it formalized as a numbered migration file in `ZAODEVZ/ZAOcowork` (would need a fresh local clone or worktree, since that repo has never been checked out locally in this environment)?

## Inline copy-paste block (for fast receiver paste)

```
Ingest the bundle at /Users/zaalpanthaki/Desktop/repos/zaostock/.handoffs/session-2026-07-09-zaocowork-team-routing-migration/README.md and follow receiver instructions at the top. 3 tasks to absorb.
```
