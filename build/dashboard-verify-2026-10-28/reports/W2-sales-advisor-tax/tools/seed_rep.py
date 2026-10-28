#!/usr/bin/env python3
"""Seed: SBR rep snapshot. DVI Test, ZZAUTOTEST Dash A1: WO with sales rep A -> invoice -> change the WO's
rep to B -> SBR must still credit A (spec §4 Snapshot: "Immutable on past invoices"). SECRET-FREE."""
import json, os, sys, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
from common import *
W = WID['DVI Test']; H = {'X-Location-ID': W}; loc(W)
c, b = get('/api/sales-reps', [], W); reps = [r['id'] for r in b['data']['collection']]
A, B = '04fc7976-76b8-4b3e-97a5-6cfdb2f96f3c', [r for r in reps if r != '04fc7976-76b8-4b3e-97a5-6cfdb2f96f3c'][0]
S = {'repA': A, 'repB': B}
now = dt.datetime.now(ZoneInfo('America/Toronto'))
c, b = curl('POST', '/api/work-orders/create', {'company_id': 'd241d825-8fee-4ec8-802b-1e0e847eed8e', 'vehicle_id': '90089b3f-1509-441c-9050-f872612cc281', 'customer_id': 'f65cb579-fa57-4629-adfb-9dd67f439b75',
            'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}, extra_headers=H); S['wo'] = b['data']['work_order_id']
c, b = curl('POST', f'/api/work-orders/{S["wo"]}/lines/create-from-canned-line', {'canned_line_id': '6e1ec60e-7412-48ae-9f96-f59e653c01a1', 'status': 'authorized'}, extra_headers=H); line = b['data']['line_id']
print('rep A', curl('POST', '/api/work-orders/change-sales-rep', {'work_order_id': S['wo'], 'sales_rep_id': A}, extra_headers=H)[0])
print('complete', curl('POST', '/api/work-orders/lines/change-status', {'line_id': line, 'status': 'complete', 'workOrderId': S['wo']}, extra_headers=H)[0])
c, b = curl('POST', '/api/invoices/create', {'work_order_id': S['wo']}, extra_headers=H); print('invoice', c); S['invoice'] = b['data']['invoice_id']
c, b = curl('POST', '/api/work-orders/change-sales-rep', {'work_order_id': S['wo'], 'sales_rep_id': B}, extra_headers=H); print('rep B after invoicing', c, json.dumps(b)[:200]); S['repB_status'] = c
c, b = get(f'/api/work-orders/view/{S["wo"]}', [], W); w = b['data']['work_order']; S['wo_number'] = w['display_number']; S['wo_rep_now'] = w.get('sales_rep_name')
f, t, s, e = win(W, 'custom_1d')
c, b = get('/api/reporting/reports/sales-by-representative', [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', 'all'), ('invoiceStatus', 'all'), ('locations', W), ('showUnassigned', '1'), ('pagination[page]', 1), ('pagination[rowsPerPage]', 100)], W)
credited = None
for r in b['data']['collection']:
    c2, iv = get(f'/api/reporting/reports/sales-by-representative/{r["key"]}/invoices', [('range', 'custom'), ('start_date', s), ('end_date', e), ('productType', 'all'), ('invoiceStatus', 'all'), ('locations', W)], W)
    if any(i['invoice_id'] == S['invoice'] for i in iv['data']['collection']): credited = (r['key'], r['rep_name'])
S['credited'] = credited
json.dump(S, open('/tmp/cln/w2/seed_rep.json', 'w'), indent=1)
print(json.dumps(S))
