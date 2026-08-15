# Which ZAOstock repo is canonical

Settled 2026-08-13. Written because two sessions in a row opened the wrong clone and
lost time to it.

## The answer

**`ZAODEVZ/ZAOstock` is canonical.** It is the only repo where ZAOstock website work
belongs. Everything else named "zaostock" is either archived or a different product.

Local clone: **`~/Documents/ZAOstock-canonical`**

## The full field, so nothing has to be re-litigated

| Repo | State | Verdict |
|---|---|---|
| `ZAODEVZ/ZAOstock` | public, active | **CANONICAL** - the Oct 3 website |
| `bettercallzaal/zao-stock` | ARCHIVED 2026-06-13 | predecessor, read-only |
| `bettercallzaal/zaostock` | ARCHIVED 2026-06-13 | predecessor, read-only |
| `bettercallzaal/zao-festivals` | private, active | **different product** |
| `ZAODEVZ/zaostock` | - | **not a repo.** GitHub is case-insensitive; this resolves to `ZAODEVZ/ZAOstock` |

Both archived predecessors end on the same tombstone commit, which is as explicit as a
repo can be about where it went:

```
bettercallzaal/zao-stock   71353af  2026-06-13  docs: repo moved to ZAODEVZ/ZAOstock
bettercallzaal/zaostock    8122632  2026-06-13  docs: repo moved to ZAODEVZ/ZAOstock
```

`bettercallzaal/zao-festivals` is not a website repo and is not a candidate. Its own
description: "ZAOstock team dashboard, mobile - Expo/React Native, Privy-embedded-wallet
auth over Hats Protocol". Recent pushes there say nothing about the website.

## Local clones on this machine

| Path | Remote | Use it? |
|---|---|---|
| `~/Documents/ZAOstock-canonical` | `ZAODEVZ/ZAOstock` | **YES** |
| `~/Documents/zaostock` | `bettercallzaal/zao-stock` | NO - archived remote |
| `~/Desktop/repos/zaostock` | `ZAODEVZ/ZAOstock` (via lowercase) | correct remote, stale checkout |

The trap is that `~/Documents/zaostock` has the most obvious name and is what a session
lands in by default. It points at an ARCHIVED remote. Work committed there cannot be
pushed and cannot become a PR.

## How to check in one command

```bash
git config --get remote.origin.url
# want: https://github.com/ZAODEVZ/ZAOstock.git
```

If it says anything with `bettercallzaal`, stop and move to
`~/Documents/ZAOstock-canonical`.

## Known stranded work - not resolved here

Two commits exist ONLY on the archived `bettercallzaal/zao-stock` and are absent from
canonical:

```
9c08494  2026-06-13  fix(build): use info@thezao.com, drop dead foreign deps, green build
0aa95a7  2026-06-13  brand(fellenz): ZAO-lead cleanup
```

Canonical's Fellenz commit (`7b6d94b`, COC partnership framing) is different work, so
this is not the same change landed twice. Whether to port these is Zaal's call. Nothing
has been cherry-picked.

Separately, `~/Documents/zaostock` carries two uncommitted edits on branch
`ws/brand-fellenz-zao-lead` - `.gitignore` adding `.gstack/`, and a quote-style change in
`src/lib/index.ts`. They are exposed to a branch switch. Left untouched; deletion and
rescue are both Zaal's.

## Notes for anyone working in the canonical clone

- There is no `.env.local`, only `.env.example`. The homepage is `force-dynamic` and reads
  Supabase at request time, so `/` will not render locally without one.
- Two Supabase projects exist and are easy to confuse. `yjrlaxpjusmrfylumban` is the real
  app DB. `etwvzrmlxeobinrlytza` is the cowork tracker. An empty team mosaic on the
  homepage is the tell that the wrong one is wired up.
