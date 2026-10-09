#!/bin/bash
# THE WHOLE SUITE IN ONE COMMAND, on any environment (2026-10-09).
#   GS_APP=https://<branch>.qa.shopview.com ./run-all.sh [logdir]
# 1) writes the environment profile once (organisation + the two locations), 2) runs every FINAL script in
# rerun-order.txt with only the checks it owns (rerun-map.json), one after another, sign-out LAST,
# 3) leaves one log per script. Results are then judged and written with push_results_to_run.py.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"; LOG="${1:-/tmp/wob-rerun-$(date +%Y%m%d-%H%M)}"; mkdir -p "$LOG"
HOST="$(echo "${GS_APP:-https://sv10043.qa.shopview.com}" | sed -E 's#https?://([^/]+).*#\1#')"
[ -f "$HERE/profiles/$HOST.json" ] || [ "$HOST" = "sv10043.qa.shopview.com" ] || "$HERE/wob-run.sh" discover-profile.mts > "$LOG/00-profile.log"
while read -r s; do [ -z "$s" ] && continue
  ids=$(python3 -c "import json;print(','.join('C%d'%c for c in json.load(open('$HERE/rerun-map.json'))['$s']))")
  extra=""; case "$s" in kbd-fix2.mts|kbd-fix3.mts|s9-fix2.mts) extra="WOB_LIVE=1";; esac
  echo "$(date +%H:%M:%S) $s ($ids)"; env ONLY="$ids" $extra timeout 3600 "$HERE/wob-run.sh" "$s" > "$LOG/${s%.mts}.log" 2>&1; echo "EXIT=$?" >> "$LOG/${s%.mts}.log"
done < "$HERE/rerun-order.txt"
echo "done — logs in $LOG"
