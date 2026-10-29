# OBS B: a work order's history (event, date, time + any ISO timestamps). SECRET-FREE, bounded.
import os, sys, json, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
woid, wid = sys.argv[1], sys.argv[2]
curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})
st, j = get(f'/api/work-orders/{woid}/history?' + urlencode({'pagination[page]': 1, 'pagination[rowsPerPage]': 60}), wid)
print(st, str(j)[:300] if st != 200 else '')
d = j['data']; rows = d if isinstance(d, list) else (d.get('collection') or d.get('items') or d.get('history') or []); print('data type', type(d).__name__, list(d.keys())[:10] if isinstance(d, dict) else len(d))
if rows: print('keys', sorted(rows[0].keys()))
for e in rows:
    iso = {k: v for k, v in e.items() if isinstance(v, str) and re.match(r'\d{4}-\d\d-\d\d', v)}
    print((e.get('eventType') or e.get('event') or e.get('eventName')), iso, (e.get('invoiceNumber') or ''))
