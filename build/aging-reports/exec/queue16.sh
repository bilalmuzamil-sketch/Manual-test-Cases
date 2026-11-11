#!/bin/bash
# queue16.sh — 11 Nov 2026 ~16:00 UTC: p75 (can Tech's role be changed with the runbook's staff id?) after queue15.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-5]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p75"; timeout 600 node p75_techrole.mjs > p75.log 2>&1; log "end p75 rc=$?"; log "queue16 done"
