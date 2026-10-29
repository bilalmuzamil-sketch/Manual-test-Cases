"""D7 fresh data (DVI Test, throwaway ZZAUTOTEST): customer on COD -> work order -> canned line -> complete -> invoice (COD)
-> customer changed to Net 30. Ids in /tmp/cln/p2d/seed_d7.json. Run with TZ=America/Toronto (Rule 99). SECRET-FREE."""
import json, os, sys, datetime as dt
from zoneinfo import ZoneInfo
from common import *
w = WID['dvi']; assert os.environ.get('TZ') == TZ[w]; H = {'X-Location-ID': w}
ST = f'{RAW}/seed_d7.json'; S = json.load(open(ST)) if os.path.exists(ST) else {}
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H); print(m, p, c, json.dumps(b)[:300]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    if isinstance(d, list) and d: d = d[0]
    for k in ('id', 'company_id', 'contact_id', 'vehicle_id', 'work_order_id', 'invoice_id', 'line_id'):
        if isinstance(d, dict) and d.get(k): return d[k]
    if isinstance(d, dict):
        for v in d.values():
            if isinstance(v, dict) and v.get('id'): return v['id']
step = sys.argv[1]; loc(w)
if step == 'customer':
    c, b = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST P2D Terms', 'credit_term': 'COD'}); S['company_id'] = did(b); save()
    c, b = call('POST', '/api/contacts/create', {'company_id': S['company_id'], 'first_name': 'ZZAUTOTEST P2D', 'last_name': 'Contact'}); S['contact_id'] = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': S['company_id'], 'customer_id': S['contact_id'], 'unit': 'ZZ-P2D-TERMS'}); S['vehicle_id'] = did(b); save()
elif step == 'view':
    c, b = call('GET', f'/api/customers/view/{S["company_id"]}'); co = b['data']['company']; print({k: co.get(k) for k in co if 'term' in k or k in ('name', 'id')})
elif step == 'setterm':
    c, b = curl('GET', f'/api/customers/view/{S["company_id"]}', extra_headers=H); co = b['data']['company']
    call('POST', '/api/customers/change', {'id': S['company_id'], 'name': co['name'], 'credit_term': sys.argv[2], 'creditTerm': sys.argv[2]})
elif step == 'wo':
    now = dt.datetime.now(ZoneInfo(TZ[w]))
    c, b = call('POST', '/api/work-orders/create', {'company_id': S['company_id'], 'vehicle_id': S['vehicle_id'], 'customer_id': S['contact_id'],
                'workplace_id': w, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True})
    d = b.get('data', {}); S['wo'] = d.get('id') or d.get('work_order_id') or (d.get('work_order') or {}).get('id'); save()
    call('POST', f'/api/work-orders/{S["wo"]}/lines/create-from-canned-line', {'canned_line_id': '6e1ec60e-7412-48ae-9f96-f59e653c01a1', 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{S["wo"]}', extra_headers=H); S['line1'] = b['data']['collection'][0]['line_id']; save()
    call('POST', '/api/work-orders/lines/change-status', {'line_id': S['line1'], 'status': 'complete', 'workOrderId': S['wo']})
elif step == 'invoice':
    c, b = call('POST', '/api/invoices/create', {'work_order_id': S['wo']}); S['invoice'] = (b or {}).get('data'); save()
elif step == 'show':
    c, b = curl('GET', f'/api/work-orders/view/{S["wo"]}', extra_headers=H); wo = b['data']['work_order']
    S['display'] = wo.get('display_number'); S['invoice_id'] = wo.get('invoice_id'); save(); print({k: wo.get(k) for k in ('display_number', 'status', 'invoice_id', 'invoice_status')})
    if wo.get('invoice_id'):
        c, iv = curl('GET', f'/api/invoices/{wo["invoice_id"]}/view', extra_headers=H); ci = iv['data']['collection']
        print({k: ci.get(k) for k in ('display_number', 'credit_terms', 'due_date', 'total_balance', 'status')})
