#!/bin/bash
# queue23.sh — 11 Nov 2026 ~16:35 UTC: q2 (C715582 old drill-down links on the QA site) after queue22.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-2]).sh|chain3[0-6].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start q2"; timeout 600 node q2_oldlink.mjs > q2.log 2>&1; log "end q2 rc=$?"; log "queue23 done"
