#!/usr/bin/env python3
"""Seed a VOID invoice in DVI Test (throwaway, ZZAUTOTEST) so every report's void exclusion can be observed.
Path (code: Line/Create CreateCommandHandler voids a PENDING invoice when a line is added to a Complete /
Invoiced work order): WO -> canned line -> clock 30 min -> complete -> invoice (screen) -> add a line by
POST /api/work-orders/lines/create. Records ids in /tmp/cln/w2/seed_void.json. SECRET-FREE."""
import json, os, sys, subprocess, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
from common import *
WID_ = WID['DVI Test']; H = {'X-Location-ID': WID_}
ST = '/tmp/cln/w2/seed_void.json'
S = json.load(open(ST)) if os.path.exists(ST) else {}
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H); print(m, p, c, json.dumps(b)[:300]); return c, b
step = sys.argv[1]
loc(WID_)
if step == 'wo':
    now = dt.datetime.now(ZoneInfo('America/Toronto'))
    c, b = call('POST', '/api/work-orders/create', {'company_id': 'd241d825-8fee-4ec8-802b-1e0e847eed8e', 'vehicle_id': '90089b3f-1509-441c-9050-f872612cc281', 'customer_id': 'f65cb579-fa57-4629-adfb-9dd67f439b75',
                'workplace_id': WID_, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True})
    S.setdefault('abandoned', []).append(S.get('wo')) if S.get('wo') else None
    d = b.get('data', {}); S['wo'] = d.get('id') or d.get('work_order_id') or (d.get('work_order') or {}).get('id'); save()
    c, b = call('POST', f'/api/work-orders/{S["wo"]}/lines/create-from-canned-line', {'canned_line_id': '6e1ec60e-7412-48ae-9f96-f59e653c01a1', 'status': 'authorized'})
    c, b = get(f'/api/work-orders/lines/{S["wo"]}', [], WID_); S['line1'] = b['data']['collection'][0]['line_id']; S['labour_type_id'] = b['data']['collection'][0]['labour_type_id']; save()
    print(S)
elif step == 'clock':
    now = dt.datetime.now(ZoneInfo('America/Toronto')).replace(second=0, microsecond=0)
    s = now - dt.timedelta(minutes=50); e = now - dt.timedelta(minutes=20)
    c, b = call('POST', '/api/technician-tasks/create', {'line_id': S['line1'], 'work_order_id': S['wo'], 'tech_assigned_id': 'b669608e-a897-4f21-a510-8ced9d9fa982',
                'start_date': s.strftime('%d/%m/%Y %H:%M'), 'end_date': e.strftime('%d/%m/%Y %H:%M')})
elif step == 'complete':
    call('POST', '/api/work-orders/lines/change-status', {'line_id': S['line1'], 'status': 'complete', 'workOrderId': S['wo']})
elif step == 'addline':
    c, b = call('POST', '/api/work-orders/lines/create', {'work_order_id': S['wo'], 'line_name': 'ZZAUTOTEST void trigger', 'labour_type_id': S['labour_type_id'],
                'time_estimate': 30, 'tech_time': 30, 'status': 'authorized', 'is_authorized_to_repair': 1})
elif step == 'invoice':
    c, b = call('POST', '/api/invoices/create', {'work_order_id': S['wo']}); S['invoice'] = (b or {}).get('data'); save()
elif step == 'show':
    c, b = get(f'/api/work-orders/view/{S["wo"]}', [], WID_); w = b['data']['work_order']; print({k: w.get(k) for k in ('display_number', 'status', 'invoice_id', 'invoice_status')})
