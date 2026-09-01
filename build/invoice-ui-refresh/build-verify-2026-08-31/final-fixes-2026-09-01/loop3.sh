#!/bin/bash
cd "$(dirname "$0")"
for a in $(seq 1 8); do
  D=$(python3 -c "
import json,os
ok=set()
if os.path.exists('APPLIED-ibs.jsonl'):
  for l in open('APPLIED-ibs.jsonl'):
    if l.strip():
      j=json.loads(l)
      if j.get('ok'): ok.add(str(j['cid']))
print(len(ok))")
  echo "attempt $a: $D/2"
  [ "$D" = "2" ] && { echo ALL_APPLIED; exit 0; }
  DIR=$PWD DATAFILE=$PWD/ibs-batch.json SNAPFILE=$PWD/ibs-snapshot.json MODE=steps \
    DONEFILE=$PWD/APPLIED-ibs.jsonl FAILEDFILE=$PWD/FAILED-ibs.jsonl \
    RUNFLAG=/tmp/invmark/RUN6 node apply_final.mjs >> /tmp/inv6/ibs-loop.log 2>&1
  sleep 6
done
echo GAVE_UP; exit 1
