#!/usr/bin/env python3
"""SV-12146 set-up at Staging Heavy Duty - 9919 (TZ=America/Edmonton), ZZAUTOTEST, QA branch only. SECRET-FREE.
Makes a new vendor and three vendor part requests on one work order (costs 10, 50, 10), and orders them, so each can be
RECEIVED ON SCREEN as its own vendor bill. Recipe: tt-playbook §AJ steps 1-4 + our playbook "Vendor invoices, receiving".
Steps: vendor | wo | parts | order | show.  Ids: /tmp/cln/qa11839/seed.json → V12146.  Log: ../seed-log.jsonl"""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
W = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; Z = 'America/Edmonton'; H = {'X-Location-ID': W}; assert os.environ.get('TZ') == Z
CANNED = '42effe86-6b35-4661-804f-e10f49af5c8b'; CAT = 'd64e8f1b-31e7-4c39-bedf-0846d97963cc'
ST = '/tmp/cln/qa11839/seed.json'; S = json.load(open(ST)); R = S.setdefault('V12146', {})
OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05'; os.makedirs(OUT, exist_ok=True); LOG = OUT + '/seed-log.jsonl'
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': 'V12146', 'op': f'{m} {p}', 'http': c, 'body_keys': sorted((body or {}).keys()), 'resp': json.dumps(b)[:200]}) + '\n')
    print(m, p, c, json.dumps(b)[:220]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    if isinstance(d, dict):
        for k in ('id', 'vendor_id', 'work_order_id', 'company_id', 'contact_id', 'part_request_id', 'orderId', 'order_id'):
            if d.get(k): return d[k]
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0])
now = dt.datetime.now(ZoneInfo(Z)); step = sys.argv[1]
if step == 'vendor':
    c, b = curl('GET', '/api/taxes', extra_headers=H); tax = [t for t in b['data']['collection'] if 'Zero' in t['name']] or b['data']['collection']
    c, b = call('POST', '/api/parts-catalogue/add-vendor', {'name': 'ZZAUTOTEST QA11839 Credit Vendor', 'credit_term': 0, 'credit_limit': 0, 'tax_id': tax[0]['id']}); R['vendor_id'] = did(b); R['vendor_tax'] = tax[0]['name']; save()
elif step == 'wo':
    c, b = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST QA11839 Vendor Credit WO'}); R['company_id'] = did(b)
    c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': 'ZZAUTOTEST VC', 'last_name': 'Contact'}); R['contact_id'] = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': 'ZZ-QA11839-VC'}); R['vehicle_id'] = did(b)
    c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'], 'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}); R['wo'] = did(b)
    call('POST', f'/api/work-orders/{R["wo"]}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H); R['line'] = b['data']['collection'][0]['line_id']; save()
elif step == 'parts':
    R['parts'] = []
    for i, cost in enumerate((10, 50, 10), 1):
        pn = f'ZZVC12146-{now.strftime("%H%M")}-{i}'
        c, b = call('POST', '/api/work-orders/part/make-request', {'work_order': R['wo'], 'line': R['line'], 'description': f'ZZAUTOTEST vendor credit test part {i}', 'part_number': pn,
                    'quantity': 1, 'part_source_type': 'vendor', 'is_authorized': False, 'is_core': False, 'part_category_id': CAT, 'cost': cost, 'sell_price': cost * 2, 'vendor_id': R['vendor_id'], 'vendor': R['vendor_id']})
        R['parts'].append({'pn': pn, 'cost': cost, 'resp': (b or {}).get('data')}); save()
elif step == 'order':
    c, b = curl('GET', f'/api/work-orders/view/{R["wo"]}', extra_headers=H); w = b['data']
    reqs = [p for x in (w.get('collection') or w.get('lines') or []) for p in (x.get('part_requests') or [])]
    if not reqs:
        c, b2 = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H)
        reqs = [p for x in b2['data']['collection'] for p in (x.get('part_requests') or [])]
    R['requests'] = [{k: p.get(k) for k in ('id', 'part_number', 'cost', 'status')} for p in reqs]; save(); print('requests', R['requests'])
    R['orders'] = []
    for p in reqs:
        c, b = call('POST', '/api/work-orders/part/perform-request-status-action', {'part_request_id': p['id'], 'action': 'order'}); R['orders'].append({'pn': p.get('part_number'), 'resp': (b or {}).get('data')})
    save()
print('V12146', json.dumps(R)[:900])
