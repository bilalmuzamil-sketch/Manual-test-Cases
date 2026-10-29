#!/usr/bin/env python3
"""Worker p2c seeds — DVI Test (America/Toronto), throwaway ZZAUTOTEST only. Run with TZ=America/Toronto (Rule 99).
State (ids, not secrets): /tmp/cln/p2c/seed.json. Usage: seed_p2c.py <tag> <step>
  tags: REP (C1: Sales By Representative + timesheet correction), ZERO (C3: $0.00 invoice), DEP (C4/C5: deposit on an earlier day)
  steps: customer | wo | clock (REP only) | complete | invoice (REP only; ZERO/DEP are invoiced on screen) | show"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common_p2c import *
W = WID['DVI Test']; H = {'X-Location-ID': W}; ZONE = 'America/Toronto'
ST = OUT + '/seed.json'; S = json.load(open(ST)) if os.path.exists(ST) else {}
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H); print(m, p, c, '' if c in (200, 201) else json.dumps(b)[:300]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    for k in ('id', 'work_order_id', 'company_id', 'contact_id', 'vehicle_id', 'invoice_id', 'line_id'):
        if isinstance(d, dict) and d.get(k): return d[k]
    if isinstance(d, dict):
        for v in d.values():
            if isinstance(v, dict) and v.get('id'): return v['id']
tag, step = sys.argv[1], sys.argv[2]; R = S.setdefault(tag, {}); loc(W)
CANNED = '6e1ec60e-7412-48ae-9f96-f59e653c01a1'          # "3x inspection", 60 min, $135/h
if step == 'customer':
    c, b = call('POST', '/api/customers/create', {'name': f'ZZAUTOTEST P2C {tag}'}); R['company_id'] = did(b)
    c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': f'ZZAUTOTEST {tag}', 'last_name': 'Contact'}); R['contact_id'] = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': f'ZZ-P2C-{tag}'}); R['vehicle_id'] = did(b); save()
elif step == 'wo':
    now = dt.datetime.now(ZoneInfo(ZONE))
    c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'],
                'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}); R['wo'] = did(b); save()
    if tag in ('REP', 'DEP'):
        call('POST', f'/api/work-orders/{R["wo"]}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
        c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H); R['line1'] = b['data']['collection'][0]['line_id']; save()
    if tag == 'REP':
        R['rep'] = '04fc7976-76b8-4b3e-97a5-6cfdb2f96f3c'
        call('POST', '/api/work-orders/change-sales-rep', {'work_order_id': R['wo'], 'sales_rep_id': R['rep']}); save()
elif step == 'clock':
    now = dt.datetime.now(ZoneInfo(ZONE)).replace(second=0, microsecond=0)
    s = now - dt.timedelta(minutes=40); e = now - dt.timedelta(minutes=10); R['clock'] = [s.isoformat(), e.isoformat()]; save()
    call('POST', '/api/technician-tasks/create', {'line_id': R['line1'], 'work_order_id': R['wo'], 'tech_assigned_id': 'b669608e-a897-4f21-a510-8ced9d9fa982',
         'start_date': s.strftime('%d/%m/%Y %H:%M'), 'end_date': e.strftime('%d/%m/%Y %H:%M')})
elif step == 'complete':
    call('POST', '/api/work-orders/lines/change-status', {'line_id': R['line1'], 'status': 'complete', 'workOrderId': R['wo']})
elif step == 'invoice':
    c, b = call('POST', '/api/invoices/create', {'work_order_id': R['wo']}); R['invoice'] = did(b); save()
elif step == 'show':
    c, b = curl('GET', f'/api/work-orders/view/{R["wo"]}', extra_headers=H); w = b['data']['work_order']
    R['display'] = w.get('display_number'); R['invoice_id'] = w.get('invoice_id'); save()
    print({k: w.get(k) for k in ('display_number', 'status', 'invoice_id', 'invoice_status', 'sales_rep_name')})
    print('payments', [(p.get('payment_date'), p.get('applied_amount'), p.get('is_deposit')) for p in (b['data'].get('customer_payments') or w.get('customer_payments') or [])])
