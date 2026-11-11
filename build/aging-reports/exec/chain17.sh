#!/bin/bash
# chain17.sh — 11 Nov 2026 ~14:05 UTC: after chain16 ends: p63 (C715449 tap instrument with Work In Progress control).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p63"; timeout 300 node p63_tap_info.mjs > p63.log 2>&1; log "end p63 rc=$?"; log "chain17 done"
