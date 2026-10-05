#!/usr/bin/env python3
"""TURN THE HAND-MADE STAGING RECORDS INTO A SEEDING PLAN — ../seeding/seed-manifest-fixtures.json.

🔴 WHY (2026-10-05). About twenty families of records the checks search for were made BY HAND on
staging on 2026-09-29 and are in no seeding plan: "Rowcheck Hidden Fields Holdings" with its Quietline
vehicle and part sale, "ZZACC José Martínez", the ZZPUNC and ZZVORTAC companies, 22 "ZZBROAD Widget"
parts, a supplier contact "Delacroixson", a ZZNOUNIT work order... A reset of the branch to its
standard starting copy removes them, and every check built on them stands down from then on.

This reads each family from staging AS IT IS NOW and writes plan entries that re-create it exactly,
so the checks keep their search words and every run can rebuild the data after a reset. Each entry is
a COPY OF A PROVEN ENTRY OF THE SAME KIND (seed-manifest-e2e.json / -gs-v2.json) with the live values
swapped in - the create route, the repair rule and the lookup that already work are kept, not
re-invented. Records an existing plan already creates are left out.

    SEED_PROFILE=/path/to/staging/cookies.json python3 tools/codify_fixtures.py [--dry]

Read-only against the environment. Re-run it only to capture a NEW hand-made family; the plan it
writes is the thing to maintain afterwards.
"""
import copy, json, os, re, sys, urllib.parse, urllib.request, ssl
HERE = os.path.dirname(os.path.abspath(__file__))
SEED = os.environ.get('GS_SEEDING_DIR') or os.path.join(HERE, '..', '..', 'seeding')
OUT = os.path.join(SEED, 'seed-manifest-fixtures.json')
sys.path.insert(0, HERE)
from resolve_terms import index  # noqa: E402

# The hand-made families, by the word every member carries.
WORDS = ['Rowcheck', 'ZZACC', 'ZZPUNC', 'ZZVORTAC', 'ZZOPENCOUNT', 'ZZNOUNIT', 'ZZBROAD', 'ZZSOFTHIY', 'ZZHIDDEN',
         'Delacroixson', 'zzresultintegrity']

P = json.load(open(os.environ.get('SEED_PROFILE', '/tmp/shopview/staging/cookies.json')))
CK = '; '.join(f'{k}={P[k]}' for k in ('sv_sso_session', 'PHPSESSID') if P.get(k))
CA = '/root/.ccr/ca-bundle.crt'
CTX = ssl.create_default_context(cafile=CA) if os.path.exists(CA) else ssl.create_default_context()

def get(path):
    req = urllib.request.Request(f"https://{P['api']}{path}", headers={'Cookie': CK, 'Accept': 'application/json',
                                 'User-Agent': 'Mozilla/5.0', 'Origin': f"https://{P['host']}"})
    for _ in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
                return json.loads(r.read().decode() or '{}')
        except Exception as e:
            last = e
    raise SystemExit(f'GET {path} failed: {last}')

q = urllib.parse.quote
def coll(j, *keys):
    d = (j or {}).get('data') or {}
    for k in keys or ('collection',):
        if isinstance(d, dict) and d.get(k) is not None: return d[k]
    return d if isinstance(d, list) else []

# ── templates: a proven entry of each kind ───────────────────────────────────────────────────────
E2E = json.load(open(os.path.join(SEED, 'seed-manifest-e2e.json')))
GS2 = json.load(open(os.path.join(SEED, 'seed-manifest-gs-v2.json')))
T = {r['key']: r for r in E2E['records']}
TPL = {'customer': T['e2e_cust_long'], 'contact': T['e2e_lr_owner_contact'], 'vehicle': T['e2e_lr_asset_1'],
       'vendor': T['e2e_lr_vendor_2'], 'cat': T['e2e_lr_cat_1'], 'inv': T['e2e_lr_inv_1'], 'ps': T['e2e_lr_ps_1'],
       'wo': next(r for r in GS2['records'] if r['find'].get('mode') == 'ids')}

