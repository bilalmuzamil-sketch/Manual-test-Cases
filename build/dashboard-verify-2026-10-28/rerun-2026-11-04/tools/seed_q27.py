#!/usr/bin/env python3
"""Q27 seed (DVI Test, throwaway ZZAUTOTEST): customer "ZZAUTOTEST Dash Q27" -> work order -> canned line
3x inspection (60 min tech time) -> one 30-minute clock (Esther Howard) -> line Complete -> invoice.
The clock is then edited on the Timesheet Activities screen (evidence_q27.mjs). SECRET-FREE; ids in /tmp/cln/q27/seed.json.
Run with TZ=America/Toronto (Rule 99)."""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
import seed
from collect_dashboard import curl
WID = '39522bc6-abca-4f67-bd12-2840043c2d68'; TZ = 'America/Toronto'; H = {'X-Location-ID': WID}
ST = '/tmp/cln/q27/seed.json'; S = json.load(open(ST)) if os.path.exists(ST) else {}
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H); print(m, p, c, json.dumps(b)[:250]); return c, b
step = sys.argv[1]
curl('POST', '/api/iam/change-location', {'workplace_id': WID, 'workplace_timezone': TZ})
if step == 'customer':
    S['customer'] = seed.customer('Q27'); save()
elif step == 'wo':
    cu = S['customer']; now = dt.datetime.now(ZoneInfo(TZ))
    c, b = call('POST', '/api/work-orders/create', {'company_id': cu['company_id'], 'vehicle_id': cu['vehicle_id'], 'customer_id': cu['contact_id'],
                'workplace_id': WID, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True})
    d = b.get('data', {}); S['wo'] = d.get('id') or d.get('work_order_id') or (d.get('work_order') or {}).get('id'); save()
    call('POST', f'/api/work-orders/{S["wo"]}/lines/create-from-canned-line', {'canned_line_id': '6e1ec60e-7412-48ae-9f96-f59e653c01a1', 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{S["wo"]}', extra_headers=H); S['line1'] = b['data']['collection'][0]['line_id']; save()
elif step == 'clock':
    now = dt.datetime.now(ZoneInfo(TZ)).replace(second=0, microsecond=0)
    s = now - dt.timedelta(minutes=40); e = now - dt.timedelta(minutes=10); S['clock'] = [s.isoformat(), e.isoformat()]; save()
    call('POST', '/api/technician-tasks/create', {'line_id': S['line1'], 'work_order_id': S['wo'], 'tech_assigned_id': 'b669608e-a897-4f21-a510-8ced9d9fa982',
         'start_date': s.strftime('%d/%m/%Y %H:%M'), 'end_date': e.strftime('%d/%m/%Y %H:%M')})
elif step == 'complete':
    call('POST', '/api/work-orders/lines/change-status', {'line_id': S['line1'], 'status': 'complete', 'workOrderId': S['wo']})
elif step == 'invoice':
    c, b = call('POST', '/api/invoices/create', {'work_order_id': S['wo']}); S['invoice'] = (b or {}).get('data'); save()
elif step == 'show':
    c, b = curl('GET', f'/api/work-orders/view/{S["wo"]}', extra_headers=H); w = b['data']['work_order']
    S['display'] = w.get('display_number'); save(); print({k: w.get(k) for k in ('display_number', 'status', 'invoice_id', 'invoice_status')})
