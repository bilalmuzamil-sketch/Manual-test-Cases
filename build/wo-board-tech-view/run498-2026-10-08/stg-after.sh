#!/bin/bash
# 14 Oct 2026: after run-all.sh finishes on staging, run the five new cases (stg-new5.mts). Sign-out stays manual-last.
cd "$(dirname "$0")"; source stg-env.sh; E=evidence/staging-full-2026-10-14
until grep -q "^done — logs in" $E/run-all.out; do sleep 30; done
echo "$(date -u +%H:%M:%S) stg-new5 start" >> $E/run-all.out
timeout 3600 ./wob-run.sh stg-new5.mts > $E/logs/stg-new5.log 2>&1; echo "EXIT=$?" >> $E/logs/stg-new5.log
echo "$(date -u +%H:%M:%S) stg-new5 finished" >> $E/run-all.out
