#!/usr/bin/env bash
# One command for the three ZAOstock checks, with an exit code that keeps them
# apart.
#
#   bash scripts/check-production.sh [links-file]     # run all three
#   bash scripts/check-production.sh --selftest       # prove the mapping
#
# The three checks, and WHAT EACH ACTUALLY READS (printed on every run):
#   preflight  scripts/reveal-preflight.sh   -> production (https://zaostock.com)
#   backstage  scripts/verify-backstage.sh   -> production, all eight pages
#   phone      the no-phone-numbers guard    -> THIS CHECKOUT, not production.
#              Its line prints the checkout's HEAD and whether that is main's
#              head, so a clean result from a stale checkout is not believed.
#   offsite    scripts/read-offsite-surfaces.sh -> public pages NOT in this repo
#              (the Luma RSVP page behind the homepage's "RSVP free"). READ
#              ONLY: it prints STALE lines and the registration count, and it
#              sets NO exit bits, because nothing in this repo can fix that page
#              (it needs Zaal's Luma login) and a check that fails every day over
#              it would teach people to ignore the rest. Read its lines.
# Both production checks first print which commit production is serving
# (scripts/deployed-sha.sh), because a merge can deploy "success" and still be
# overwritten by an older build (2026-09-10).
#
# EXIT: a BITMASK, OR-ed from all three. Never the last check's status, never a
# count.
#   0  every check clean (INFO lines are fine)
#   1  preflight FAILED
#   2  backstage FAILED
#   4  phone guard FAILED
#   8  something COULD NOT BE TOLD: a check was unverifiable (production not
#      serving main yet, an endpoint unreachable), could not run (missing
#      script, 126/127, unreadable links file), or returned an exit code this
#      wrapper does not recognise. Unknown is "could not interpret", never
#      success and never a failure. Re-run; do not go hunting a bug.
#   e.g. 3 = preflight and backstage failed; 9 = preflight failed AND something
#   could not be told.
# The bits sum to at most 15, far below the shell's reserved 126-255, so the
# exit can never be confused with "command not found" or a signal. Do not
# "simplify" this into a count: a count merges three distinguishable failures
# into one number.
#
# Every check's RAW exit code is printed beside the bits it mapped to, so a new
# or unexpected code is visible in the output, not folded silently away.
#
# All three always run. A failure in one never skips the others, and no exit
# code is ever read through a pipe.
#
# HOW TO READ IT (the operating instruction). Read step 0 first: it says which
# build every later line is about. On a normal day the output is quiet - "NO
# FAILURES", "ALL PASS", exit 0 - and the ONLY line that should change from day
# to day is the preflight INFO line: "pending" falling, then "N of 8 acts
# published. Still waiting on: ..." as bios and photos arrive. Anything else
# changing is the signal to look. Quiet does not mean nothing happened; read the
# INFO lines. The clean-day output was recorded on 2026-09-10 (main 8bfb2b9).
# Since the offsite step (2026-09-10) a clean day ALSO prints the Luma page's
# STALE lines until Zaal edits that page; each one that disappears was fixed at
# the source, so delete its phrase in read-offsite-surfaces.sh.
set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
BASE="${BASE:-https://zaostock.com}"
LINKS="${1:-${LINKS:-$HOME/zao-vault/projects/zaostock-artist-ops-links-2026-09-10.md}}"

# Commands are overridable so --selftest can drive every mapping with stubs.
CHECK_PREFLIGHT="${CHECK_PREFLIGHT:-bash \"$HERE/reveal-preflight.sh\"}"
CHECK_BACKSTAGE="${CHECK_BACKSTAGE:-bash \"$HERE/verify-backstage.sh\" \"$BASE\" \"$LINKS\"}"
CHECK_PHONE="${CHECK_PHONE:-npx vitest run src/content/no-phone-numbers.test.ts}"
CHECK_OFFSITE="${CHECK_OFFSITE:-bash \"$HERE/read-offsite-surfaces.sh\"}"
QUIET="${QUIET:-0}"

# raw exit code -> bits, per check. Anything not listed maps to 8.
map_preflight() { case "$1" in 0) echo 0 ;; 1) echo 1 ;; 2) echo 8 ;; 3) echo 9 ;; *) echo 8 ;; esac; }
map_backstage() { case "$1" in 0) echo 0 ;; 1) echo 2 ;; 2) echo 8 ;; 3) echo 10 ;; *) echo 8 ;; esac; }
map_phone()     { case "$1" in 0) echo 0 ;; 1) echo 4 ;; *) echo 8 ;; esac; }
# Deliberately 0 for EVERY code, including "could not fetch" (2): off-site pages
# are information, not a gate. The raw code still prints in the summary.
map_offsite()   { echo 0; }

