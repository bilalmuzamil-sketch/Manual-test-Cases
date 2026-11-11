#!/bin/bash
# runq51.sh — 11 Nov 2026 19:00 UTC (PRODUCTION lane): after runq48: pr6 (enrol the production account at Trucks Hill 2, then the C715477 work-order
# link flow) and q3_prod ONLY=C715480 into prod/q3p2/ (the location list, clicked by its text).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "runq48\.sh|node q3_prod" >/dev/null; do sleep 10; done
log "start pr6"; timeout 900 node pr6_wolink.mjs > prod/pr6.log 2>&1; log "end pr6 rc=$?"
log "start q3p2"; OUTDIR=q3p2 ONLY=C715480 timeout 600 node q3_prod.mjs > q3p2.log 2>&1; log "end q3p2 rc=$?"; log "runq51 done"
