#!/bin/bash
# queue.sh — 11 Nov 2026: ONE strict queue for the aging-report runs on sv11315 (a second admin sign-in ends the first, so jobs never overlap).
# Each line runs only after the previous one has exited. Progress in queue.log.
cd "$(dirname "$0")"
log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "node [a-z0-9_]+\.mjs" >/dev/null; do sleep 15; done
run() { local name=$1; shift; log "start $name"; "$@"; log "end $name rc=$?"; }
run p36   env RUN_P36=1 timeout 300  node p36_exact.mjs      > p36.log 2>&1
run p34   timeout 900  node p34_seed_s4.mjs                  > p34.log 2>&1
run s4    timeout 3600 node s4_run.mjs                       > s4.log 2>&1
run p35   timeout 600  node p35_seed_s5.mjs                  > p35.log 2>&1
run s5    timeout 3600 node s5_run.mjs                       > s5.log 2>&1
run s2b4  env ONLY=C715305 timeout 900 node s2_run.mjs s2b.json > s2b4.log 2>&1
run s2c2  env ONLY=C715320,C715317 timeout 1800 node s2c_run.mjs > s2c2.log 2>&1
run s2d   timeout 5400 node s2_run.mjs s2d.json              > s2d.log 2>&1
run s78   timeout 3600 node s78_run.mjs                      > s78.log 2>&1
log "queue done"
