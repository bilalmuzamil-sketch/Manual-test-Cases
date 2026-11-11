#!/bin/bash
# runq40.sh — 11 Nov 2026 ~19:20 UTC: pm1b = pm1 re-run (iam/create now carries workPlaceId) after d3b2 (runq35) and everything before it.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start pm1b"; timeout 2400 node pm1_perms.mjs > pm1b.log 2>&1; log "end pm1b rc=$?"; log "runq40 done"
