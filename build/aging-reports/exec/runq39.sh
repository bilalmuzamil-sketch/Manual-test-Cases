#!/bin/bash
# runq39.sh — 11 Nov 2026 ~19:05 UTC: d3f (Sales By Customer's own empty-export warning for C715517 step 5) after runq31-34, 37, 38; before pm1/d3b2.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-478]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3f"; timeout 600 node d3f_sbcempty.mjs > d3f.log 2>&1; log "end d3f rc=$?"; log "runq39 done"
