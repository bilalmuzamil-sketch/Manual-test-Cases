#!/usr/bin/env python3
"""Staging preparation for V1R-32, V1R-53 and V1R-87 - the QA recipe (../unblock-2026-11-11/) on staging.
Every write is logged to oplog.jsonl (utc · op · target · HTTP · read-back verification).
    python3 staging_prep.py roles     # the two custom roles V1R-32 / V1R-53 use (tech is NOT changed here)
    python3 staging_prep.py locc      # location C + a customer + one open $87.00 invoice there (needs the seed's anchor)
    python3 staging_prep.py show      # read-only: what exists
Endpoints, all from the front end (Rule 115): POST roles, GET organizations/{org}/roles, GET roles/{id}
(app/src/api/administration), POST workplaces/create (administration/index.ts:117, payload CreateWorkplacePayload,
AdministrationModel.ts:976), POST iam/change-location (auth/index.ts:62). Tech's role is changed only during the run,
with ../unblock-2026-11-11/tools/ops.py's set_tech_role recipe, and restored to tech-before-staging.json after."""
import datetime, json, os, sys
from zoneinfo import ZoneInfo
HERE = os.path.dirname(os.path.abspath(__file__)); TOOLS = os.path.join(os.path.dirname(HERE), 'tools')
sys.path.insert(0, TOOLS)
from api import call
import seedlib
ENV = 'staging'; ORG = 'd55bc308-e61a-438d-b5f1-c7a73c89d49f'
RP = '7724fb7f-dba8-4672-a168-314c0460c0ab'   # reportsPageAccess - same id on staging (read off role 'ZZAUTOTEST Full Access', 12 Nov 2026)
A = ('b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi')
C_NAME = 'ZZAUTOTEST V1R-87 Location C'
LOG = os.path.join(HERE, 'oplog.jsonl'); STATE = os.path.join(HERE, 'prep-state.json')
def now(): return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def log(op, target, status, verification, **extra):
    rec = {'utc': now(), 'op': op, 'target': target, 'http': status, 'verification': verification, **extra}
    open(LOG, 'a').write(json.dumps(rec) + '\n'); print(json.dumps(rec)[:300])
def state(): return json.load(open(STATE)) if os.path.exists(STATE) else {}
def put(k, v): s = state(); s[k] = v; json.dump(s, open(STATE, 'w'), indent=1, sort_keys=True)
def roles(): return {r['name']: r for r in call(ENV, f'/api/organizations/{ORG}/roles?page=1&pageSize=100')['json']['data']}
def ensure_role(name, desc):
    r = roles()
    if name in r: rid = r[name]['id']; log('create_role (skip, exists)', name, 200, 'exists', role_id=rid)
    else:
        x = call(ENV, '/api/roles', 'POST', {'name': name, 'description': desc, 'fePermissions': [RP], 'organization': ORG, 'viewMode': None,
                 'crossToggles': {'seeFinancialData': False, 'seeApArData': False, 'viewHistoryLogs': False}, 'templateId': None})
        rid = ((x['json'] or {}).get('data') or {}).get('id') or roles().get(name, {}).get('id')
        log('create_role', name, x['status'], 'created' if rid else 'FAILED ' + x['raw'][:300], role_id=rid)
    d = call(ENV, f'/api/roles/{rid}')['json']['data']
    got = sorted(p['code'] for p in d['fe_permissions'])
    ok = got == ['reportsPageAccess'] and not any(d['cross_toggles'].values())
    log('read_back_role', name, 200, f"perms={got} cross={d['cross_toggles']} {'OK' if ok else 'MISMATCH'}", role_id=rid)
    return rid
def switch(wid, tz, label):
    r = call(ENV, '/api/iam/change-location', 'POST', {'workplace_id': wid, 'workplace_timezone': tz}, allow_change_location=True)
    log('change_location (QA lead session)', label, r['status'], 'ok' if r['status'] in (200, 201) else r['raw'][:200])
    if r['status'] not in (200, 201): raise SystemExit('switch failed')
