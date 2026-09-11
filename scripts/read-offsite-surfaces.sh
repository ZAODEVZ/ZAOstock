#!/usr/bin/env bash
# READ the public ZAOstock surfaces that are NOT in this repo.
#
#   bash scripts/read-offsite-surfaces.sh
#
# WHY. Every stale claim removed on 2026-09-10 lived in a file, so a test could
# hold it. The RSVP page did not. The homepage's primary button ("RSVP free")
# goes to ticket.zaostock.com, which 302s to a Luma event page, and nobody had
# read it: it still promised "Lineup announced August 2026", put the festival
# in a "Franklin Street parking lot", and billed "DJs between every act".
#
# THIS CANNOT TEST THAT PAGE, ONLY READ IT. Its copy lives in Luma, not here, so
# there is nothing in the repo to fix and no test that could hold it. Fixing a
# line means Zaal's Luma login. What this does is make the page impossible to
# forget: it fetches each surface anonymously and prints every known-stale
# phrase still on it, with what is true instead, plus the one real attendance
# figure that exists anywhere (Luma's registration count).
#
# EXIT: 0 every surface was read (STALE lines are information, not failure);
#       2 a surface could not be fetched, so this run knows nothing about it.
# check-production.sh runs this as its fourth step and gives it NO exit bits:
# a check that fails every day over a page nobody here can edit teaches people
# to ignore the whole output.
#
# When a STALE line disappears it was fixed at the source. KEEP its phrase: it
# is now a regression guard, and the line comes back if the page slides back.
# Only a phrase Zaal has ACCEPTED leaves the list, with his reason recorded
# under ACCEPTED so nobody re-adds it. A new stale claim goes in STALE with
# the truth beside it.

set -u

# surface name | URL a visitor actually uses
SURFACES=(
  "rsvp (Luma)|https://ticket.zaostock.com"
)

# phrase on the page (case-insensitive) | what is true instead
STALE=(
  "Lineup announced August 2026|the lineup is at zaostock.com/program, and there is no reveal day"
  "DJs between every act|the MC and our partners hold the changeovers; there is no DJ between sets"
  "all day|music runs noon to six"
  "ZAO MUSIC EVENTS|it is produced by ZAO Festivals"
)

# ACCEPTED, not stale (never re-add to STALE):
# - "Franklin Street parking lot" in Luma's LOCATION field. Zaal, 2026-09-10:
#   "its the same thing it say aprking lot on the auto maps" - it is the map
#   provider's own name for the place, the address resolves to the parklet, and
#   the event description names the Franklin Street Parklet. Fixed-on-Luma
#   2026-09-10 and kept as guards above: "Lineup announced August 2026",
#   "DJs between every act", "all day".

unread=0
for s in "${SURFACES[@]}"; do
  name="${s%%|*}"
  url="${s#*|}"
  tmp="$(mktemp)"
  meta="$(curl -sL --max-time 20 -A "Mozilla/5.0 (zaostock read-offsite)" -o "$tmp" -w '%{http_code} %{url_effective}' "$url" 2>/dev/null)"
  code="${meta%% *}"
  final="${meta#* }"
  if [ "$code" != "200" ] || [ ! -s "$tmp" ]; then
    echo "UNREAD  $name: $url answered ${code:-nothing}; this run knows nothing about that page"
    unread=1
    rm -f "$tmp"
    continue
  fi
  echo "READ    $name: $url -> $final (not in the repo: read only, fix needs the Luma login)"
  hits=0
  for p in "${STALE[@]}"; do
    phrase="${p%%|*}"
    truth="${p#*|}"
    if grep -qiF -- "$phrase" "$tmp"; then
      echo "STALE   $name: \"$phrase\" is still on it - $truth"
      hits=$((hits + 1))
    fi
  done
  [ "$hits" -eq 0 ] && echo "CLEAN   $name: none of the ${#STALE[@]} known-stale phrases is on it"
  guests="$(grep -oE '"guest_count"[[:space:]]*:[[:space:]]*[0-9]+' "$tmp" | head -1 | grep -oE '[0-9]+$')"
  [ -n "$guests" ] && echo "INFO    $name: ${guests} registered (Luma guest_count, $(date -u +%Y-%m-%dT%H:%MZ))"
  rm -f "$tmp"
done

[ "$unread" -eq 0 ] && exit 0
exit 2
