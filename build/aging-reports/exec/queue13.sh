#!/bin/bash
# queue13.sh (re-used name, 11 Nov) — p46r5 (R12 again with today's invoice at 08:00 UTC, R15 overpaid), then p48 again (vendor list read to the end), then s9 A/R totals; after queue12 (s2x).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 16; while pgrep -f "queue1[12]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
mkdir -p p46r5; run p46r5 env SFX=" R5" ONLY=R12,R15 OUTDIR=p46r5 timeout 900 node p46_seed_ar.mjs > p46r5.log 2>&1
run p48 timeout 1500 node p48_pdf2000.mjs > p48.log 2>&1
run s9 timeout 2400 node s9_ar.mjs > s9.log 2>&1
log "queue13 done"
