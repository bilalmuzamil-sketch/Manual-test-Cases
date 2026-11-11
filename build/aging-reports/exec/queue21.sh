#!/bin/bash
# queue21.sh — 11 Nov 2026: p43 (PDF of 1,783 lines with a 300 s wait), after queues 2-20.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|20)?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p43 timeout 900 node p43_pdf1800.mjs > p43.log 2>&1
log "queue21 done"