SEEDED = set()
for _k, vals in index(exclude=('seed-manifest-fixtures.json',)):
    SEEDED |= {re.sub(r'[^a-z0-9]', '', v.lower()) for v in vals if isinstance(v, str)}
seeded = lambda *v: all(x and re.sub(r'[^a-z0-9]', '', str(x).lower()) in SEEDED for x in v)

def slug(s): return re.sub(r'[^a-z0-9]+', '_', str(s).lower()).strip('_')[:40]
OUTREC, KEYS = [], set()
def add(kind, key, rec, why):
    key = f'fx_{kind}_{slug(key)}'
    n = 2
    while key in KEYS: key = f'{key.rsplit("__", 1)[0]}__{n}'; n += 1
    KEYS.add(key)
    rec = {**rec, 'key': key, 'serves': [], '_why': why}
    rec.pop('depends_on', None)
    OUTREC.append(rec)
    return key

def customer(row):
    r = copy.deepcopy(TPL['customer'])
    r['find'] = {**r['find'], 'value': row['name']}
    p = {'name': row['name'], 'city': row.get('city'), 'state_or_province': row.get('state_or_province'),
         'postal_code': row.get('postal_code'), 'country_code': row.get('country_code') or 'US',
         'address': row.get('address_1'), 'phone': row.get('telephone')}
    if row.get('address_2'): p['address_2'] = row['address_2']
    r['create'] = {**r['create'], 'payload': {k: v for k, v in p.items() if v}}
    r['verify'] = [f for f in ('name', 'city', 'address', 'phone', 'address_2', 'state_or_province', 'postal_code') if p.get(f)]
    return add('cust', row['name'], r, 'hand-made on staging 2026-09-29; captured by tools/codify_fixtures.py')

def contact(parent_key, c):
    r = copy.deepcopy(TPL['contact'])
    r['find'] = {**r['find'], 'parent': parent_key, 'value': c['first_name'],
                 'also': {k: c[k] for k in ('last_name', 'email') if c.get(k)}}
    p = {k: c.get(k) for k in ('first_name', 'last_name', 'title', 'telephone', 'email') if c.get(k)}
    r['create'] = {**r['create'], 'payload': p, 'inject': {'company_id': parent_key}}
    write = copy.deepcopy(r.get('write') or {})
    if write.get('also'): write['also'] = {k: (parent_key if v == r.get('depends_on', 'e2e_lr_owner') or v == 'e2e_lr_owner' else v) for k, v in write['also'].items()}
    if write: r['write'] = json.loads(json.dumps(write).replace('e2e_lr_owner', parent_key))
    r['verify'] = [f for f in ('first_name', 'last_name') if p.get(f)]
    return add('contact', f"{c.get('first_name')}_{c.get('last_name')}", r, 'a contact of a hand-made customer')

def vehicle(company_key, contact_key, v):
    r = copy.deepcopy(TPL['vehicle'])
    ident = ('vin', v.get('vin')) if v.get('vin') else ('unit', v.get('unit')) if v.get('unit') else ('licence_plate', v.get('licence_plate'))
    r['find'] = {**r['find'], 'field': ident[0], 'value': ident[1]}
    r['read_as'] = {**(r.get('read_as') or {}), 'maker_name': 'vehicle_make', 'model_name': 'vehicle_model'}
    p = {'maker_name': v.get('vehicle_make'), 'model_name': v.get('vehicle_model'), 'year': v.get('year'),
         'unit': v.get('unit'), 'vin': v.get('vin'), 'licence_plate': v.get('licence_plate')}
    r['create'] = {**r['create'], 'payload': {k: x for k, x in p.items() if x not in (None, '')},
                   'inject': {k: x for k, x in (('customer_id', contact_key), ('company_id', company_key)) if x}}
    r['verify'] = [f for f in ('vin', 'unit', 'licence_plate') if p.get(f)]
    return add('veh', ident[1], r, 'a vehicle of a hand-made customer')

