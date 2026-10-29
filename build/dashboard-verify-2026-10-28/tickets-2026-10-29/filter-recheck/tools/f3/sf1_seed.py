"""SF1 control seed (DVI Test, America/Toronto; throwaway ZZAUTOTEST only): one work order for the existing customer ZZAUTOTEST P2C DEP,
one canned labor line, no invoice. The deposit itself is added through the screen (sf1_screen.mjs). Run: TZ=America/Toronto python3 sf1_seed.py
State (ids only, no secrets): evidence/f3/SF1/seed.json"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from common import *
W = WID['dvi']; ZONE = TZ[W]; H = {'X-Location-ID': W}; print('change-location', loc(W))
ST = f'{EV}/SF1/seed.json'; os.makedirs(os.path.dirname(ST), exist_ok=True); S = json.load(open(ST)) if os.path.exists(ST) else {}
if 'wo' not in S:
    now = dt.datetime.now(ZoneInfo(ZONE))
    c, b = curl('POST', '/api/work-orders/create', {'company_id': 'a63836b3-ae77-4bb9-8f13-3784e0e22212', 'vehicle_id': 'fa21bc68-fa2b-4089-871e-b0275cff8cbe',
                'customer_id': '4a5e75cb-cf3c-4729-b7e8-c19086efd234', 'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}, extra_headers=H)
    print('create', c); d = b.get('data', {}) if isinstance(b, dict) else {}
    S['wo'] = d.get('id') or d.get('work_order_id') or (d.get('work_order') or {}).get('id'); S['created_utc'] = dt.datetime.now(dt.timezone.utc).isoformat(); S['customer'] = 'ZZAUTOTEST P2C DEP'
    c, b = curl('POST', f'/api/work-orders/{S["wo"]}/lines/create-from-canned-line', {'canned_line_id': '6e1ec60e-7412-48ae-9f96-f59e653c01a1', 'status': 'authorized'}, extra_headers=H); print('line', c)
c, b = curl('GET', f'/api/work-orders/view/{S["wo"]}', extra_headers=H); w = b['data']['work_order']
S['display'] = w.get('display_number'); S['status'] = w.get('status'); S['payments'] = [(p['label'], p['payment_date']) for p in (w.get('customer_payments') or [])]
json.dump(S, open(ST, 'w'), indent=1); print(S)
