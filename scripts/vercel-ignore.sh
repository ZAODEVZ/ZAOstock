#!/usr/bin/env bash
# Vercel ignoreCommand. Exit 0 = SKIP the build, non-zero = BUILD.
#
# Adapted from bettercallzaal/zao-app scripts/vercel-ignore.sh (MIT, Zaal
# Panthaki / The ZAO), itself ported from ZAOOS. Differences here:
#   - It skips by an allowlist of files that never ship (docs, tests, CI),
#     instead of a list of build paths. Anything not on the list builds.
#   - Preview deploys are NOT skipped: ZAOstock PR review uses the preview.
#   - A docs file that the app reads at runtime always builds. /build reads
#     docs/builders/build-on-zaostock-2026-08-29.md and the press kit reads
#     docs/marketing/press-kit.md, so "docs never ship" is false here. Those
#     files are listed in RUNTIME_DOCS below, and scripts/vercel-ignore.test.ts
#     fails if src/ starts reading a docs file the list does not name.
#
# Every decision is logged, and every doubt builds: no diff base, an empty
# diff, or a git error all BUILD.

say() { echo "[vercel-ignore] $*"; }

# 1. Diff base: the previous deploy's SHA, fetched if the shallow clone lacks
#    it. No previous SHA, or one still unreachable after the fetch, BUILDS:
#    falling back to HEAD^ would miss earlier commits in the same push (a code
#    commit followed by a docs commit would skip).
PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$PREV" ]; then
  say "no previous deploy sha -> BUILD (safe default)"
  exit 1
fi
if ! git cat-file -e "$PREV" 2>/dev/null; then
  git fetch --depth=1 origin "$PREV" 2>/dev/null || true
fi
if ! git cat-file -e "$PREV" 2>/dev/null; then
  say "previous deploy sha $PREV is not reachable -> BUILD (safe default)"
  exit 1
fi
BASE="$PREV"

# 2. The changed files. --no-renames lists both sides of a rename, so moving
#    src/x.ts to docs/x.md shows the src path and builds. A git error or an
#    empty list builds.
if ! CHANGED="$(git diff --no-renames --name-only "$BASE" HEAD 2>/dev/null)"; then
  say "git diff failed vs $BASE -> BUILD (safe default)"
  exit 1
fi
if [ -z "$CHANGED" ]; then
  say "no files changed vs $BASE -> BUILD (safe default)"
  exit 1
fi

# 3. Files that never ship: docs, agent notes, tests and CI config.
never_ships() {
  case "$1" in
    public/*) return 1 ;;   # served as-is, markdown included (public/partners/README.md)
    docs/*|.handoffs/*|.agents/*|agents/*|e2e/*|.github/*) return 0 ;;
    *.md) return 0 ;;
    */__tests__/*|*.test.ts|*.test.tsx|*.test.mjs|*.spec.ts|*.spec.tsx) return 0 ;;
    playwright.config.*|vitest.config.*) return 0 ;;
  esac
  return 1
}

# 4. ...unless the app reads that file at runtime. Keep in step with
#    path.join(process.cwd(), 'docs', ...) reads in src/; the test checks it.
RUNTIME_DOCS=(
  docs/builders/build-on-zaostock-2026-08-29.md
  docs/marketing/press-kit.md
)
read_at_runtime() {
  local d
  for d in "${RUNTIME_DOCS[@]}"; do [ "$1" = "$d" ] && return 0; done
  return 1
}

while IFS= read -r f; do
  [ -n "$f" ] || continue
  if ! never_ships "$f"; then
    say "$f can ship -> BUILD"
    exit 1
  fi
  if read_at_runtime "$f"; then
    say "$f is read by the app at runtime -> BUILD"
    exit 1
  fi
done <<EOF
$CHANGED
EOF

say "only docs, tests and CI changed vs $BASE -> SKIP"
exit 0
