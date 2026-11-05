#!/usr/bin/env python3
"""SV-12202 baseline set-up at Staging Heavy Duty - 9919 (TZ=America/Edmonton): catalogue part + stocked inventory part ZZAUTOTEST-PV12202-<tag>,
customer/contact/asset, work order + one approved canned labor line (mileage + tech story set). The part is added and PICKED on screen
(sale_12202.mjs), then the line/WO are completed and invoiced here (step 'invoice'). Adapted from rerun-sv11839-2026-11-04/tools/sec3/seed_hd.py.
Steps: parts | wo | invoice | show.  Ids: /tmp/cln/qa11839/seed.json → PV12202. SECRET-FREE."""
import sys, os, json, datetime as dt
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
from urllib.parse import urlencode
W = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; Z = 'America/Edmonton'; H = {'X-Location-ID': W}; assert os.environ.get('TZ') == Z
CANNED = '42effe86-6b35-4661-804f-e10f49af5c8b'
ST = '/tmp/cln/qa11839/seed.json'; S = json.load(open(ST)); R = S.setdefault('PV12202', {})
LOG = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05/seed-log.jsonl'
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': 'PV12202', 'op': f'{m} {p}', 'http': c, 'resp': json.dumps(b)[:200]}) + '\n')
    print(m, p, c, json.dumps(b)[:200]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    if isinstance(d, dict):
        for k in ('id', 'part_id', 'catalogue_part_id', 'work_order_id', 'company_id', 'contact_id', 'invoice_id'):
            if d.get(k): return d[k]
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0])
step = sys.argv[1]
if step == 'parts':
    tag = R.setdefault('tag', dt.datetime.utcnow().strftime('%m%d%H%M')); pn = f'ZZAUTOTEST-PV12202-{tag}'
    c, cats = curl('GET', '/api/inventory/categories?limit=500', extra_headers=H); cat = cats['data']['collection'][0]
    c, bins = curl('GET', '/api/inventory/bin-locations', extra_headers=H); b = [x for x in bins['data']['binLocations'] if x['isDefault']][0]
    c, r = call('POST', '/api/parts-catalogue/add-catalogue-part', {'name': 'ZZAUTOTEST Last Sale part 12202', 'partNumber': pn, 'category_id': cat['value'], 'manufacturerId': None, 'tags': []})
    R['cat'] = {'id': (r.get('data') or {}).get('catalogue_part_id') or did(r), 'pn': pn}; save()
    c, r = call('POST', '/api/inventory/parts/create', {'catalogPartId': R['cat']['id'], 'categoryId': cat['value'], 'vendorId': None, 'quantity': 5, 'cost': 20, 'sellPrice': 30,
               'min': 1, 'max': 10, 'manufacturerId': None, 'coreCharge': None, 'environmentalCharge': None, 'tags': [], 'isFixedPrice': False, 'gridLocation': '',
               'bins': [{'id': b['id'], 'quantity': 5, 'isDefault': True}]})
    R['inv'] = (r.get('data') or {}).get('part_id') or did(r); save()
elif step == 'wo':
    c, b = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST QA11839 Last Sale'}); R['company_id'] = did(b)
    c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': 'ZZAUTOTEST LS', 'last_name': 'Contact'}); R['contact_id'] = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': 'ZZ-QA11839-LS', 'vin': 'ZZTESTVINLS1220201'}); R['vehicle_id'] = did(b)
    now = dt.datetime.now()
    c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'], 'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}); R['wo'] = did(b)
    call('POST', f'/api/work-orders/{R["wo"]}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H); R['line'] = b['data']['collection'][0]['line_id']
    call('POST', '/api/work-orders/change-mileage', {'work_order_id': R['wo'], 'mileage': '123456'})
    call('POST', '/api/work-orders/lines/change-story', {'line_id': R['line'], 'tech_story': 'ZZAUTOTEST QA seed', 'work_order_id': R['wo']})
    c, v = curl('GET', f'/api/work-orders/view/{R["wo"]}', extra_headers=H); R['display'] = v['data']['work_order'].get('display_number'); save()
elif step == 'invoice':
    call('POST', '/api/work-orders/lines/change-status', {'line_id': R['line'], 'status': 'complete', 'workOrderId': R['wo']})
    call('POST', '/api/work-orders/change-status', {'id': R['wo'], 'status': 'complete'})
    c, b = call('POST', '/api/invoices/create', {'work_order_id': R['wo']}); R['invoice'] = did(b); R['invoice_created_utc'] = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'); save()
elif step == 'show':
    c, l = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H)
    print([(x.get('status'), [(p.get('part_number'), p.get('status')) for p in (x.get('parts') or [])], [(p.get('part_number'), p.get('status')) for p in (x.get('part_requests') or [])]) for x in l['data']['collection']])
print('PV12202', json.dumps(R)[:600])