TOTAL=0
SUMMARY=""

run_check() { # name target mapfn command
  local name="$1" target="$2" mapfn="$3" cmd="$4" out rc bits
  out="$(mktemp)"
  (cd "$ROOT" && BASE="$BASE" eval "$cmd") > "$out" 2>&1
  rc=$?
  bits="$($mapfn "$rc")"
  TOTAL=$((TOTAL | bits))
  if [ "$QUIET" != 1 ]; then
    echo "================ $name  ($target)"
    cat "$out"
  fi
  rm -f "$out"
  SUMMARY="${SUMMARY}  ${name}  target=${target}  raw_exit=${rc}  bits=${bits}"$'\n'
}

main() {
  # PREFLIGHT reads production.
  run_check preflight "$BASE" map_preflight "$CHECK_PREFLIGHT"

  # BACKSTAGE reads production; it needs the private links file.
  if [ -r "$LINKS" ] || [ -n "${CHECK_BACKSTAGE_STUB:-}" ]; then
    run_check backstage "$BASE, 8 pages" map_backstage "$CHECK_BACKSTAGE"
  else
    TOTAL=$((TOTAL | 8))
    SUMMARY="${SUMMARY}  backstage  target=$BASE  raw_exit=not-run  bits=8  (links file unreadable: $LINKS)"$'\n'
  fi

  # PHONE reads this checkout - say exactly which commit, and whether it is main.
  local head main_head fresh
  head="$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
  main_head="$(gh api repos/ZAODEVZ/ZAOstock/commits/main --jq '.sha[0:7]' 2>/dev/null || echo unknown)"
  if [ "$head" = "$main_head" ]; then fresh="= main"; else fresh="NOT main (main is $main_head)"; fi
  run_check phone "checkout $ROOT at $head, $fresh" map_phone "$CHECK_PHONE"

  # OFFSITE reads pages that live outside this repo. Information only.
  run_check offsite "pages not in this repo, read only" map_offsite "$CHECK_OFFSITE"

  echo
  echo "SUMMARY"
  printf '%s' "$SUMMARY"
  echo "  exit=${TOTAL}  (1 preflight failed, 2 backstage failed, 4 phone failed, 8 could not tell; offsite never sets bits: read its STALE lines)"
  return "$TOTAL"
}

selftest() {
  # Every case runs the REAL mapping and bit logic with stub commands. Most
  # cases are expect-FIRES: a harness whose cases all expect silence passes
  # when the harness itself is broken.
  local fails=0 got
  local tmp; tmp="$(mktemp)"; echo "links" > "$tmp"
  check() { # expected preflight backstage phone [links]
    local want="$1" p="$2" b="$3" ph="$4" links="${5:-$tmp}"
    CHECK_PREFLIGHT="exit $p" CHECK_BACKSTAGE="exit $b" CHECK_PHONE="exit $ph" CHECK_OFFSITE="exit ${OFF:-0}" LINKS="$links" QUIET=1 \
      bash "${BASH_SOURCE[0]}" >/dev/null 2>&1
    got=$?
    if [ "$got" = "$want" ]; then echo "  ok    p=$p b=$b ph=$ph off=${OFF:-0} links=$(basename "$links") -> $got"
    else echo "  WRONG p=$p b=$b ph=$ph off=${OFF:-0} links=$(basename "$links") -> $got, expected $want"; fails=$((fails+1)); fi
  }
  echo "check-production selftest"
  check 0  0 0 0            # silent: all clean
  check 1  1 0 0            # fires: preflight failed (and phone, last, was 0: never the last status)
  check 2  0 1 0            # fires: backstage failed
  check 4  0 0 1            # fires: phone failed
  check 8  2 0 0            # fires: preflight UNVERIFIABLE -> could not tell, not failed
  check 9  3 0 0            # fires: preflight failed AND unverifiable
  check 8  0 2 0            # fires: backstage unverifiable (production behind main)
  check 10 0 3 0            # fires: backstage failed AND unverifiable
  check 7  1 1 1            # fires: all three failed, all three visible
  check 8  42 0 0           # fires: unknown code -> could not interpret, never success
  check 8  0 0 127          # fires: command not found -> could not run
  check 8  0 0 0 /nonexistent/links.md   # fires: links file unreadable -> backstage not run
  OFF=2 check 0 0 0 0      # silent: offsite could not fetch -> still 0, never gates
  OFF=2 check 7 1 1 1      # fires: offsite unread does not hide three real failures
  rm -f "$tmp"
  if [ "$fails" -eq 0 ]; then echo "SELFTEST PASS"; return 0; fi
  echo "SELFTEST FAILED: $fails"; return 1
}

if [ "${1:-}" = "--selftest" ]; then
  selftest
  exit $?
fi
main
exit $?
