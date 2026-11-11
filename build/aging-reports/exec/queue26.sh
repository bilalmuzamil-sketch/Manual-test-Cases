#!/bin/bash
# queue26.sh — 11 Nov 2026: C715402 again (untick through the list rows, not the tags), after queues 2-25.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-5])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5i env ONLY=C715402 timeout 600 node s5_run.mjs > s5i.log 2>&1
log "queue26 done"
