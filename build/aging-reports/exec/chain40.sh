#!/bin/bash
# chain40.sh — 11 Nov 2026: after chain39 ends: s83b = s83 re-run for the tests that ran while the bridge was down (C715356, C715363, C715600, C715384, C715385).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "chain1[2-9].sh|chain2[0-9].sh|chain3[0-9].sh" >/dev/null || pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start s83b"; ONLY=C715356,C715363,C715600,C715384,C715385 timeout 1800 node s83_groups.mjs > s83b.log 2>&1; log "end s83b rc=$?"; log "chain40 done"
