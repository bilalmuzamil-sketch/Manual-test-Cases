#!/bin/bash
# queue8.sh — 11 Nov 2026: the S4 tests that never ran (s4 hit its 1-hour limit after the 11,900-line A/P bucket), after queues 1-7.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[234567]?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4d env ONLY=C715372,C715373,C715374,C715605,C715599,C715601,C715602,C1062582,C1062583 timeout 3600 node s4_run.mjs > s4d.log 2>&1
log "queue8 done"
