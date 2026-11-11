#!/bin/bash
# queue2.sh — 11 Nov 2026: second strict queue; starts only after queue.sh has finished and no runner is signed in.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p38 timeout 600 node p38_capture.mjs > p38.log 2>&1
log "queue2 done"
