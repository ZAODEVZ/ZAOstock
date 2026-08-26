# Lane audit - 2026-08-25

Written at the end of a session that audited this repo, opened four PRs, and
recovered five stranded handoffs. Every number below was measured today. Not
pushed - committed locally for review.

## 1. Docs versus truth

**The sharpest one.** `src/components/FormsUnavailable.tsx` says "while the write
path is down the forms come off." That was false for two days.
`src/lib/forms-status.ts` carries the same claim. PR #48 guarded four forms and
missed `RSVPForm`, which sits on the homepage at `page.tsx:384` and kept taking
names and email addresses, discarding every one. Confirmed live before fixing:

```
POST /api/events/rsvp -> {"error":"Could not submit right now"}  HTTP 500
```

Fixed in PR #54. Three more components POST without the guard and are still
unguarded: `musicians/rider/RiderForm.tsx`, `artist/[slug]/ArtistProfileView.tsx`,
`circles/CirclesView.tsx`. All token-gated rather than public, so the right
fallback is a different question, but they have the same discard-on-500.

**`docs/CANONICAL-REPO.md`** calls `~/Desktop/repos/zaostock` the "stale
checkout". Backwards as of today: Desktop `main` is 4 commits behind
`origin/main`, `~/Documents/ZAOstock-canonical` is 13 behind. The correction is
in PR #53 and unmerged, so `main` still carries the wrong statement.

**`docs/AUDIT.md`** opens "Compiled 2026-07-17/18" and then a section headed
"BLOCKING - needs Zaal, nothing else matters until this is done". Item 1 of that
section is still not done, 39 days later. The doc is accurate about what it found
and silent about the fact that its blocker outlived it. Anyone reading it today
cannot tell whether it is a live blocker or history. It is live.

**`README.md`** says "Run by [The ZAO](https://zaoos.com)". `zaoos.com` resolves
to `18.204.152.241` and then times out on HTTPS. Dead link on the front page of a
public repo. `thezao.com` answers 301 and works.

**Checked and *not* drift**, so nobody re-opens them: the "24 public routes"
figure in `README.md` and `docs/ARCHITECTURE.md` is right (21 page routes plus
`/llms.txt`, `/robots.txt`, `/sitemap.xml`). The `LICENSE` is MIT and matches what
the GitHub API reports.

## 2. This session

**Set out to** audit the repo. Was asked to fix CI, then add monitoring, then
resolve which clone is canonical, then rescue the handoffs.

**Landed:** PR #51 (hook-order fix, CI green - first green run on any branch since
Aug 24), PR #52 (uptime check on `/api/events`), PR #53 (clone-consolidation doc
plus five redacted handoffs), PR #54 (the RSVP guard). `main` in the Desktop clone
reset off an unredacted local commit and verified clean.

**Still open:** all four PRs unmerged. The Vercel env var and `npm audit fix` are
held pending Zaal. The private-repo question on PR #53 handoffs 4 and 5 is
undecided.

**What I got wrong:**

