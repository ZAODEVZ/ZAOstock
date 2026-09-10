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
# Per act, PASS needs ALL of: HTTP 200, the act marker the page renders, an
# iframe whose src is the public form, and no "reveal" / "13 September" /
# "Sunday" anywhere on the page (there is no reveal day since 2026-09-10). Two controls run in the same invocation
# and MUST come back the other way, or the whole run fails:
#   - a made-up code must 404 and must not render any act marker
#   - /backstage with no code must 200 and carry the form
# Exit 0 only if every act passes and both controls hold.
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

has_form() { grep -q "docs.google.com/forms/d/e/$FORM_ID/viewform" "$TMP/body" && grep -q '<iframe' "$TMP/body"; }

# A stale promise on the page is a failure too. Every one of these pages is
# the landing page for a message that says there is no reveal day (Zaal,
# 2026-09-10), so none may say "reveal", "13 September" or "Sunday" anywhere
# in the served HTML - visible text or the payload that hydrates it.
STALE='reveal|13 September|Sunday'
stale_hits() { grep -o -i -E "$STALE" "$TMP/body" | wc -l | tr -d ' '; }

echo "backstage check against $BASE, $N codes from $(basename "$LINKS")"
if [ "$N" -ne 8 ]; then echo "FAIL  expected 8 codes in the links file, found $N"; fails=$((fails+1)); fi

for code in $CODES; do
  key="${code%-*}"
  st=$(fetch "$BASE/backstage/$code")
  stale=$(stale_hits)
  if [ "$st" = 200 ] && grep -q "data-backstage-act=\"$key\"" "$TMP/body" && has_form && [ "$stale" = 0 ]; then
    echo "PASS  $key  200, act marker, form iframe, no stale reveal promise"
  elif [ "$st" = 200 ] && [ "$stale" != 0 ]; then
    echo "FAIL  $key  status=200 but $stale stale reveal/date hit(s): $(grep -o -i -E "$STALE" "$TMP/body" | sort | uniq -c | tr -s ' ' | tr '\n' ';')"
    fails=$((fails+1))
  else
    marker=$(grep -c "data-backstage-act=\"$key\"" "$TMP/body" || true)
    form=$(has_form && echo yes || echo no)
    echo "FAIL  $key  status=$st marker=$marker form=$form"
    fails=$((fails+1))
  fi
done

st=$(fetch "$BASE/backstage/not-a-real-code-zz9999")
if [ "$st" = 404 ] && ! grep -q 'data-backstage-act=' "$TMP/body"; then
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

if [ "$fails" -eq 0 ]; then echo "ALL PASS"; exit 0; fi
echo "$fails FAILED"; exit 1
