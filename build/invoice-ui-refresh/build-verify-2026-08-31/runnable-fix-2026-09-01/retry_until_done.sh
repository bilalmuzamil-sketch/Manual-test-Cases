#!/bin/bash
# The shared TestRail database throws "Deadlock found when trying to get lock; try restarting
# transaction" under concurrent load. That is retryable by definition - the message says so - and
# the writer checkpoints every success, so a re-run only picks up what is still outstanding.
cd "$(dirname "$0")"
TOTAL=$(python3 -c "import json;print(len(json.load(open('batch.json'))))")
for attempt in $(seq 1 12); do
  DONE=$(python3 - <<'PY'
import json,os
ok=set()
if os.path.exists('APPLIED-steps.jsonl'):
    for l in open('APPLIED-steps.jsonl'):
        if l.strip():
            j=json.loads(l)
            if j.get('ok'): ok.add(str(j['cid']))
print(len(ok))
PY
)
  echo "attempt $attempt: $DONE/$TOTAL applied"
  [ "$DONE" = "$TOTAL" ] && { echo "ALL APPLIED"; exit 0; }
  DIR=$PWD DATAFILE=$PWD/batch.json SNAPFILE=$PWD/PRE-snapshot.json MODE=steps \
    RUNFLAG=/tmp/invmark/RUN3 node apply_steps.mjs >> /tmp/inv6/steps-loop.log 2>&1
  sleep 8
done
echo "gave up after 12 attempts"; exit 1
