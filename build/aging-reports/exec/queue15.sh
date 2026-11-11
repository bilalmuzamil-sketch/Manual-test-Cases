#!/bin/bash
# queue15.sh — 11 Nov 2026 ~16:40 UTC: p74 loading-bar comparison (C715499-C715504) after queue14.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-4]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p74"; timeout 900 node p74_loadbar.mjs > p74.log 2>&1; log "end p74 rc=$?"; log "queue15 done"
