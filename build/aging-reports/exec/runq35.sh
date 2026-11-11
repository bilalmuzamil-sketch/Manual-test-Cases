#!/bin/bash
# runq35.sh — 11 Nov 2026 ~17:40 UTC: d3b2 = d3b re-run (every case now starts in light theme) for the cases that ran dark or never ran, after queues 14-26 and runq31-34. Re-armed 18:20 to wait for runq36 (pm1) too, so the two never start together.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-46789]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start d3b2"; ONLY=C715546,C715520,C715532,C715534,C715536,C715538,C715539,C715541,C715542,C715543,C715544,C715545,C715547,C715548,C715549,C715550,C715551,C715552,C715553,C715554,C715555,C715556,C715557 timeout 5400 node d3b_design.mjs > d3b2.log 2>&1; log "end d3b2 rc=$?"; log "runq35 done"
