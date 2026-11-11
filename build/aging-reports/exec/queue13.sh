#!/bin/bash
# queue13.sh — 11 Nov 2026 ~16:10 UTC: d3b design screen states (31 design tests) after queue12.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[012]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3b"; timeout 5400 node d3b_design.mjs > d3b.log 2>&1; log "end d3b rc=$?"; log "queue13 done"
