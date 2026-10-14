#!/bin/bash
# 14 Oct 2026 — third pass on staging: each line of third-pass-plan.txt = script | ONLY | extra settings. Logs to
# evidence/staging-full-2026-10-14/logs3/. stg6.mts runs through its own sign-in (npx tsx from global-search/e2e).
cd "$(dirname "$0")"; source stg-env.sh; export WOB_LOC_SELECT=1 WOB_EMPTY_LOC="ZZAUTOTEST F2 Empty Shop"
L=evidence/staging-full-2026-10-14/logs3; mkdir -p $L
grep -v '^#' third-pass-plan.txt | while IFS='|' read -r s only extra; do
  s=$(echo $s); only=$(echo $only); extra=$(echo "$extra" | sed 's/^ *//; s/ *$//'); [ -z "$s" ] && continue
  [ -f "$L/${s%.mts}.done" ] && continue
  echo "$(date -u +%H:%M:%S) $s ($only) [$extra]" >> $L/run.out
  if [ "$extra" = "NODIRECT" ]; then
    (cd ../../global-search/e2e && ONLY="$only" timeout 3600 npx tsx ../../wo-board-tech-view/run498-2026-10-08/$s) > $L/${s%.mts}.log 2>&1; rc=$?
  else
    env ONLY="$only" ${extra:+"$extra"} timeout 3600 ./wob-run.sh "$s" > $L/${s%.mts}.log 2>&1; rc=$?
  fi
  echo "EXIT=$rc" >> $L/${s%.mts}.log; [ $rc -eq 0 ] && touch $L/${s%.mts}.done
done
echo "$(date -u +%H:%M:%S) THIRD PASS DONE" >> $L/run.out
