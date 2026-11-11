#!/bin/bash
# queue23.sh — 11 Nov 2026: C715367 again (vendor-name pattern now allows the icon prefix), after queues 2-22.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[012])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4e env ONLY=C715367 timeout 900 node s4_run.mjs > s4e.log 2>&1
log "queue23 done"
