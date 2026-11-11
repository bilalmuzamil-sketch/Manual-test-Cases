#!/bin/bash
# runq53.sh — 11 Nov 2026 19:12 UTC (QA lane): after runq52: q4_sbcmenus (C715584 QA side).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 45; while pgrep -f "runq47\.sh|runq50\.sh|runq52\.sh|node (q3_qa|p49_seed_ap)" >/dev/null; do sleep 10; done
log "start q4"; timeout 600 node q4_sbcmenus.mjs > q4.log 2>&1; log "end q4 rc=$?"; log "runq53 done"
