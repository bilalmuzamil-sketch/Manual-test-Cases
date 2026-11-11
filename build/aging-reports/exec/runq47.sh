#!/bin/bash
# runq47.sh — 11 Nov 2026 ~23:50 UTC: p49 V40 seed (C715540 vendor) then q3_qa (C715476, C715480, C715475, C715617, C715618, C715540 on the QA site).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|runq4[0-6]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p49v40"; OUTDIR=p49v40 ONLY=V40 timeout 1500 node p49_seed_ap.mjs > p49v40.log 2>&1; log "end p49v40 rc=$?"
log "start q3"; OUTDIR=q3 timeout 2400 node q3_qa.mjs > q3.log 2>&1; log "end q3 rc=$?"; log "runq47 done"
