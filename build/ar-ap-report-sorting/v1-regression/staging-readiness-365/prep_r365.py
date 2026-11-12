#!/usr/bin/env python3
"""Staging/QA preparation for the 365 run-557 tests that are NOT records of a customer or vendor (those are seed.py
--universe r365). Every write is logged to oplog-r365.jsonl (utc · op · target · HTTP · read-back verification).
    python3 prep_r365.py staging locc      # the universe's own third location (long name), recorded as loc:C in the r365 ledger
    python3 prep_r365.py staging roles     # the ZZAUTOTEST custom roles the permission tests sign in with (nobody is signed in)
    python3 prep_r365.py staging nine      # RUN LAST: extra locations + one open invoice each, so A/R has documents at 9+ locations
    python3 prep_r365.py staging show      # read-only
Endpoints from the front end (Rule 115): POST workplaces/create (app/src/api/administration/index.ts:117), GET workplaces,
GET staff/my-workplaces (auth/index.ts:64), POST roles, GET organizations/{org}/roles, GET roles/{id} (administration)."""
import datetime, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); TOOLS = os.path.join(HERE, '..', 'live-run-2026-11-11', 'tools')
sys.path.insert(0, TOOLS)
from api import call
import seedlib
ENV = sys.argv[1]; CMD = sys.argv[2] if len(sys.argv) > 2 else 'show'
LOG = os.path.join(HERE, f'oplog-r365-{ENV}.jsonl')
C_NAME = 'ZZAUTOTEST R365 Location C with a name longer than the chip'
def now(): return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
def log(op, target, status, verification, **extra):
    rec = {'utc': now(), 'op': op, 'target': target, 'http': status, 'verification': verification, **extra}
    open(LOG, 'a').write(json.dumps(rec, ensure_ascii=False) + '\n'); print(json.dumps(rec, ensure_ascii=False)[:300])
def all_wp():
    d = call(ENV, '/api/workplaces')['json']['data']; return d.get('collection', d)
def my_wp(): return {w['id']: w for w in (lambda j: j.get('data', j))(call(ENV, '/api/staff/my-workplaces')['json']).get('collection', [])}
def ensure_location(name, L, key):
    c = next((w for w in all_wp() if w['name'] == name), None)
    if not c:
        body = {'name': name, 'address_1': '365 ZZAUTOTEST Way', 'address_2': None, 'city': 'Calgary', 'state_or_province': 'Alberta',
                'postal_code': 'T2C 4M5', 'country_code': 'CA', 'telephone': '(403) 555 - 0365', 'timezone': 'America/Edmonton',
                'color': '#00897B', 'shop_id': '2', 'remit_to': None, 'shop_supplies_charge': 0, 'min_shop_supplies_charge': 0,
                'max_shop_supplies_charge': None, 'shopSupplyPercentageEnabled': False, 'remit_to_type': 1,
                'sales_tax_rounding_mode': 'line_by_line', 'salesTaxRoundingMode': 'line_by_line',
                'tax': {'id': '819f3c25-5d9b-4bc6-9ddc-4e284ebe2f6b', 'name': 'GST'}}
        x = call(ENV, '/api/workplaces/create', 'POST', body)
        c = next((w for w in all_wp() if w['name'] == name), None)
        log('create_workplace', name, x['status'], f"read back in workplace list: {bool(c)}" + ('' if c else ' ' + x['raw'][:300]), workplace_id=c and c['id'])
        if not c: raise SystemExit('location not created')
    enrolled = c['id'] in my_wp()
    log('read_enrolment', name, 200, f'signed-in user enrolled: {enrolled}', workplace_id=c['id'])
    if not enrolled: raise SystemExit('not enrolled at the new location, so documents cannot be made there by switching - stop and report')
    rec = {'id': c['id'], 'name': name, 'timezone': c.get('timezone') or 'America/Edmonton', 'shop_id': c.get('shop_id'), 'created_utc': now()}
    if not L.get(key): L.put(key, rec)
    return L.get(key)
if __name__ == '__main__':
    L = seedlib.Ledger(ENV, 'r365')
    if CMD == 'locc': ensure_location(C_NAME, L, 'loc:C')
    elif CMD == 'show':
        print(json.dumps({k: v for k, v in L.d.items() if k.startswith(('loc', 'role'))}, indent=1, ensure_ascii=False))
    else: raise SystemExit('unknown command ' + CMD)
