#!/bin/bash
# queue13.sh — 11 Nov 2026: re-run C715407/C715408 (real location switch), after queues 1-12. Ends by switching back is NOT done by the test; queue runs p40 to switch back.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[012])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s5e env ONLY=C715407,C715408 timeout 900 node s5_run.mjs > s5e.log 2>&1
log "queue13 done"
