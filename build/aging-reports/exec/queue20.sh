#!/bin/bash
# queue20.sh (re-used name, 11 Nov) — p50: C715462 overpayment through the New Payment screen, after queue19 (p48b).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 30; while pgrep -f "queue1[1-9]\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p50 timeout 600 node p50_overpay.mjs > p50.log 2>&1
log "queue20 (p50) done"
