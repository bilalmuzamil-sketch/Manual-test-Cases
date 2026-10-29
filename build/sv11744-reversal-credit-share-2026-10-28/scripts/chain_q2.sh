#!/bin/bash
# Q2: the $118 invoice (sorts second) is part-paid in cash, then credit covers the rest of both; reverse; read everything.
export QA_DIR=/tmp/qa4Q2; T=Q2
NOCREDIT=1 ROWAMT=S2-1781=50 timeout 300 node pay_credit.mjs prod $T 0 S2-1781 Cash 2>&1 | grep -E "^POST" | cut -c1-160
timeout 300 node pay_credit.mjs prod $T 217.95 S2-1779,S2-1781 Cash 2>&1 | grep -E "^memo|^POST" | cut -c1-200
timeout 300 node invview.mjs prod $T 1-before 2>&1 | grep -E "^==|screen" | cut -c1-400
timeout 300 node reverse.mjs prod $T "ZZAUTOTEST $T \$0.00" 2>&1 | grep -E "^POST|remove button" | cut -c1-200
timeout 300 node state.mjs prod $T 2-after-reverse 2>&1 | python3 -c "
import sys,json;t=sys.stdin.read();d=json.loads(t[t.index('{'):])
for k in ['invoicesAll','payments','wos','api']: print(k, json.dumps(d.get(k))[:600])"
timeout 300 node invview.mjs prod $T 2-after 2>&1 | grep -E "^==|screen" | cut -c1-400
timeout 300 node newpay_check.mjs prod $T 2>&1 | tail -1 | cut -c1-300
