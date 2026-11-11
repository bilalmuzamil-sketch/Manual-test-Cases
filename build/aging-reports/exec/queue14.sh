#!/bin/bash
# queue14.sh (re-used name, 11 Nov) — s9b: more A/R exact-amount tests (C797945, C715344, C715346, C715347, C715580, C715581, C1062580, C1062581, C1062587), after queue13.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 18; while pgrep -f "queue1[123]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s9b timeout 2400 node s9b_ar.mjs > s9b.log 2>&1
log "queue14 (s9b) done"
