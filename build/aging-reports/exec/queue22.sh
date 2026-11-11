#!/bin/bash
# queue22.sh — 11 Nov 2026 ~16:25 UTC: q1c (filter memory, QA side, redone) after queue21.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[01]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start q1c"; timeout 900 node q1c_memory.mjs > q1c.log 2>&1; log "end q1c rc=$?"; log "queue22 done"
