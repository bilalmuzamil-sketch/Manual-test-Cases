#!/bin/bash
# queue17.sh — 11 Nov 2026: C715305 re-run with the two test vendors only, after queues 1-16.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-6])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s2x305 timeout 600 node s2x_305.mjs > s2x305.log 2>&1
log "queue17 done"
