#!/bin/bash
# runq50.sh — 11 Nov 2026 18:45 UTC: p49 V40 again (vendor-id fix) then q3_qa ONLY=C715540 into q3b/ (q3 ran C715540 before its vendor existed).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "runq47\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p49v40b"; OUTDIR=p49v40b ONLY=V40 timeout 1500 node p49_seed_ap.mjs > p49v40b.log 2>&1; log "end p49v40b rc=$?"
VA=$(grep -o '"name": "ZZY P96[^"]*"' p49v40b/out.json | head -1 | sed 's/"name": //; s/"//g'); log "q3b vendor: $VA"
log "start q3b"; VA="$VA" OUTDIR=q3b ONLY=C715540 timeout 1200 node q3_qa.mjs > q3b.log 2>&1; log "end q3b rc=$?"; log "runq50 done"
