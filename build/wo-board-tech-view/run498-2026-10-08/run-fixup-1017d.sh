#!/bin/bash
# 17 Oct 2026 — FIX-UP pass for TestRail run 498 (WO Board & Tech View) on staging: re-runs ONLY the tests whose SCRIPT failed in the
# 16 Oct full staging run (judge's report), after the 11 scripts were fixed. A copy of run-full-1016.sh, adapted:
#   - reads ORDER_FILE (default fixup-1017.txt; same line format as full-order-1016.txt: block|script|ONLY ids|extra env|mode|note)
#   - logs to evidence/staging-full-2026-10-14/logs-fixup-1017/<step>-<script>.log, one queue.out line per start / end / skip
#   - before each step the script's own result file (<script>.json in WOB_EV) is copied to <step>-<script>.before.json, because a
#     re-run with ONLY rewrites that file and would otherwise drop the main run's readings of the other cases in it
#   - no Analyst 1 block, no TODO / two-day / draft modes (none are in the fix-up list); signout-fix is NOT in it (see below)
# PREPARED, NOT RUN. Start it only after run-full-1016.sh has finished (one staging sign-in holds one session, L0394; this script
# refuses to start while another wob-run.sh is running) and on the QA lead's go-ahead.
#
# Usage:   ./run-fixup-1017.sh                 the whole fix-up list
#          FROM=<n> ./run-fixup-1017.sh        resume from step n (step numbers are in queue.out)
#          ORDER_FILE=<file> ./run-fixup-1017.sh   another list in the same format
# Before EVERY Admin script: `timeout 300 ./wob-run.sh ensure-heavy.mts` (exit 0 required, else the script is SKIPPED, L0399).
# The queue stops if a log shows the staging sign-in has expired — CONFIRMED first by a fresh ensure-heavy sign-in (confirm_expired,
# L0413: a single Google page in one log was a false stop on 16 Oct).
# signout-fix.mts (C368240) signs the shared session out and must stay the LAST thing run on staging: if the main run held it
# (NO_SIGNOUT=1), run it after this fix-up:  ONLY=C368240 ./wob-run.sh signout-fix.mts  (with stg-env.sh sourced).
set -u
cd "$(dirname "$0")"; HERE="$(pwd)"; source stg-env.sh
export WOB_LOC_SELECT=1 WOB_EMPTY_LOC="ZZAUTOTEST F2 Empty Shop"     # as every staging pass since the second (run-second.sh … run-full-1016.sh)
ORDER_FILE="${ORDER_FILE:-fixup-1017d.txt}"; [ -f "$ORDER_FILE" ] || { echo "no order file $ORDER_FILE"; exit 2; }
L=$WOB_EV/logs-fixup-1017d; mkdir -p "$L"; Q=$L/queue.out
say() { echo "$(date -u +%T) $*" | tee -a "$Q"; }
expired() { grep -qE 'accounts\.google\.com|sso_required' "$1" 2>/dev/null; }
# a log that looks expired is CONFIRMED by a fresh ensure-heavy sign-in before the queue stops (L0413)
confirm_expired() { expired "$1" || return 1; timeout 300 ./wob-run.sh ensure-heavy.mts > "$L/recheck-$(date +%H%M%S).log" 2>&1 && { say "sign-in re-checked after a Google page in $1: still signed in, carrying on"; return 1; }; return 0; }
if ps -eo args | grep -v "run-fixup-1017" | grep -q "[w]ob-run.sh"; then say "STOP: another wob-run.sh is running (one staging sign-in holds one session, L0394)"; exit 1; fi
say "fix-up queue start: $ORDER_FILE"
n=0
grep -v '^#' "$ORDER_FILE" | while IFS='|' read -r block s only extra mode note; do
  n=$((n+1)); [ "$n" -lt "${FROM:-1}" ] && continue
  [ -z "$s" ] && continue
  [ "$only" = "-" ] && only=""; [ "$extra" = "-" ] && extra=""
  tag=$(printf '%02d-%s' "$n" "${s%.mts}"); log=$L/$tag.log
  [ -f "$WOB_EV/${s%.mts}.json" ] && cp "$WOB_EV/${s%.mts}.json" "$L/$tag.before.json"
  if [ "$mode" = setup ]; then
    say "step $n start $s [set-up] $extra"
    env ${extra:+"$extra"} timeout 900 ./wob-run.sh "$s" > "$log" 2>&1; rc=$?; say "step $n end $s exit $rc $(grep -oE 'BUILD .*|SIGN-IN (OK|FAILED)' "$log" | head -1)"
    if [ "$s" = stg6-tz.mts ] && [ $rc -ne 0 ]; then
      env ${extra:+"$extra"} timeout 900 ./wob-run.sh "$s" > "$log.retry" 2>&1; rc=$?; say "step $n stg6-tz retry exit $rc"
      [ $rc -ne 0 ] && { say "STOP: the location zone could not be proved equal to the browser zone (Rule 125)"; break; }
    fi
    confirm_expired "$log" && { say "STOP: staging sign-in expired"; break; }
    continue
  fi
  case "$mode" in ensure|nodirect) ;; *) say "step $n SKIPPED $s: mode '$mode' is not run by the fix-up queue"; continue ;; esac
  # an Admin script, started from Heavy Duty
  timeout 300 ./wob-run.sh ensure-heavy.mts > "$L/$tag.ensure.log" 2>&1; rc=$?
  say "step $n location check before $s: exit $rc $(grep -o 'LOCATION.*' "$L/$tag.ensure.log" | head -1)"
  confirm_expired "$L/$tag.ensure.log" && { say "STOP: staging sign-in expired"; break; }
  [ $rc -ne 0 ] && { say "step $n SKIPPED $s ONLY=$only (not at Heavy Duty)"; continue; }
  say "step $n start $s ONLY=$only ${extra:+[$extra]} ($mode)"
  if [ "$mode" = nodirect ]; then
    (cd ../../global-search/e2e && env ONLY="$only" ${extra:+"$extra"} TZ="${WOB_TZ:-UTC}" timeout 3600 npx tsx "$HERE/$s") > "$log" 2>&1; rc=$?
  else
    env ONLY="$only" ${extra:+"$extra"} timeout 3600 ./wob-run.sh "$s" > "$log" 2>&1; rc=$?
  fi
  say "step $n end $s exit $rc $(grep -c 'START STATE found' "$log") start-state line(s)"
  confirm_expired "$log" && { say "STOP: staging sign-in expired"; break; }
done
say "fix-up queue finished"
