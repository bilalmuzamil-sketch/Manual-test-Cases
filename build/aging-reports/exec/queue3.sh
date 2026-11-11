#!/bin/bash
# queue3.sh — 11 Nov 2026 ~15:15 UTC: runs after queue2.sh. The long-bucket tests C715454 / C715455 with the fixed s86 reader (non-empty rows only,
# document number by the ID column, location fallback reading the menu's own lines). (queue2 was edited while running; bash keeps the old text.)
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue2.sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s86c"; ONLY=C715454,C715455 timeout 2400 node s86_paging.mjs > s86c.log 2>&1; log "end s86c rc=$?"; log "queue3 done"
