#!/usr/bin/env python3
"""Fetch the work order Stats tab record (GET /api/work-orders/statistics/{id}) for every work order
listed by the Sales report (all cached ranges) -> /tmp/cln/w2/stats/<woId>.json. SECRET-FREE."""
import json, os, sys, glob
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from common import *
OUT = os.path.join(RAW, 'stats'); os.makedirs(OUT, exist_ok=True)
todo = {}
for wid, name, tz in WORKPLACES:
    for p in glob.glob(f'/tmp/cln/dv/rep/{wid}/*__sales*.json') + glob.glob(f'/tmp/cln/dv/rep/{wid}/*__saa*.json'):
        j = json.load(open(p))
        if j.get('status') != 200: continue
        for r in j['body']['data']['collection']:
            if r.get('work_order_id'): todo[r['work_order_id']] = wid
def one(a):
    wo, wid = a
    p = os.path.join(OUT, wo + '.json')
    if os.path.exists(p): return 'cached'
    c, b = get(f'/api/work-orders/statistics/{wo}', [], wid)
    if c == 200: json.dump(b, open(p, 'w'))
    return c
with ThreadPoolExecutor(8) as ex:
    res = list(ex.map(one, todo.items()))
from collections import Counter
print(len(todo), Counter(res))
