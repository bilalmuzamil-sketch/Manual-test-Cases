#!/bin/bash
# queue17.sh — 11 Nov 2026 ~16:05 UTC: p71b = p71 again for the three roles that hit the "Enable See Financial Data?" dialog (existing roles skipped), after queue16.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-6]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p71b"; timeout 1200 node p71_roles.mjs > p71b.log 2>&1; log "end p71b rc=$?"; log "queue17 done"
