#!/usr/bin/env python3
"""Fetch every invoiced work order's live lines (GET /api/work-orders/lines/{id}) into /tmp/cln/dv/wol/. SECRET-FREE."""
import json, os, sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl, WORKPLACES
OUT = '/tmp/cln/dv/wol'; os.makedirs(OUT, exist_ok=True)
jobs = []
for wid, name, tz in WORKPLACES:
    seen = set()
    for lab in ('last_12_months', 'last_year'):
        for r in json.load(open(f'/tmp/cln/dv/rep/{wid}/{lab}__sales.json'))['body']['data']['collection']:
            if not r['is_credit'] and r['work_order_id'] not in seen:
                seen.add(r['work_order_id']); jobs.append((wid, r['work_order_id']))
def get(a):
    wid, wo = a; p = f'{OUT}/{wo}.json'
    if os.path.exists(p): return 1
    c, b = curl('GET', f'/api/work-orders/lines/{wo}', extra_headers={'X-Location-ID': wid})
    if c == 200: json.dump(b, open(p, 'w'))
    return c
with ThreadPoolExecutor(6) as ex:
    for i, c in enumerate(ex.map(get, jobs)):
        if i % 500 == 0: print(i, len(jobs), c, flush=True)
print('done', len(jobs))