def vendor(row):
    r = copy.deepcopy(TPL['vendor'])
    field, value = ('email', row['email']) if row.get('email') else ('name', row['name'])
    r['find'] = {**r['find'], 'field': field, 'value': value,
                 'also': {k: row[k] for k in ('name', 'address_1') if row.get(k) and k != field}}
    p = {k: row.get(k) for k in ('name', 'address_1', 'address_2', 'city', 'state_or_province', 'postal_code',
                                 'telephone', 'email', 'credit_term', 'credit_limit') if row.get(k) not in (None, '')}
    r['create'] = {**r['create'], 'payload': p}
    r['verify'] = [f for f in ('name', 'email', 'address_1', 'address_2', 'telephone') if p.get(f)]
    return add('vendor', f"{row['name']}_{row.get('email') or ''}", r, 'hand-made supplier on staging 2026-09-29')

def vendor_contact(vendor_key, c):
    r = {'type': 'VendorContact',
         'find': {'mode': 'child', 'parent': vendor_key, 'also': {k: c[k] for k in ('last_name',) if c.get(k)},
                  'view': '/api/parts-catalogue/list-vendor-contacts?vendorId={id}&pagination%5BrowsPerPage%5D=1000',
                  'path': 'collection', 'field': 'first_name', 'value': c['first_name']},
         'create': {'endpoint': '/api/parts-catalogue/add-vendor-contact',
                    'payload': {k: c.get(k) for k in ('first_name', 'last_name', 'title', 'telephone', 'email', 'department') if c.get(k)},
                    'inject': {'vendor_id': vendor_key},
                    '_why': 'measured 2026-10-05 through the supplier page\'s Add Contact form; Title and Department are required'},
         'verify': ['first_name', 'last_name']}
    r['create']['payload'].setdefault('department', 'preferred')
    return add('vcontact', f"{c.get('first_name')}_{c.get('last_name')}", r, 'a supplier contact made by hand')

def parts(word):
    made = []
    cats = coll(get(f'/api/parts-catalogue/catalogue-parts?search={q(word)}&limit=100'))
    for c in cats:
        if word.lower() not in f"{c.get('name')} {c.get('part_number')}".lower() or seeded(c.get('part_number')): continue
        r = copy.deepcopy(TPL['cat'])
        r['find'] = {**r['find'], 'value': c['part_number']}
        r['create'] = {**r['create'], 'payload': {k: c.get(k) for k in ('name', 'part_number') if c.get(k)}
                       | ({'tags': c['tags']} if c.get('tags') else {})}
        ck = add('cat', c['part_number'], r, 'hand-made catalogue part on staging 2026-09-29')
        inv = coll(get(f'/api/inventory/parts?search={q(c["part_number"])}&limit=10'))
        inv = next((x for x in inv if x.get('part_number') == c['part_number']), None)
        if inv:
            r2 = copy.deepcopy(TPL['inv'])
            r2['find'] = {**r2['find'], 'value': c['part_number']}
            r2['create'] = copy.deepcopy(r2['create'])
            r2['create']['payload'] = {**r2['create']['payload'], 'quantity': inv.get('quantity') or 1,
                                       'tags': inv.get('tags') or []}
            r2['create']['resolve_by_example']['catalog_part_id']['value'] = c['part_number']
            r2['create']['resolve_nested']['bins']['template'][0]['quantity'] = inv.get('quantity') or 1
            add('inv', c['part_number'], r2, 'its stocked copy, in the seeding shop')
        made.append(ck)
    return made

