#!/usr/bin/env python3
"""SV-12199 set-up at Staging Heavy Duty - 9919 (TZ=America/Edmonton): customer "ZZAUTOTEST QA11839 Terms test" on Credit Terms COD (contact + asset),
work order with one labor line, line Complete, invoice. The change to Net 30 and the export are done on screen (sv12199.mjs). SECRET-FREE."""
import sys, os, json, datetime as dt
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
W = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; Z = 'America/Edmonton'; H = {'X-Location-ID': W}; assert os.environ.get('TZ') == Z
CANNED = '42effe86-6b35-4661-804f-e10f49af5c8b'
S = json.load(open('/tmp/cln/qa11839/seed.json')); R = S.setdefault('T12199', {})
LOG = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05/seed-log.jsonl'
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': 'T12199', 'op': f'{m} {p}', 'http': c, 'resp': json.dumps(b)[:200]}) + '\n')
    print(m, p, c, json.dumps(b)[:160]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    for k in ('id', 'work_order_id', 'company_id', 'contact_id', 'invoice_id', 'line_id'):
        if isinstance(d, dict) and d.get(k): return d[k]
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0])
c, b = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST QA11839 Terms test', 'credit_term': 'COD'}); R['company_id'] = did(b)
c, v = curl('GET', f'/api/customers/view/{R["company_id"]}', extra_headers=H); co = v['data']['company']
if co.get('credit_term') != 'COD':
    body = {k: x for k, x in co.items() if not isinstance(x, (list, dict))}; body.update({'id': R['company_id'], 'credit_term': 'COD'}); call('POST', '/api/customers/change', body)
    c, v = curl('GET', f'/api/customers/view/{R["company_id"]}', extra_headers=H); co = v['data']['company']
R['credit_term_at_invoice'] = co.get('credit_term'); print('credit_term now', co.get('credit_term'))
c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': 'ZZAUTOTEST Terms', 'last_name': 'Contact'}); R['contact_id'] = did(b)
c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': 'ZZ-QA11839-TERMS'}); R['vehicle_id'] = did(b)
c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'], 'workplace_id': W, 'start_date': dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}); R['wo'] = did(b)
call('POST', f'/api/work-orders/{R["wo"]}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H); R['line'] = b['data']['collection'][0]['line_id']
call('POST', '/api/work-orders/change-mileage', {'work_order_id': R['wo'], 'mileage': '123456'})
call('POST', '/api/work-orders/lines/change-story', {'line_id': R['line'], 'tech_story': 'ZZAUTOTEST QA seed', 'work_order_id': R['wo']})
call('POST', '/api/work-orders/lines/change-status', {'line_id': R['line'], 'status': 'complete', 'workOrderId': R['wo']})
call('POST', '/api/work-orders/change-status', {'id': R['wo'], 'status': 'complete'})
c, b = call('POST', '/api/invoices/create', {'work_order_id': R['wo']}); R['invoice'] = did(b)
c, v = curl('GET', f'/api/work-orders/view/{R["wo"]}', extra_headers=H); R['display'] = v['data']['work_order'].get('display_number')
json.dump(S, open('/tmp/cln/qa11839/seed.json', 'w'), indent=1); print('T12199', json.dumps(R)[:400])
