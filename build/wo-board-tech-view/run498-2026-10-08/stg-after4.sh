#!/bin/bash
# 15 Oct 2026: after the third pass writes "third pass finished" (stg-after3.sh), run the fourth pass (fourth-pass-plan.txt).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "third pass finished" $E/run-all.out 2>/dev/null; do sleep 30; done
mkdir -p $E/json-before-pass4 && cp $E/*.json $E/json-before-pass4/ 2>/dev/null   # readings of pass 3, kept before scripts rewrite their files
echo "$(date -u +%H:%M:%S) fourth pass start" >> $E/run-all.out
./run-fourth.sh; rc=$?
echo "$(date -u +%H:%M:%S) fourth pass finished (exit $rc)" >> $E/run-all.out
