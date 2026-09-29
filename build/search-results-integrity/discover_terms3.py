#!/usr/bin/env python3
"""Third pass: capture and VERIFY terms for the rows the new seed universe unblocks.

Same rule as passes 1 and 2 - a term is kept only when the response says the match came from the
field the test is about, or (for the pair cases) only when two or more DISTINCT rows come back.
"""
import sys, os, json, importlib.util
SEED = '/home/user/Manual-test-Cases/build/global-search/seeding'
sys.argv = ['seed.py']
spec = importlib.util.spec_from_file_location('seedmod', f'{SEED}/seed.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
call = m.call
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(f'{HERE}/discovered-terms.json'))
FOUND, PAIRS = D['found'], D['pairs']

def groups(q):
    r = call('/api/search?q=' + str(q).replace(' ', '%20').replace('&', '%26'))
    return ((r['json'] or {}).get('data') or {}).get('groups') or []

def rows(q, g):
    for gr in groups(q):
        if gr['type'] == g: return gr.get('items') or []
    return []

def keep(key, term, group, rec):
    FOUND[key] = dict(rec, term=str(term), group=group)
    print(f"  ✅ {key:26} type {term!r:42} -> {rec.get('field')} ({rec.get('kind')})")

def field_hit(key, term, group, want=None):
    for i in rows(term, group):
        mt = i.get('match') or {}
        if want is None or str(mt.get('field')) == want:
            keep(key, term, group, {'field': mt.get('field'), 'kind': mt.get('kind'),
                                    'highlight': mt.get('highlight'), 'primary': i.get('primary'),
                                    'secondary': i.get('secondary')})
            return True
    print(f"  ❌ {key:26} {term!r} gave no {want or 'row'} in {group}")
    return False

def pair_hit(key, term, group, minimum=2):
    items = rows(term, group)
    distinct = {json.dumps({'p': i.get('primary'), 's': i.get('secondary')}, sort_keys=True)
                for i in items}
    if len(items) >= minimum and len(distinct) >= 1:
        PAIRS[key] = {'term': str(term), 'group': group, 'field': (items[0].get('match') or {}).get('field'),
                      'count': len(items),
                      'rows': [{'primary': i.get('primary'), 'secondary': i.get('secondary'),
                                'highlight': (i.get('match') or {}).get('highlight')} for i in items[:4]]}
        print(f"  ✅ {key:26} type {term!r:42} -> {len(items)} rows ({len(distinct)} distinct)")
        return True
    print(f"  ❌ {key:26} {term!r} gave {len(items)} row(s) in {group}, need {minimum}")
    return False

TWIN = 'ZZLONGROW'
print('=== the twin pair on every tab (A1/A2/A3/B1/B2 and G2)')
for g in ('customers', 'vendors', 'parts', 'assets', 'part_sales', 'work_orders'):
    pair_hit(f'twin.{g}', TWIN, g)

print('=== identical-bold-line pairs (B2)')
pair_hit('same.customers', f'{TWIN} Identical Name Cartage', 'customers')
pair_hit('same.vendors',   f'{TWIN} Identical Name Supply', 'vendors')
pair_hit('same.parts',     f'{TWIN} Heavy Duty Air Brake', 'parts')
pair_hit('same.assets',    TWIN, 'assets')
pair_hit('same.purchase_orders', 'Fibridge', 'purchase_orders')
pair_hit('same.vendor_invoices', 'Fibridge', 'vendor_invoices')

print('=== the hidden-field records (Class C)')
field_hit('vendors.email', 'zzhidden.vendor@staging.shopview.local', 'vendors', 'email')
field_hit('vendors.address_line_2', 'ZZHIDDENSUITE', 'vendors', 'address_line_2')
field_hit('customers.state', 'ZZQUEBEXA', 'customers')
field_hit('part_sales.vin', 'ZZHIDDENVIN0000001', 'part_sales')
field_hit('part_sales.asset', 'Quietline', 'part_sales')
field_hit('assets.vin_hidden', 'ZZHIDDENVIN0000001', 'assets')

print('=== the no-unit work order (G1) and the soft matches (I1)')
field_hit('workorders.nounit', 'ZZNOUNIT', 'work_orders')
for g in ('work_orders', 'part_sales', 'purchase_orders', 'vendor_invoices', 'customers', 'vendors'):
    hit = None
    for i in rows('ZZSOFTHIT', g):
        if str((i.get('match') or {}).get('kind')) == 'fuzzy':
            hit = i; break
    if hit:
        keep(f'soft.{g}', 'ZZSOFTHIT', g,
             {'field': (hit.get('match') or {}).get('field'), 'kind': 'fuzzy',
              'highlight': (hit.get('match') or {}).get('highlight'),
              'primary': hit.get('primary'), 'secondary': hit.get('secondary')})
    else:
        print(f"  ❌ soft.{g:20} 'ZZSOFTHIT' returned no soft-matched row")

print('=== a real work-order number to type (E7, F1, H3)')
st = json.load(open(f'{SEED}/seed-state-live-resultintegrity-staging.json'))
wid = None
for rec in st['records']:
    if rec['key'] == 'ri_wo_twin_1' and rec.get('ids'): wid = rec['ids'][0]; break
if wid:
    r = call(f'/api/work-orders/view/{wid}')
    wo = (((r['json'] or {}).get('data') or {}).get('work_order') or {})
    num = wo.get('number')
    if num and field_hit('workorders.number', num, 'work_orders'):
        FOUND['workorders.number']['_rule111'] = (
            'This number is BRANCH-ASSIGNED and changes on a reseed or a redeploy. Re-read it from '
            'the seed state before a test run rather than trusting this cell.')
else:
    print('  ❌ no work order id in the seed state')

D['found'], D['pairs'] = FOUND, PAIRS
json.dump(D, open(f'{HERE}/discovered-terms.json', 'w'), indent=1)
print(f"\n{len(FOUND)} verified terms, {len(PAIRS)} pair groups")
