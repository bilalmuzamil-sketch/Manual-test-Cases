#!/bin/bash
# queue21.sh — 11 Nov 2026 ~16:20 UTC: p76 (the Admin's enrolled locations) after queue20.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|20).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p76"; timeout 600 node p76_enrolled.mjs > p76.log 2>&1; log "end p76 rc=$?"; log "queue21 done"
