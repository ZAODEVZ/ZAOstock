#!/usr/bin/env bash
#
# ZAOstock reveal-day preflight.
#
# WHY THIS EXISTS
#   On 2026-09-07 the reveal gate opened exactly on time, the endpoint answered
#   correctly, and the bill was empty because no row was `confirmed`. Every
#   individual thing worked. Nobody ran the one check that would have caught it,
#   because that check lived in a person's head rather than in a command.
#
#   This is that check, plus the others learned since, in one command that says
#   PASS or FAIL rather than printing output for a human to interpret at 6am.
#
# USAGE
#   scripts/reveal-preflight.sh            # against production
#   BASE=https://staging.example scripts/reveal-preflight.sh
#
# EXIT CODE (split 2026-09-10, so a wrapper can tell "wrong" from "could not tell")
#   0 = no FAIL and nothing UNVERIFIABLE (INFO lines allowed)
#   1 = at least one FAIL, nothing unverifiable
#   2 = nothing FAILed, but at least one check was UNVERIFIABLE
#   3 = both
#   A check that cannot run is never silent and never a pass: it is
#   UNVERIFIABLE, which is its own exit bit rather than a failure.

set -o pipefail

BASE="${BASE:-https://zaostock.com}"
FAILURES=0
UNVERIFIED=0

pass() { printf '  \033[32mPASS\033[0m  %s\n' "$1"; }
fail() { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; FAILURES=$((FAILURES + 1)); }
warn() { printf '  \033[33mUNVERIFIABLE\033[0m  %s\n' "$1"; UNVERIFIED=$((UNVERIFIED + 1)); }
# INFO is a true fact about the artists, not a fault in the software. It never
# changes the exit code. Since there is no reveal morning (2026-09-10), an empty
# or partial bill is the NORMAL state until photos arrive; calling it FAIL would
# read red for days and train everyone to skip this script.
info() { printf '  \033[36mINFO\033[0m  %s\n' "$1"; }

echo
echo "ZAOstock reveal preflight against ${BASE}"
echo "  $(date -u '+%Y-%m-%dT%H:%MZ')"
echo

# THERE IS NO REVEAL DATE since 2026-09-10 (Zaal: "stop making a whole reveal
# date"). An act publishes when its own row is confirmed with a bio and a photo
# (src/lib/lineup-reveal.ts). So this no longer checks a gate date; it checks
# that no reveal date has crept back, and what the bill actually shows.
echo "  gate: per artist (confirmed + bio + photo), no reveal date"
echo

echo "0. Is production serving main? (every result below is about THAT build)"
# 2026-09-10: a merge deployed "success" and was then overwritten by an OLDER
# build that finished later. Page checks read the old copy with nothing
# failing. So say which build we are about to read, before reading it.
if bash "$(dirname "${BASH_SOURCE[0]}")/deployed-sha.sh" "$BASE"; then
  :
else
  warn "production is not verifiably serving main - results below may describe an older build"
fi
echo

echo "1. The lineup endpoint"
BODY="$(curl -sf --max-time 20 "${BASE}/api/events/zaostock/lineup")"
if [ $? -ne 0 ] || [ -z "$BODY" ]; then
  warn "lineup endpoint unreachable - this is NOT 'no artists yet'"
else
  pass "reachable"
  echo "        ${BODY}"

  COUNT="$(printf '%s' "$BODY" | python3 -c 'import sys,json; print(len(json.load(sys.stdin).get("artists",[])))' 2>/dev/null)"
  if [ -z "$COUNT" ]; then
    warn "could not parse the artists array"
  elif [ "$COUNT" -gt 0 ]; then
    pass "${COUNT} act(s) on the bill"
  else
    # Zero published is NOT a failure any more: nobody has sent a complete
    # bio and photo yet. It is never silent either - it prints the endpoint's
    # own reason, so "nobody confirmed" and "photo not in" read differently.
    WHY="$(printf '%s' "$BODY" | python3 -c 'import sys,json; b=json.load(sys.stdin); print("withheld: %s, pending: %s" % (b.get("withheld"), b.get("pending")))' 2>/dev/null)"
    if [ -z "$WHY" ]; then
      warn "zero acts published and the reason fields are unreadable"
    else
      info "zero acts published yet (${WHY}). Nobody gets a post until they appear here"
    fi
  fi

  # THE BILL, NOT JUST "MORE THAN ZERO" (#148). Compare what is published
  # against LINEUP_NAMES and name who is missing. What changed on 2026-09-10 is
  # only the SEVERITY: with no reveal morning, a partial bill is the normal
  # state for weeks, so it is INFO. Two things stay FAIL because they mean
  # something is actually wrong:
  #   - a published act NOT on the bill (a stale confirmed row - Hurricane left
  #     the bill that day)
  #   - a published act WITHOUT a bio or photo (the per-artist gate has broken)
  if [ -n "$COUNT" ] && [ "$COUNT" -gt 0 ]; then
    BILL="$(printf '%s' "$BODY" | python3 -c '
