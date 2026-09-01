#!/bin/bash
cd "$(dirname "$0")"
TOTAL=$(python3 -c "import json;print(len(json.load(open('batch.json'))))")
for a in $(seq 1 12); do
  D=$(python3 -c "
import json,os
ok=set()
if os.path.exists('APPLIED-steps.jsonl'):
  for l in open('APPLIED-steps.jsonl'):
    if l.strip():
      j=json.loads(l)
      if j.get('ok'): ok.add(str(j['cid']))
print(len(ok))")
  echo "attempt $a: $D/$TOTAL"
  [ "$D" = "$TOTAL" ] && { echo ALL_APPLIED; exit 0; }
  DIR=$PWD DATAFILE=$PWD/batch.json SNAPFILE=$PWD/PRE-snapshot.json MODE=steps \
    RUNFLAG=/tmp/invmark/RUN4 node apply_final.mjs >> /tmp/inv6/final-loop.log 2>&1
  sleep 6
done
echo GAVE_UP; exit 1
