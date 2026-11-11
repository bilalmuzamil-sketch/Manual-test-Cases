#!/bin/bash
# chain46.sh — 11 Nov 2026: after chain45 ends: s88 (three-location tests: C715387, C715394, C715411, C715412, C715413, C1062584, C1062585).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh|chain4[0-5].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s88"; timeout 1800 node s88_threeloc.mjs > s88.log 2>&1; log "end s88 rc=$?"; log "chain46 done"
