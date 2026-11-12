"""Seed staging for the A/R A/P 'existing data unchanged' check (ZZAUTOTEST). Idempotent via state file.
Endpoints from app/src/api (Rule 115): companies/index.ts customers/create, credit-memos; parts/index.ts add-vendor,
vendor/credit/create. Never calls login/logout/change-location."""
import json, os, sys, datetime
from api import req
OUT = sys.argv[1]  # repo folder for seed-state.json
SF = os.path.join(OUT, 'seed-state.json')
S = json.load(open(SF)) if os.path.exists(SF) else {}
def save(): json.dump(S, open(SF, 'w'), indent=1)
def now(): return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def ok(r, what):
    st, js = r
    if st not in (200, 201): raise SystemExit(f'{what}: HTTP {st} {str(js)[:300]}')
    return js.get('data', js) if isinstance(js, dict) else js
CNAME = 'ZZAUTOTEST SV11315 Staging CM'
VNAME = 'ZZAUTOTEST SV11315 Staging VC'
if 'customer' not in S:
    d = ok(req('POST', '/api/customers/create', {"name": CNAME, "address": "1 ZZAUTOTEST Way", "city": "Calgary",
        "state_or_province": "Alberta", "postal_code": "T2C 4M5", "phone": "(403) 555-0100", "country_code": "CA"}), 'customer')
    cid = d['company_id']
    view = ok(req('GET', f'/api/customers/view/{cid}'), 'customer view')['company']
    S['customer'] = {'id': cid, 'name': CNAME, 'account': view.get('customer_account_id'), 'created_utc': now()}; save()
print('customer', S['customer'])
if 'credit_memo' not in S:
    body = {'customerAccountId': S['customer']['account'], 'amount': 5, 'reason': 'ZZAUTOTEST staging before-feature capture for C1062590 (A/R and A/P upgrade, SV-11315)',
            'originDate': '2026-11-14T07:00:00.000Z'}
    x = ok(req('POST', '/api/credit-memos', body), 'credit memo')
    S['credit_memo'] = {'raw_keys': list(x)[:20], 'id': x.get('creditMemoId') or x.get('id'), 'number': x.get('creditNumber') or x.get('credit_display_number'),
                        'amount': 5, 'origin_date_sent': body['originDate'], 'created_utc': now()}; save()
print('credit_memo', S['credit_memo'])
# read it back from the customer's unpaid list
st, u = req('GET', f"/api/customer-account/list-unpaid-transaction?accountId={S['customer']['account']}&pagination[page]=1&pagination[rowsPerPage]=100")
items = (u.get('data') or {}) if isinstance(u, dict) else {}
items = items.get('collection') or items.get('items') or items if isinstance(items, dict) else items
print('unpaid list', st, json.dumps(items)[:700])
if 'vendor' not in S:
    r = req('POST', '/api/parts-catalogue/add-vendor', {"name": VNAME, "address_1": "1 ZZAUTOTEST Way", "city": "Calgary", "state_or_province": "Alberta",
            "postal_code": "T2C 4M5", "telephone": "(403) 555-0102", "email": "sv11315.staging.vc@zzautotest.test", "credit_limit": 25000, "credit_term": "Net 30", "tax_id": "0c47b1fb-38bb-4788-8719-6900c365e34c"})
    print('add-vendor', r[0], str(r[1])[:300])
    if r[0] in (200, 201) and isinstance(r[1], dict) and isinstance(r[1].get('data'), dict): vid = r[1]['data']['vendor_id']
    else:  # created by an earlier attempt (its 200 answer had a list body) or duplicate: find it by name (resumable)
        st, j = req('GET', '/api/parts-catalogue/vendors?search=' + VNAME.replace(' ', '%20'))
        vid = [v for v in j['data']['collection'] if v['name'] == VNAME][0]['id']
    acc = ok(req('GET', f'/api/parts-catalogue/vendor/{vid}'), 'vendor view')['vendor']['vendor_account_id']
    S['vendor'] = {'id': vid, 'name': VNAME, 'account': acc, 'created_utc': now()}; save()
print('vendor', S['vendor'])
if 'vendor_credit' not in S:
    x = ok(req('POST', '/api/parts-catalogue/vendor/credit/create', {'vendorId': S['vendor']['id'], 'amount': 7, 'memo': 'ZZAUTOTEST staging VC dated today (SV-11315 before-feature)'}), 'vendor credit')
    S['vendor_credit'] = {'resp': x if not isinstance(x, dict) else {k: x[k] for k in list(x)[:12]}, 'amount': 7, 'created_utc': now()}; save()
print('vendor_credit', S['vendor_credit'])
st, u = req('GET', f"/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account?accountId={S['vendor']['account']}&pagination[page]=1&pagination[rowsPerPage]=100")
print('vendor unpaid', st, json.dumps(u)[:700])
# 2: a credit memo dated TODAY (5 minutes ago), so C1062590 can run as soon as the feature lands — the new date picker
# offers no day after today (SV-11315 shared notes, comment 80616), so CM-4540 (14 Nov) can only be checked from 14 Nov.
if 'credit_memo_today' not in S:
    t = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=5)).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    body = {'customerAccountId': S['customer']['account'], 'amount': 3, 'reason': 'ZZAUTOTEST staging before-feature capture for C1062590, dated today (SV-11315)', 'originDate': t}
    x = ok(req('POST', '/api/credit-memos', body), 'credit memo today')
    S['credit_memo_today'] = {'id': x.get('creditMemoId') or x.get('id'), 'number': x.get('creditNumber'), 'amount': 3, 'origin_date_sent': t, 'created_utc': now()}; save()
print('credit_memo_today', S['credit_memo_today'])
st, u = req('GET', f"/api/customer-account/list-unpaid-transaction?accountId={S['customer']['account']}&pagination[page]=1&pagination[rowsPerPage]=100")
for x in u['response']['collection'] if 'response' in u else u['data']['response']['collection']:
    print('  unpaid:', x['credit_display_number'], x['amount'], x['date'], x['status'])
S['vendor_credit'].update({'id': '01c19b8b-3dd4-48d8-89f1-07199951ffcc', 'number': 'C-13911', 'date': '2026-11-12 06:29:54'}); save()
