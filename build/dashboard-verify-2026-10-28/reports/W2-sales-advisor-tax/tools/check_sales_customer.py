#!/usr/bin/env python3
"""Sales report Customer filter (companyId) — every customer of every location, last 12 months: the filtered
report = the unfiltered report's rows for that customer, and its Totals = those rows. SECRET-FREE."""
import json, os, sys, collections
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from common import *
rows = []
for wid, name, tz in WORKPLACES:
    f, t, s, e = win(wid, 'last_12_months')
    W = [('range', 'custom'), ('start_date', s), ('end_date', e)]
    c, b = get('/api/reporting/sales/custom', W, wid); allr = b['data']['collection']
    custs = json.load(open(os.path.join(RAW, wid, 'sbc__last_12_months__all.json')))['data']['collection'] if os.path.exists(os.path.join(RAW, wid, 'sbc__last_12_months__all.json')) else []
    def one(cu):
        c, b = get('/api/reporting/sales/custom', W + [('companyId', cu['key'])], wid); return cu, c, b
    with ThreadPoolExecutor(6) as ex:
        for cu, c, b in ex.map(one, custs):
            got = sorted(r['invoice_number'] for r in b['data']['collection']) if c == 200 else None
            exp = sorted(r['invoice_number'] for r in allr if r['customer_service'] == cu['customer_name'])
            tot = b['data']['totals'] if c == 200 else {}
            ok = got == exp and abs((tot.get('total_invoiced') or 0) - round(sum(r['total_invoiced'] for r in b['data']['collection']), 2)) < 0.02
            rows.append({'report': 'Sales', 'location': name, 'range': 'last_12_months', 'check': 'Customer filter: only that customer\'s invoices and credit memos; Totals = those rows', 'result': 'PASS' if ok else 'FAIL',
                         'detail': f'{cu["customer_name"]}: filtered {len(got or [])} vs unfiltered {len(exp)}; diff {sorted(set(got or [])^set(exp))[:4]}', 'source': 'SV-6025 / Sales screen Customer filter (no written rule beyond its label)'})
json.dump(rows, open(os.path.join('/tmp/cln/w2/full', 'results-sales-customer-filter.json'), 'w'), indent=0)
print(collections.Counter((r['location'], r['result']) for r in rows))
for r in [r for r in rows if r['result'] == 'FAIL'][:8]: print(r['detail'])
