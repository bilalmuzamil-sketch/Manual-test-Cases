#!/bin/bash
# 16 Oct 2026 (third go, build v26.40.18-7d85b7d) — re-runs for the 30 tests whose expected results changed (RETEST-PLAN-2026-10-16.md).
# Usage: ./rerun-1016c.sh "C96909 s1-batch1.mts" "C581895 c581895-v2.mts" ...   One script at a time, each after ensure-heavy.mts (L0399).
# Stops the whole queue if a log shows the staging sign-in has expired (Google sign-in page or sso_required, L0393).
cd "$(dirname "$0")"; source stg-env.sh; L=$WOB_EV/logs-1016c; mkdir -p $L
for pair in "$@"; do
  set -- $pair; tag=${3:-${2%.mts}}
  timeout 300 ./wob-run.sh ensure-heavy.mts > $L/ensure-$tag.log 2>&1; rc=$?
  echo "$(date -u +%T) location check before $tag: exit $rc $(grep -o 'LOCATION.*' $L/ensure-$tag.log | head -1)" >> $L/queue.out
  if grep -qE 'accounts\.google\.com|sso_required' $L/ensure-$tag.log; then echo "$(date -u +%T) STOP: staging sign-in expired" >> $L/queue.out; break; fi
  [ $rc -ne 0 ] && { echo "$(date -u +%T) SKIPPED $tag (not at Heavy Duty)" >> $L/queue.out; continue; }
  echo "$(date -u +%T) start $2 ONLY=$1" >> $L/queue.out
  ONLY=$1 timeout ${WOB_TIMEOUT:-1800} ./wob-run.sh $2 > $L/$tag.log 2>&1; echo "$(date -u +%T) end $tag exit $?" >> $L/queue.out
  if grep -qE 'accounts\.google\.com|sso_required' $L/$tag.log; then echo "$(date -u +%T) STOP: staging sign-in expired" >> $L/queue.out; break; fi
done
echo "$(date -u +%T) queue finished" >> $L/queue.out
