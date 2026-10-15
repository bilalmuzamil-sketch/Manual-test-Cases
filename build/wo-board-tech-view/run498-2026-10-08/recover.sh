#!/bin/bash
# 15 Oct 2026 — ONE command after a container restart (uptime shows "up N min" and nothing is running):
#   build/wo-board-tech-view/run498-2026-10-08/recover.sh
# 1 sign-in relay on the new proxy port (L0355) · 2 memory guard · 3 resume the unfinished pass (its start-of-pass resets run
# again) · 4 the next pass's waiter. Each pass runner skips scripts that already have a .done file.
cd "$(dirname "$0")"; R=$(git rev-parse --show-toplevel); E=evidence/staging-full-2026-10-14; A=$E/run-all.out
if ! pgrep -f "atlassian-login/bridge.mjs" >/dev/null; then
  rm -f /tmp/atlassian/bridge-port.txt; (cd "$R" && setsid nohup node build/atlassian-login/bridge.mjs > /tmp/atlassian/bridge.log 2>&1 < /dev/null &)
  for i in $(seq 1 20); do [ -s /tmp/atlassian/bridge-port.txt ] && break; sleep 1; done
fi
echo "relay $(curl -s -o /dev/null -w '%{http_code}' -x http://127.0.0.1:$(cat /tmp/atlassian/bridge-port.txt) -k https://app.staging.shopview.com/)"
pgrep -f memwatch.sh >/dev/null || setsid nohup ./memwatch.sh > /dev/null 2>&1 < /dev/null &
if pgrep -f "run-sixth.sh|run-seventh.sh" >/dev/null; then echo "a pass is already running"; exit 0; fi
if ! grep -q "sixth pass finished" $A; then
  rm -f $E/logs6/role-viewonly-stg4.done $E/logs6/clocks-stg4.done
  echo "$(date -u +%H:%M:%S) container restart — resumed by recover.sh" >> $E/logs6/run.out
  setsid nohup ./resume-sixth.sh > /dev/null 2>&1 < /dev/null &
  pgrep -f stg-after7.sh >/dev/null || setsid nohup ./stg-after7.sh > /dev/null 2>&1 < /dev/null &
  echo "resumed the SIXTH pass"
elif grep -q "seventh pass start" $A && ! grep -q "seventh pass finished" $A; then
  rm -f $E/logs7/role-viewonly-stg4.done $E/logs7/clocks-stg4.done
  echo "$(date -u +%H:%M:%S) container restart — resumed by recover.sh" >> $E/logs7/run.out
  setsid nohup ./resume-seventh.sh > /dev/null 2>&1 < /dev/null &
  echo "resumed the SEVENTH pass"
elif ! grep -q "seventh pass start" $A; then
  setsid nohup ./stg-after7.sh > /dev/null 2>&1 < /dev/null &
  echo "restarted the seventh-pass waiter"
else echo "all passes finished"; fi
