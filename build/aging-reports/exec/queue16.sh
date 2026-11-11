#!/bin/bash
# queue16.sh (re-used name, 11 Nov) — d1 design captures (C715481-C715498: six reports, light/dark, 1440/1536), after queue15 (p49).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 22; while pgrep -f "queue1[12345]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run d1 timeout 2400 node d1_design.mjs > d1.log 2>&1
log "queue16 (d1) done"
