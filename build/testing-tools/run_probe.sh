#!/bin/bash
# Run a production probe with the MITM bridge guaranteed up.
#
# Why: the bridge dies between long-running probes, and every time it does the next probe fails with
# "connect ECONNREFUSED 127.0.0.1:<port>" at bootProdLogin - which reads like a login or network
# fault and is neither. Three separate runs were lost to it on 2026-09-25 before this wrapper existed.
#
#   usage: run_probe.sh <probe.mjs> [PROD_ENVF]
set -u
PROBE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"   # resolve BEFORE the cd, or the path breaks
ENVF="${2:-/tmp/shopview/prod-login.env}"
cd /home/user/Manual-test-Cases
for attempt in 1 2 3; do
  source build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
  sleep 6
  PORT=$(cat /tmp/atlassian/bridge-port.txt 2>/dev/null)
  CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 -x "http://127.0.0.1:${PORT}" -k \
         -X POST -H 'Content-Type: application/json' -d '{}' https://api.shopview.com/api/login 2>/dev/null)
  # 400 is the API rejecting an empty login body - which proves the bridge is carrying traffic.
  if [ "$CODE" != "000" ] && [ -n "$CODE" ]; then
    echo "bridge up on ${PORT} (probe reached the API, it answered ${CODE})"
    PROD_ENVF="$ENVF" exec node "$PROBE"
  fi
  echo "bridge not carrying traffic yet (attempt ${attempt}); retrying"
  sleep 4
done
echo "bridge would not come up after three attempts - not a product fault, report it as tooling"; exit 1
