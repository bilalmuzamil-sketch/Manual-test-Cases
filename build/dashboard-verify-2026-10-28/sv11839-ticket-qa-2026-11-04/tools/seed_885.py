#!/usr/bin/env python3
"""SV-11885 seeds at Staging Heavy Duty - 9919 (throwaway ZZAUTOTEST, QA branch only). SECRET-FREE. TZ=America/Edmonton.
Creates text that starts with + and @ and - and = in the reports that had none / to cover "+":
  customer "+ZZAUTOTEST QA11839 Plus" (contact "@ZZAUTOTEST" "-Contact", sales rep set) -> work order -> line clocked by a new staff
  "-ZZAUTOTEST" "QA11839 Tech" -> invoice -> customer credit memo; vendor "@ZZAUTOTEST QA11839 Vendor" -> vendor credit memo "=ZZAUTOTEST credit".
Every call is logged to ../seed-log.jsonl. Ids in /tmp/cln/qa11839/seed.json under X885."""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
W = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; Z = 'America/Edmonton'; H = {'X-Location-ID': W}; assert os.environ.get('TZ') == Z
CANNED = '42effe86-6b35-4661-804f-e10f49af5c8b'; TECH_ROLE = 'af8d02b5-ecd1-4205-a82f-32a4d5bb1015'; DEPT = '0653be2e-2816-4428-8dd2-db3526cccebb'
ST = '/tmp/cln/qa11839/seed.json'; S = json.load(open(ST)); R = S.setdefault('X885', {})
LOG = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/seed-log.jsonl'
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H)
    open(LOG, 'a').write(json.dumps({'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': 'X885', 'op': f'{m} {p}', 'http': c, 'resp': json.dumps(b)[:200]}) + '\n')
    print(m, p, c, json.dumps(b)[:180]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    if isinstance(d, dict):
        for k in ('id', 'work_order_id', 'company_id', 'contact_id', 'vehicle_id', 'invoice_id', 'line_id', 'user_id', 'vendor_id', 'creditMemoId'):
            if d.get(k): return d[k]
print('change-location', curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': Z})[0])
now = dt.datetime.now(ZoneInfo(Z)).replace(second=0, microsecond=0)
step = sys.argv[1]
if step == 'customer':
    c, b = call('POST', '/api/customers/create', {'name': '+ZZAUTOTEST QA11839 Plus'}); R['company_id'] = did(b)
    c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': '@ZZAUTOTEST', 'last_name': '-Contact'}); R['contact_id'] = did(b)
    c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': 'ZZ-QA11839-885'}); R['vehicle_id'] = did(b)
    c, b = curl('GET', f'/api/customers/view/{R["company_id"]}', extra_headers=H); R['customer_account_id'] = b['data']['company'].get('customer_account_id')
    call('POST', '/api/customers/change', {'id': R['company_id'], 'name': '+ZZAUTOTEST QA11839 Plus', 'sales_rep_first_name': 'Admin', 'sales_rep_last_name': 'ShopView'}); save()
elif step == 'staff':
    em = 'zzautotest.qa11839.tech885@example.invalid'
    call('POST', '/api/iam/create', {'email': em, 'first_name': '-ZZAUTOTEST', 'last_name': 'QA11839 Tech', 'role_id': TECH_ROLE, 'departments': [DEPT], 'workplace_id': W})
    c, b = curl('GET', '/api/staff?search=ZZAUTOTEST&limit=50', extra_headers=H)
    st = [x for x in b['data']['collection'] if x.get('email') == em]; R['staff'] = {k: st[0].get(k) for k in ('id', 'staff_id', 'first_name', 'last_name', 'clockable')} if st else None; save(); print(R['staff'])
elif step == 'wo':
    c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'], 'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}); R['wo'] = did(b)
    call('POST', f'/api/work-orders/{R["wo"]}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H); R['line'] = b['data']['collection'][0]['line_id']
    call('POST', '/api/work-orders/change-mileage', {'work_order_id': R['wo'], 'mileage': '123456'})
    call('POST', '/api/work-orders/lines/change-story', {'line_id': R['line'], 'tech_story': 'ZZAUTOTEST QA seed', 'work_order_id': R['wo']})
    s, e = now - dt.timedelta(minutes=50), now - dt.timedelta(minutes=20)
    call('POST', '/api/technician-tasks/create', {'line_id': R['line'], 'work_order_id': R['wo'], 'tech_assigned_id': R['staff']['staff_id'], 'start_date': s.strftime('%d/%m/%Y %H:%M'), 'end_date': e.strftime('%d/%m/%Y %H:%M')})
    call('POST', '/api/work-orders/lines/change-status', {'line_id': R['line'], 'status': 'complete', 'workOrderId': R['wo']})
    call('POST', '/api/work-orders/change-status', {'id': R['wo'], 'status': 'complete'})
    c, b = call('POST', '/api/invoices/create', {'work_order_id': R['wo']}); R['invoice'] = did(b)
    c, b = call('POST', '/api/credit-memos', {'customer_account_id': R['customer_account_id'], 'amount': 5}); R['credit_memo'] = (b or {}).get('data'); save()
elif step == 'vendor':
    c, b = curl('GET', '/api/taxes', extra_headers=H); tax = b['data']['collection'][0]['id']
    c, b = call('POST', '/api/parts-catalogue/add-vendor', {'name': '@ZZAUTOTEST QA11839 Vendor', 'credit_term': 0, 'credit_limit': 0, 'tax_id': tax}); R['vendor_resp'] = b
    vid = did(b)
    if not vid:
        c, v = curl('GET', '/api/parts-catalogue/vendors?search=ZZAUTOTEST', extra_headers=H); print('vendor lookup', c, json.dumps(v)[:300])
        try: vid = [x for x in (v['data'].get('collection') or v['data'].get('vendors') or []) if 'ZZAUTOTEST QA11839' in x.get('name', '')][0]['id']
        except Exception: pass
    R['vendor_id'] = vid; save()
    if vid: c, b = call('POST', '/api/parts-catalogue/vendor/credit/create', {'vendor_id': vid, 'memo': '=ZZAUTOTEST credit 1+1', 'amount': 7}); R['vendor_credit'] = (b or {}).get('data'); save()
elif step == 'delete-staff':
    c, b = call('DELETE', f'/api/staff/{R["staff"]["staff_id"]}')
print('X885', json.dumps({k: v for k, v in R.items() if k != 'vendor_resp'})[:500])
