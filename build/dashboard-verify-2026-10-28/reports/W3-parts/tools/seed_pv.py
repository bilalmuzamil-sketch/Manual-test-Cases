"""W3 seeding in DVI Test (quiet location): ZZAUTOTEST records for Parts Velocity / Inventory Value known-data checks.
State (ids only, no secrets) in /tmp/cln/w3/seed.json and copied to ../results-seeded-records.json by the caller.
Usage: python3 seed_pv.py <step>"""
from common import *
WID = '39522bc6-abca-4f67-bd12-2840043c2d68'; H = {'X-Location-ID': WID}
ST = '/tmp/cln/w3/seed.json'
S = json.load(open(ST)) if os.path.exists(ST) else {}
def save(): json.dump(S, open(ST, 'w'), indent=1)
def call(m, p, b=None):
    c, r = curl(m, p, b, extra_headers=H)
    print(m, p, '->', c, json.dumps(r)[:600]); return c, r
def d(r): return (r or {}).get('data') or {}
step = sys.argv[1]
change_loc(WID)
if step == 'parts':
    tag = S.setdefault('tag', dt.datetime.utcnow().strftime('%m%d%H%M'))
    st, cats = curl('GET', '/api/inventory/categories?limit=500', extra_headers=H)
    cat = [c for c in cats['data']['collection'] if c['label'] == 'HD-Filters'][0]['value']
    S['category'] = cat
    st, bins = curl('GET', '/api/inventory/bin-locations', extra_headers=H)
    b = [x for x in bins['data']['binLocations'] if x['isDefault']][0]; S['bin'] = b
    for k, pn, desc in (('cat1', f'ZZAUTOTEST-PV1-{tag}', 'ZZAUTOTEST PV stocked part'), ('cat2', f'ZZAUTOTEST-SO1-{tag}', 'ZZAUTOTEST PV special order receive later'),
                        ('cat3', f'ZZAUTOTEST-SO2-{tag}', 'ZZAUTOTEST PV special order received')):
        c, r = call('POST', '/api/parts-catalogue/add-catalogue-part', {'name': desc, 'partNumber': pn, 'category_id': cat, 'manufacturerId': None, 'tags': []})
        S[k] = {'id': d(r).get('catalogue_part_id') or d(r).get('id'), 'pn': pn}
    c, r = call('POST', '/api/inventory/parts/create', {'catalogPartId': S['cat1']['id'], 'categoryId': cat, 'vendorId': None, 'quantity': 10, 'cost': 20, 'sellPrice': 30,
               'min': 2, 'max': 20, 'manufacturerId': None, 'coreCharge': None, 'environmentalCharge': None, 'tags': [], 'isFixedPrice': False, 'gridLocation': '',
               'bins': [{'id': b['id'], 'quantity': 10, 'isDefault': True}]})
    S['inv1'] = d(r).get('part_id') or d(r).get('id'); save()
elif step == 'customer':
    c, r = call('POST', '/api/customers/create', {'name': 'ZZAUTOTEST PV Customer'}); cid = d(r).get('company_id') or d(r).get('id')
    c, r = call('POST', '/api/contacts/create', {'company_id': cid, 'first_name': 'ZZAUTOTEST PV', 'last_name': 'Contact'}); ct = d(r).get('contact_id') or d(r).get('id')
    c, r = call('POST', '/api/vehicles/create', {'company_id': cid, 'customer_id': ct, 'unit': 'ZZ-PV1'}); vid = d(r).get('vehicle_id') or d(r).get('id')
    S['customer'] = {'company_id': cid, 'contact_id': ct, 'vehicle_id': vid}; save()
elif step == 'wo':
    C = S['customer']
    c, r = call('POST', '/api/work-orders/create', {'vehicle_id': C['vehicle_id'], 'company_id': C['company_id'], 'workplace_id': WID, 'is_vehicle_here': True, 'type': 'service', 'note': 'ZZAUTOTEST PV', 'mileage': 1000})
    S['wo'] = d(r).get('work_order_id') or d(r).get('id'); save()
    st, lt = curl('GET', '/api/labour-types', extra_headers=H)
    print('labour types', st, json.dumps(lt)[:300])
elif step == 'raw':
    c, r = call(sys.argv[2], sys.argv[3], json.loads(sys.argv[4]) if len(sys.argv) > 4 else None)
save()
