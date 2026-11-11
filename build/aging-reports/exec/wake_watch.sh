#!/bin/bash
# wake_watch.sh — 11 Nov 2026: every 60 s, if the sv11315 quick-login answers a redirect to sleep.qa.shopview.com, run wake_sv11315.mjs
# (the running chain's wait_ok treats a sleeping site as an expired sign-in and would wait forever). Logs to queue.log.
cd "$(dirname "$0")"
while true; do S=$(sed 's/^sv_sso_session=//' /tmp/qa-cookies/sv11315-sso.txt 2>/dev/null)
  R=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -H "Cookie: sv_sso_session=$S" https://sv11315api.qa.shopview.com/api/quick-login/users)
  if echo "$R" | grep -q "sleep.qa.shopview.com"; then echo "$(date -u +%H:%M:%S) wake_watch: site asleep ($R), waking" >> queue.log; timeout 240 node wake_sv11315.mjs >> queue.log 2>&1; fi
  sleep 60; done
