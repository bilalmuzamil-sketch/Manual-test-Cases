#!/bin/bash
# queue4.sh (re-used name, 11 Nov 09:40) — p45 again (Net 30 customer, part payment, term switch), right after queue3.sh (p47). Later queues match "queue4.sh".
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
sleep 5; while pgrep -f "queue3\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 5; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p45b timeout 600 node p45_exactpay.mjs > p45b.log 2>&1
log "queue4 (p45b) done"