def main():
    dry = '--dry' in sys.argv
    seen_c, seen_v = set(), set()
    for w in WORDS:
        # customers, with their contacts and vehicles
        for row in coll(get(f'/api/customers?search={q(w)}&limit=100')):
            if row['id'] in seen_c or w.lower() not in json.dumps(row).lower(): continue
            seen_c.add(row['id'])
            if seeded(row['name']): continue
            ck = customer(row)
            view = (get(f"/api/customers/view/{row['id']}").get('data') or {}).get('company') or {}
            ckeys = [contact(ck, c) for c in view.get('contacts') or [] if c.get('first_name')]
            for v in view.get('vehicles') or []:
                full = next((x for x in coll(get(f"/api/vehicles?search={q(v.get('vin') or v.get('unit') or '')}&limit=10"))
                             if x.get('id') == v.get('id')), v)
                if not seeded(full.get('vin') or full.get('unit')):
                    vk = vehicle(ck, ckeys[0] if ckeys else None, full)
                    for ps in coll(get(f"/api/part-sales?search={q(full.get('vin') or '')}"), 'partSales'):
                        if full.get('vin') and ps.get('vehicleVin') == full['vin']:
                            r = copy.deepcopy(TPL['ps'])
                            r['find'] = {**r['find'], 'field': 'vehicleVin', 'value': full['vin']}
                            r['create'] = {**r['create'], 'inject': {'company_id': ck, **({'customer_id': ckeys[0]} if ckeys else {}), 'vehicle_id': vk}}
                            add('ps', full['vin'], r, 'a part sale on that vehicle (part-sales create accepts vehicle_id; measured 2026-10-05)')
                    wos = [i for g in (get(f"/api/search?q={q(row['name'])}").get('data') or {}).get('groups', [])
                           if g['type'] == 'work_orders' for i in g['items'] if row['name'] in str(i.get('secondary'))]
                    if wos:
                        r = copy.deepcopy(TPL['wo'])
                        r['count'] = len(wos)
                        r['find'] = {**r['find'], 'ids': [], 'discover': {'search': row['name'], 'group': 'work_orders',
                                     'match_secondary': row['name'], '_why': 'adopt the work orders already there'}}
                        r['create'] = {k: v for k, v in r['create'].items() if not k.startswith(('_', '\U0001f534'))}
                        r['create'].update({'inject': {'company_id': ck, 'vehicle_id': vk, **({'customer_id': ckeys[0]} if ckeys else {})},
                                            'repeat': len(wos)})
                        add('wo', row['name'], r, f'{len(wos)} work order(s) for this customer')
        # suppliers, with their contacts
        hits = coll(get(f'/api/parts-catalogue/vendors?search={q(w)}&limit=100'))
        for g in (get(f'/api/search?q={q(w)}').get('data') or {}).get('groups', []):
            if g['type'] != 'vendors': continue
            for i in g.get('items') or []:
                hits += [x for x in coll(get(f"/api/parts-catalogue/vendors?search={q(i['primary'])}&limit=100"))
                         if x.get('id') == i.get('id')]
        for row in hits:
            if row['id'] in seen_v: continue
            seen_v.add(row['id'])
            contacts = coll(get(f"/api/parts-catalogue/list-vendor-contacts?vendorId={row['id']}&pagination%5BrowsPerPage%5D=1000"))
            if seeded(row['name'], row.get('email')) and not contacts: continue
            if w.lower() not in (json.dumps(row) + json.dumps(contacts)).lower(): continue
            vk = vendor(row) if not seeded(row['name'], row.get('email')) else None
            if vk is None:      # an existing plan makes the supplier; only its contact is hand-made - make our own twin
                vk = vendor({**row, 'email': f"fx.{slug(row['name'])}@zze2e.test"})
            for c in contacts:
                if c.get('first_name'): vendor_contact(vk, c)
        parts(w)
    man = {'_README': 'GENERATED from staging by e2e/tools/codify_fixtures.py on capture day, then maintained here. '
                      'The records the checks search for that were once made by hand (2026-09-29), so a reset of '
                      'the branch no longer loses them. Same engine, same rules as every other plan.',
           'environment': E2E.get('environment'), 'records': OUTREC}
    kinds = {}
    for r in OUTREC: kinds[r['type']] = kinds.get(r['type'], 0) + 1
    print(f'{len(OUTREC)} entries: {kinds}')
    if not dry:
        json.dump(man, open(OUT, 'w'), indent=1, ensure_ascii=False); open(OUT, 'a').write('\n')
        print(f'written: {OUT}')

if __name__ == '__main__':
    main()
