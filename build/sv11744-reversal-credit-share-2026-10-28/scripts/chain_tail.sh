#!/bin/bash
# usage: chain_tail.sh <tag> <reverse-match>   -> invoice view before, reverse on screen, tabs + invoice view after, New Payment
T=$1; export QA_DIR=/tmp/qa4$T
timeout 300 node invview.mjs prod $T 1-before 2>&1 | grep -E "^==|screen" | cut -c1-500
timeout 300 node reverse.mjs prod $T "$2" 2>&1 | grep -E "^POST|remove button" | cut -c1-200
timeout 300 node state.mjs prod $T 2-after-reverse 2>&1 | python3 -c "
import sys,json;t=sys.stdin.read();d=json.loads(t[t.index('{'):])
for k in ['invoicesAll','payments','wos','api']: print(k, json.dumps(d.get(k))[:700])"
timeout 300 node invview.mjs prod $T 2-after 2>&1 | grep -E "^==|screen" | cut -c1-500
timeout 300 node newpay_check.mjs prod $T 2>&1 | tail -1 | cut -c1-300
