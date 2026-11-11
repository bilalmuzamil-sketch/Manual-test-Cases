#!/bin/bash
# queue14.sh — 11 Nov 2026: re-run C715606/C715608 with a customer/vendor whose documents are only at the current location, after queues 1-13.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-3])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5f env ONLY=C715606,C715608 timeout 900 node s5_run.mjs > s5f.log 2>&1
log "queue14 done"
