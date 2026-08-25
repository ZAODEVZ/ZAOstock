# Which stock clone is real, and what the others are holding

Settled 2026-08-25. `docs/CANONICAL-REPO.md` answered this at the **repo** level on
2026-08-13 and its answer still holds. This doc answers it at the **clone** level,
which is where the current confusion actually lives, and corrects one line of that
older doc that has since gone stale.

Nothing was merged, moved, or deleted to produce this. Read-only.

## The short answer

**`ZAODEVZ/ZAOstock` is the repo. `~/Desktop/repos/zaostock` is the clone to work in.**

The name `~/Documents/ZAOstock-canonical` is the trap. It is named after the canonical
*repo*, which it does point at, but it is the *stalest* of the two clones of that repo.
It is 13 commits behind `origin/main` and sitting on an August 17 feature branch. The
directory with the least authoritative-sounding name is the current one.

**Nothing of value is stranded anywhere.** The one exception is five session handoff
documents on the Desktop clone that were never committed. Everything else that looked
like unmerged work is already in `main` under a different SHA.

## There are two repos, not three

`ZAODEVZ/zaostock` and `ZAODEVZ/ZAOstock` are the same repository. GitHub repo names are
case-insensitive, so the lowercase URL resolves to the capitalized one. Same numeric id,
which is the thing that cannot be faked by a redirect:

```
$ gh api repos/ZAODEVZ/zaostock --jq '{id, full_name}'
{"id":1268591323,"full_name":"ZAODEVZ/ZAOstock"}

$ gh api repos/ZAODEVZ/ZAOstock --jq '{id, full_name}'
{"id":1268591323,"full_name":"ZAODEVZ/ZAOstock"}
```

So the field is:

| Repo | id | State | Verdict |
|---|---|---|---|
| `ZAODEVZ/ZAOstock` | 1268591323 | public, active | **CANONICAL** |
| `ZAODEVZ/zaostock` | 1268591323 | - | same repo, lowercase alias |
| `bettercallzaal/zao-stock` | 1160355507 | archived 2026-06-13 | predecessor, read-only |
| `bettercallzaal/zaostock` | 1224473012 | archived 2026-06-13 | second predecessor, read-only |

Independently reached the same way by the bczstrat lane on the same day, from the same
case-insensitivity fact. Two repos, not three - earlier counts that said three were
double-counting the alias.

The fourth one is worth knowing about even though nobody asked: there are two archived
predecessors, not one, and both end on the same `docs: repo moved to ZAODEVZ/ZAOstock`
tombstone.

## The three clones

| Path | Remote | `main` vs `origin/main` | Last fetch | Verdict |
|---|---|---|---|---|
| `~/Desktop/repos/zaostock` | `ZAODEVZ/zaostock` (= canonical) | behind 4 | 2026-08-25 | **WORK HERE** |
| `~/Documents/ZAOstock-canonical` | `ZAODEVZ/ZAOstock` | behind 13 | 2026-08-20 | same repo, stale clone |
| `~/Documents/zaostock` | `bettercallzaal/zao-stock` | n/a, archived | 2026-08-25 | dead lineage |

Both Documents paths mislead in opposite directions. `ZAOstock-canonical` sounds
authoritative and is not current. `zaostock` sounds like the obvious default and points
at an archived remote where nothing can be pushed.

### Correction to `docs/CANONICAL-REPO.md`

That doc says, under "Local clones on this machine":

> `~/Desktop/repos/zaostock` | `ZAODEVZ/ZAOstock` (via lowercase) | correct remote, stale checkout

The remote note is right. The staleness note is now backwards: as of today, Desktop is
4 commits behind and `ZAOstock-canonical` is 13 behind. Whichever clone gets used stays
current and the other rots, so this will invert again unless the loser is deleted. That
is the argument for consolidating rather than re-checking every few weeks.

## What the other two hold that canonical does not

### Short version

| Source | Unique commits with content not in `main` | Worth keeping |
|---|---|---|
| Desktop clone | 0 | 5 uncommitted handoff docs |
| ZAOstock-canonical | 0 | nothing |
| Documents/zaostock (archived) | 2, both unportable | nothing |

### The nine branch tips that are not on the remote

Six on Desktop, three on ZAOstock-canonical. All nine are pre-squash SHAs. When a PR is
squash-merged, the branch's original commits never appear on `main` even though every
line of their content does, so "not on the remote" reads as stranded work when it is not.

Tested by diffing each branch against `origin/main` restricted to the files that branch
touched. Empty diff means the content already landed:

