# OBS B: exact UTC timestamps on a work order and its invoice(s) (API returns ISO-8601 UTC). Prints only date-time fields. SECRET-FREE.
import os, sys, json, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common_f2 import *
woid, wid = sys.argv[1], sys.argv[2]
curl('POST', '/api/iam/change-location', {'workplace_id': wid, 'workplace_timezone': TZ[wid]})
def walk(o, p=''):
    if isinstance(o, dict):
        for k, v in o.items(): yield from walk(v, p + '.' + k)
    elif isinstance(o, list):
        for i, v in enumerate(o[:6]): yield from walk(v, f'{p}[{i}]')
    elif isinstance(o, str) and re.match(r'\d{4}-\d\d-\d\d[T ]\d\d:\d\d', o): yield p, o
for path in (f'/api/work-orders/{woid}', f'/api/work-orders/{woid}/invoices', f'/api/work-orders/{woid}/finance'):
    st, j = get(path, wid); print('##', path, st)
    if st == 200:
        for p, v in list(walk(j))[:40]: print('  ', p[-70:], v)
