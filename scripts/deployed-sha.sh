#!/usr/bin/env bash
# Is production serving main? Answer this BEFORE believing any page check.
#
#   bash scripts/deployed-sha.sh [base-url]
#
# WHY. 2026-09-10: #156 merged as 006aab9 and deployed "success" at 12:05:00.
# #155 (92c4aad, one commit BEHIND it) finished at 12:06:11 and was promoted
# over it. GitHub said merged, Vercel said success twice, and production served
# the older build for minutes while every page check read the old copy and
# looked like a copy bug. "Merged" is not live, and "deployed: success" is not
# live either.
#
# HOW. Ask the site itself first: /api/build returns the commit the serving
# build was made from (VERCEL_GIT_COMMIT_SHA, baked in at build). If that route
# is absent (a build from before it existed), fall back to the GitHub
# deployments API for environment Production: the newest deployment whose
# latest status is success - never simply the newest, or a build still running
# reads as the live one. The fallback is an inference from records and the
# output says so.
#
# Every run prints the deployed SHA, main's head and the behind-by count, even
# when they match, so the number can be checked later.
#
# EXIT
#   0  production is serving main's head
#   3  UNVERIFIABLE: production is behind (or ahead of, or unrelated to) main,
#      or the deployed SHA could not be read. Not a pass and not a failure -
#      "not yet" is not "wrong". Wait for the deploy, then re-run.
#
# Overrides for the red control: DEPLOYED_SHA=<sha> skips the lookup and
# compares that SHA against main.
set -u

BASE="${1:-${BASE:-https://zaostock.com}}"
BASE="${BASE%/}"
REPO="ZAODEVZ/ZAOstock"

MAIN_SHA="$(gh api "repos/$REPO/commits/main" --jq .sha 2>/dev/null)"
if [ -z "$MAIN_SHA" ]; then
  echo "  UNVERIFIABLE  could not read main's head from GitHub"
  exit 3
fi

SOURCE=""
DEPLOYED="${DEPLOYED_SHA:-}"
if [ -n "$DEPLOYED" ]; then
  SOURCE="override (DEPLOYED_SHA)"
else
  BUILD="$(curl -s --max-time 20 -H 'Cache-Control: no-cache' "$BASE/api/build")"
  DEPLOYED="$(printf '%s' "$BUILD" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("sha") or "")' 2>/dev/null)"
  if [ -n "$DEPLOYED" ]; then
    SOURCE="$BASE/api/build (read from the serving build)"
  elif [ "$BASE" != "https://zaostock.com" ]; then
    # The deployments API describes PRODUCTION. Borrowing it for another host
    # (localhost, a fixture, a preview) would report on a different server.
    echo "  UNVERIFIABLE  $BASE/api/build gave no sha, and the deployments API only describes https://zaostock.com"
    echo "                main ${MAIN_SHA:0:7}"
    exit 3
  else
    DEPLOYED="$(python3 - "$REPO" <<'PY' 2>/dev/null
import json, subprocess, sys
repo = sys.argv[1]
def api(path):
    return json.loads(subprocess.run(["gh", "api", path], capture_output=True, text=True, check=True).stdout)
for d in api(f"repos/{repo}/deployments?environment=Production&per_page=15"):
    statuses = api(f"repos/{repo}/deployments/{d['id']}/statuses?per_page=1")
    if statuses and statuses[0].get("state") == "success":
        print(d["sha"])
        break
PY
)"
    [ -n "$DEPLOYED" ] && SOURCE="GitHub deployments API, newest SUCCESSFUL Production deployment (INFERRED from records, not read from the site)"
  fi
fi

if [ -z "$DEPLOYED" ]; then
  echo "  UNVERIFIABLE  could not read the deployed SHA ($BASE/api/build gave no sha, and no successful Production deployment was found)"
  echo "                main ${MAIN_SHA:0:7}"
  exit 3
fi

CMP="$(gh api "repos/$REPO/compare/${DEPLOYED}...${MAIN_SHA}" --jq '"\(.status) \(.ahead_by) \(.behind_by)"' 2>/dev/null)"
STATUS="${CMP%% *}"
REST="${CMP#* }"
BEHIND="${REST%% *}"   # commits main has that production lacks
AHEAD="${REST#* }"     # commits production has that main lacks

LINE="deployed ${DEPLOYED:0:7}, main ${MAIN_SHA:0:7}, production behind main by ${BEHIND:-?} (source: $SOURCE)"
if [ "$STATUS" = "identical" ]; then
  echo "  PASS  production is serving main: $LINE"
  exit 0
fi
case "$STATUS" in
  ahead)    echo "  UNVERIFIABLE  production is NOT serving main yet: $LINE. Wait for the deploy, then re-run" ;;
  behind)   echo "  UNVERIFIABLE  production is AHEAD of main by ${AHEAD}: $LINE" ;;
  diverged) echo "  UNVERIFIABLE  production and main have diverged (behind ${BEHIND}, ahead ${AHEAD}): $LINE" ;;
  *)        echo "  UNVERIFIABLE  could not compare deployed ${DEPLOYED:0:7} with main ${MAIN_SHA:0:7} (source: $SOURCE)" ;;
esac
exit 3
