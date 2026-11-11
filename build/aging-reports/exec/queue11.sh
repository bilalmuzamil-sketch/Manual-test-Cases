#!/bin/bash
# queue11.sh — 11 Nov 2026: p39 browser-Back probe (C715393/C715397), after queues 1-10.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|10)?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p39 timeout 900 node p39_back.mjs > p39.log 2>&1
log "queue11 done"
