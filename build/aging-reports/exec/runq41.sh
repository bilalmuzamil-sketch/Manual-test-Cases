#!/bin/bash
# runq41.sh — 11 Nov 2026 ~19:45 UTC: d3g (C715538 credit-memo row) after d3b2 (runq35), before pm1b (runq40).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3g"; timeout 600 node d3g_cm.mjs > d3g.log 2>&1; log "end d3g rc=$?"; log "runq41 done"
