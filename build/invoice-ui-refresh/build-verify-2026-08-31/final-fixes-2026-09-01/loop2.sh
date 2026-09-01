#!/bin/bash
cd "$(dirname "$0")"
TOTAL=$(python3 -c "import json;print(len(json.load(open('titles-batch.json'))))")
for a in $(seq 1 10); do
  D=$(python3 -c "
import json,os
ok=set()
if os.path.exists('APPLIED-titles.jsonl'):
  for l in open('APPLIED-titles.jsonl'):
    if l.strip():
      j=json.loads(l)
      if j.get('ok'): ok.add(str(j['cid']))
print(len(ok))")
  echo "attempt $a: $D/$TOTAL"
  [ "$D" = "$TOTAL" ] && { echo ALL_APPLIED; exit 0; }
  DIR=$PWD DATAFILE=$PWD/titles-batch.json SNAPFILE=$PWD/titles-snapshot.json MODE=steps \
    DONEFILE=$PWD/APPLIED-titles.jsonl FAILEDFILE=$PWD/FAILED-titles.jsonl \
    RUNFLAG=/tmp/invmark/RUN5 node apply_final.mjs >> /tmp/inv6/titles-loop.log 2>&1
  sleep 6
done
echo GAVE_UP; exit 1
