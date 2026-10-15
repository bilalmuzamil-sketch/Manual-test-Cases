#!/bin/bash
# 15 Oct 2026: after the ninth pass writes "ninth pass finished" (stg-after9.sh), run the TENTH pass (tenth-pass-plan.txt, run-tenth.sh).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "ninth pass finished" $E/run-all.out 2>/dev/null; do sleep 30; done
mkdir -p $E/json-before-pass10 && cp $E/*.json $E/json-before-pass10/ 2>/dev/null   # readings of pass 9, kept before scripts rewrite their files
echo "$(date -u +%H:%M:%S) tenth pass start" >> $E/run-all.out
./run-tenth.sh; rc=$?
echo "$(date -u +%H:%M:%S) tenth pass finished (exit $rc)" >> $E/run-all.out
