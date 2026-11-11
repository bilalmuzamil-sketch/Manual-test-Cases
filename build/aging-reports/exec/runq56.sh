#!/bin/bash
# runq56.sh — 11 Nov 2026 20:00 UTC (QA lane): p49 V40 (P97 names, vendor id found by name) then q3_qa ONLY=C715540 into q3e/.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 20; while pgrep -f "runq50\.sh|runq53\.sh|runq54\.sh|node (q3_qa|p49_seed_ap|q4_sbcmenus|locsw_check)" >/dev/null; do sleep 10; done
log "start p49v40c"; OUTDIR=p49v40c ONLY=V40 timeout 1500 node p49_seed_ap.mjs > p49v40c.log 2>&1; log "end p49v40c rc=$?"
VA=$(grep -o '"name": "ZZY P97[^"]*"' p49v40c/out.json | head -1 | sed 's/"name": //; s/"//g'); log "q3e vendor: $VA"
[ -n "$VA" ] && { log "start q3e"; VA="$VA" OUTDIR=q3e ONLY=C715540 timeout 1200 node q3_qa.mjs > q3e.log 2>&1; log "end q3e rc=$?"; }; log "runq56 done"
