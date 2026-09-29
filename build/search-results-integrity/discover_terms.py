#!/usr/bin/env python3
"""Finds a REAL, VERIFIED search term on the live environment for each case that needs one.

A case that says "type a fragment of the part number" is not runnable - the tester has to go and
find the data first, and most of them will pick something that also appears in the name, which
makes the case prove nothing (Rule 110's attribution trap). So: pull real records off the list
endpoints, search a distinctive value from the target field, and KEEP IT ONLY IF the response says
the match came from that field. The term written into the workbook is therefore proven, not guessed.

Output: discovered-terms.json, consumed by build_workbook.py.
"""
import sys, os, json, importlib.util, collections

SEED = '/home/user/Manual-test-Cases/build/global-search/seeding'
sys.argv = ['seed.py']
spec = importlib.util.spec_from_file_location('seedmod', f'{SEED}/seed.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
call = m.call

def search(q):
    r = call('/api/search?q=' + str(q).replace(' ', '%20').replace('#', '%23').replace('&', '%26'))
    return ((r['json'] or {}).get('data') or {}).get('groups') or []

def rows(q, group=None):
    out = []
    for g in search(q):
        if group and g['type'] != group: continue
        for i in g.get('items') or []:
            out.append((g['type'], i))
    return out

def listing(ep):
    r = call(ep)
    d = (r['json'] or {}).get('data') if isinstance(r['json'], dict) else None
    if isinstance(d, dict):
        for k in ('collection', 'items', 'results'):
            if isinstance(d.get(k), list): return d[k]
    return d if isinstance(d, list) else []

def verify(term, group, want_field):
    """Search `term`; return the row whose match.field is want_field, else None."""
    for gtype, i in rows(term, group):
        mt = i.get('match') or {}
        if str(mt.get('field')) == want_field:
            return {'term': str(term), 'group': gtype, 'field': want_field,
                    'kind': mt.get('kind'), 'highlight': mt.get('highlight'),
                    'primary': i.get('primary'), 'secondary': i.get('secondary')}
    return None

FOUND, MISSING = {}, []

def try_field(key, group, want_field, candidates, note=''):
    for c in candidates:
        c = str(c or '').strip()
        if len(c) < 3: continue
        hit = verify(c, group, want_field)
        if hit:
            hit['note'] = note
            FOUND[key] = hit
            print(f"  ✅ {key:34} type {c!r:26} -> {want_field} ({hit['kind']})")
            return True
    MISSING.append(key)
    print(f"  ❌ {key:34} no value on this environment matched {want_field}")
    return False

print('=== vehicles')
veh = listing('/api/vehicles')
print(f"  {len(veh)} vehicles")
try_field('assets.licence_plate', 'assets', 'licence_plate',
          [v.get('licence_plate') for v in veh if v.get('licence_plate')][:12])
try_field('assets.unit', 'assets', 'unit',
          [v.get('unit') for v in veh if v.get('unit')][:12])
for vinkey in ('vin', 'serial_number', 'vin_serial', 'serial'):
    vals = [v.get(vinkey) for v in veh if v.get(vinkey)]
    if vals:
        try_field('assets.vin', 'assets', vinkey, vals[:12]); break
else:
    # the VIN may be under another name - probe the row payload for a 17-char alnum
    cands = []
    for v in veh:
        for k, val in v.items():
            if isinstance(val, str) and len(val) == 17 and val.isalnum(): cands.append(val)
    if cands:
        for f in ('vin', 'serial_number'):
            if try_field('assets.vin', 'assets', f, cands[:8]): break
    else:
        MISSING.append('assets.vin'); print('  ❌ assets.vin                       no 17-char VIN on any listed vehicle')

print('=== customers')
cust = listing('/api/customers')
print(f"  {len(cust)} customers")
try_field('customers.phone', 'customers', 'phone',
          [c.get('telephone') or c.get('phone') for c in cust][:14])
try_field('customers.address_line_2', 'customers', 'address_line_2',
          [c.get('address_2') for c in cust if c.get('address_2')][:14])
try_field('customers.city', 'customers', 'city',
          [c.get('city') for c in cust if c.get('city')][:10])
try_field('customers.postal_code', 'customers', 'postal_code',
          [c.get('postal_code') or c.get('zip') for c in cust][:14])
# contact fields need the company view
cc = 0
for c in cust[:25]:
    if cc >= 3: break
    v = call(f"/api/customers/view/{c['id']}")
    comp = (((v['json'] or {}).get('data') or {}).get('company') or {})
    for ct in (comp.get('contacts') or [])[:4]:
        for key, field, val in (('customers.contact_phones', 'contact_phones', ct.get('telephone')),
                                ('customers.contact_emails', 'contact_emails', ct.get('email')),
                                ('customers.contact_names', 'contact_names', ct.get('first_name'))):
            if key not in FOUND and val:
                if try_field(key, 'customers', field, [val]): cc += 1

print('=== parts')
cat = listing('/api/parts-catalogue/catalogue-parts')
inv = listing('/api/inventory/parts')
print(f"  {len(cat)} catalogue, {len(inv)} inventory")
try_field('parts.manufacturer', 'parts', 'manufacturer_name',
          [p.get('manufacturer_name') for p in cat if p.get('manufacturer_name')][:12]) or \
 try_field('parts.manufacturer', 'parts', 'manufacturer',
          [p.get('manufacturer_name') for p in cat if p.get('manufacturer_name')][:12])
try_field('parts.category', 'parts', 'category_label',
          [p.get('category_label') for p in cat if p.get('category_label')][:10]) or \
 try_field('parts.category', 'parts', 'category',
          [p.get('category_label') for p in cat if p.get('category_label')][:10])
bins = []
for p in inv:
    for b in (p.get('binLocations') or []):
        n = b.get('name') or b.get('bin') or b.get('label')
        if n: bins.append(n)
try_field('parts.bin_location', 'parts', 'bin_location', bins[:14])

print('=== natural fragment-sharing pairs (Class B data)')
PAIRS = {}
for probe in ('965', '3286', '786', '0123', '4471', '5067', '328', '496'):
    buckets = collections.defaultdict(list)
    for gtype, i in rows(probe):
        mt = i.get('match') or {}
        buckets[(gtype, mt.get('field'))].append(
            {'primary': i.get('primary'), 'secondary': i.get('secondary'),
             'highlight': mt.get('highlight')})
    for (gtype, field), items in buckets.items():
        if len(items) < 2: continue
        distinct = {json.dumps(x, sort_keys=True) for x in items}
        if len(distinct) < 2: continue
        key = f'{gtype}.{field}'
        if key not in PAIRS:
            PAIRS[key] = {'term': probe, 'group': gtype, 'field': field,
                          'count': len(items), 'rows': items[:4]}
            print(f"  ✅ {key:34} type {probe!r:8} -> {len(items)} rows share the fragment")

out = {'environment': 'app.staging.shopview.com', 'workplace': 'Staging Heavy Duty - 9919',
       'found': FOUND, 'missing': MISSING, 'pairs': PAIRS}
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 'discovered-terms.json'), 'w'), indent=1)
print(f"\n{len(FOUND)} verified terms, {len(PAIRS)} fragment-sharing groups, {len(MISSING)} not found")