| Clone | Branch | Verdict |
|---|---|---|
| Desktop | `feat/zaostock26-brand-assets` | content in `main` (#42) |
| Desktop | `pr42` | duplicate of the above, same SHA |
| Desktop | `ws/zaostock-brand-migration-plan` | content in `main` (#43) |
| Desktop | `ws/zaostock-docs-architecture` | content in `main` (#44) |
| Desktop | `ws/zaostock-lineup-degradation` | content in `main` (#41) |
| Desktop | `ws/zaostock-2391-program-rebuild` | **superseded**, see below |
| canonical | `ws/zaostock-festivals-lane-0805` | content in `main`, 7 commits |
| canonical | `ws/zaostock-locals-first-reorder-0813` | content in `main`, 2 commits |
| canonical | `pr17-head` | junk, `test: webhook ping verify (delete this PR)`, May 3 |

`ws/zaostock-2391-program-rebuild` is the only one whose diff against `main` is not
empty, and it is stale rather than stranded. It landed as #40 on Aug 23, then #47
replaced that whole design on Aug 24:

```
704e51f 2026-08-24 program: outdoors till six, then indoors - replaces the alternating design (#47)
d343349 2026-08-23 program: rebuild the public schedule from the run of show (doc 2391) (#40)
```

Restoring it would undo #47. Delete the branch, do not merge it.

Five further branches on these clones have no upstream at all and look unpushed
(`ws/audit-fixes-web`, `ws/haptics-and-profile-fix`, `ws/ellsworth-page`,
`ws/onepagers-resilience`, `ws/session-failclosed`). Every one has zero commits absent
from the remote. They are ancestors of `main`. Nothing to rescue.

### The five handoff docs. This is the only real find.

`~/Desktop/repos/zaostock/.handoffs/` holds six session directories. One is committed on
`main`. Five are untracked and exist nowhere else, on no remote and in no other clone:

```
session-2026-07-09-zaocowork-team-routing-migration   67 lines
session-2026-07-13-budget-reconcile-artizen-page      63 lines
session-2026-07-14-team-access-hats-streaming         70 lines
session-2026-07-15-privy-to-walletconnect-hats-base   64 lines
session-2026-07-15-zao-festivals-testflight           70 lines
```

334 lines of July session history, covering the team routing migration, the budget
reconcile, Hats-based team access, the Privy to WalletConnect move, and the TestFlight
push. `.handoffs/session-2026-07-18-park-zaostock-zaofestivals/README.md` from the same
run **is** committed, so the pattern is clearly meant to be tracked and these five simply
never were.

They are one `git checkout` of a branch that touches `.handoffs/` away from being
confusing, and one `rm -rf` of the wrong directory away from being gone.

### The stash on ZAOstock-canonical

```
stash@{0}: WIP on main: e2c2c42 chore(ellsworth): refresh content comment
```

Dated 2026-08-05. Contents: one line added to `.gitignore`, `.gstack/`. That is the whole
stash. Drop it.

Note for whoever clears it: `ZAOstock-canonical` has a second worktree at
`~/Documents/worktrees/zs-pitch-pack-0820-1434` and the stash stack is shared across
worktrees of the same clone. Drop by SHA, not by `stash@{0}`, in case something else
pushed onto the stack in between.

### The archived clone

Two commits exist only on `bettercallzaal/zao-stock`:

```
9c08494  2026-06-13  fix(build): use info@thezao.com, drop dead foreign deps, green build
0aa95a7  2026-06-13  brand(fellenz): ZAO-lead cleanup
```

`docs/CANONICAL-REPO.md` left porting these as Zaal's call. They are not portable. They
edit `src/app/stock/page.tsx`, `src/app/talks/page.tsx`, `src/lib/farcaster.ts` and
`src/lib/index.ts`, none of which exist in the canonical repo. It is a different site.

Their intent is already satisfied independently: `info@thezao.com` appears across
canonical in `content/pitch-pack/`, `docs/audit/`, and `docs/outreach/`, and the Fellenz
ZAO-lead framing is in `content/pitch-pack/deck-words.md` and `src/app/sponsor/page.tsx`.

Two uncommitted edits sit in the same clone: `.gitignore` gaining `.gstack/`, and a
single-quote-to-double-quote change in `src/lib/index.ts`, a file canonical does not
have. Both discardable.

## Merge plan

Nothing here has been run. Steps 1 and 2 are the only ones that move content.

### 1. Rescue the five handoff docs - DONE, this PR

The only step that recovers anything, and the reason this PR exists. All five are
committed here alongside this doc.

```bash
# what this PR ran
cd ~/Desktop/repos/zaostock
git fetch origin
git checkout -b ws/zaostock-rescue-july-handoffs origin/main
git add -f .handoffs/session-2026-07-09-zaocowork-team-routing-migration \
             .handoffs/session-2026-07-13-budget-reconcile-artizen-page \
             .handoffs/session-2026-07-14-team-access-hats-streaming \
             .handoffs/session-2026-07-15-privy-to-walletconnect-hats-base \
             .handoffs/session-2026-07-15-zao-festivals-testflight
git commit -m "docs: commit the five July session handoffs that were never tracked"
```

They were read in full and scanned before being committed, because this repo is public
and they are unreviewed session notes. No credentials, tokens or keys were present. Five
things were redacted, each replaced in place with a marker and flagged by a note at the
top of the affected file:

| Redacted | Where | Why |
|---|---|---|
| A personal Apple ID email | TestFlight handoff | Personal address, not a work one, published nowhere else |
| Apple Team ID and App Store Connect app ID | TestFlight handoff | Account identifiers for an individual developer enrollment |
| A third-party company's name | TestFlight handoff, twice | Named alongside an expired membership; not ours to publish |
| An unpublished testimonial quote | Artizen handoff | Permission from its author is still pending, per that same file's own task list |
| The real budget target and cash on hand | Artizen handoff | Internal financial position, not public anywhere else |

Deliberately left in: business vendor phone numbers (published), the Hats Protocol
contract address (public), the Supabase project ref (already in `docs/CANONICAL-REPO.md`),
and `PRIVY_VERIFICATION_KEY` / `CRON_SECRET` named without values. "Roddy Ehrlenbach,
City of Ellsworth Parks/Rec" was also left in: "Roddy at City Hall" is already public in
`src/app/onepagers/overview/page.tsx`, so the surname is an increment rather than a new
exposure. Say so if that call should go the other way.

One thing the scan surfaced that is not a publishing question: handoffs 4 and 5 describe
`bettercallzaal/zao-festivals` in real detail, and that repo is **private**. Its file
layout, auth architecture and four bug post-mortems are now in a public repo. That was a
deliberate, approved call, noted here so it is on the record rather than discovered later.

### 2. Decide on `.claude/settings.json`

Untracked in all three clones and on no remote. The three copies may differ. Either
commit one deliberately or add `.claude/` to `.gitignore`, but pick one, because right
now it is invisible state that changes behaviour depending on which directory a session
lands in.

### 3. Retire `~/Documents/ZAOstock-canonical`

Confirm it holds nothing first, then remove it. Two worktrees are attached and the
worktree must go first or git leaves a broken registration behind:

```bash
cd ~/Documents/ZAOstock-canonical
git status --porcelain            # expect: only .claude/settings.json, .gstack/
git stash list                    # expect: the one .gitignore WIP, droppable
git worktree remove ~/Documents/worktrees/zs-pitch-pack-0820-1434
cd ~ && rm -rf ~/Documents/ZAOstock-canonical
```

`ws/pitch-pack-0820-1434` is pushed, so removing that worktree loses nothing.

### 4. Leave `~/Documents/zaostock` alone for now

It is dead, but it is not free to delete. An orca worktree is attached at
`~/orca/workspaces/zaostock/main-2` and deleting the parent clone breaks it. Remove the
worktree first, and only when no session is using it:

```bash
cd ~/Documents/zaostock
git worktree list                 # confirm nothing else is attached
git worktree remove ~/orca/workspaces/zaostock/main-2
cd ~ && rm -rf ~/Documents/zaostock
```

The two uncommitted edits and the two stranded commits die with it, which is correct.

### 5. Prune the stale branches in the Desktop clone

27 local branches, most of them July mobile-audit work that merged long ago. After step 1:

```bash
cd ~/Desktop/repos/zaostock
git fetch --prune origin
git branch --merged origin/main | grep -v ' main$'      # review before deleting
git worktree prune                                       # clears /private/tmp/wt-fs, wt-press
```

Delete `pr42`, `ws/zaostock-2391-program-rebuild`, and the `pr*-head` branches explicitly.
They are pre-squash duplicates and one actively harmful revert.

### 6. Rename what is left

Once Desktop is the only clone, the name `~/Desktop/repos/zaostock` is the last piece of
the trap, since it matches the archived clone's basename. Renaming it to
`~/Desktop/repos/ZAOstock` and updating `docs/CANONICAL-REPO.md` to point at it closes
this out. Not urgent, but it is the reason this doc had to be written at all.

## How to re-check any of this in one command

```bash
git config --get remote.origin.url     # want: ZAODEVZ/ZAOstock or ZAODEVZ/zaostock
git log --oneline -1 origin/main       # after a fetch, compare to GitHub
```

To check whether a branch that looks unmerged actually is, compare it against `main` on
only the files it touched. An empty result means it was squash-merged and the branch is
safe to delete:

```bash
mb=$(git merge-base origin/main "$BRANCH")
git diff --stat origin/main "$BRANCH" -- $(git diff --name-only "$mb" "$BRANCH")
```
