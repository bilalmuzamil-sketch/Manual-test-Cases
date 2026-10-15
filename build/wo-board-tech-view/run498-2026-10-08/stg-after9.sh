#!/bin/bash
# 15 Oct 2026: after the eighth pass writes "eighth pass finished" (stg-after8.sh), run the NINTH pass (ninth-pass-plan.txt, run-ninth.sh).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "eighth pass finished" $E/run-all.out 2>/dev/null; do sleep 30; done
mkdir -p $E/json-before-pass9 && cp $E/*.json $E/json-before-pass9/ 2>/dev/null   # readings of pass 8, kept before scripts rewrite their files
echo "$(date -u +%H:%M:%S) ninth pass start" >> $E/run-all.out
./run-ninth.sh; rc=$?
echo "$(date -u +%H:%M:%S) ninth pass finished (exit $rc)" >> $E/run-all.out
