#!/bin/bash
# queue20.sh — 11 Nov 2026: p42 exact-amount invoice probe, after queues 2-19.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p42 timeout 600 node p42_exact.mjs > p42.log 2>&1
log "queue20 done"
