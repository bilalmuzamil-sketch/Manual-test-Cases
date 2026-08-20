#!/bin/sh
# Restart the MITM bridge for staging and publish its new port.
#
# WHY THIS IS A FILE AND NOT A HEREDOC (playbook §U.0b trap 1, SECOND FORM):
# pgrep/pkill match the FULL command line of every process. If the pattern appears
# anywhere in the invoking Bash command - INCLUDING INSIDE A HEREDOC THAT WRITES
# THIS SCRIPT - pgrep matches the caller's own shell and kills it (exit 144).
# Write this file with a file-write tool, never a shell heredoc. The pattern is
# also assembled from pieces so it never appears literally anywhere.
P1='staging-brid'
P2='ge.mjs'
PAT="/tmp/sv8815-staging/$P1$P2"
for pid in $(pgrep -f "$PAT" 2>/dev/null); do
  [ "$pid" != "$$" ] && kill "$pid" 2>/dev/null
done
sleep 2
cd /tmp/sv8815-staging || exit 1
NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt \
  nohup node "$PAT" > bridge.log 2>&1 &
sleep 8
PORT=$(grep -o 'BRIDGE_LISTENING 127.0.0.1:[0-9]*' bridge.log | tail -1 | sed 's/.*://')
if [ -z "$PORT" ]; then echo "FAILED to start"; tail -5 bridge.log; exit 1; fi
printf '%s' "$PORT" > bridgeport.txt
echo "bridge port: $PORT"
curl -s -o /dev/null -w "reach app.staging: %{http_code}\n" \
  -x "http://127.0.0.1:$PORT" https://app.staging.shopview.com/ --max-time 20
