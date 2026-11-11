#!/bin/bash
# queue17.sh (re-used name, 11 Nov) — s2y: exact-amount A/P sort tests on the p49 vendors, after queue16 (d1).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 24; while pgrep -f "queue1[1-6]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s2y timeout 2400 node s2_run.mjs s2y.json > s2y.log 2>&1
log "queue17 (s2y) done"
