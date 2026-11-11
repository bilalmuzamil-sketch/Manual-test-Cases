#!/bin/bash
# queue10.sh — 11 Nov 2026: C1062566 (credit memo + deposit on the as-of date), after queues 1-9.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[23456789]?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5c env ONLY=C1062566 timeout 600 node s5_run.mjs > s5c.log 2>&1
log "queue10 done"
