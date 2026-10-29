#!/usr/bin/env python3
"""p2a seed (DVI Test, throwaway ZZAUTOTEST): customer "ZZAUTOTEST P2A Labor" -> contact -> unit ZZ-P2A -> work order ->
one approved canned line (60 min). The clocks themselves are made ON SCREEN (ev_p2a.mjs, Timesheet Activities ->
New Timesheet). Run with TZ=America/Toronto (Rule 99). SECRET-FREE; ids in /tmp/cln/p2a/seed.json.
Steps: customer | wo | show | clocks | delete-clocks"""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, os.path.dirname(__file__))
from p2aenv import curl, use, get, instants
wid, TZ, name, c = use('DVI'); assert os.environ.get('TZ') == TZ
H = {'X-Location-ID': wid}; ST = '/tmp/cln/p2a/seed.json'; S = json.load(open(ST)) if os.path.exists(ST) else {}
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H); print(m, p, c, json.dumps(b)[:200]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    for k in ('id', 'company_id', 'contact_id', 'vehicle_id', 'work_order_id', 'line_id', 'task_id'):
        if isinstance(d, dict) and d.get(k): return d[k]
    if isinstance(d, dict):
        for v in d.values():
            if isinstance(v, dict) and v.get('id'): return v['id']
    return None
step = sys.argv[1]
if step == 'customer':
    cid = S.get('company_id')
    if not cid:
        c, b = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST P2A Labor'}); cid = did(b); S['company_id'] = cid; save()
    c, b = call('POST', '/api/contacts/create', {'company_id': cid, 'first_name': 'ZZAUTOTEST P2A', 'last_name': 'Contact'}); ct = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': cid, 'customer_id': ct, 'unit': 'ZZ-P2A'}); vid = did(b)
    S['customer'] = {'company_id': cid, 'contact_id': ct, 'vehicle_id': vid}; save()
elif step == 'wo':
    cu = S['customer']; now = dt.datetime.now(ZoneInfo(TZ))
    c, b = call('POST', '/api/work-orders/create', {'company_id': cu['company_id'], 'vehicle_id': cu['vehicle_id'], 'customer_id': cu['contact_id'],
                'workplace_id': wid, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True})
    d = b.get('data', {}); S['wo'] = d.get('id') or d.get('work_order_id') or (d.get('work_order') or {}).get('id'); save()
    call('POST', f'/api/work-orders/{S["wo"]}/lines/create-from-canned-line', {'canned_line_id': '6e1ec60e-7412-48ae-9f96-f59e653c01a1', 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{S["wo"]}', extra_headers=H); S['line1'] = b['data']['collection'][0]['line_id']
    S['line1_name'] = b['data']['collection'][0].get('line_name') or b['data']['collection'][0].get('name'); save()
elif step == 'show':
    c, b = curl('GET', f'/api/work-orders/view/{S["wo"]}', extra_headers=H); w = b['data']['work_order']
    S['display'] = w.get('display_number'); save(); print({k: w.get(k) for k in ('display_number', 'status')}, S.get('line1_name'))
elif step == 'clocks':      # every Timesheet Activities row on my work order in the last 40 days (Toronto days)
    today = dt.datetime.now(ZoneInfo(TZ)).date(); s, e = instants(today - dt.timedelta(days=40), today, TZ)
    c, b = get('/api/reporting/punch-clock-activities/custom', [('range', 'custom'), ('start_date', s), ('end_date', e), ('pagination[page]', 1), ('pagination[rowsPerPage]', 1000)], wid)
    m = [r for r in b['data']['collection'] if r.get('work_order_id') == S['wo']]
    S['clocks'] = sorted({r['id'] for r in m}); save()
    for r in m: print(r['id'], r['employee'], r['formatted_start_date_time'], '->', r['formatted_end_date_time'], r['hours'], 'active' if r.get('is_active') else '')
elif step == 'delete-clocks':
    for i in S.get('clocks', []): call('DELETE', f'/api/technician-tasks/{i}')
