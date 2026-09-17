#!/usr/bin/env python3
"""Reads the seeded universe back off the environment and writes SEED-MANIFEST-GS-V2.md — every
record with the identifier the BRANCH assigned it, not the one we asked for.

This is the file the tester and the next post-redeploy session read. It is generated, never typed,
because a hand-kept list of ids is wrong the first time a branch is redeployed and nobody notices.
"""
import json, os, runpy, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV = _seed['call'], _seed['ENV_LABEL']

def q(x): return urllib.parse.quote(str(x))

def rows(r, coll='collection'):
    d = (r['json'] or {}).get('data', {}) or {}
    return d.get(coll) or (d if isinstance(d, list) else [])

def find_one(path, field, value, coll='collection'):
    """🔴 RETRY BEFORE PRINTING A RED MARK. These list endpoints return transient empties, and an
    inventory that says a record is missing when it is sitting there is worse than no inventory -
    the next reader reseeds something that was never broken. One flaky read put a false 🔴 against
    asset_fib_5 on 2026-09-16 while the vehicle answered on the very next attempt."""
    import time as _t
    for attempt in range(3):
        r = call(path)
        if r['status'] == 200:
            hit = next((x for x in rows(r, coll) if str(x.get(field) or '') == str(value)), None)
            if hit: return hit
        if attempt < 2: _t.sleep(2 * (attempt + 1))
    return None

def out(section, header, lines):
    print(f'\n### {section}\n')
    print('| ' + ' | '.join(header) + ' |')
    print('|' + '|'.join('---' for _ in header) + '|')
    for l in lines: print('| ' + ' | '.join(str(x) for x in l) + ' |')

man = json.load(open(f'{HERE}/seed-manifest-gs-v2.json'))
ids = json.load(open(f'{HERE}/seed-ids-gsv2-{ENV}.json'))
try: po = json.load(open(f'{HERE}/po-invoices-gsv2-{ENV}.json'))
except Exception: po = {}
try: wos = json.load(open(f'{HERE}/wo-statuses-gsv2-{ENV}.json'))
except Exception: wos = {}

