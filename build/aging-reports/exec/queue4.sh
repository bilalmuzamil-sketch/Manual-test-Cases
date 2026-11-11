#!/bin/bash
# queue4.sh — 11 Nov 2026: re-shoot the export pop-up messages (C715350-353) after queues 1-3 finish.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[23]?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s3t env ONLY=C715350,C715351,C715352,C715353 timeout 900 node s3_run.mjs > s3t.log 2>&1
log "queue4 done"
