#!/bin/bash
# chain39.sh — 11 Nov 2026: after chain38 ends: q1 (QA "after" side of the release-day checks pr1 ran on production).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-8].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start q1"; timeout 900 node q1_after.mjs > q1.log 2>&1; log "end q1 rc=$?"; log "chain39 done"
