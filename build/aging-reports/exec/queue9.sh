#!/bin/bash
# queue9.sh — 11 Nov 2026: re-run C715386 (open the location list in the switcher) after queues 1-8.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[2345678]?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5b env ONLY=C715386 timeout 600 node s5_run.mjs > s5b.log 2>&1
log "queue9 done"
