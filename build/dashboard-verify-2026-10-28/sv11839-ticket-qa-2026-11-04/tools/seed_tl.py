#!/usr/bin/env python3
"""SV-11885 follow-up seeds at Test Location (Asia/Karachi), ZZAUTOTEST, QA branch only. SECRET-FREE. Run with TZ=Asia/Karachi (Rule 99).
Steps: inv (inventory part + one manual quantity change → Journal Entry rows) · wo (invoiced work order → Customer Invoice row)
       · tabcr (customers + contacts whose names start with a TAB and with a CR) · show
Ids in /tmp/cln/qa11839/seed.json under TL885; every call appended to ../seed-log.jsonl."""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
W = 'f9da140e-f4eb-4e3b-adc8-028214ebaf4c'; Z = 'Asia/Karachi'; H = {'X-Location-ID': W}; assert os.environ.get('TZ') == Z, 'Rule 99: TZ=Asia/Karachi'
CANNED = '42effe86-6b35-4661-804f-e10f49af5c8b'
ST = '/tmp/cln/qa11839/seed.json'; S = json.load(open(ST)); R = S.setdefault('TL885', {})
LOG = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/seed-log.jsonl'
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': 'TL885', 'op': f'{m} {p}', 'http': c, 'body_keys': sorted((body or {}).keys()), 'resp': json.dumps(b)[:200]}) + '\n')
    print(m, p, c, json.dumps(b)[:200]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    if isinstance(d, dict):
        for k in ('id', 'work_order_id', 'company_id', 'contact_id', 'invoice_id', 'line_id', 'part_id', 'inventory_part_id'):
            if d.get(k): return d[k]
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0])
now = dt.datetime.now(ZoneInfo(Z)).replace(second=0, microsecond=0)
step = sys.argv[1]
if step == 'inv':
    c, b = call('POST', '/api/inventory/parts/create', {'catalog_part_id': '4b4753e0-bed7-40eb-bbd1-c0f9e2ecd5f4', 'category_id': 'd64e8f1b-31e7-4c39-bedf-0846d97963cc', 'quantity': 1, 'cost': 10, 'tags': [], 'bins': [{'id': '5040fb6b-dace-4ec6-bf7f-bf4b709986af', 'quantity': 1, 'isDefault': True}]})
    R['inv_part'] = did(b); save()
    from urllib.parse import urlencode
    c, b = curl('GET', '/api/inventory/parts?' + urlencode({'pagination[rowsPerPage]': 5, 'pagination[page]': 1}), extra_headers=H)
    col = b['data']['collection']; R['inv_rows'] = [{k: x.get(k) for k in ('id', 'part_number', 'quantity', 'purchase_price', 'category', 'catalogue_part_id', 'binLocations')} for x in col]; save(); print(R['inv_rows'])
    if col:
        p = col[0]; R['inv_part'] = p['id']
        c, b = call('POST', '/api/inventory/parts/change', {'id': p['id'], 'catalog_part_id': p['catalogue_part_id'], 'category_id': p['category'], 'quantity': (p['quantity'] or 0) + 1,
                    'purchase_price': p['purchase_price'], 'tags': [], 'bins': [{'id': x['binLocationId'], 'quantity': x['quantity'] + (1 if x.get('isDefault') else 0)} for x in (p.get('binLocations') or [])]})
        save()
elif step == 'wo':
    c, b = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST QA11839 TL Invoice'}); R['company_id'] = did(b)
    c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': 'ZZAUTOTEST TL', 'last_name': 'Contact'}); R['contact_id'] = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': 'ZZ-QA11839-TL'}); R['vehicle_id'] = did(b)
    c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'], 'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}); R['wo'] = did(b)
    call('POST', f'/api/work-orders/{R["wo"]}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H); R['line'] = b['data']['collection'][0]['line_id']
    call('POST', '/api/work-orders/change-mileage', {'work_order_id': R['wo'], 'mileage': '123456'})
    call('POST', '/api/work-orders/lines/change-story', {'line_id': R['line'], 'tech_story': 'ZZAUTOTEST QA seed', 'work_order_id': R['wo']})
    call('POST', '/api/work-orders/lines/change-status', {'line_id': R['line'], 'status': 'complete', 'workOrderId': R['wo']})
    call('POST', '/api/work-orders/change-status', {'id': R['wo'], 'status': 'complete'})
    c, b = call('POST', '/api/invoices/create', {'work_order_id': R['wo']}); R['invoice'] = did(b); save()
elif step == 'tabcr':
    for tag, ch in (('tab', '\t'), ('cr', '\r')):
        c, b = call('POST', '/api/customers/create', {'name': f'{ch}ZZAUTOTEST QA11839 {tag.upper()} customer'}); cid = did(b)
        c, b = call('POST', '/api/contacts/create', {'company_id': cid, 'first_name': f'{ch}ZZAUTOTEST {tag.upper()}', 'last_name': 'Contact'})
        c, v = curl('GET', f'/api/customers/view/{cid}', extra_headers=H); co = (v.get('data') or {}).get('company') or {}
        R[f'{tag}_customer'] = {'id': cid, 'stored_name': co.get('name'), 'contacts': [(x.get('first_name'), x.get('last_name')) for x in co.get('contacts') or []]}
        print(tag, 'stored name', repr(co.get('name')), [repr(x.get('first_name')) for x in co.get('contacts') or []])
    save()
print('TL885', json.dumps(R)[:600])
