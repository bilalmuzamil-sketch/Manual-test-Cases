#!/bin/bash
# queue11.sh (re-used name, 11 Nov) — p46 sets R1, R8, R9 again with today's invoices stamped 08:00 UTC (suffix " R4"), after queue10 (p48).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 12; while pgrep -f "queue10\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
mkdir -p p46r4; run p46r4 env SFX=" R4" ONLY=R1,R8,R9 OUTDIR=p46r4 timeout 1200 node p46_seed_ar.mjs > p46r4.log 2>&1
log "queue11 (p46r4) done"
