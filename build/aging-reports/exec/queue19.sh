#!/bin/bash
# queue19.sh — 11 Nov 2026: queue.sh (s2d, s78) was killed by the 2-hour background limit at 08:01 while s2d ran; only C715289 finished.
# Re-run the other 19 sorts and s78, after queues 2-18. Started with nohup, so no session limit stops it.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-8])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run s2d2 env ONLY=C715290,C715292,C715293,C715295,C715296,C715299,C715300,C715303,C715304,C715307,C715308,C715310,C715311,C715312,C715314,C715323,C715593,C715588,C715591 timeout 5400 node s2_run.mjs s2d.json > s2d2.log 2>&1
run s78 timeout 5400 node s78_run.mjs > s78.log 2>&1
log "queue19 done"
