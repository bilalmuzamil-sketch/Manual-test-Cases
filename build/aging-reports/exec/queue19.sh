#!/bin/bash
# queue19.sh — 11 Nov 2026 ~16:15 UTC: s89b = s89 again (stocked part picked per location; new vendor names "... P89b") after queue18.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-8]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s89b"; timeout 2400 node s89_vcredit.mjs > s89b.log 2>&1; log "end s89b rc=$?"; log "queue19 done"
