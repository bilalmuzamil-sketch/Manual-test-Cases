#!/bin/bash
# runq44.sh — 11 Nov 2026 ~21:35 UTC: d3j (C715556 two customers with B having nothing open; C715555 full Vendor menus) after d3i (runq43), before pm1b (runq40).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|runq4[123]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3j"; timeout 900 node d3j_fix.mjs > d3j.log 2>&1; log "end d3j rc=$?"; log "runq44 done"
