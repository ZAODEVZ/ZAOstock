#!/usr/bin/env bash
# Fetch every artist ops page ANONYMOUSLY and prove each one renders with the
# form on it. "Deployed" is not "works": this is the check Zaal's send waits on.
#
#   bash scripts/verify-backstage.sh <base-url> <links-file>
#
# <links-file> is the private vault file holding the eight links
# (zao-vault/projects/zaostock-artist-ops-links-2026-09-10.md). The codes are
# never in this repo, so this script reads them from there. Every
# `/backstage/<code>` URL in the file is checked against <base-url>, whatever
# host the file itself names.
#
# Per act, PASS needs ALL of: HTTP 200, an <h1> carrying that act's real name
# (OPS_ACTS in src/content/artist-ops.ts), and no "reveal" / "13 September" /
# "Sunday" anywhere on the page (there is no reveal day since 2026-09-10).
#
# CORRECTED 2026-09-24. The two checks this replaced - a `data-backstage-act`
# marker and an embedded Google Form iframe - tested for things that were
# already gone from the live page 8 days before this script was next run.
# Zaal, 2026-09-16: "remove the form and just ask them in the message what
# we still need from each of them" - the on-page form went away entirely
# (src/app/backstage/[code]/page.tsx's own top comment records the ruling),
# and no `data-backstage-act` attribute has ever existed in that component.
# Result: every one of the 8 real links FAILED against a checker looking for
# artifacts the redesign deliberately removed, while the pages themselves
# were rendering correctly - confirmed by reading the actual served text of
# two pages by hand. 8-for-8 failing the first time a checker runs is the
# checker, not the pages (a near-universal result is the instrument).
# A failing page is re-checked once after RETRY_WAIT seconds (default 45) and
# the output names the pass that decided it. Two controls run in the same
# invocation and MUST come back the other way, or the whole run fails:
#   - a made-up code must 404 and must not render any act marker
#   - /backstage with no code must 200 and carry the form
# EXIT: 0 every act passes and both controls hold; 1 something FAILED;
# 2 nothing failed but production is not verifiably serving main (the pages
# may be an older build - re-run after the deploy); 3 both.
set -u

BASE="${1:?base url, e.g. https://zaostock.com}"
LINKS="${2:?links file from the vault}"
BASE="${BASE%/}"
FORM_ID='1FAIpQLSf7ex3EiiT1AkzyN8GKQ4jSfPWjBTo89l4ez27xvZCpc0OqtQ'
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -r "$LINKS" ] || { echo "FAIL  cannot read $LINKS"; exit 1; }
CODES=$(grep -oE '/backstage/[a-z0-9-]+' "$LINKS" | sed 's#/backstage/##' | sort -u)
N=$(printf '%s\n' "$CODES" | grep -c . || true)
fails=0

fetch() { # url -> writes body to $TMP/body, echoes status
  curl -s -o "$TMP/body" -w '%{http_code}' --max-time 30 -A 'verify-backstage/1 (anonymous)' "$1"
}

# Real act names, `key: name` from src/content/artist-ops.ts's OPS_ACTS - kept
# here rather than parsed from the TypeScript, same reasoning as FORM_ID above
# (a literal is easier to audit than a parser, and this list changes only when
# the lineup does, which is a hand-edit either way).
act_name() {
  case "$1" in
    crown-vics) echo 'The Crown Vics' ;;
    open-x) echo 'OPEN X' ;;
    grass-rug) echo 'Grass Rug' ;;
    acadia-rising) echo 'Acadia Rising' ;;
    michael-anderson) echo 'Michael Anderson' ;;
    dcoop) echo 'DCoop' ;;
    lyons-den) echo 'LyonsDen' ;;
    fellenz) echo 'Tom Fellenz' ;;
    *) echo '' ;;
  esac
}

# The name inside an <h1 ...>...</h1> on the fetched body, real text not a
# marker attribute - matches src/app/backstage/[code]/page.tsx's own
# `<h1 ...>{act.name}</h1>`.
has_act_name() {
  local name="$1"
  grep -oE '<h1[^>]*>[^<]*' "$TMP/body" | grep -qF "$name"
}

# Only /backstage with NO code still embeds this - the public intake form
# (src/app/backstage/ArtistForm.tsx). The per-act pages dropped their own
# embed entirely on 2026-09-17; do not use this for check_act.
has_form() { grep -q "docs.google.com/forms/d/e/$FORM_ID/viewform" "$TMP/body" && grep -q '<iframe' "$TMP/body"; }

