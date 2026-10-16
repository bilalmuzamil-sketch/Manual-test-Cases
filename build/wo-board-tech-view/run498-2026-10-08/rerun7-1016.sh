#!/bin/bash
# 16 Oct 2026 — the 7 staging re-runs from NEXT-SESSION-2026-10-15.md, ONE AT A TIME (one staging sign-in holds one session, L0394),
# started after C97033 day 2 (ga-week.mts) finishes. Logs: evidence/staging-full-2026-10-14/logs-1016/<script>.log
cd "$(dirname "$0")"; source stg-env.sh; L=$WOB_EV/logs-1016; mkdir -p $L
while ps -eo args | grep -q "[g]a-week.mts"; do sleep 20; done
for pair in "C368217 ps-counts.mts" "C368156 rest-batch.mts" "C368178,C368179 high1-fix5.mts" "C96962 s4-batchE.mts" "C97012 staledrop-stg4.mts" "C590120 design-stg5.mts"; do
  set -- $pair; echo "$(date -u +%T) start $2 ONLY=$1" >> $L/queue.out
  ONLY=$1 timeout 1800 ./wob-run.sh $2 > $L/${2%.mts}.log 2>&1; echo "$(date -u +%T) end $2 exit $?" >> $L/queue.out
done
echo "$(date -u +%T) queue finished" >> $L/queue.out
