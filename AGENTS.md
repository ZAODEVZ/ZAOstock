<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Start here, whoever you are

**Everything you need is in this repository.** Read
[`CONTRIBUTING.md`](CONTRIBUTING.md) first - it has the real workflow, the
setup, and the checks CI will run on your pull request. Then
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the app is put together.

**You do not need credentials to contribute.** `npm ci` then `npm run typecheck`,
`npm run lint`, `npm run test` and `npm run build` all run without any secret,
which is exactly what CI does on every pull request
(`.github/workflows/ci.yml`). Only `npm run dev` against live data wants the
Supabase values in `.env.example`, and a visual or structural change usually
does not need them.

Every fact about the festival that appears on the site is checked by
`npm run check:facts`, and the content indexes are enforced by
`src/content/registry.test.ts` - so a missing index row fails the build rather
than leaving a file nobody can find. Read the error; it names the fix.

## ZAO shared reality (2026-09-10, plan 5) - INTERNAL, and not reachable from a clone

**The paths in this section live on ZAO maintainers' own machines, not in this
repository.** If you cloned this repo, none of them exist for you and nothing
below is a prerequisite for contributing - skip to the section above. This is
recorded rather than deleted because it is still the right instruction for the
people it was written for.

Before agentic work in this repo, ZAO maintainers read `~/zao-vault/GENESIS.md`
(the constitution), `~/zao-vault/BLACKBOARD.md` (live state) and
`~/zao-vault/AGENTS.md` (registry and the one-screen checklist).
`~/zao-vault/SYSTEM_MAP.md` says what exists; `~/zao-vault/DECISIONS.md` says
what is already decided. Antigravity workspace rules for this repo live at
`.agents/rules/zao.md`, which IS in the clone; the `/grill-me` workflow is
generated, never hand-edited
(`zao-vault/scripts/render-antigravity-workflows.sh --check`).
Spec: `zao-vault/projects/agentic-infrastructure-spec-2026-09-09.md`.

This section is appended after the `next dev`-owned block above and is not
touched by it; do not move it inside the `BEGIN`/`END` markers.
