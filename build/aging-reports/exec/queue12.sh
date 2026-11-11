#!/bin/bash
# queue12.sh (re-used name, 11 Nov) — s2x: exact-amount A/R sort tests (C715289/290 on the R4 customers, C715295/296/300/588 on R3), after queue11 (p46r4).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 14; while pgrep -f "queue11\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s2x timeout 2400 node s2_run.mjs s2x.json > s2x.log 2>&1
log "queue12 (s2x) done"
