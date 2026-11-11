#!/bin/bash
# queue26.sh — 11 Nov 2026 ~16:55 UTC: p77 (C715537 Close) after queue25.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-5]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p77"; timeout 600 node p77_close.mjs > p77.log 2>&1; log "end p77 rc=$?"; log "queue26 done"
