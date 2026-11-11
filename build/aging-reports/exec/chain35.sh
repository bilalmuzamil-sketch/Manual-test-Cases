#!/bin/bash
# chain35.sh — 11 Nov 2026: after chain34 ends: p65b (C715477: is the work-order link good? copy one at Lethbridge, paste at Heavy Duty).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-4].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start p65b"; timeout 600 node p65b_wo_link.mjs > p65b.log 2>&1; log "end p65b rc=$?"; log "chain35 done"
