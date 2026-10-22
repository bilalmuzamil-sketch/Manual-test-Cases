#!/bin/bash
# 22 Oct 2026 — FULL PRODUCTION run of run 498 (WO Board & Tech View), ONE script at a time. QA lead: run every test of run 498 on
# production as soon as the release is there (v26.43.0-ffea43c seen 22 Oct 11:15 UTC); "continue unattended".
# Made from run-full-1016.sh: source prod-env.sh (password sign-in, second admin test account), order full-order-prod-1022.txt,
# ensure-loc.mts (profile location "Truck Hill 1") instead of ensure-heavy.mts, no Google-sign-in expiry checks (production signs in
# with a password every script). Usage: ./run-full-prod-1022.sh   [FROM=<n>]   RUN_DRAFTS=1 also runs the three draft scripts.
# Logs: evidence/prod-2026-10-22/logs-full/<step>-<script>.log, one queue.out line per start / end / skip.
set -u
cd "$(dirname "$0")"; HERE="$(pwd)"; source prod-env.sh
export WOB_LOC_SELECT=1
L=$WOB_EV/logs-full; mkdir -p "$L"; Q=$L/queue.out
say() { echo "$(date -u +%T) $*" | tee -a "$Q"; }
expired() { return 1; }   # production signs in with a password in every script; nothing to expire
# 17 Oct 2026: a single script's log can show the Google page once while the sign-in is fine (step 30, 22:44 UTC: the next
# ensure-heavy signed in at once). So a log that looks expired is CONFIRMED by a fresh ensure-heavy sign-in before the queue stops.
confirm_expired() { expired "$1" || return 1; timeout 300 ./wob-run.sh ensure-loc.mts > "$L/recheck-$(date +%H%M%S).log" 2>&1 && { say "sign-in re-checked after a Google page in $1: still signed in, carrying on"; return 1; }; return 0; }
if ps -eo args | grep -v "run-full-prod-1022" | grep -q "[w]ob-run.sh"; then say "STOP: another wob-run.sh is running (one staging sign-in holds one session, L0394)"; exit 1; fi
SEED=$WOB_EV/orgb-seed-stg.json
ANALYST_OK=1; n=0
grep -v '^#' full-order-prod-1022.txt | while IFS='|' read -r block s only extra mode note; do
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
    last)      [ "${NO_SIGNOUT:-}" = 1 ] && { say "step $n SIGN-OUT held (NO_SIGNOUT=1): $s ONLY=$only — run it after the fix-ups, it ends the shared sign-in"; continue; } ;;   # 17 Oct 2026
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
    confirm_expired "$log" && { say "STOP: staging sign-in expired"; break; }
    continue
  fi
  # ensure / nodirect / last / todo / todo-2day / draft: an Admin script, started from Heavy Duty
  timeout 300 ./wob-run.sh ensure-loc.mts > "$L/$tag.ensure.log" 2>&1; rc=$?
  say "step $n location check before $s: exit $rc $(grep -o 'LOCATION.*' "$L/$tag.ensure.log" | head -1)"
  expired "$L/$tag.ensure.log" && { say "STOP: staging sign-in expired"; break; }
  [ $rc -ne 0 ] && { say "step $n SKIPPED $s ONLY=$only (not at the profile location)"; continue; }
  say "step $n start $s ONLY=$only ${extra:+[$extra]} ($mode)"
  if [ "$mode" = nodirect ]; then
    (cd ../../global-search/e2e && env ONLY="$only" ${extra:+"$extra"} TZ="${WOB_TZ:-UTC}" timeout 3600 npx tsx "$HERE/$s") > "$log" 2>&1; rc=$?
  else
    env ONLY="$only" ${extra:+"$extra"} timeout 3600 ./wob-run.sh "$s" > "$log" 2>&1; rc=$?
  fi
  say "step $n end $s exit $rc"
  # 22 Oct 2026: a script can run in two steps (a test split out to run alone) — keep each step's readings
  b=${s%.mts}; [ -n "$WOB_EV" ] && [ -f "$WOB_EV/$b.json" ] && cp "$WOB_EV/$b.json" "$WOB_EV/$b.step$n.json"
  confirm_expired "$log" && { say "STOP: staging sign-in expired"; break; }
done
say "queue finished"
