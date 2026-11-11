#!/bin/bash
# queue22.sh — 11 Nov 2026: s4p (pinned rows C715362/364/365) did not sign in at 08:21 (one-off, s4c signed in at once after), so run it again after queues 2-21.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[01])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s4p2 env ONLY=C715362,C715364,C715365 timeout 1800 node s4_run.mjs > s4p2.log 2>&1
log "queue22 done"
