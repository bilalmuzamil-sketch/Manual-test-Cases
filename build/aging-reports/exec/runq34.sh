#!/bin/bash
# runq34.sh — 11 Nov 2026 ~17:25 UTC: d3e (existing "Switch location?" prompt for C715519/C715546 step 2) after queues 13-26 and runq31-33.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-3]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3e"; timeout 600 node d3e_prompt.mjs > d3e.log 2>&1; log "end d3e rc=$?"; log "runq34 done"
