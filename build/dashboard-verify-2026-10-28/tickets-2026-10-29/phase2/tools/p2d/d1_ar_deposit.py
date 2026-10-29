"""D1 — A/R Aging Detail vs customer Invoices tab for invoiced part sales with a held deposit. Run: TZ=Asia/Karachi python3 d1_ar_deposit.py"""
import json, datetime as dt
from zoneinfo import ZoneInfo
from common import *
w = WID['hd']; z = TZ[w]; print('change-location', loc(w)); out = {'zones': zones(w)}
today = dt.datetime.now(ZoneInfo(z)).date(); A = asof(today, z); out['asOf'] = A
s, det = get('/api/reporting/account-receivable/aging-detail-report', [('asOfDate', A)], w)
json.dump(det, open(f'{RAW}/d1_detail.json', 'w'))
d = det['data']
# find rows by number anywhere in the structure
hits = {}
def walk(o, path=''):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, str) and v in ('P2-2352', 'P2-2439', 'DEP-4763', 'DEP-4801'):
                hits.setdefault(v, []).append({kk: vv for kk, vv in o.items() if not isinstance(vv, (list, dict))})
            walk(v, path + '/' + k)
    elif isinstance(o, list):
        for x in o: walk(x, path)
walk(d); out['ar_rows'] = hits
for name in ('TestVT1', 'Bravo Mechanical Services'):
    s, cs = get('/api/customers/list', [('search', name), ('pagination[rowsPerPage]', 10)], w)
    out.setdefault('cust_search_status', []).append(s)
    json.dump(cs, open(f'{RAW}/d1_cust_{name[:5]}.json', 'w'))
print(json.dumps(out, indent=1, default=str)[:4000])
json.dump(out, open(f'{RAW}/d1_out.json', 'w'), default=str)
