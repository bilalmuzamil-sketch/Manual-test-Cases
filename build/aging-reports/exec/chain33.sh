#!/bin/bash
# chain33.sh — 11 Nov 2026: after chain32 ends: p63b (C715449 frame-by-frame tap re-check; its Passed was withdrawn).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-2].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p63b"; timeout 600 node p63b_tap_frames.mjs > p63b.log 2>&1; log "end p63b rc=$?"; log "chain33 done"
