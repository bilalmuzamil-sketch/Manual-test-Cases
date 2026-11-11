#!/bin/bash
# queue3.sh — 11 Nov 2026: third strict queue; waits for queue.sh and queue2.sh and any signed-in runner to finish.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue2?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s3x env ONLY=C715342,C797942 MAXROWS=800 PDFWAIT=240000 timeout 1500 node s3_run.mjs > s3x.log 2>&1
log "queue3 done"
