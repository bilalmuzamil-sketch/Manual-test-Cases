#!/usr/bin/env python3
"""16 Nov re-run: the 28 Oct pass read /tmp/cln/dv/wolist.json (all work orders) but its producer was never
committed. This rebuilds the part check_saa.py uses (work order id -> startDate) from each work order's own
record (GET /api/work-orders/view/{id}) for every work order the Service Advisor Analysis rows list.
SECRET-FREE (cookie from the session file named by SV_SESS). Output /tmp/cln/rg16/dv/wolist.json."""
import json, os, glob, sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from collect_dashboard import curl
ids = {}
for f in glob.glob('/tmp/cln/rg16/dv/rep/*/*__saa*.json'):
    wid = f.split('/')[-2]
    try: rows = json.load(open(f))['body']['data']['collection']
    except Exception: continue
    for r in rows:
        if r.get('work_order_id'): ids[r['work_order_id']] = wid
C = '/tmp/cln/rg16/dv/wov'; os.makedirs(C, exist_ok=True)
def one(item):
    wo, wid = item; p = f'{C}/{wo}.json'
    if not os.path.exists(p):
        s, b = curl('GET', f'/api/work-orders/view/{wo}', extra_headers={'X-Location-ID': wid})
        if s != 200: return wo, None
        json.dump(b, open(p, 'w'))
    d = json.load(open(p))['data']; d = d.get('work_order', d)
    return wo, d.get('start_date')
with ThreadPoolExecutor(6) as ex: res = list(ex.map(one, ids.items()))
out = [{'id': wo, 'startDate': sd.replace(' ', 'T') if sd else None} for wo, sd in res]
json.dump({'work_orders': out}, open('/tmp/cln/rg16/dv/wolist.json', 'w'))
print('wolist', len(out), 'missing', sum(1 for x in out if not x['startDate']))