- **I missed the RSVP form for three turns.** My first audit reported "public
  forms turned off (#48)" as a completed mitigation. I read the switch and
  believed it instead of testing the surface. #48 covered four of five forms, and
  the one it missed is the most prominent on the site. It only surfaced because
  Zaal asked an open-ended "what's left to build" - not because the audit caught
  it. An audit that reads config and does not probe the live surface will keep
  making this mistake.
- **I wrote `CLONE-CONSOLIDATION.md` as an untracked file into a live clone** -
  the exact stranding hazard that doc exists to describe. Another pane then
  committed it, unredacted, alongside a personal Apple ID.
- **My first secret scan claimed "no secrets" when it meant "nothing matching my
  patterns."** The email regex required a TLD, so it could not match `user@IP`.
  `zaal@31.97.148.88` was missed and only turned up later through a
  differently-shaped grep. It is in the already-public 07-18 handoff, not in
  anything this session added, but the scan should have found it.

## 3. Prior sessions - promised, never done

From `.handoffs/` here and `~/zao-vault/handoffs/zaostock.md`:

| Promised | Where | Status |
|---|---|---|
| Fix the Vercel Supabase env var | `docs/AUDIT.md`, 07-17, "BLOCKING" | 39 days, still wrong |
| Set `CRON_SECRET` in Vercel | handoff 07-14 | No evidence it was set; lockout enforces nothing without it |
| Ask Hurric4n3Ike for quote permission | handoff 07-13 | Still pending - the quote is still unpublished |
| Mint the Hat, decide the auth model | handoffs 07-14, 07-15 | No Hats code exists in this repo |
| Set `EXPO_PUBLIC_REOWN_PROJECT_ID` | handoff 07-15 | Wallet still self-disables |
| Add Sentry | handoff 07-15 | Not added |
| Root-cause the mobile blank screen | handoff 07-15 | "Root cause not yet confirmed", never revisited |
| Run the ZAOcowork PR #124 SQL | handoff 07-09 | Different repo, unverified from here |

The pattern is the finding: **every one is a Zaal-only action.** The code half of
these handoffs shipped and merged. The human half was written down in a file
nobody re-reads and nothing tracks. That is why a July blocker is still live in
late August.

## 4. Vault context - where `repo-estate.md` is right and wrong

**Right, and exactly right.** Desktop clone: 27 branches, 0 stashes, 5 unpushed.
Canonical clone: 17 branches, 1 stash, 10 unpushed. I measured both independently
and got the same numbers. The "trap name" call on `ZAOstock-canonical` is correct,
and "keep Desktop" is the right verdict.

**Wrong or imprecise:**

- **"There are only two [stock repos], not three."** Three *distinct* repos exist:
  `ZAODEVZ/ZAOstock` (live), `bettercallzaal/zaostock` (archived),
  `bettercallzaal/zao-stock` (archived). What is true is narrower: the ZAODEVZ
  pair is one repo, and only one stock repo is live. The same note contradicts
  itself - section 2 calls `Documents/zaostock` "a THIRD stock repo" while the
  answered section says there are two.
- **"6 days behind"** measures folder mtime, not history. In commits:
  `ZAOstock-canonical` is 13 behind `origin/main`, Desktop is 4 behind.
- **`Documents/zaostock` uncommitted = 5.** Measured 6: two modified tracked
  files (`.gitignore`, `src/lib/index.ts`) and four untracked.
- **Worktrees are missing from the delete logic.** Both Documents clones have
  worktrees attached - canonical to `Documents/worktrees/zs-pitch-pack-0820-1434`,
  and `Documents/zaostock` to `orca/workspaces/zaostock/main-2`, which is an
  active session. Removing either parent folder without removing the worktree
  first leaves git broken. The note's "safe to delete" reasoning does not account
  for this.

**And the one that changes what Zaal does next.** `~/zao-vault/handoffs/zaostock.md`
says:

> ZAOstock's own Supabase project `yjrlaxpjusmrfylumban` returns **503** ...
> narrowed to credentials or a paused project, still unresolved.

Measured today, twice:

```
https://yjrlaxpjusmrfylumban.supabase.co/rest/v1/  ->  HTTP 401  in 68ms
{"message":"No API key found in request","hint":"No `apikey` request header ..."}
```

That is a live PostgREST instance asking for an API key. Not 503, not paused, not
quota-blocked. **The database is up.** Production is pointed at a different
project entirely - `/api/events` reports `resolvedHost: etwvzrmlxeobinrlytza`,
which is the cowork tracker.

So tap #1 on that brief - *"Is `yjrlaxpjusmrfylumban` in the org he upgraded to
Pro? One look at billing. Blocks three things."* - is chasing the wrong thing. It
should be struck and replaced with the env var change, which is the same fix
`docs/AUDIT.md` named on 2026-07-17.

## Flagged, not done

Nothing irreversible was touched. These need Zaal:

1. **Vercel env vars** on `za-ostock` under *thezao's projects* -
   `NEXT_PUBLIC_SUPABASE_URL` to `yjrlaxpjusmrfylumban`, plus the matching
   service-role key. Unblocks forms, lineup, roster.
2. **`CRON_SECRET`** on the same project.
3. **Merge order:** #51 first, then #50, #52, #53, #54 rebase green.
4. **PR #53 handoffs 4 and 5** - they describe the private `zao-festivals` repo.
5. **`zaal@31.97.148.88`** is public in `main` since `71dfae8`, in the 07-18
   handoff. Pre-existing, not added by anything this session.
6. **`npm audit fix`** - 6 vulns, 5 high, needs a real build check after.
7. **Three unguarded token-gated forms** listed in section 1.
