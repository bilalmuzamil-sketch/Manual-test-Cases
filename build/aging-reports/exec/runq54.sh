#!/bin/bash
# runq54.sh — 11 Nov 2026 19:22 UTC (QA lane): after runq53: q3_qa ONLY=C715475,C715617,C715618 LOC=Staging Lethbridge - 4310 into q3d/ (link must
# carry a non-default location; PDF wait 300 s).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 60; while pgrep -f "runq47\.sh|runq50\.sh|runq52\.sh|runq53\.sh|node (q3_qa|p49_seed_ap|q4_sbcmenus)" >/dev/null; do sleep 10; done
log "start q3d"; LOC="Staging Lethbridge - 4310" OUTDIR=q3d ONLY=C715475,C715617,C715618 timeout 2400 node q3_qa.mjs > q3d.log 2>&1; log "end q3d rc=$?"; log "runq54 done"
