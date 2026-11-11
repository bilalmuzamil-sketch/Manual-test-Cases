#!/bin/bash
# queue7.sh (re-used name, 11 Nov) — p46 A/R seed again (contact last name fixed), right after queue6 (s4p3). Later queues match "queue7.sh".
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 5; while pgrep -f "queue6\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p46 timeout 1800 node p46_seed_ar.mjs > p46.log 2>&1
log "queue7 (p46) done"
