#!/usr/bin/env python3
"""Seed (4 Nov 2026, staging, disposable, ZZAUTOTEST) at Staging Heavy Duty - 9919, Asia/Karachi:
catalogue + inventory part ZZAUTOTEST-PV8-<tag>, customer/contact/asset, work order + one approved canned labor line.
The part pick, the technician clock (Timesheet Activities -> New), Complete and Create Invoice are done ON SCREEN
(seed_hd_ui.mjs). Serves item 5 (Technician Efficiency data this month) and item 4 (a sale shortly before local midnight).
Ids (not secrets) -> /tmp/cln/s3/seed.json. Usage: TZ=Asia/Karachi python3 seed_hd.py probe|parts|customer|wo|show"""
import json, os, sys, datetime as dt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from s3 import use, get, call, did, curl
L = use('HD'); W = L['wid']; ST = '/tmp/cln/s3/seed.json'
S = json.load(open(ST)) if os.path.exists(ST) else {}
def save(): json.dump(S, open(ST, 'w'), indent=1)
H = {'X-Location-ID': W}
step = sys.argv[1]
S.setdefault('zones', {})[step] = L
if step == 'probe':
    c, cats = curl('GET', '/api/inventory/categories?limit=500', extra_headers=H)
    print('cats', c, [x['label'] for x in cats['data']['collection']][:15])
    c, bins = curl('GET', '/api/inventory/bin-locations', extra_headers=H)
    print('bins', c, [(x['id'], x.get('name') or x.get('label'), x['isDefault']) for x in bins['data']['binLocations']][:6])
    c, cl = curl('GET', '/api/work-orders/canned-lines', extra_headers=H)
    d = cl.get('data'); col = d.get('collection') if isinstance(d, dict) else d
    print('canned', c, [(x.get('id'), x.get('name') or x.get('line_name')) for x in (col or [])][:40])
elif step == 'parts':
    tag = S.setdefault('tag', dt.datetime.utcnow().strftime('%m%d%H%M')); save()
    c, cats = curl('GET', '/api/inventory/categories?limit=500', extra_headers=H)
    cat = cats['data']['collection'][0]; S['category'] = cat
    c, bins = curl('GET', '/api/inventory/bin-locations', extra_headers=H)
    b = [x for x in bins['data']['binLocations'] if x['isDefault']][0]; S['bin'] = b
    pn = f'ZZAUTOTEST-PV8-{tag}'
    c, r = call('POST', '/api/parts-catalogue/add-catalogue-part', {'name': 'ZZAUTOTEST Last Sale part', 'partNumber': pn, 'category_id': cat['value'], 'manufacturerId': None, 'tags': []}, W)
    S['cat'] = {'id': (r.get('data') or {}).get('catalogue_part_id') or did(r), 'pn': pn}; save()
    c, r = call('POST', '/api/inventory/parts/create', {'catalogPartId': S['cat']['id'], 'categoryId': cat['value'], 'vendorId': None, 'quantity': 5, 'cost': 20, 'sellPrice': 30,
               'min': 1, 'max': 10, 'manufacturerId': None, 'coreCharge': None, 'environmentalCharge': None, 'tags': [], 'isFixedPrice': False, 'gridLocation': '',
               'bins': [{'id': b['id'], 'quantity': 5, 'isDefault': True}]}, W)
    S['inv'] = (r.get('data') or {}).get('part_id') or did(r); save(); print(S['cat'], S['inv'])
elif step == 'customer':
    c, r = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST S3 Heavy Duty'}, W); cid = did(r)
    c, r = call('POST', '/api/contacts/create', {'company_id': cid, 'first_name': 'ZZAUTOTEST S3', 'last_name': 'Contact'}, W); ct = did(r)
    c, r = call('POST', '/api/vehicles/create', {'company_id': cid, 'customer_id': ct, 'unit': 'ZZ-S3HD', 'vin': 'ZZTESTVINS3HD00001'}, W); vid = did(r)
    S['customer'] = {'company_id': cid, 'contact_id': ct, 'vehicle_id': vid}; save(); print(S['customer'])
elif step == 'wo':
    cu = S['customer']
    c, r = call('POST', '/api/work-orders/create', {'company_id': cu['company_id'], 'vehicle_id': cu['vehicle_id'], 'customer_id': cu['contact_id'], 'workplace_id': W,
                'is_vehicle_here': True, 'type': 'service', 'note': 'ZZAUTOTEST S3 seed', 'mileage': 1000}, W)
    d = r.get('data', {}) if isinstance(r, dict) else {}; S['wo'] = d.get('work_order_id') or d.get('id') or did(r); save()
    call('POST', f'/api/work-orders/{S["wo"]}/lines/create-from-canned-line', {'another': False, 'canned_line_id': sys.argv[2], 'work_order_id': S['wo'], 'status': 'authorized'}, W)
    c, b = get(f'/api/work-orders/lines/{S["wo"]}', [], W); ln = b['data']['collection'][0]
    S['line'] = ln['line_id']; S['line_name'] = ln.get('line_name') or ln.get('name'); save()
    # remove any part request the canned line auto-created (they would block invoicing)
    for pr in ln.get('part_requests') or []: call('POST', f'/api/work-orders/part/remove-request/{pr["id"]}', {}, W)
elif step == 'show':
    c, b = get(f'/api/work-orders/view/{S["wo"]}', [], W); w = b['data']['work_order']
    S['display'] = w.get('display_number'); S['status'] = w.get('status'); save()
    c, l = get(f'/api/work-orders/lines/{S["wo"]}', [], W)
    print({k: w.get(k) for k in ('display_number', 'status')}, [(x.get('line_name'), x.get('status'), len(x.get('parts') or []), len(x.get('part_requests') or [])) for x in l['data']['collection']])
print(json.dumps({k: v for k, v in S.items() if k != 'zones'})[:600])
