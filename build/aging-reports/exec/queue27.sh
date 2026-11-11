#!/bin/bash
# queue27.sh — 11 Nov 2026: C715408 again, starting at Heavy Duty (reloaded), after queues 2-26.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-6])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5j env ONLY=C715408 timeout 600 node s5_run.mjs > s5j.log 2>&1
log "queue27 done"
