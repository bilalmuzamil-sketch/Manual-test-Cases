#!/bin/bash
# queue28.sh — 11 Nov 2026: C715392 / C715607 / C715609 with a date A found on each report's OWN location list (only Heavy Duty), after queues 2-27.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-7])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5k env ONLY=C715392,C715607,C715609 timeout 1500 node s5_run.mjs > s5k.log 2>&1
log "queue28 done"
