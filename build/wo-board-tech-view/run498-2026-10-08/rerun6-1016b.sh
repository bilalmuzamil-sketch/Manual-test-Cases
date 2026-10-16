#!/bin/bash
# 16 Oct 2026 (second go) — the staging re-runs, each preceded by ensure-heavy.mts (the account had drifted to other locations, L0399).
# C368156 (switches location itself) goes LAST. Logs: evidence/staging-full-2026-10-14/logs-1016b/
cd "$(dirname "$0")"; source stg-env.sh; L=$WOB_EV/logs-1016b; mkdir -p $L
for pair in "C368217 ps-counts.mts" "C368178,C368179 high1-fix5.mts" "C96962 s4-batchE.mts" "C97012 staledrop-stg4.mts" "C590120 design-stg5.mts" "C368156 rest-batch.mts"; do
  set -- $pair; timeout 300 ./wob-run.sh ensure-heavy.mts > $L/ensure-${2%.mts}.log 2>&1; rc=$?
  echo "$(date -u +%T) location check before $2: exit $rc $(grep -o 'LOCATION.*' $L/ensure-${2%.mts}.log | head -1)" >> $L/queue.out
  [ $rc -ne 0 ] && { echo "$(date -u +%T) SKIPPED $2 (not at Heavy Duty)" >> $L/queue.out; continue; }
  echo "$(date -u +%T) start $2 ONLY=$1" >> $L/queue.out
  ONLY=$1 timeout 1800 ./wob-run.sh $2 > $L/${2%.mts}.log 2>&1; echo "$(date -u +%T) end $2 exit $?" >> $L/queue.out
done
echo "$(date -u +%T) queue finished" >> $L/queue.out
