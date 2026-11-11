#!/bin/bash
# chain19.sh — 11 Nov 2026 ~14:12 UTC: after chain18 ends: p65 (C715477 with the right work-order link).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-8].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p65"; timeout 300 node p65_wo_link.mjs > p65.log 2>&1; log "end p65 rc=$?"; log "chain19 done"
