#!/bin/bash
# Wait for the search service on sv9160 to come back, then capture the scope-tab evidence.
# Detached, idempotent, checkpointed: GS2_tabs.mjs skips anything already captured and refuses to
# record during an outage, so re-running is always safe. Exits as soon as all six are captured.
cd /home/user/Manual-test-Cases
for i in $(seq 1 18); do            # ~90 minutes at 5-minute spacing
  bash build/testing-tools/ensure_bridge.sh >/dev/null 2>&1
  timeout 300 node build/global-search/tickets-2026-09-14/GS2_tabs.mjs >> build/global-search/tickets-2026-09-14/GS3-wait.log 2>&1
  n=$(python3 -c "
import json,os
p='build/global-search/tickets-2026-09-14/GS2.json'
d=json.load(open(p))['q'] if os.path.exists(p) else {}
print(sum(1 for v in d.values() if not v.get('instrumentFailure')))" 2>/dev/null || echo 0)
  echo \"$(date -u +%H:%M:%S) attempt $i -- real captures: $n/6\" >> build/global-search/tickets-2026-09-14/GS3-wait.log
  if [ "$n" -ge 6 ]; then
    git add -- build/global-search/tickets-2026-09-14/ >/dev/null 2>&1
    git commit -q -m "Global Search: scope-tab evidence captured once the search service recovered

GS2_tabs.mjs clicks each scope tab and reads the pane the user actually sees, rather than the count
badge that misled me. Captured automatically by the detached waiter as soon as the branch stopped
answering 'Search unavailable'.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FWbxRKg4riKCp3gpbbwYzA" >/dev/null 2>&1
    git push -u origin claude/test-execution-defects-cdrjsq >/dev/null 2>&1
    echo "$(date -u +%H:%M:%S) ALL SIX CAPTURED -- committed and pushed" >> build/global-search/tickets-2026-09-14/GS3-wait.log
    exit 0
  fi
  # clear the outage placeholders so the next attempt retries them
  python3 - <<'PY' 2>/dev/null
import json,os
p='build/global-search/tickets-2026-09-14/GS2.json'
if os.path.exists(p):
    d=json.load(open(p))
    d['q']={k:v for k,v in d['q'].items() if not v.get('instrumentFailure')}
    json.dump(d,open(p,'w'),indent=1)
PY
  sleep 300
done
echo "$(date -u +%H:%M:%S) gave up after 18 attempts -- search still unavailable" >> build/global-search/tickets-2026-09-14/GS3-wait.log
