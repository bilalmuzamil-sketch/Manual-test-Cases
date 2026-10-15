#!/bin/bash
# 15 Oct 2026: after the seventh pass writes "seventh pass finished" (stg-after7.sh), run the EIGHTH pass (eighth-pass-plan.txt, run-eighth.sh).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "seventh pass finished" $E/run-all.out 2>/dev/null; do sleep 30; done
mkdir -p $E/json-before-pass8 && cp $E/*.json $E/json-before-pass8/ 2>/dev/null   # readings of pass 7, kept before scripts rewrite their files
echo "$(date -u +%H:%M:%S) eighth pass start" >> $E/run-all.out
./run-eighth.sh; rc=$?
echo "$(date -u +%H:%M:%S) eighth pass finished (exit $rc)" >> $E/run-all.out
