#!/bin/bash
# 22 Oct 2026: stop the production full run cleanly at a step boundary so a set-up fix that needs its own sign-in can run
# (a second production sign-in ends the first). Waits for "step <N> end" in the queue log, then stops the queue runner,
# run-full-prod-1022.sh and any wob-run.sh / node child — matched by PID, never by a pattern that could match this script.
# Usage: ./pause-at-step-1022.sh <N>     Resume afterwards with FROM=<N+1> ./run-full-prod-1022.sh
N=$1; Q=evidence/prod-2026-10-22/logs-full/queue.out; cd "$(dirname "$0")"
until grep -q "step $N end" "$Q"; do sleep 5; done
me=$$; par=$PPID
for i in 1 2 3; do
  for pid in $(pgrep -f "run-full-prod-1022.sh|wob-run.sh|run_queue.sh .*q-prod-full|ensure-loc.mts|node .*\.mts"); do
    [ "$pid" = "$me" ] || [ "$pid" = "$par" ] || kill "$pid" 2>/dev/null
  done; sleep 2
done
echo "$(date -u +%H:%M:%S) paused after step $N" | tee -a "$Q"
