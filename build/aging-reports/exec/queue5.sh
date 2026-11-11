#!/bin/bash
# queue5.sh (re-used name, 11 Nov 09:50) — p46 A/R exact-amount seed, right after queue22 (s4p2). Later queues match "queue5.sh".
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 5; while pgrep -f "queue22\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p46 timeout 1800 node p46_seed_ar.mjs > p46.log 2>&1
log "queue5 (p46) done"
