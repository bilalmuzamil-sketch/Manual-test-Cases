#!/bin/bash
# queue12.sh — 11 Nov 2026: re-run C715402 (search by the distinctive word), after queues 1-11.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[01])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5d env ONLY=C715402 timeout 600 node s5_run.mjs > s5d.log 2>&1
log "queue12 done"
