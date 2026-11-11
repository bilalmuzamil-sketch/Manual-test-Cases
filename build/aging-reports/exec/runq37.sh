#!/bin/bash
# runq37.sh — 11 Nov 2026 ~18:40 UTC: s89c (C715420/C715421 click credit A by its credit number) after queues 19-26 and runq31-34, before pm1/d3b2.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-4]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s89c"; timeout 600 node s89c_click.mjs > s89c.log 2>&1; log "end s89c rc=$?"; log "runq37 done"
