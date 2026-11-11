#!/bin/bash
# runq33.sh — 11 Nov 2026 ~17:00 UTC: d3d (C715517 export messages vs Sales By Customer, right menu labels) after queues 13-26, runq31, runq32.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[12]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3d"; timeout 900 node d3d_toast.mjs > d3d.log 2>&1; log "end d3d rc=$?"; log "runq33 done"
