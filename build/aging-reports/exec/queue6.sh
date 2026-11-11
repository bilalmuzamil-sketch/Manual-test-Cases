#!/bin/bash
# queue6.sh (re-used name, 11 Nov 09:55) — pinned rows C715362/364/365 again (the detector's text match dropped every "s"), after queue5 (p46).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 8; while pgrep -f "queue(22|5)\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4p3 env ONLY=C715362,C715364,C715365 timeout 1800 node s4_run.mjs > s4p3.log 2>&1
log "queue6 (s4p3) done"
