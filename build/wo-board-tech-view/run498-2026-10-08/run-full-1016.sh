#!/bin/bash
# 16 Oct 2026 — FULL staging re-run of every test in TestRail run 498 (WO Board & Tech View), ONE script at a time.
# PREPARED, NOT RUN. Start it only on the QA lead's go-ahead (another session is build-verifying on the same staging sign-in).
#
# Usage:   ./run-full-1016.sh                       main run (blocks A, B, C, D, then G = signout-fix LAST)
#          RUN_TODO=1   ./run-full-1016.sh          also block E: tests whose case text changed after their latest result and whose
#                                                   script still needs a change (full-changed-1016.md) — only once the scripts are fixed
#          RUN_GA=day1  ./run-full-1016.sh          also ga-week.mts day 1 (C97026, C97033, C97034); RUN_GA=day2 on the NEXT
#                                                   Pakistan-time day runs PHASE=day2 ONLY=C97033,C97034 (two-day analytics)
#          RUN_DRAFTS=1 ./run-full-1016.sh          also block F: the six DRAFT scripts for the new cases C614711..C614719
#          FROM=<n>     ./run-full-1016.sh          resume from step n of full-order-1016.txt (step numbers are in queue.out)
# Plan:    full-order-1016.txt (one line per step), full-map-1016.json (script -> tests), full-unplaced-1016.md, full-changed-1016.md
# Logs:    evidence/staging-full-2026-10-14/logs-full-1016/<step>-<script>.log, one queue.out line per start / end / skip.
#
# ORDER, AND WHY (coordinator 16 Oct, proved ~18:35 UTC): Analyst 1's cookies now share the SAME Google sign-in (sv_sso_session) as the
# Admin's, and one Google sign-in holds ONE app session — every Admin quick-login ends the Analyst 1 session and the reverse. So:
#   A  Analyst 1 (second company) scripts FIRST, while its PHPSESSID is alive, with NO ensure-heavy.mts before them (that is an Admin
#      quick-login). analyst-ready.mts signs Analyst 1 in through the app's own Email/Password form only if its session has gone
#      (analyst.mts, L0405) and saves the new PHPSESSID to /tmp/qa-cookies/staging-analyst1.json. If it cannot, block A is skipped.
#   B  Admin set-up: build-marker.mts, stg6-tz.mts (Rule 125: Heavy Duty on Asia/Karachi = the browser, proved by the Schedule's
#      "now" pill; the queue STOPS if it cannot be proved, since time readings would be void), sign-in check, the view-only role put
#      back to View only, running test clocks stopped.
#   C  scripts that stay at Heavy Duty;  D  scripts that switch location / change roles (each still starts from ensure-heavy.mts).
#   E  TODO (not run by default) · F  DRAFTS (not run by default) · G  signout-fix.mts — it signs the shared session out, ALWAYS LAST.
# Before EVERY Admin script: `timeout 300 ./wob-run.sh ensure-heavy.mts` (exit 0 required, else the script is SKIPPED, L0399).
# The whole queue stops if any log shows the staging sign-in has expired (Google sign-in page or sso_required, L0393).
# C97012 (two people) is in block E: its route used Analyst 1's own Google sign-in, which is now the SAME one (see full-unplaced-1016.md).
set -u
cd "$(dirname "$0")"; HERE="$(pwd)"; source stg-env.sh
export WOB_LOC_SELECT=1 WOB_EMPTY_LOC="ZZAUTOTEST F2 Empty Shop"     # as every staging pass since the second (run-second.sh … run-tenth.sh)
L=$WOB_EV/logs-full-1016; mkdir -p "$L"; Q=$L/queue.out
say() { echo "$(date -u +%T) $*" | tee -a "$Q"; }
expired() { grep -qE 'accounts\.google\.com|sso_required' "$1" 2>/dev/null; }
if ps -eo args | grep -v "run-full-1016" | grep -q "[w]ob-run.sh"; then say "STOP: another wob-run.sh is running (one staging sign-in holds one session, L0394)"; exit 1; fi
SEED=$WOB_EV/orgb-seed-stg.json
ANALYST_OK=1; n=0
grep -v '^#' full-order-1016.txt | while IFS='|' read -r block s only extra mode note; do
  n=$((n+1)); [ "$n" -lt "${FROM:-1}" ] && continue
  [ -z "$s" ] && continue
  [ "$only" = "-" ] && only=""; [ "$extra" = "-" ] && extra=""
  tag=$(printf '%02d-%s' "$n" "${s%.mts}"); log=$L/$tag.log
  case "$mode" in
    todo)      [ "${RUN_TODO:-}" = 1 ]   || { say "step $n TODO not run: $s ONLY=$only ($note)"; continue; } ;;
    todo-2day) if [ "${RUN_GA:-}" = day1 ]; then extra="PHASE=day1+c97026"
               elif [ "${RUN_GA:-}" = day2 ]; then extra="PHASE=day2"; only="C97033,C97034"
               else say "step $n TWO-DAY not run: $s ONLY=$only (set RUN_GA=day1, then RUN_GA=day2 the next Pakistan-time day)"; continue; fi ;;
    draft)     [ "${RUN_DRAFTS:-}" = 1 ] || { say "step $n DRAFT not run: $s"; continue; } ;;
  esac
  if [ "$mode" = analyst ]; then
    [ "$ANALYST_OK" = 1 ] || { say "step $n SKIPPED $s (Analyst 1 not signed in)"; continue; }
    [ "$s" = stg-orgb-seed.mts ] && [ -f "$SEED" ] && cp "$SEED" "$L/orgb-seed-stg.before.json"
    say "step $n start $s ONLY=$only [Analyst 1, no ensure-heavy]"
    ONLY="$only" timeout 3600 ./wob-run.sh "$s" > "$log" 2>&1; rc=$?; say "step $n end $s exit $rc"
    if [ "$s" = analyst-ready.mts ] && [ $rc -ne 0 ]; then ANALYST_OK=0; say "Analyst 1 could not be signed in: block A skipped (C590131, C368191 left for a later go)"; fi
    if [ "$s" = stg-orgb-seed.mts ] && ! python3 -c "import json,sys; d=json.load(open('$SEED')); sys.exit(0 if d.get('signedIn')==200 and d.get('ids') else 1)" 2>/dev/null; then
      [ -f "$L/orgb-seed-stg.before.json" ] && cp "$L/orgb-seed-stg.before.json" "$SEED"; say "orgb-seed-stg.json put back (the seed could not sign in as Analyst 1)"; fi
    continue
  fi
  if [ "$mode" = setup ]; then
    say "step $n start $s [set-up] $extra"
    env ${extra:+"$extra"} timeout 900 ./wob-run.sh "$s" > "$log" 2>&1; rc=$?; say "step $n end $s exit $rc $(grep -oE 'BUILD .*|SIGN-IN (OK|FAILED)' "$log" | head -1)"
    if [ "$s" = stg6-tz.mts ] && [ $rc -ne 0 ]; then
      env ${extra:+"$extra"} timeout 900 ./wob-run.sh "$s" > "$log.retry" 2>&1; rc=$?; say "step $n stg6-tz retry exit $rc"
      [ $rc -ne 0 ] && { say "STOP: the location zone could not be proved equal to the browser zone (Rule 125)"; break; }
    fi
    expired "$log" && { say "STOP: staging sign-in expired"; break; }
    continue
  fi
  # ensure / nodirect / last / todo / todo-2day / draft: an Admin script, started from Heavy Duty
  timeout 300 ./wob-run.sh ensure-heavy.mts > "$L/$tag.ensure.log" 2>&1; rc=$?
  say "step $n location check before $s: exit $rc $(grep -o 'LOCATION.*' "$L/$tag.ensure.log" | head -1)"
  expired "$L/$tag.ensure.log" && { say "STOP: staging sign-in expired"; break; }
  [ $rc -ne 0 ] && { say "step $n SKIPPED $s ONLY=$only (not at Heavy Duty)"; continue; }
  say "step $n start $s ONLY=$only ${extra:+[$extra]} ($mode)"
  if [ "$mode" = nodirect ]; then
    (cd ../../global-search/e2e && env ONLY="$only" ${extra:+"$extra"} TZ="${WOB_TZ:-UTC}" timeout 3600 npx tsx "$HERE/$s") > "$log" 2>&1; rc=$?
  else
    env ONLY="$only" ${extra:+"$extra"} timeout 3600 ./wob-run.sh "$s" > "$log" 2>&1; rc=$?
  fi
  say "step $n end $s exit $rc"
  expired "$log" && { say "STOP: staging sign-in expired"; break; }
done
say "queue finished"
