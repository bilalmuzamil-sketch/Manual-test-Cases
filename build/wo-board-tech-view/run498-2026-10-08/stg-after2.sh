#!/bin/bash
# 14 Oct 2026: after stg-new5 finishes (stg-after.sh writes "stg-new5 finished"), start the second pass.
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "stg-new5 finished" $E/run-all.out; do sleep 30; done
echo "$(date -u +%H:%M:%S) second pass start" >> $E/run-all.out
./run-second.sh
echo "$(date -u +%H:%M:%S) second pass finished" >> $E/run-all.out
