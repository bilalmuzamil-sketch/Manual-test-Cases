#!/bin/bash
# queue2.sh (re-used name, 11 Nov 09:30) — p45 exact-amount payment probe, slotted right after queue21 (p43). Queues 22-30 match "queue2.sh" in their
# wait pattern, so they wait for this one; this one waits only for queue21 and any running runner.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 5; while pgrep -f "queue21\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p45 timeout 600 node p45_exactpay.mjs > p45.log 2>&1
log "queue2 (p45) done"
