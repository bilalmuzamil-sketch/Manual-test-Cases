#!/bin/bash
# 15 Oct 2026: after the fourth pass writes "fourth pass finished" (stg-after4.sh), run the FIFTH pass (fifth-pass-plan.txt, run-fifth.sh).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "fourth pass finished" $E/run-all.out 2>/dev/null; do sleep 30; done
mkdir -p $E/json-before-pass5 && cp $E/*.json $E/json-before-pass5/ 2>/dev/null   # readings of pass 4, kept before scripts rewrite their files
echo "$(date -u +%H:%M:%S) fifth pass start" >> $E/run-all.out
./run-fifth.sh; rc=$?
echo "$(date -u +%H:%M:%S) fifth pass finished (exit $rc)" >> $E/run-all.out
