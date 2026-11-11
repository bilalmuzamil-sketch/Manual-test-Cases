#!/bin/bash
# runq59.sh — 11 Nov 2026 19:15 UTC (QA lane): after q6b: q6 SETS=c (Inventory Value PDF at ~614 and ~245 rows, full export answers + error bodies) into q6c/.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "node q6_ivlimit" >/dev/null; do sleep 10; done
log "start q6c"; SETS=c OUTDIR=q6c timeout 1500 node q6_ivlimit.mjs > q6c.log 2>&1; log "end q6c rc=$?"; log "runq59 done"
