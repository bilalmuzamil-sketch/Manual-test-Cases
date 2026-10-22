#!/bin/bash
# 22 Oct 2026: after each step of the production full run ends, count tests with an "error" in that script's readings and print one line
# "STEPCHECK <step> <script> tests=N errors=E <first error>" (a whole step of errors = set-up, not the product, L0507). Read-only.
cd "$(dirname "$0")"; Q=evidence/prod-2026-10-22/logs-full/queue.out
tail -n 0 -F "$Q" | while read -r line; do
  [[ "$line" =~ step\ ([0-9]+)\ end\ ([^ ]+)\.mts ]] || { [[ "$line" == *"queue finished"* ]] && { echo "STEPCHECK queue finished"; exit 0; }; continue; }
  n=${BASH_REMATCH[1]}; s=${BASH_REMATCH[2]}; f=evidence/prod-2026-10-22/$s.json
  python3 - "$f" "$n" "$s" <<'PY'
import json,sys
f,n,s=sys.argv[1:4]
try: d=json.load(open(f))
except Exception: print(f'STEPCHECK {n} {s} no readings file'); sys.exit()
cs=[k for k in d if k.startswith('C') and isinstance(d[k],dict)]; e=[k for k in cs if d[k].get('error')]
first=(d[e[0]]['error'][:90] if e else '')
print(f'STEPCHECK {n} {s} tests={len(cs)} errors={len(e)} {first}', flush=True)
PY
done
