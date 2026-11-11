#!/bin/bash
# queue9.sh — 11 Nov 2026 ~15:30 UTC: q1b = q1_after.mjs again (left menu found by text; the aside/.q-drawer/nav selector matched nothing) after queue8.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[2-8].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start q1b"; timeout 1800 node q1_after.mjs > q1b.log 2>&1; log "end q1b rc=$?"; log "queue9 done"
