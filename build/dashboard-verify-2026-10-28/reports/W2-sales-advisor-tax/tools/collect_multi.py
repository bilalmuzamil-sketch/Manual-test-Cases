#!/usr/bin/env python3
"""Sales By Customer / Sales By Representative: all-locations scope and the Customer filter (every customer,
one request each), last 12 months, windows in Heavy Duty's time zone. -> /tmp/cln/w2/multi/. SECRET-FREE."""
import json, os, sys
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from common import *
OUT = os.path.join(RAW, 'multi'); os.makedirs(OUT, exist_ok=True)
hd = WID['Staging Heavy Duty - 9919']
f, t, s, e = win(hd, 'last_12_months')
ALL = ','.join(w for w, n, z in WORKPLACES)
W = [('range', 'custom'), ('start_date', s), ('end_date', e), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]
res = {'from': str(f), 'to': str(t), 'start': s, 'end': e}
for wid, n, z in WORKPLACES:
    res[wid] = get('/api/reporting/reports/sales-by-customer', W + [('productType', 'all'), ('locations', wid)], hd)[1]
    res['sbr_' + wid] = get('/api/reporting/reports/sales-by-representative', W + [('productType', 'all'), ('invoiceStatus', 'all'), ('locations', wid), ('showUnassigned', '1')], hd)[1]
res['all'] = get('/api/reporting/reports/sales-by-customer', W + [('productType', 'all'), ('locations', ALL)], hd)[1]
res['sbr_all'] = get('/api/reporting/reports/sales-by-representative', W + [('productType', 'all'), ('invoiceStatus', 'all'), ('locations', ALL), ('showUnassigned', '1')], hd)[1]
custs = res[hd]['data']['collection']
def one(c):
    return c['key'], get('/api/reporting/reports/sales-by-customer', W + [('productType', 'all'), ('locations', hd), ('customers', c['key'])], hd)
with ThreadPoolExecutor(6) as ex:
    res['by_customer'] = {k: {'status': cc, 'body': b} for k, (cc, b) in ex.map(one, custs)}
two = [c['key'] for c in custs[:2]]
res['two_customers'] = get('/api/reporting/reports/sales-by-customer', W + [('productType', 'all'), ('locations', hd), ('customers', ','.join(two))], hd)
json.dump(res, open(os.path.join(OUT, 'multi.json'), 'w'))
print('customers', len(custs), 'all-loc rows', len(res['all']['data']['collection']))
