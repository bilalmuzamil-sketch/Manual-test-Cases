#!/usr/bin/env python3
"""Production vs staging readings, per check (22 Oct 2026). For a script's JSON written by the production run
(evidence/prod-2026-10-22/<name>.json) and the same script's staging JSON (evidence/staging-full-2026-10-14/<name>.json, the run whose
results are Passed in run 498), flatten each check's readings to path=value and print only what DIFFERS after masking what is expected to
differ between environments (work order numbers, ids, stamps, dates, money, run numbers, location names, build markers).
Same readings => production behaves as staging did when the test passed; a difference is judged by hand, never by this tool.
Usage: python3 prod_compare.py <name>.json [C-id ...]   (made from stg_compare.py)"""
import json, re, sys, os
H = os.path.dirname(os.path.abspath(__file__))
MASK = [(re.compile(r'\b[A-Z]{1,4}\d*-\d{2,}\b'), '<WO>'), (re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'), '<ID>'),
        (re.compile(r'\b\d{6,}\b'), '<N>'), (re.compile(r'\$[\d,]+\.\d\d'), '<$>'), (re.compile(r'\b(20\d\d-\d\d-\d\dT[\d:.]+Z?|20\d\d-\d\d-\d\d|\w{3} \d{1,2}, 20\d\d)\b'), '<DATE>'),
        (re.compile(r'\b\d{1,2}:\d\d(:\d\d)?( ?[AP]M)?\b'), '<TIME>'), (re.compile(r'(ZZAUTOTEST[^"|,;]*?) \d{3,}'), r'\1 <S>'),
        (re.compile(r'Staging Heavy Duty - 9919|Truck Hill 1|Staging Lethbridge - 4310|Trucks Hill 2'), '<LOC>'), (re.compile(r'v\d+\.\d+\.\d+-[0-9a-f]{7}'), '<BUILD>'),
        (re.compile(r'\b\d+(\.\d+)? ?Hrs Today\b'), '<HRS>')]
def mask(v):
    s = json.dumps(v) if not isinstance(v, str) else v
    for rx, r in MASK: s = rx.sub(r, s)
    return s[:200]
def flat(x, p=''):
    if isinstance(x, dict):
        for k, v in x.items(): yield from flat(v, f'{p}.{k}' if p else k)
    elif isinstance(x, list) and len(x) <= 12 and all(not isinstance(i, (dict, list)) for i in x): yield p, mask(x)
    elif isinstance(x, list):
        for i, v in enumerate(x[:12]): yield from flat(v, f'{p}[{i}]')
    else: yield p, mask(x)
name = sys.argv[1]; want = set(x for x in sys.argv[2:] if not x.startswith('--'))
prod = json.load(open(os.path.join(H, 'evidence/prod-2026-10-22', name)))
stg = json.load(open(os.path.join(H, 'evidence/staging-full-2026-10-14', name)))
# a later partial staging run overwrites the file with only its own tests: take each missing test's LATEST committed staging reading
import subprocess
REL = f'build/wo-board-tech-view/run498-2026-10-08/evidence/staging-full-2026-10-14/{name}'
src = {c: 'working tree' for c in stg}
for h in subprocess.run(['git', '-C', H, 'log', '--format=%h', '--', os.path.join(H, 'evidence/staging-full-2026-10-14', name)], capture_output=True, text=True).stdout.split():
    try: old = json.loads(subprocess.run(['git', '-C', H, 'show', f'{h}:{REL}'], capture_output=True, text=True).stdout or '{}')
    except Exception: continue
    for c, v in old.items():
        if c.startswith('C') and c not in stg: stg[c] = v; src[c] = h
for c in sorted(set(prod) | set(stg)):
    if want and c not in want: continue
    a, b = dict(flat(stg.get(c, {}))), dict(flat(prod.get(c, {})))
    POS = re.compile(r'(^|\.)(x|y|w|h|r|b|left|top|right|bottom|width|height|cx|cy|dx|dy|centreDx|gap|scroll\w*|vw|count|n|total|ids?|wo\w*|number|name|text|rows?|row\w*|label|lead|cust\w*|customer|unit|vin|asset|picture|pic|clip|png|started|ended|at|time|stamp)(\[\d+\])?$', re.I)
    keep = lambda k: not POS.search(k) and not re.search(r'(box|chain|against|trigger|rect|place)\.', k, re.I)
    diff = [(k, a.get(k), b.get(k)) for k in sorted(set(a) | set(b)) if a.get(k) != b.get(k) and keep(k)]
    if '--all' in sys.argv: diff = [(k, a.get(k), b.get(k)) for k in sorted(set(a) | set(b)) if a.get(k) != b.get(k)]
    print(f'== {c}: {len(diff)} differences [staging reading: {src.get(c, "-")}]' + ('' if c in stg else ' (no staging reading)') + ('' if c in prod else ' (no production reading)'))
    for k, x, y in diff[:40]: print(f'   {k}\n      staging:    {x}\n      production: {y}')
