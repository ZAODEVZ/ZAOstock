# Pre-compact snapshot - lane `zaostock` - 2026-09-09 06:23

Written by a hook, not the model: mechanical state only. The full
transcript is the source; this is the map to it.

## Receiver instructions

1. Read `handoffs/zaostock.md` if it exists (the lane brief) - the standing rules live there.
2. Read the last prompts below; the last one is what the session was doing when it stopped.
3. If a fuller bundle exists with a later timestamp in this directory's parent, prefer it.

## Record

- session: `c4083f56-7bbc-4193-8e08-d4353dd5c752`
- kind: precompact (manual)
- cwd: `/Users/zaalpanthaki/Documents/zaostock`
- branch: `main`
- tmux: `zaostock`
- brief: `/Users/zaalpanthaki/zao-vault/handoffs/zaostock.md`
- previous bundle: `/Users/zaalpanthaki/Documents/zaostock/.handoffs/session-2026-09-07-zaostock-precompact/README.md`
- prompts this session: 85
- transcript: `/Users/zaalpanthaki/.claude/projects/-Users-zaalpanthaki-Documents-zaostock/c4083f56-7bbc-4193-8e08-d4353dd5c752.jsonl`

## Git state

5 uncommitted path(s):

```
M docs/marketing/press-kit.md
?? .handoffs/session-2026-09-01-zaostock-32-days/
?? .handoffs/session-2026-09-03-zaostock-to-zj/
?? .handoffs/session-2026-09-03-zaostock-travel-window/
?? .handoffs/session-2026-09-07-zaostock-precompact/
```

Recent commits:

```
1a26147 handoff: correct my own bundle - it is five drafts, not nine
24b9793 handoff: bundle for the deck lane, with two late corrections
cf57537 Merge pull request #102 from ZAODEVZ/fix/ops-room-31-aug-schedule
b51b675 Merge pull request #104 from ZAODEVZ/ws/obsidian-signby-before-reveal
4b03f85 fix(ops-room): the LF-normalising regex was written with literal newlines
```

## Last prompts (newest last)

- TOOL FOR THE PATHSPEC GAP - use it instead of being careful: python3 scripts/inflight-row.py --lane <lane> --row-file row.txt python3 scripts/inflight-row.py --lane <lane> --show It commits HEAD's copy of IN-FLIGHT.md with ONLY your row replaced, so another lane's unstaged edits are never in the content being committed - then restores their edits to the working tree, so they are not lost either. B ...
- TWO TOOLS NOW EXIST FOR THE SHARED-FILE PROBLEM - whoever owns the second should see this before committing it. scripts/inflight-row.py committed a8e2b71 - REPLACES your row in IN-FLIGHT.md, PROCEEDS when dirty scripts/vault-append-commit.sh UNTRACKED, unclaimed - APPENDS to any shared file, REFUSES when dirty Complementary, not duplicates: append vs replace-my-row, any file vs IN-FLIGHT.md, refus ...
- ZAAL, VERBATIM, JUST NOW: 'stop everything ... close up shop on anything not directly tied to zaostock ... form needs to go out and then pitch deck needs to be finalized'. Every other lane is being parked. You are the only lane working. ORDER: form first, then deck. Form chain is fixed - create it, ARTIST_CONFIRM_SECRET in Vercel and the form's Script properties (route says 503 Not configured even ...
- restart on the bundle and do the deck
- https://bombtheworld.io/eventgallery/zaoville is what attabotty built
- /compact

## Last thing the assistant said

Understood — that URL is the ZAOville *gallery*, not the pitch. You'll compact and then share AttaBotty's actual pitch as the reference. I won't guess at the format until I see it.

Noted on positioning: **sponsor the ZAO Festivals event in Maine** — and I won't write "flagship" until you've decided. It's the kind of word that reads as a claim, and this deck has one already in `$5K public only`.

Two things before you compact, both recorded so they survive it:

**The staged Steve draft is stale — don't send it.** Draft `r-2121594487851335304` was created *before* the DJ was added, and my Gmail expired before I could update it. **Send from the vault body instead:** `projects/zaostock-steve-draft-with-dj-2026-09-08.md` — four addresses, the PA before Friday's gate, *and* the DJ. If the staged one goes as-is, the DJ question is silently lost, and **a sent email looks exactly like success**. Artizen caught it, verified my body was broader than its own draft, and stood its own version down so Steve gets one email rather than two.

**That Steve email is not gated on the form URL** — artizen's point, and it's right. The addresses are the longer pole: four acts have no route and Lyons Den has been unreachable since 31 August. Chased in parallel, Friday still works. Chased in sequence, it doesn't.

State at compact: reveal **13 September, four days**. `503`, **0 of 9 confirmed**. Your three taps on the form, plus a **Gmail reauth** for both lanes. Only five of nine acts are addressable until Steve replies.

When you're back: **AttaBotty's pitch**, and I'll build the page against it with the rules already locked — $5K public only, tiers price on request, no artist pay figures, one flight with no number, 0 of 9 stated honestly, run of show copied from #122.
