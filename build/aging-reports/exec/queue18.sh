#!/bin/bash
# queue18.sh — 11 Nov 2026: re-test C715360/C715361 paging with the fixed reader, and re-run C715317/C715320 (yesterday = 10, customer at both locations), after queues 1-17.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-7])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4x timeout 2400 node s4x_paging.mjs > s4x.log 2>&1
run s2c3 env ONLY=C715317,C715320 timeout 1500 node s2c_run.mjs > s2c3.log 2>&1
log "queue18 done"
