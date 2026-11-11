#!/bin/bash
# queue29.sh — 11 Nov 2026: p44 page-join check for C715360/C715361, after queues 2-28.
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([2-9]|1[0-9]|2[0-8])?\.sh$|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 20; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p44 timeout 600 node p44_pageedge.mjs > p44.log 2>&1
log "queue29 done"
