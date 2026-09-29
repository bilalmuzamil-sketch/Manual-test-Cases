#!/usr/bin/env python3
"""Second discovery pass: the fields pass 1 could not reach, plus the fuzzy near-miss terms.

Vendors have no list endpoint (404), so vendor rows are reached through the search itself and then
read with /api/vendors/view/{id}. Same verification rule as pass 1: a term is kept only if the
response says the match came from the field the test is about.
"""
import sys, os, json, importlib.util
SEED = '/home/user/Manual-test-Cases/build/global-search/seeding'
sys.argv = ['seed.py']
spec = importlib.util.spec_from_file_location('seedmod', f'{SEED}/seed.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
call = m.call
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(f'{HERE}/discovered-terms.json'))
FOUND = D['found']

def groups(q):
    r = call('/api/search?q=' + str(q).replace(' ', '%20').replace('#', '%23').replace('&', '%26'))
    return ((r['json'] or {}).get('data') or {}).get('groups') or []

def verify(term, group, want):
    for g in groups(term):
        if g['type'] != group: continue
        for i in g.get('items') or []:
            mt = i.get('match') or {}
            if str(mt.get('field')) == want:
                return {'term': str(term), 'group': group, 'field': want, 'kind': mt.get('kind'),
                        'highlight': mt.get('highlight'), 'primary': i.get('primary'),
                        'secondary': i.get('secondary')}
    return None

def try_field(key, group, want, cands, label=''):
    if key in FOUND: return True
    for c in cands:
        c = str(c or '').strip()
        if len(c) < 3: continue
        hit = verify(c, group, want)
        if hit:
            FOUND[key] = hit
            print(f"  ✅ {key:32} type {c!r:44} -> {want} ({hit['kind']})")
            return True
    print(f"  ❌ {key:32} nothing matched {want}")
    return False

print('=== vendors (no list endpoint — reached through search, then read by id)')
vids = []
for probe in ('965', '3286', 'Supply', 'Parts'):
    for g in groups(probe):
        if g['type'] == 'vendors':
            for i in g.get('items') or []:
                if i.get('id') and i['id'] not in vids: vids.append(i['id'])
print(f"  {len(vids)} vendor ids reachable")
emails, a2, cnames, cemails, cphones = [], [], [], [], []
for vid in vids[:18]:
    r = call(f'/api/vendors/view/{vid}')
    d = (r['json'] or {}).get('data') or {}
    v = d.get('vendor') or d.get('company') or d
    if not isinstance(v, dict): continue
    if v.get('email'): emails.append(v['email'])
    if v.get('address_2'): a2.append(v['address_2'])
    for ct in (v.get('contacts') or [])[:4]:
        if ct.get('first_name'): cnames.append(ct['first_name'])
        if ct.get('email'): cemails.append(ct['email'])
        if ct.get('telephone'): cphones.append(ct['telephone'])
try_field('vendors.email', 'vendors', 'email', emails[:14])
try_field('vendors.address_line_2', 'vendors', 'address_line_2', a2[:14])
try_field('vendors.contact_names', 'vendors', 'contact_names', cnames[:14])
try_field('vendors.contact_emails', 'vendors', 'contact_emails', cemails[:14])
try_field('vendors.contact_phones', 'vendors', 'contact_phones', cphones[:14])

print('=== parts — vendor name on a part')
vnames = []
for g in groups('965'):
    if g['type'] == 'vendors':
        vnames += [i.get('primary') for i in (g.get('items') or []) if i.get('primary')]
try_field('parts.vendor_name', 'parts', 'vendor_name', vnames[:12])

print('=== vendor invoices — the PO number the invoice belongs to')
ponums = []
for g in groups('965'):
    if g['type'] == 'purchase_orders':
        ponums += [i.get('primary') for i in (g.get('items') or []) if i.get('primary')]
for g in groups('I2-'):
    if g['type'] == 'purchase_orders':
        ponums += [i.get('primary') for i in (g.get('items') or []) if i.get('primary')]
try_field('vendor_invoices.po_number', 'vendor_invoices', 'purchase_order_number', ponums[:12]) or \
 try_field('vendor_invoices.po_number', 'vendor_invoices', 'po_number', ponums[:12]) or \
 try_field('vendor_invoices.po_number', 'vendor_invoices', 'order_number', ponums[:12])

print('=== the fuzzy near-miss terms (typing a near-miss must still find the record)')
# Seeded typo siblings - typing one returns the other as a soft match.
for key, group, term in (('fuzzy.parts', 'parts', 'ZZKRYPTON'),
                         ('fuzzy.vendors', 'vendors', 'ZZMAGENTA'),
                         ('fuzzy.assets', 'assets', 'ZZOBSIDIAN'),
                         ('fuzzy.customers', 'customers', 'ZZPREFIY'),
                         ('fuzzy.customers2', 'customers', 'Petersn')):
    hit = None
    for g in groups(term):
        if g['type'] != group: continue
        for i in g.get('items') or []:
            if str((i.get('match') or {}).get('kind')) == 'fuzzy':
                hit = {'term': term, 'group': group, 'field': (i.get('match') or {}).get('field'),
                       'kind': 'fuzzy', 'primary': i.get('primary'),
                       'highlight': (i.get('match') or {}).get('highlight'),
                       'secondary': i.get('secondary')}
                break
        if hit: break
    if hit:
        FOUND[key] = hit
        print(f"  ✅ {key:22} type {term!r:14} -> {hit['primary']!r} drawn as a soft match")
    else:
        print(f"  ❌ {key:22} {term!r} returned no fuzzy row in {group}")

D['found'] = FOUND
json.dump(D, open(f'{HERE}/discovered-terms.json', 'w'), indent=1)
print(f"\n{len(FOUND)} verified terms in total")
