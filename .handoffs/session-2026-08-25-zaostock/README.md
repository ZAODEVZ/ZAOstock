# Session handoff - 2026-08-25 (lane: zaostock)
> from ~/Desktop/repos/zaostock, branch `ws/zaostock-lane-audit-0825` -> to the next session via `claude --resume`
> doc: .handoffs/session-2026-08-25-zaostock/README.md
> chain: none. Related: the five July bundles in this same directory, committed today in PR #53.

Orca wind-down. Everything is committed. Nothing was pushed after PR #54.

## Resume point - exact

```bash
cd ~/Desktop/repos/zaostock
git checkout ws/zaostock-lane-audit-0825     # where this session ended
git fetch origin && gh pr list -R ZAODEVZ/ZAOstock --state open
```

Nothing is half-done. No file was left mid-edit. **First question on resume: did
#51 merge?** Everything else keys off that.

## A. State - five PRs open, one of them green

| PR | What | CI | Note |
|---|---|---|---|
| #51 | Hook-order fix, unblocks CI | **green** | Merge this first. Nothing else can go green until it does |
| #54 | Homepage RSVP form was still discarding submissions | red (inherited) | The urgent one. Fix is 13 lines |
| #52 | Uptime check on `/api/events` | red (inherited) | Files one issue on merge - correct, the site is down |
| #53 | Clone-consolidation doc + five redacted July handoffs | red (inherited) | Blocked on a Zaal decision, see taps |
| #50 | Press kit at `/press` | red (inherited) | Pre-existing, not this session's |

All four reds are the same 48 `rules-of-hooks` errors #48 put on `main`. They are
not defects in those branches. #51 clears every one.

**Merge order: #51, then rebase #54, #52, #53, #50.**

Committed and deliberately **not pushed**: `docs/audit/2026-08-25-lane-audit.md`
on this branch (`87b3c88`). It is the four-part lane audit - doc drift, an honest
account of what this session got wrong, eight dead promises from the July
handoffs, and corrections to `~/zao-vault/notes/repo-estate.md`.

## B. Why the state looks like this

- `main` in this clone briefly carried `1b805eb`, an unredacted commit from
  another pane containing a personal Apple ID, an Apple Team ID, a third-party
  company name and an unpermissioned quote. It was never pushed. `main` was reset
  with `git branch -f main origin/main` and verified: on no branch, in no
  reachable history, on no remote. **Do not resurrect it from the reflog.** Its
  two pieces of non-sensitive work were preserved - `.claude/settings.json` is
  restored to disk untracked, and its 3-line `.gitignore` change is recorded in
  the audit doc.
- The homepage RSVP form was never covered by #48. It kept taking names and email
  addresses and discarding them for two days. Found by probing production, not by
  reading config - that lesson is written into the audit doc.
- `ZAODEVZ/zaostock` and `ZAODEVZ/ZAOstock` are one repo (id `1268591323`). Three
  distinct stock repos exist in total; only one is live. Full reasoning in
  `docs/CLONE-CONSOLIDATION.md`, which is in PR #53.

## C. Open Zaal-taps - nothing below can be done by an agent

1. **The Vercel env var.** `za-ostock` project, under **thezao's projects**, not a
   personal account. `NEXT_PUBLIC_SUPABASE_URL` -> `https://yjrlaxpjusmrfylumban.supabase.co`
   plus the matching service-role key. This is `docs/AUDIT.md`'s BLOCKING #1 from
   2026-07-17, still unfixed 39 days later. It is why the forms are off, why the
   lineup runs on a fallback, and why the roster is empty.
   **Correction worth acting on:** `~/zao-vault/handoffs/zaostock.md` says this
   project returns 503 and may be paused, and asks Zaal to check billing.
   Measured twice today it returns **401 in 68ms** with a live PostgREST body.
   The database is up. Production is pointed at `etwvzrmlxeobinrlytza`, the cowork
   tracker. Strike the billing tap.
2. **`CRON_SECRET`** on the same Vercel project. The inactivity lockout has been
   code-complete since July and enforces nothing without it.
3. **PR #53, handoffs 4 and 5.** They describe the *private*
   `bettercallzaal/zao-festivals` - file layout, auth architecture, four bug
   post-mortems. Merging publishes that into a public repo. Approved once already;
   confirm before merge or drop those two files.
4. **`npm audit fix`** - 6 vulns, 5 high (sharp/libvips, brace-expansion,
   postcss). Needs a real build check after, not a blind apply.
5. **`zaal@31.97.148.88`** is public in `main` since `71dfae8`, in the already-
   tracked 07-18 handoff. Pre-existing, not added by this session. Decide.
6. **Three token-gated forms** still discard on 500: `musicians/rider/RiderForm.tsx`,
   `artist/[slug]/ArtistProfileView.tsx`, `circles/CirclesView.tsx`. A mailto is
   probably wrong for an artist mid-rider, so this needs a call, not a sweep.

## D. In-flight

Nothing. No background jobs, no subagents, no scheduled wakeups, no open
questions. No Orca Run is bound to this terminal, so this lane has no
orchestration task and no `worker_done` was fired.

## E. Cold-start map

- **Work here:** `~/Desktop/repos/zaostock` -> `ZAODEVZ/ZAOstock`. Not
  `~/Documents/ZAOstock-canonical` (13 commits behind, trap name) and never
  `~/Documents/zaostock` (archived remote, nothing can be pushed from it).
- **Written this session:** `docs/CLONE-CONSOLIDATION.md` (in #53),
  `docs/audit/2026-08-25-lane-audit.md` (this branch, unpushed), five redacted
  July handoffs in `.handoffs/` (in #53), `src/app/RSVPForm.tsx` guard (#54),
  `.github/workflows/uptime.yml` (#52), the four form guards (#51).
- **Read before re-auditing:** `docs/AUDIT.md` is dated 2026-07-17 and its
  BLOCKING item is still live - it reads like history and is not.
  `docs/CANONICAL-REPO.md` calls this clone the stale one, which is now backwards;
  #53 carries the correction.
- **Untracked here on purpose:** `.claude/settings.json`. It holds the push and
  reset denials on `main`. Whether to track it is an open decision, not an
  oversight - see step 2 of `docs/CLONE-CONSOLIDATION.md`.
- **What is left to build**, in priority order: the env var, then forms that
  survive an outage (the API routes 500 and drop the submission - `forms-status.ts`
  says so itself), then the roster and photos placeholders on the homepage, then
  route-level tests (40 routes, 1 test). Hats gating and wallet-connect are parked
  and should stay parked - both are blocked on Zaal's wallet.