marker = ''
try:
    import urllib.request, ssl, re
    c = json.load(open(os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')))
    ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
    html = ''
    for _a in range(3):
        try:
            html = urllib.request.urlopen(f"https://{c['host']}/", context=ctx, timeout=30).read().decode()
            break
        except Exception:
            import time as _t; _t.sleep(3)
    m = re.search(r'app-version"\s+content="([^"]+)"', html)
    marker = m.group(1) if m else ''
except Exception as e: marker = f'(could not read: {e})'

print(f'# SEED MANIFEST — Global Search V2 "Fibridge" universe · {ENV}')
print(f'\n**Read back off the environment, not typed.** Build marker: `{marker}`.')
print('Regenerate with `python3 dump_seed_manifest.py > SEED-MANIFEST-GS-V2-<env>.md`.')

# customers
lines = []
for rec in man['records']:
    if rec['type'] != 'Customer': continue
    v = rec['find']['value']
    hit = find_one(f"/api/customers?search={q(v)}&limit=100", 'name', v)
    lines.append([rec['key'], v, hit.get('id') if hit else '🔴 NOT FOUND',
                  (hit or {}).get('telephone') or '', (hit or {}).get('address_1') or ''])
out('Customers', ['key', 'name', 'id', 'telephone', 'address'], lines)

# contacts
lines = []
for rec in man['records']:
    if not rec['type'].startswith('Contact'): continue
    pf = next(x['find'] for x in man['records'] if x['key'] == rec['depends_on'])
    pr = call(f"/api/customers?search={q(pf['value'])}&limit=100")
    pid = next((x['id'] for x in rows(pr) if x.get('name') == pf['value']), None)
    hit = None
    if pid:
        # Same retry as every other lookup here - a single transient read printed a red mark against
        # a contact that answered perfectly on the next attempt (production, 2026-09-17).
        import time as _t
        for attempt in range(3):
            v = call(f"/api/customers/view/{pid}")
            node = ((v['json'] or {}).get('data') or {}).get('company', {}) or {}
            hit = next((c for c in (node.get('contacts') or [])
                        if c.get('first_name') == rec['find']['value']), None)
            if hit: break
            if attempt < 2: _t.sleep(2 * (attempt + 1))
    p = rec['create']['payload']
    lines.append([rec['key'], f"{p['first_name']} {p['last_name']}", (hit or {}).get('id', '🔴'),
                  p['title'], p['telephone'], p['email']])
out('Contacts (people AT a customer company)',
    ['key', 'name', 'id', 'title', 'telephone', 'email'], lines)

# assets
lines = []
for rec in man['records']:
    if rec['type'] != 'Vehicle': continue
    vin = rec['find']['value']
    hit = find_one(f"/api/vehicles?search={q(vin)}&limit=50", 'vin', vin)
    lines.append([rec['key'], f"{(hit or {}).get('year','')} {(hit or {}).get('vehicle_make','')} "
                  f"{(hit or {}).get('vehicle_model','')}".strip(), (hit or {}).get('id', '🔴'),
                  (hit or {}).get('unit') or '(none — deliberate)', vin])
out('Assets', ['key', 'year make model', 'id', 'unit', 'VIN'], lines)

# vendor
vendor = find_one('/api/parts-catalogue/vendors?search=Fibridge&limit=100', 'name',
                  'ZZAUTOTEST Fibridge Mining')
# 🔴 ITS OWN NAME. `hit` is reused by every loop below it, so reading the vendor id off `hit`
# further down returns whatever the LAST loop matched - an inventory part - and the purchase-order
# and vendor-invoice tables come out empty while the records exist. Shadowing, not missing data.
out('Vendor', ['name', 'id', 'email', 'credit term'],
    [['ZZAUTOTEST Fibridge Mining', (vendor or {}).get('id', '🔴'), (vendor or {}).get('email', ''),
      (vendor or {}).get('credit_term', '')]])

# parts
lines = []
for rec in man['records']:
    if rec['type'] != 'InventoryPart': continue
    pn = rec['find']['value']
    hit = find_one(f"/api/inventory/parts?search={q(pn)}&limit=50", 'part_number', pn)
    st = rec.get('stock') or {}
    lines.append([rec['key'], pn, (hit or {}).get('description') or (hit or {}).get('name') or '',
                  (hit or {}).get('id', '🔴'), st.get('quantity_on_hand'), st.get('min')])
out('Inventory parts (the three stock states + the exact part number)',
    ['key', 'part number', 'description', 'id', 'on hand', 'reorder level'], lines)

# work orders
lines = []
for key in ('work_orders_fib_main', 'work_orders_fib_nounit'):
    for i in ids.get(key) or []:
        # Same retry as every other lookup here: a single failed view call prints a red mark
        # against a work order that answers perfectly on the next attempt.
        w = {}
        for attempt in range(3):
            r = call(f'/api/work-orders/view/{i}')
            w = ((r['json'] or {}).get('data') or {}).get('work_order') or {}
            if w.get('number'): break
            if attempt < 2:
                import time as _t; _t.sleep(2 * (attempt + 1))
        lines.append([key, w.get('number') or '🔴', i, w.get('status', ''), w.get('company_name', '')])
out('Work orders (numbers are ASSIGNED BY THE BRANCH — they cannot be chosen)',
    ['key', 'number', 'id', 'status', 'customer'], lines)

# part sale
r = call('/api/part-sales?search=' + q('ZZAUTOTEST Fibridge Commercial') + '&limit=100')
lines = [[x.get('number'), x.get('id'), x.get('companyName'), x.get('status')]
         for x in rows(r, 'partSales') if 'Fibridge' in str(x.get('companyName'))]
out('Part sales', ['P-number', 'id', 'customer', 'status'], lines)

# POs and invoices
vid = (vendor or {}).get('id')
r = call('/api/inventory/orders?limit=250')
lines = [[x.get('order_number'), x.get('id'), x.get('status'), x.get('total_price')]
         for x in rows(r) if x.get('vendor_id') == vid]
out('Purchase orders (on the Fibridge vendor)', ['number', 'id', 'status', 'total'], lines)

r = call('/api/inventory/deliveries?limit=250')
lines = [[x.get('invoice_number'), x.get('id'), x.get('order_number'), x.get('total_price')]
         for x in rows(r) if x.get('vendor_id') == vid]
out('Vendor invoices (a delivery IS the vendor invoice)',
    ['invoice number', 'id', 'from PO', 'total'], lines)
print('\n> The payment badge is not stored on the invoice — it is '
      '`vendor_transaction.vendor_transaction_status`, joined by the indexer. Read the live badge '
      'from a search, not from this table.')
if po:
    out('What each purchase-order row was seeded FOR',
        ['tag', 'PO', 'route', 'invoice', 'payment'],
        [[k, v.get('order_number'), v.get('route', ''), v.get('invoice_number', '—'),
          v.get('pay_result', '—')] for k, v in po.items()])
if wos:
    out('Work-order status spread actually reached',
        ['status', 'count'], [[k, len(v)] for k, v in sorted(wos.items(), key=lambda x: -len(x[1]))])
