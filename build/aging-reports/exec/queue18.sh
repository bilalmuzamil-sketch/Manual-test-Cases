#!/bin/bash
# queue18.sh (re-used name, 11 Nov) — s9c: A/P exact-amount totals/CSV/credit tests on the p49 vendors, after queue17 (s2y).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 26; while pgrep -f "queue1[1-7]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s9c timeout 3000 node s9c_ap.mjs > s9c.log 2>&1
log "queue18 (s9c) done"
