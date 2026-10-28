#!/usr/bin/env python3
"""Void exclusion on the seeded void invoice S1-38207 (DVI Test, created + voided 2026-10-28): every report
read for Today and This month. Output ../results-void.json. SECRET-FREE."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import *
S = json.load(open('/tmp/cln/w2/seed_void.json')); wid = WID['DVI Test']; loc(wid)
NUM, WO, LINE1 = S['void_invoice']['number'], S['wo'], S['line1']
out = []
for lab in ('custom_1d', 'this_month'):
    f, t, s, e = win(wid, lab)
    W = [('range', 'custom'), ('start_date', s), ('end_date', e)]
    P = [('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)]
    c, b = get(f'/api/invoices/{S["void_invoice"]["id"]}/view', [], wid)
    st = b['data']['collection']['status'] if c == 200 else c
    rep = {}
    c, b = get('/api/reporting/sales/custom', W, wid); rep['Sales'] = NUM in json.dumps(b)
    c, b = get('/api/reporting/service-advisor-analysis/custom', W + P, wid); rep['Advisor Analysis'] = NUM in json.dumps(b)
    c, b = get('/api/reporting/reports/sales-by-customer', W + P + [('productType', 'all'), ('locations', wid)], wid)
    found = False
    for cu in b['data']['collection']:
        c2, a = get(f'/api/reporting/reports/sales-by-customer/{cu["key"]}/assets', W + P + [('productType', 'all'), ('locations', wid)], wid)
        for asset in a['data']['collection']:
            from urllib.parse import quote
            c3, iv = get(f'/api/reporting/reports/sales-by-customer/{cu["key"]}/assets/{quote(asset["key"], safe="")}/invoices', W + P + [('productType', 'all'), ('locations', wid)], wid)
            found |= NUM in json.dumps(iv)
    rep['Sales By Customer'] = found
    c, b = get('/api/reporting/reports/sales-by-representative', W + P + [('productType', 'all'), ('invoiceStatus', 'all'), ('locations', wid), ('showUnassigned', '1')], wid)
    found = False
    for r in b['data']['collection']:
        c2, iv = get(f'/api/reporting/reports/sales-by-representative/{r["key"]}/invoices', W + P + [('productType', 'all'), ('invoiceStatus', 'all'), ('locations', wid)], wid)
        found |= NUM in json.dumps(iv)
    rep['Sales By Representative'] = found
    staff = ['b669608e-a897-4f21-a510-8ced9d9fa982']
    c, b = get('/api/reporting/technician-efficiency/expanded/custom', W + [('staff_ids[]', x) for x in staff], wid); rep['Technician Efficiency (Invoiced)'] = NUM in json.dumps(b) or LINE1 in json.dumps(b)
    c, b = get('/api/reporting/technician-efficiency-completed/expanded/custom', W + [('staff_ids[]', x) for x in staff], wid); rep['Technician Efficiency (Completed) — line 1'] = LINE1 in json.dumps(b)
    c, b = get('/api/reporting/sales-tax-report', [('dateRange', 'custom'), ('startDate', s), ('endDate', e), ('pagination[page]', 1), ('pagination[rowsPerPage]', 500)], wid); rep['Sales Tax Collected'] = NUM in json.dumps(b)
    for k, v in rep.items():
        expect_present = k.startswith('Technician Efficiency (Completed)')
        out.append({'report': k, 'location': 'DVI Test', 'range': lab, 'check': 'Seeded VOID invoice S1-38207 ' + ('line still counted (completion, not invoice, decides — SV-5450)' if expect_present else 'is excluded'),
                    'result': 'PASS' if v == expect_present else 'FAIL', 'detail': f'invoice status now {st}; listed={v}', 'source': 'SBC S7-R7 / SBR §3 Reversed / Dashboard PRD S3-E2 / SV-2115 / SV-5450'})
json.dump(out, open(os.path.join(os.path.dirname(__file__), '..', 'results-void.json'), 'w'), indent=0)
for r in out: print(r['result'], r['range'], r['report'], r['detail'])
