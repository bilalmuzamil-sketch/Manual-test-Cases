#!/bin/bash
# 15 Oct 2026 — SEVENTH pass on staging: each line of seventh-pass-plan.txt = script | ONLY | extra settings. Logs to
# evidence/staging-full-2026-10-14/logs7/. NODIRECT scripts run through their own sign-in (npx tsx from global-search/e2e).
# The first line (signin-check-stg4.mts) proves sign-in still works after the sixth pass; if it fails, nothing else runs.
cd "$(dirname "$0")"; source stg-env.sh; export WOB_LOC_SELECT=1 WOB_EMPTY_LOC="ZZAUTOTEST F2 Empty Shop"
L=evidence/staging-full-2026-10-14/logs7; mkdir -p $L
grep -v '^#' seventh-pass-plan.txt | while IFS='|' read -r s only extra; do
  s=$(echo $s); only=$(echo $only); extra=$(echo "$extra" | sed 's/^ *//; s/ *$//'); [ -z "$s" ] && continue
  [ "$s" != "signin-check-stg4.mts" ] && [ -f "$L/${s%.mts}.done" ] && continue   # the sign-in check always runs
  TO=3600; [ "$s" = "design-stg5.mts" ] && TO=5400   # 22 design cases with their own data and pictures: up to 90 minutes
  echo "$(date -u +%H:%M:%S) $s ($only) [$extra]" >> $L/run.out
  if [ "$extra" = "NODIRECT" ]; then
    (cd ../../global-search/e2e && ONLY="$only" timeout $TO npx tsx ../../wo-board-tech-view/run498-2026-10-08/$s) > $L/${s%.mts}.log 2>&1; rc=$?
  else
    env ONLY="$only" ${extra:+"$extra"} timeout $TO ./wob-run.sh "$s" > $L/${s%.mts}.log 2>&1; rc=$?
  fi
  echo "EXIT=$rc" >> $L/${s%.mts}.log; [ $rc -eq 0 ] && touch $L/${s%.mts}.done
  if [ "$s" = "signin-check-stg4.mts" ] && [ $rc -ne 0 ]; then echo "$(date -u +%H:%M:%S) SIGN-IN FAILED after the sixth pass — seventh pass stopped (new staging cookies needed)" >> $L/run.out; exit 3; fi
done; [ "${PIPESTATUS[1]}" = "3" ] && exit 3
echo "$(date -u +%H:%M:%S) SEVENTH PASS DONE" >> $L/run.out
