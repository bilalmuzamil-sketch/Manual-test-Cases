#!/bin/bash
# queue24.sh — 11 Nov 2026: C1062582/C1062583 (offline bucket messages) with a 40 s wait and failed-call log, after queues 2-23.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-3])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4f env ONLY=C1062582,C1062583 timeout 900 node s4_run.mjs > s4f.log 2>&1
log "queue24 done"
