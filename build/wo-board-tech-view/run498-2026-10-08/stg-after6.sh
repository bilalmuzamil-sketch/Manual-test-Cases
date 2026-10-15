#!/bin/bash
# 15 Oct 2026: after the fifth pass writes "fifth pass finished" (stg-after5.sh), run the SIXTH pass (sixth-pass-plan.txt, run-sixth.sh).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "fifth pass finished" $E/run-all.out 2>/dev/null; do sleep 30; done
mkdir -p $E/json-before-pass6 && cp $E/*.json $E/json-before-pass6/ 2>/dev/null   # readings of pass 5, kept before scripts rewrite their files
echo "$(date -u +%H:%M:%S) sixth pass start" >> $E/run-all.out
./run-sixth.sh; rc=$?
echo "$(date -u +%H:%M:%S) sixth pass finished (exit $rc)" >> $E/run-all.out
