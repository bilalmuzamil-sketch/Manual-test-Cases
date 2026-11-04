#!/usr/bin/env python3
"""Seeds for the sv11839 ticket QA pass (4 Nov 2026). Throwaway ZZAUTOTEST data on the QA branch only.
SECRET-FREE: the cookie is read by collect_dashboard from /tmp/cln/qa11839/cookie.txt. Ids (not secrets) go to
/tmp/cln/qa11839/seed.json and are copied into the evidence afterwards.
Run with TZ = the location's zone (Rule 99): Heavy Duty / Lethbridge = America/Edmonton.
Usage: seed_qa.py <tag> <step>
  TE  (SV-11931, Heavy Duty): customer | wo | clock | status | invoice | show
  SBC (SV-11934, Heavy Duty): customer | wo | clock | status | invoice | show
  CM  (SV-11821, Lethbridge): customer | memo | show
Recipes: build/APP-ACTIONS-PLAYBOOK.md "The invoiced-work-order chain"; rerun-2026-11-04/tools/seed_q27.py (technician-tasks/create)."""
import sys, os, json, datetime as dt
from zoneinfo import ZoneInfo
sys.path.insert(0, '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-sv11839-2026-11-04/tools')
from collect_dashboard import curl
HD = 'b3c8c820-f815-4cf1-8938-10956c5ee71a'; LB = 'f8a8b802-7780-4b16-bf10-343caeb616b2'; ZONE = 'America/Edmonton'
CANNED = '42effe86-6b35-4661-804f-e10f49af5c8b'   # "Service - Battery service", 60 min tech time, labour rate, no parts (Heavy Duty)
TECH = {'ADV': '21bb7388-2e45-4025-bfd8-a4c2e306e9f6', 'ADV2': '21bb7388-2e45-4025-bfd8-a4c2e306e9f6', 'ADV3': '21bb7388-2e45-4025-bfd8-a4c2e306e9f6', 'TE': '21bb7388-2e45-4025-bfd8-a4c2e306e9f6',   # staff_id of Stephen Grimes (Technician, active)
        'SBC': '558264f7-7c13-4198-b331-5e95ab20c4f9'}  # staff_id of Craig Mckee (Technician, active)
ST = '/tmp/cln/qa11839/seed.json'; S = json.load(open(ST)) if os.path.exists(ST) else {}
LOG = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/seed-log.jsonl'
assert os.environ.get('TZ') == ZONE, 'Rule 99: run with TZ=America/Edmonton'
def save(): json.dump(S, open(ST, 'w'), indent=1)
tag, step = sys.argv[1], sys.argv[2]; R = S.setdefault(tag, {}); W = LB if tag == 'CM' else HD; H = {'X-Location-ID': W}
def call(m, p, body=None):
    c, b = curl(m, p, body, extra_headers=H)
    rec = {'at_utc': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'), 'tag': tag, 'step': step, 'op': f'{m} {p}', 'http': c,
           'body_sent_keys': sorted((body or {}).keys()), 'resp': (json.dumps(b)[:300] if c not in (200, 201, 204) else json.dumps(b)[:160])}
    open(LOG, 'a').write(json.dumps(rec) + '\n'); print(m, p, c, rec['resp'][:200]); return c, b
def did(b):
    d = (b or {}).get('data', b) or {}
    for k in ('id', 'work_order_id', 'company_id', 'contact_id', 'vehicle_id', 'invoice_id', 'line_id', 'credit_memo_id'):
        if isinstance(d, dict) and d.get(k): return d[k]
    if isinstance(d, dict):
        for v in d.values():
            if isinstance(v, dict) and v.get('id'): return v['id']