def my_wp(): return {w['id']: w for w in (lambda j: j.get('data', j))(call(ENV, '/api/staff/my-workplaces')['json']).get('collection', [])}
def all_wp():
    d = call(ENV, '/api/workplaces')['json']['data']; return d.get('collection', d)
def locc():
    L = seedlib.Ledger(ENV)
    if not L.get('anchor_dates'): raise SystemExit('seed first: no anchor in seeded-staging.json')
    c = next((w for w in all_wp() if w['name'] == C_NAME), None)
    if not c:
        body = {'name': C_NAME, 'address_1': '87 ZZAUTOTEST Way', 'address_2': None, 'city': 'Calgary', 'state_or_province': 'Alberta',
                'postal_code': 'T2C 4M5', 'country_code': 'CA', 'telephone': '(403) 555 - 0187', 'timezone': 'America/Edmonton',
                'color': '#7B1FA2', 'shop_id': '2', 'remit_to': None, 'shop_supplies_charge': 0, 'min_shop_supplies_charge': 0,
                'max_shop_supplies_charge': None, 'shopSupplyPercentageEnabled': False, 'remit_to_type': 1,
                'sales_tax_rounding_mode': 'line_by_line', 'salesTaxRoundingMode': 'line_by_line',
                'tax': {'id': '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', 'name': 'GST'}}
        x = call(ENV, '/api/workplaces/create', 'POST', body)
        c = next((w for w in all_wp() if w['name'] == C_NAME), None)
        log('create_workplace', C_NAME, x['status'], f"read back in workplace list: {bool(c)}" + ('' if c else ' ' + x['raw'][:300]), workplace_id=c and c['id'])
        if not c: raise SystemExit('location C not created')
    put('location_c', {'id': c['id'], 'name': C_NAME, 'timezone': c.get('timezone'), 'shop_id': c.get('shop_id')})
    enrolled = c['id'] in my_wp()
    log('read_qa_lead_enrolment_at_C', C_NAME, 200, f'QA lead enrolled at C: {enrolled}')
    if not enrolled: raise SystemExit('the QA lead is not enrolled at C, so its invoice cannot be made by switching there - stop and report')
    inv = L.get('inv:V1R87C')
    if not (inv and inv.get('invoice_id')):
        d = datetime.date.fromisoformat(L.get('anchor_dates')['B']) - datetime.timedelta(days=10)   # C is on Edmonton, like B
        created_on = datetime.datetime.combine(d, datetime.time(12, 0), ZoneInfo('America/Edmonton')).astimezone(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
        switch(c['id'], 'America/Edmonton', C_NAME)
        try:
            seedlib.CUR_LT.clear(); seedlib.CUR_LT['fixed_total'] = True
            cu = seedlib.customer(ENV, L, 'V1R87C', 'ZZAUTOTEST AR V1R-87 Location C')
            log('create_customer', 'ZZAUTOTEST AR V1R-87 Location C', 201, f"company_id={cu['id']} account={cu['account']}")
            inv = seedlib.invoice(ENV, L, 'V1R87C', cu, 87, created_on)
            w = (call(ENV, f"/api/work-orders/view/{inv['wo']}")['json'] or {}).get('data', {}).get('work_order', {})
            log('create_invoice', 'ZZAUTOTEST V1R-87 Location C invoice', 200,
                f"read back: WO {w.get('number')} workplace={w.get('workplace_id')} status={w.get('status')} total={w.get('total_cost')} created_on={created_on}")
        finally:
            switch(A[0], A[1], 'Staging Heavy Duty - 9919 (back)')
    put('location_c_invoice', {k: inv.get(k) for k in ('wo', 'wo_number', 'invoice_id', 'total', 'created_on')})
if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'show'
    if cmd == 'roles':
        put('roles', {'V1R-32': ensure_role('ZZAUTOTEST V1R-32 Reports on Customers View off', 'ZZAUTOTEST C1079005: Reports page access ON, Customers View OFF (nothing else)'),
                      'V1R-53': ensure_role('ZZAUTOTEST V1R-53 Reports page access only', 'ZZAUTOTEST C1079026: only Reports page access')})
    elif cmd == 'locc': locc()
    print(json.dumps(state(), indent=1))