import sys, json, re
names = [a.get("name", "") for a in json.load(sys.stdin).get("artists", [])]
m = re.search(r"LINEUP_NAMES[^=]*=\s*\[(.*?)\];", open("src/content/site.ts").read(), re.S)
bill = re.findall(r"\x27([^\x27]+)\x27", m.group(1)) if m else []
print("EXPECTED", len(bill))
print("MISSING", ", ".join(n for n in bill if n not in names))
print("EXTRA", ", ".join(n for n in names if n not in bill))
' 2>/dev/null)"
    INCOMPLETE="$(printf '%s' "$BODY" | python3 -c '
import sys, json
arts = json.load(sys.stdin).get("artists", [])
print(", ".join(a.get("name", "?") for a in arts if not str(a.get("bio") or "").strip() or not str(a.get("photo_url") or "").strip()))
' 2>/dev/null)"
    if [ -n "$INCOMPLETE" ]; then
      fail "published WITHOUT a bio or photo: ${INCOMPLETE} - the per-artist gate has broken"
    fi
    EXPECTED="$(printf '%s\n' "$BILL" | sed -n 's/^EXPECTED //p')"
    MISSING="$(printf '%s\n' "$BILL" | sed -n 's/^MISSING //p')"
    EXTRA="$(printf '%s\n' "$BILL" | sed -n 's/^EXTRA //p')"
    if [ -z "$EXPECTED" ] || [ "$EXPECTED" -eq 0 ]; then
      warn "could not read LINEUP_NAMES from src/content/site.ts to compare the bill"
    else
      if [ -n "$EXTRA" ]; then
        fail "published but NOT on the bill: ${EXTRA}"
      fi
      if [ -n "$MISSING" ]; then
        info "${COUNT} of ${EXPECTED} acts published. Still waiting on: ${MISSING}"
      elif [ -z "$EXTRA" ]; then
        pass "all ${EXPECTED} acts of the bill are published"
      fi
    fi
  fi

  case "$BODY" in
    *'"reveal_date"'*) fail "endpoint still carries reveal_date - the per-artist gate is not what is deployed" ;;
    *)                 pass "endpoint carries no reveal date" ;;
  esac
fi
echo

echo "2. The app's slug resolves to the same answer"
APP_BODY="$(curl -sf --max-time 20 "${BASE}/api/events/zaostock-2026/lineup")"
if [ $? -ne 0 ]; then
  warn "the app's slug is unreachable - the mobile app reads this one"
elif [ "$APP_BODY" = "$BODY" ]; then
  pass "zaostock-2026 matches zaostock"
else
  fail "the two slugs DISAGREE - the app and the site would show different bills"
fi
echo

echo "3. Public surfaces"
for path in "" "program" "press" "lineup" "sponsors"; do
  CODE="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "${BASE}/${path}")"
  case "$CODE" in
    200|307|308) pass "/${path:-} -> ${CODE}" ;;
    *)           fail "/${path:-} -> ${CODE}" ;;
  esac
done
echo

echo "4. The press kit promises no reveal day"
# MATCHED WITHOUT A PIPE, ON PURPOSE. `set -o pipefail` plus `grep -q`
# manufactures FALSE FAILURES (grep exits early, the producer dies of SIGPIPE),
# so a shell pattern match is used instead of a pipe.
PRESS="$(curl -sf --max-time 20 "${BASE}/press")"
if [ -z "$PRESS" ]; then
  warn "/press unreachable - read it yourself before posting"
else
  case "$PRESS" in
    *"13 September"*|*"reveal on"*|*"Lineup reveal"*)
      fail "/press still promises a reveal day - there is none since 2026-09-10" ;;
    *)
      pass "/press promises no reveal day" ;;
  esac
fi
echo

if [ "$FAILURES" -eq 0 ] && [ "$UNVERIFIED" -eq 0 ]; then
  printf '\033[32mNO FAILURES\033[0m - read the INFO lines for who is published and who is still waiting.\n\n'
else
  [ "$FAILURES" -gt 0 ] && printf '\033[31m%d CHECK(S) FAILED\033[0m - something is wrong with the site or the data.\n' "$FAILURES"
  [ "$UNVERIFIED" -gt 0 ] && printf '\033[33m%d CHECK(S) UNVERIFIABLE\033[0m - could not tell; re-run once the deploy is live. Not a pass.\n' "$UNVERIFIED"
  printf 'An artist not having sent a photo yet is INFO, never a FAIL.\n\n'
fi

RC=0
[ "$FAILURES" -gt 0 ] && RC=$((RC | 1))
[ "$UNVERIFIED" -gt 0 ] && RC=$((RC | 2))
exit "$RC"
