#!/bin/bash
# Run 498 on ANOTHER ENVIRONMENT in one go (Rule 126; written 12 Oct 2026). Reads the script -> tests table in
# STAGING-READY.md and runs every script with ONLY=<its tests>, one after another, logging to evidence/<label>/.
#   1. Put a fresh sign-in cookie in /tmp/shopview/<first part of host>.env as SV_SSO_SESSION=... (chmod 600), e.g. app.env
#   2. GS_APP=https://app.staging.shopview.com WOB_API=https://api.staging.shopview.com ./staging-all.sh staging-2026-10-14
#      (first run writes profiles/<host>.json via discover-profile.mts; re-runs skip finished scripts — delete the .done file to redo)
#   Optional: ONLY_SCRIPTS="s2-batchA s4-batchD" to run a subset. Time checks: Rule 125 first (location zone = browser zone).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"; cd "$HERE"
LABEL="${1:-env-$(date -u +%Y%m%d)}"; OUT="evidence/$LABEL"; mkdir -p "$OUT"
: "${GS_APP:?set GS_APP}"
HOST=$(echo "$GS_APP" | sed -E 's#https?://##; s#/.*##')
[ -f "profiles/$HOST.json" ] || { echo "== discover-profile"; ./wob-run.sh discover-profile.mts | tee "$OUT/discover-profile.log"; }
python3 - "$OUT" <<'PY' > "$OUT/plan.txt"
import re,sys
for line in open('STAGING-READY.md'):
    m=re.match(r'\|\s*`([A-Za-z0-9-]+)\.mts`\s*\|\s*([^|]+)\|',line)
    if m: print(m.group(1), ','.join(re.findall(r'C\d+', m.group(2))))
PY
while read -r s cases; do
  [ -n "${ONLY_SCRIPTS:-}" ] && ! echo " $ONLY_SCRIPTS " | grep -q " $s " && continue
  [ -f "$OUT/$s.done" ] && { echo "skip $s (done)"; continue; }
  echo "== $s  ($cases)  $(date -u +%H:%M)"
  ONLY="$cases" timeout 2400 ./wob-run.sh "$s.mts" > "$OUT/$s.log" 2>&1; rc=$?
  [ -f "evidence/$s.json" ] && cp "evidence/$s.json" "$OUT/$s.json"
  echo "   exit $rc"; [ $rc -eq 0 ] && touch "$OUT/$s.done"
done < "$OUT/plan.txt"
echo "ALL DONE -> $OUT (results: $OUT/*.json; tests to do by hand: see STAGING-READY.md)"