# A stale promise on the page is a failure too. Every one of these pages is
# the landing page for a message that says there is no reveal day (Zaal,
# 2026-09-10), so none may say "reveal", "13 September" or "Sunday" anywhere
# in the served HTML - visible text or the payload that hydrates it.
STALE='reveal|13 September|Sunday'
stale_hits() { grep -o -i -E "$STALE" "$TMP/body" | wc -l | tr -d ' '; }

echo "backstage check against $BASE, $N codes from $(basename "$LINKS")"
# Say which build these pages come from before judging them (2026-09-10: an
# older build was promoted over a newer merge and served stale copy).
unverified=0
if ! bash "$(dirname "${BASH_SOURCE[0]}")/deployed-sha.sh" "$BASE"; then
  unverified=1
fi
if [ "$N" -ne 8 ]; then echo "FAIL  expected 8 codes in the links file, found $N"; fails=$((fails+1)); fi

# EVERY PAGE, NEVER A SAMPLE. The eight pages are one template but they do NOT
# refresh together after a deploy: on 2026-09-10 the vault lane caught three of
# eight still serving the retired "Sunday 13 September" line while the other
# five were already correct, minutes after the same deploy. A check of one
# "representative" page would have passed while three artists' pages still
# contradicted the message sent to them. Do not optimise this loop down.
#
# NOT YET IS NOT WRONG. Because pages warm independently, a failure straight
# after a deploy may only mean "not refreshed yet". So a page that fails is
# re-fetched once after RETRY_WAIT seconds (default 45), and the output says
# which pass decided it. A page that fails twice is a real failure; a page
# that passes on the second pass is reported as such, never silently.
RETRY_WAIT="${RETRY_WAIT:-45}"

check_act() { # code key -> sets VERDICT (PASS|FAIL) and DETAIL
  local code="$1" key="$2" st stale name
  name="$(act_name "$key")"
  st=$(fetch "$BASE/backstage/$code")
  stale=$(stale_hits)
  if [ -z "$name" ]; then
    VERDICT=FAIL; DETAIL="unknown key \"$key\" - not in this script's act_name() table, add it there first"
  elif [ "$st" = 200 ] && has_act_name "$name" && [ "$stale" = 0 ]; then
    VERDICT=PASS; DETAIL="200, h1 says \"$name\", no stale reveal promise"
  elif [ "$st" = 200 ] && [ "$stale" != 0 ]; then
    VERDICT=FAIL; DETAIL="status=200 but $stale stale reveal/date hit(s): $(grep -o -i -E "$STALE" "$TMP/body" | sort | uniq -c | tr -s ' ' | tr '\n' ';')"
  else
    VERDICT=FAIL; DETAIL="status=$st, expected h1 \"$name\": $(has_act_name "$name" && echo found || echo NOT FOUND)"
  fi
}

for code in $CODES; do
  key="${code%-*}"
  check_act "$code" "$key"
  if [ "$VERDICT" = PASS ]; then
    echo "PASS  $key  $DETAIL"
    continue
  fi
  first="$DETAIL"
  sleep "$RETRY_WAIT"
  check_act "$code" "$key"
  if [ "$VERDICT" = PASS ]; then
    echo "PASS  $key  on the SECOND pass after ${RETRY_WAIT}s (first pass: $first)"
  else
    echo "FAIL  $key  on BOTH passes, ${RETRY_WAIT}s apart: $DETAIL"
    fails=$((fails+1))
  fi
done

st=$(fetch "$BASE/backstage/not-a-real-code-zz9999")
any_act_rendered=0
for code in $CODES; do
  if has_act_name "$(act_name "${code%-*}")"; then any_act_rendered=1; break; fi
done
if [ "$st" = 404 ] && [ "$any_act_rendered" = 0 ]; then
  echo "PASS  control: made-up code -> 404, no act rendered"
else
  echo "FAIL  control: made-up code -> $st (the gate is not gating)"; fails=$((fails+1))
fi

st=$(fetch "$BASE/backstage")
if [ "$st" = 200 ] && has_form; then
  echo "PASS  control: /backstage with no code -> 200 with the form"
else
  echo "FAIL  control: /backstage with no code -> $st, form=$(has_form && echo yes || echo no)"; fails=$((fails+1))
fi

RC=0
[ "$fails" -gt 0 ] && RC=$((RC | 1))
[ "$unverified" -gt 0 ] && RC=$((RC | 2))
if [ "$RC" -eq 0 ]; then echo "ALL PASS"; exit 0; fi
[ "$fails" -gt 0 ] && echo "$fails FAILED"
[ "$unverified" -gt 0 ] && echo "UNVERIFIABLE: production is not verifiably serving main; re-run after the deploy"
exit "$RC"