c, _ = curl('POST', '/api/iam/change-location', {'workplace_id': W, 'workplace_timezone': ZONE}); print('change-location', c)
now = dt.datetime.now(ZoneInfo(ZONE)).replace(second=0, microsecond=0)
if step == 'customer':
    name = {'ADV': 'ZZAUTOTEST QA11839 Advisor Deleted', 'TE': 'ZZAUTOTEST QA11839 TE Declined', 'SBC': 'ZZAUTOTEST QA11839 SBC Delta', 'CM': 'ZZAUTOTEST QA11839 Credit'}[tag]
    c, b = call('POST', '/api/customers/create', {'name': name}); R['company_id'] = did(b); R['name'] = name
    c, b = call('POST', '/api/contacts/create', {'company_id': R['company_id'], 'first_name': f'ZZAUTOTEST {tag}', 'last_name': 'Contact'}); R['contact_id'] = did(b)
    if tag != 'CM':
        c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': f'ZZ-QA11839-{tag}'}); R['vehicle_id'] = did(b)
    c, b = curl('GET', f'/api/customers/view/{R["company_id"]}', extra_headers=H)
    R['customer_account_id'] = (((b or {}).get('data') or {}).get('company') or {}).get('customer_account_id'); save()
elif step == 'wo':
    c, b = call('POST', '/api/work-orders/create', {'company_id': R['company_id'], 'vehicle_id': R['vehicle_id'], 'customer_id': R['contact_id'],
                'workplace_id': W, 'start_date': now.strftime('%Y-%m-%d %H:%M:%S'), 'is_vehicle_here': True}); R['wo'] = did(b); save()
    for _ in range(2 if tag == 'TE' else 1):
        call('POST', f'/api/work-orders/{R["wo"]}/lines/create-from-canned-line', {'canned_line_id': CANNED, 'status': 'authorized'})
    c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H)
    R['lines'] = [l['line_id'] for l in b['data']['collection']]; save()
    call('POST', '/api/work-orders/change-mileage', {'work_order_id': R['wo'], 'mileage': '123456'})
    for l in R['lines']:
        call('POST', '/api/work-orders/lines/change-story', {'line_id': l, 'tech_story': 'ZZAUTOTEST QA seed', 'work_order_id': R['wo']})
elif step == 'clock':
    # TE: line 1 = 60 min, line 2 = 30 min. SBC: one 30-min clock. All finished in the past, today, Edmonton time.
    plan = [(R['lines'][0], 200, 140), (R['lines'][1], 130, 100)] if tag == 'TE' else [(R['lines'][0], 90, 60)]
    R['clocks'] = []
    for line, a, z in plan:
        s, e = now - dt.timedelta(minutes=a), now - dt.timedelta(minutes=z)
        c, b = call('POST', '/api/technician-tasks/create', {'line_id': line, 'work_order_id': R['wo'], 'tech_assigned_id': TECH[tag],
                    'start_date': s.strftime('%d/%m/%Y %H:%M'), 'end_date': e.strftime('%d/%m/%Y %H:%M')})
        R['clocks'].append({'line': line, 'start_local': s.isoformat(), 'end_local': e.isoformat(), 'http': c, 'id': did(b)})
    save()
elif step == 'status':
    call('POST', '/api/work-orders/lines/change-status', {'line_id': R['lines'][0], 'status': 'complete', 'workOrderId': R['wo']})
    if tag == 'TE':
        call('POST', '/api/work-orders/lines/change-status', {'line_id': R['lines'][1], 'status': 'authorization_declined', 'workOrderId': R['wo']})
    call('POST', '/api/work-orders/change-status', {'id': R['wo'], 'status': 'complete'})
elif step == 'invoice':
    if tag.startswith('ADV') and 'ZZAUTOTEST' not in ((R.get('advisor_set') or {}).get('service_advisor_name') or ''): raise SystemExit('refusing: ZZAUTOTEST advisor not set on ' + tag)
    c, b = call('POST', '/api/invoices/create', {'work_order_id': R['wo']}); R['invoice'] = did(b); save()
