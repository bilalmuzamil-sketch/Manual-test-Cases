#!/bin/bash
# queue25.sh — 11 Nov 2026: C1062566 again (buckets now actually opened), after queues 2-24.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-4])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5h env ONLY=C1062566 timeout 600 node s5_run.mjs > s5h.log 2>&1
log "queue25 done"
