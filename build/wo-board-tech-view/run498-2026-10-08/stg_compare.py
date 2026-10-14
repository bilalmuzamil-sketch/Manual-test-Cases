#!/usr/bin/env python3
"""Staging vs QA-branch readings, per check (14 Oct 2026). For every script JSON written by the staging run (working tree,
evidence/<script>.json) and its QA-branch version (git HEAD), flatten each check's readings to path=value and print only
what DIFFERS after masking things that are expected to differ (work order numbers, ids, stamps, dates, money, counts of
unrelated rows). Same readings => the staging behaviour matches the QA-branch Passed result; a difference is judged by hand.
Usage: python3 stg_compare.py <script.json> [C-id ...]"""
import json, re, subprocess, sys
MASK = [(re.compile(r'\b[A-Z]{1,4}\d*-\d{3,}\b'), '<WO>'), (re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'), '<ID>'),
        (re.compile(r'\b\d{8,}\b'), '<N>'), (re.compile(r'\$[\d,]+\.\d\d'), '<$>'), (re.compile(r'\b(20\d\d-\d\d-\d\d|\w{3} \d{1,2}, 20\d\d)\b'), '<DATE>'),
        (re.compile(r'\b\d{1,2}:\d\d( ?[AP]M)?\b'), '<TIME>'), (re.compile(r'(ZZAUTOTEST[^"|,;]*?) \d{3,}'), r'\1 <S>')]
def mask(v):
    s = json.dumps(v) if not isinstance(v, str) else v
    for rx, r in MASK: s = rx.sub(r, s)
    return s[:160]
def flat(x, p=''):
    if isinstance(x, dict):
        for k, v in x.items(): yield from flat(v, f'{p}.{k}' if p else k)
    elif isinstance(x, list) and len(x) <= 12 and all(not isinstance(i, (dict, list)) for i in x): yield p, mask(x)
    elif isinstance(x, list):
        for i, v in enumerate(x[:12]): yield from flat(v, f'{p}[{i}]')
    else: yield p, mask(x)
f = sys.argv[1]; want = set(sys.argv[2:])
stg = json.load(open(f))
try: qa = json.loads(subprocess.run(['git', 'show', f'HEAD:build/wo-board-tech-view/run498-2026-10-08/{f}'], capture_output=True, text=True).stdout or '{}')
except Exception: qa = {}
for cid in sorted(k for k in stg if k.startswith('C') and (not want or k in want)):
    a, b = dict(flat(qa.get(cid, {}))), dict(flat(stg[cid]))
    diff = [(k, a.get(k), b.get(k)) for k in sorted(set(a) | set(b)) if a.get(k) != b.get(k)]
    err = stg[cid].get('error') if isinstance(stg[cid], dict) else None
    print(f'== {cid}: {len(diff)} differences{"  ERROR: " + str(err)[:200] if err else ""}{"  (no QA reading)" if cid not in qa else ""}')
    for k, x, y in diff[:25]: print(f'   {k}\n      QA : {x}\n      STG: {y}')