elif step == 'staff':      # ADV (SV-11820): a throwaway advisor who will be deleted after the invoice exists
    em = 'zzautotest.qa11839.advisor@example.invalid'
    # proven 4 Nov 2026: snake_case keys + at least one department + workplace_id (the 400 names camelCase keys, which do NOT work)
    if not R.get('user_id'):
        c, b = call('POST', '/api/iam/create', {'email': em, 'first_name': 'ZZAUTOTEST', 'last_name': 'Advisor QA11839', 'role_id': 'ad1a793e-7cc7-48a5-8f93-507c03562b32',
                    'departments': ['0653be2e-2816-4428-8dd2-db3526cccebb'], 'workplace_id': W})
        R['user_id'] = ((b or {}).get('data') or b or {}).get('user_id') if isinstance(b, dict) else None
    c, b = curl('GET', '/api/staff?search=ZZAUTOTEST&limit=50', extra_headers=H)   # the plain ?limit=200 list returns only 66 rows and misses it
    st = [x for x in b['data']['collection'] if x.get('email') == em]
    R['staff'] = {k: st[0].get(k) for k in ('id', 'staff_id', 'first_name', 'last_name', 'role_label', 'is_active')} if st else None; save(); print('staff', R['staff'])
elif step == 'advisor':
    if R.get('invoice'): raise SystemExit('refusing: invoice already exists for ' + tag)
    for key in ('id', 'staff_id'):
        c, b = call('POST', '/api/work-orders/change-service-advisor', {'work_order_id': R['wo'], 'service_advisor_id': R['staff'][key]})
        c, v = curl('GET', f'/api/work-orders/view/{R["wo"]}', extra_headers=H); w = v['data']['work_order']
        R['advisor_set'] = {k: w.get(k) for k in w if 'advisor' in k.lower()}; R['advisor_key_used'] = key; save(); print('advisor now', R['advisor_set'])
        if 'ZZAUTOTEST' in (w.get('service_advisor_name') or ''): break   # a new WO defaults to its creator as advisor, so check the NAME
elif step == 'delete-staff':
    for key in ('staff_id', 'id'):
        c, b = call('DELETE', f'/api/staff/{R["staff"][key]}')
        if c in (200, 204): R['deleted_with'] = key; break
    c, v = curl('GET', f'/api/work-orders/view/{R["wo"]}', extra_headers=H); w = v['data']['work_order']
    R['advisor_after_delete'] = {k: w.get(k) for k in w if 'advisor' in k.lower()}; save(); print('after delete', R['advisor_after_delete'])
elif step == 'vehicle':   # CM: the Lethbridge customer also needs an asset for its one small invoice
    c, b = call('POST', '/api/vehicles/create', {'company_id': R['company_id'], 'customer_id': R['contact_id'], 'unit': f'ZZ-QA11839-{tag}'}); R['vehicle_id'] = did(b); save()
elif step == 'memo':
    amt = float(sys.argv[3]) if len(sys.argv) > 3 else 25
    c, b = call('POST', '/api/credit-memos', {'customer_account_id': R['customer_account_id'], 'amount': amt})
    R.setdefault('memos', []).append((b or {}).get('data')); R['memo'] = (b or {}).get('data'); save()
elif step == 'show':
    if tag == 'CM' and step == 'show' and not R.get('wo'):
        c, b = curl('GET', f'/api/customer-account/list-unpaid-transaction?account_id={R["customer_account_id"]}', extra_headers=H)
        R['memo_rows'] = [{k: t.get(k) for k in ('type', 'formatted_invoice_number', 'status_label', 'amount', 'total', 'date', 'created_on')} for t in ((b or {}).get('data') or {}).get('collection', (b or {}).get('data') or [])] if isinstance(b, dict) else b
        save(); print(json.dumps(R['memo_rows'])[:600])
    else:
        c, b = curl('GET', f'/api/work-orders/view/{R["wo"]}', extra_headers=H); w = b['data']['work_order']
        R['display'] = w.get('display_number'); R['invoice_id'] = w.get('invoice_id'); save()
        print({k: w.get(k) for k in ('display_number', 'status', 'invoice_id', 'invoice_status')})
        c, b = curl('GET', f'/api/work-orders/lines/{R["wo"]}', extra_headers=H)
        for l in b['data']['collection']:
            print({k: l.get(k) for k in ('line_id', 'status', 'tech_time', 'clocked_time', 'title', 'line_total', 'total')})
print('state', json.dumps(R)[:400])
