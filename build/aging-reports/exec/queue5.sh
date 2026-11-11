#!/bin/bash
# queue5.sh — 11 Nov 2026: re-run C715357 (A/P Unpaid collapse/expand all) after queues 1-4.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[234]?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4b env ONLY=C715357 timeout 900 node s4_run.mjs > s4b.log 2>&1
log "queue5 done"
