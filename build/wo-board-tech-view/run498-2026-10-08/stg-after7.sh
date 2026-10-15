#!/bin/bash
# 15 Oct 2026: after the sixth pass writes "sixth pass finished" (stg-after6.sh), run the SEVENTH pass (seventh-pass-plan.txt, run-seventh.sh).
cd "$(dirname "$0")"; E=evidence/staging-full-2026-10-14
until grep -q "sixth pass finished" $E/run-all.out 2>/dev/null; do sleep 30; done
mkdir -p $E/json-before-pass7 && cp $E/*.json $E/json-before-pass7/ 2>/dev/null   # readings of pass 6, kept before scripts rewrite their files
echo "$(date -u +%H:%M:%S) seventh pass start" >> $E/run-all.out
./run-seventh.sh; rc=$?
echo "$(date -u +%H:%M:%S) seventh pass finished (exit $rc)" >> $E/run-all.out
