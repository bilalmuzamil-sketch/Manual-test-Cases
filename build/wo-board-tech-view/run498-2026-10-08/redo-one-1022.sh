#!/bin/bash
# 22 Oct 2026: re-run some tests of one script on PRODUCTION without losing the full run's readings. Keeps a copy of the script's
# readings file first (<script>.before-<HHMMSS>.json), puts the profile location back (ensure-loc.mts), then runs ONLY those tests.
# Usage: ./redo-one-1022.sh <script without .mts> <C-ids comma-separated|-> [VAR=value ...]
cd "$(dirname "$0")" && source prod-env.sh
s=$1; only=$2; shift 2; E=evidence/prod-2026-10-22; L=$E/logs-redo; mkdir -p "$L"; st=$(date -u +%H%M%S)
[ -f "$E/$s.json" ] && cp "$E/$s.json" "$E/$s.before-$st.json"
timeout 300 ./wob-run.sh ensure-loc.mts > "$L/$s-$st.ensure.log" 2>&1
if [ "$only" = "-" ]; then env "$@" QA_DPR=2 timeout 3600 ./wob-run.sh "$s.mts" > "$L/$s-$st.log" 2>&1
else env "$@" ONLY="$only" QA_DPR=2 timeout 3600 ./wob-run.sh "$s.mts" > "$L/$s-$st.log" 2>&1; fi
echo "$(date -u +%T) redo $s $only exit $? log $L/$s-$st.log"
