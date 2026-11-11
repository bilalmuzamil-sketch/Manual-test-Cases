#!/bin/bash
# runq58.sh — 11 Nov 2026 20:56 UTC (QA lane): q3_qa ONLY=C715475 with the small "ZZAUTOTEST V1R-87 Location C" (is the Inventory Value PDF refusal size-driven?) into q3f/.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "runq56\.sh|node (q3_qa|p49_seed_ap|q4_sbcmenus)" >/dev/null; do sleep 10; done
log "start q3f"; LOC="ZZAUTOTEST V1R-87 Location C" OUTDIR=q3f ONLY=C715475 timeout 1200 node q3_qa.mjs > q3f.log 2>&1; log "end q3f rc=$?"; log "runq58 done"
