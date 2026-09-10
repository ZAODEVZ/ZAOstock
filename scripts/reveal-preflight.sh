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
# EXIT CODE
#   0 = every check passed. Non-zero = the number of failures.
#   A FAIL is never silent and never an empty result: a check that cannot run
#   reports UNVERIFIABLE and counts as a failure, because "I could not tell"
#   must not read the same as "fine".

set -o pipefail

BASE="${BASE:-https://zaostock.com}"
FAILURES=0

pass() { printf '  \033[32mPASS\033[0m  %s\n' "$1"; }
fail() { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; FAILURES=$((FAILURES + 1)); }
warn() { printf '  \033[33mUNVERIFIABLE\033[0m  %s\n' "$1"; FAILURES=$((FAILURES + 1)); }

echo
echo "ZAOstock reveal preflight against ${BASE}"
echo "  $(date -u '+%Y-%m-%dT%H:%MZ')"
echo

# The date the site itself believes in. Read from source, not typed here, so
# this script cannot disagree with the gate.
REVEAL_DATE="$(grep -oE "lineupRevealDate: '[0-9-]+'" src/content/site.ts | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')"
if [ -z "$REVEAL_DATE" ]; then
  warn "could not read lineupRevealDate from src/content/site.ts"
else
  echo "  reveal date in source: ${REVEAL_DATE}"
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
    # THE CHECK THAT WOULD HAVE CAUGHT 7 SEPTEMBER.
    fail "ZERO acts on the bill. Do not proceed - the reveal has nothing to reveal"
  fi

  # THE BILL, NOT JUST "MORE THAN ZERO". On 2026-09-10 one act of eight was
  # confirmed, and the check above would have printed a green "1 act(s) on the
  # bill" on reveal morning with seven acts missing. So compare what is
  # published against LINEUP_NAMES, the bill the site names, and say who is
  # missing - and fail on any published act that is NOT on the bill (Hurricane
  # left it that day; a stale confirmed row would reveal him).
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
        fail "PARTIAL BILL: ${COUNT} of ${EXPECTED} acts published. Missing: ${MISSING}. Decide: announce these, or hold"
      elif [ -z "$EXTRA" ]; then
        pass "all ${EXPECTED} acts of the bill are published"
      fi
    fi
  fi

  if printf '%s' "$BODY" | grep -q "\"reveal_date\":\"${REVEAL_DATE}\""; then
    pass "endpoint agrees with the gate date"
  elif printf '%s' "$BODY" | grep -q '"reveal_date"'; then
    fail "endpoint reveal_date disagrees with src/content/site.ts (${REVEAL_DATE})"
  fi

  if printf '%s' "$BODY" | grep -q '"withheld"'; then
    fail "endpoint is WITHHOLDING: the gate passed with nothing confirmed"
  fi
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

echo "4. The press kit is not announcing a date that has passed"
# Formatted with python rather than `date -d`, which is GNU-only and silently
# fails on macOS - where this will actually be run at 6am on the day.
REVEAL_HUMAN="$(python3 -c "
import datetime,sys
d=datetime.date.fromisoformat(sys.argv[1])
print(f'{d.day} {d:%B}')
" "${REVEAL_DATE}" 2>/dev/null)"
if [ -z "$REVEAL_HUMAN" ]; then
  warn "could not format the reveal date for comparison"
else
  # MATCHED WITHOUT A PIPE, ON PURPOSE.
  #
  # `set -o pipefail` plus `grep -q` manufactures FALSE FAILURES: grep -q exits
  # at the first match and closes the pipe, the producer dies of SIGPIPE, and
  # pipefail reports the whole pipeline as failed. So a press kit that DOES
  # carry the right date reads as a failure.
  #
  # It is invisible in casual testing because `grep -c` and `grep -o` consume
  # all input and never trigger it - which is exactly how this was nearly
  # shipped: the same check passed by hand and failed in the script.
  #
  # pipefail is still right. It stops a failing producer from being masked. But
  # it turns any early-exiting consumer into a false alarm, so the answer is to
  # not pipe at all when a shell pattern match will do.
  PRESS="$(curl -sf --max-time 20 "${BASE}/press")"
  if [ -z "$PRESS" ]; then
    warn "/press unreachable - read it yourself before publishing"
  else
    case "$PRESS" in
      *"$REVEAL_HUMAN"*)
        pass "press kit names the reveal date (${REVEAL_HUMAN})" ;;
      *)
        fail "press kit does NOT name ${REVEAL_HUMAN} - it may still carry an old date" ;;
    esac
  fi
fi
echo

if [ "$FAILURES" -eq 0 ]; then
  printf '\033[32mALL CHECKS PASSED\033[0m - safe to proceed with the reveal.\n\n'
else
  printf '\033[31m%d CHECK(S) FAILED\033[0m - do NOT publish until each is understood.\n' "$FAILURES"
  printf 'An empty bill is the failure that already happened once. It looked\n'
  printf 'exactly like a working system.\n\n'
fi

exit "$FAILURES"
