#!/bin/bash
# runq46.sh — 11 Nov 2026 ~22:55 UTC: pm2 (C715384/C715431/C715432/C715610 redo, customer/vendor ticked first) - runs alone (it switches the shared Admin session).
cd "$(dirname "$0")"; log() { echo "$(date -u +%H:%M:%S) $*" >> queue.log; }
while pgrep -f "queue([1-9]|1[0-9]|2[0-6])\.sh|runq3[1-9]\.sh|runq4[0-5]\.sh|node [a-z0-9_]+\.mjs" >/dev/null; do sleep 10; done
log "start pm2"; OUTDIR=./pm2/ ONLY=C715384,C715431,C715432,C715610 timeout 1500 node pm1_perms.mjs > pm2.log 2>&1; log "end pm2 rc=$?"; log "runq46 done"
