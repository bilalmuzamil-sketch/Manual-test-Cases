#!/bin/bash
# queue9.sh (re-used name, 11 Nov) — C715364 again, A/P Detail filtered to the two OVER100 vendors so both buckets fit in one scroll; after queue8 (p46).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 8; while pgrep -f "queue8\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4p4 env ONLY=C715364 timeout 900 node s4_run.mjs > s4p4.log 2>&1
log "queue9 (s4p4) done"
