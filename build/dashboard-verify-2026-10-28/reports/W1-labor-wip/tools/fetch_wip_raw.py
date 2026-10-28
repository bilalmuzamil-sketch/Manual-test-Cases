#!/usr/bin/env python3
"""Fetch the RAW records behind every WIP row (independent path, not the report's code):
  GET /api/work-orders/lines/{id}   -> lines, parts, line adjustments, task_records (clocks)
  GET /api/work-orders/view/{id}    -> status, type, start date, WO-level adjustments
Idempotent + resumable: skips files already present. Raw -> /tmp/cln/w1/wol/, /tmp/cln/w1/wov/.
"""
import json, os, sys, glob
from concurrent.futures import ThreadPoolExecutor
TOOLS = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tools'
sys.path.insert(0, TOOLS)
from collect_dashboard import curl

OUT = '/tmp/cln/w1'
os.makedirs(f'{OUT}/wol', exist_ok=True); os.makedirs(f'{OUT}/wov', exist_ok=True)

ids = {}
for f in glob.glob(f'{OUT}/wip/*/*.json'):
    if 'ALL' in f:
        continue
    d = json.load(open(f))
    for r in d.get('collection', []):
        ids[r['work_order_id']] = r['workplace_id']


def one(item):
    wo, wid = item
    H = {'X-Location-ID': wid}
    for kind, path in (('wol', f'/api/work-orders/lines/{wo}'), ('wov', f'/api/work-orders/view/{wo}')):
        p = f'{OUT}/{kind}/{wo}.json'
        if os.path.exists(p):
            continue
        c, b = curl('GET', path, extra_headers=H)
        if c == 200:
            json.dump(b, open(p, 'w'))
        else:
            print('ERR', kind, wo, c, str(b)[:120], flush=True)
    return wo


with ThreadPoolExecutor(6) as ex:
    for i, _ in enumerate(ex.map(one, sorted(ids.items()))):
        if i % 250 == 0:
            print('progress', i, len(ids), flush=True)
print('DONE', len(ids), flush=True)
