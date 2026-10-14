#!/bin/bash
# 15 Oct 2026: after the second pass writes "SECOND PASS DONE", run the third pass (third-pass-plan.txt; signout-fix LAST).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "SECOND PASS DONE" $E/logs2/run.out 2>/dev/null; do sleep 30; done
echo "$(date -u +%H:%M:%S) third pass start" >> $E/run-all.out
./run-third.sh
echo "$(date -u +%H:%M:%S) third pass finished" >> $E/run-all.out
