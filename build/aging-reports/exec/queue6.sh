#!/bin/bash
# queue6.sh — 11 Nov 2026: re-run the pinned-row tests (C715362, C715364, C715365) with the fixed detector, after queues 1-5.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[2345]?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4p env ONLY=C715362,C715364,C715365 timeout 1800 node s4_run.mjs > s4p.log 2>&1
log "queue6 done"
