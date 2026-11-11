#!/bin/bash
# queue15.sh — 11 Nov 2026: p41 read-only date-A probe, after queues 1-14.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-4])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p41 timeout 300 node p41_dateA.mjs > p41.log 2>&1
log "queue15 done"
