#!/bin/bash
# queue5.sh — 11 Nov 2026 ~15:45 UTC: after queue4 (sed -i gives queue4.sh a new file; the running queue4 keeps the old text, so s90 is queued here).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[234].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s90"; timeout 1200 node s90_partsale.mjs > s90.log 2>&1; log "end s90 rc=$?"; log "queue5 done"
