#!/bin/bash
# runq36.sh — 11 Nov 2026 ~18:20 UTC: pm1 (permission tests C715425-432, C715448, C715474, C715610, C715616 as new staff with the p71 roles,
# switch-user + own-context route) after queues 18-26 and runq31-34, BEFORE d3b2 (runq35 waits on runq3[1-4]; this one is not in its pattern, so
# whichever starts first runs - both wait for no node runner).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-478]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start pm1"; timeout 2400 node pm1_perms.mjs > pm1.log 2>&1; log "end pm1 rc=$?"; log "runq36 done"
