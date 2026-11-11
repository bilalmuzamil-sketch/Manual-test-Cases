#!/bin/bash
# queue16.sh — 11 Nov 2026: re-run C1062586 with a date A on which both locations had documents, after queues 1-15.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-5])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5g env ONLY=C1062586 timeout 600 node s5_run.mjs > s5g.log 2>&1
log "queue16 done"
