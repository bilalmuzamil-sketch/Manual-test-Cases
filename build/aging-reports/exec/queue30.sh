#!/bin/bash
# queue30.sh — 11 Nov 2026: the s2d tests whose script matches the test's clicks and needs no exact-amount data (C715299, C715307, C715312, C715314,
# C715323, C715593), then s78 (location/release tests); after queues 20-29. The other s2d tests wait for exact-amount seeds (p42).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue(2[0-9])\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s2d3 env ONLY=C715299,C715307,C715312,C715314,C715323,C715593 timeout 2400 node s2_run.mjs s2d.json > s2d3.log 2>&1
run s78 timeout 5400 node s78_run.mjs > s78.log 2>&1
log "queue30 done"
