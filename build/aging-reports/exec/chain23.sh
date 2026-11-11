#!/bin/bash
# chain23.sh — 11 Nov 2026: after chain22 ends: p67 (read-only data census for the next batch).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-2].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p67"; timeout 1800 node p67_find.mjs > p67.log 2>&1; log "end p67 rc=$?"; log "chain23 done"
