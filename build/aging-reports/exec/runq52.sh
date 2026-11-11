#!/bin/bash
# runq52.sh — 11 Nov 2026 19:00 UTC (QA lane): after runq47/runq50: q3_qa ONLY=C715480 into q3c/ (the location clicked by its text).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 30; while pgrep -f "runq47\.sh|runq50\.sh|node (q3_qa|p49_seed_ap)" >/dev/null; do sleep 10; done
log "start q3c"; OUTDIR=q3c ONLY=C715480 timeout 600 node q3_qa.mjs > q3c.log 2>&1; log "end q3c rc=$?"; log "runq52 done"
