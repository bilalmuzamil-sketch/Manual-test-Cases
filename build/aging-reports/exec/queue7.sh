#!/bin/bash
# queue7.sh — 11 Nov 2026 ~16:00 UTC: p73 (phone positive control for C715446) after queue6.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue[23456].sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p73"; timeout 600 node p73_phonectl.mjs > p73.log 2>&1; log "end p73 rc=$?"; log "queue7 done"
