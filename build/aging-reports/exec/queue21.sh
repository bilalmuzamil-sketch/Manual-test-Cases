#!/bin/bash
# queue21.sh (re-used name, 11 Nov) — r1: regression tests C1078974-C1078983 (menu, titles, as-of date), after queue20 (p50).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 32; while pgrep -f "queue1[1-9]\.sh$|queue20\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run r1 timeout 1500 node r1_reg.mjs > r1.log 2>&1
log "queue21 (r1) done"
