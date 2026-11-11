#!/bin/bash
# queue7.sh — 11 Nov 2026: re-run C715367 (vendor A now matched by name) after queues 1-6.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[23456]?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4c env ONLY=C715367 timeout 900 node s4_run.mjs > s4c.log 2>&1
log "queue7 done"
