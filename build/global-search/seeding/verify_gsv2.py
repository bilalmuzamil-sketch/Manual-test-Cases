#!/usr/bin/env python3
"""Proves the Fibridge seed actually answers the query each case types — BY IDENTITY, never by count.

Rule 110: a result is not evidence until it is attributed, identified and dated. So every check here
names the record it expects and asserts THAT RECORD came back. A group total is reported for the
count targets only, where the number IS the thing under test.

Run:  python3 verify_gsv2.py            (QA)
      SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2" python3 verify_gsv2.py
"""
import json, os, re, runpy, sys, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV = _seed['call'], _seed['ENV_LABEL']

def search(q):
    r = call('/api/search?q=' + urllib.parse.quote(q))
    if r['status'] != 200: return None, f"HTTP {r['status']}"
    return ((r['json'] or {}).get('data') or {}), None

def rows(d, gtype=None):
    out = []
    for g in d.get('groups') or []:
        if gtype and g['type'] != gtype: continue
        for i in g['items']: out.append((g['type'], i))
    p = d.get('pinned')
    if p: out.append(('pinned', p))
    return out

def blob(i):
    f = i.get('fields') or {}
    return f"{i.get('primary')} {i.get('secondary')} " + ' '.join(str(v) for v in f.values())

# (label, query, expect_substring_in_a_returned_row, group or None, cases)
CHECKS = [
 ('spine, work orders',      'Fib', 'ZZAUTOTEST Fibridge Commercial', 'work_orders',
  '44816 44823 44824 44826 44874 44875'),
 ('spine, customers',        'Fib', 'ZZAUTOTEST Fibridge Commercial', 'customers', '44817 44832'),
 ('spine, assets',           'Fib', 'ZZAUTOTEST Fibridge',            'assets',    '44818'),
 ('spine, parts',            'Fib', 'ZZAUTOTEST Fibridge',            'parts',     '44819'),
 ('spine, vendors',          'Fib', 'ZZAUTOTEST Fibridge Mining',     'vendors',   '44820 44835'),
 ('spine, part sales',       'Fib', 'ZZAUTOTEST Fibridge Commercial', 'part_sales','44821'),
 ('spine, purchase orders',  'Fib', 'ZZAUTOTEST Fibridge Mining',     'purchase_orders', '44899 45130'),
 ('spine, vendor invoices',  'Fib', 'ZZAUTOTEST Fibridge Mining',     'vendor_invoices', '44900 45131'),
 ('persisting query',        'Fibridge', 'ZZAUTOTEST Fibridge',       None, '44861 44862 44863'),
 ('unit + YMM on a WO row',  'TRK 412', 'TRK 412',                    None, '44831'),
 ('asset by exact VIN',      '1FUJGLDR9CLBP8834', '1FUJGLDR9CLBP8834',None, '44844'),
 # 🔴 SEARCHED BY OWNER, NOT BY "2025 Freightliner M2". The year is indexed as an integer and the
 # group caps at 20, so a year-led query degrades to "Freightliner M2" and the staging estate's own
 # twenty Freightliner M2s fill the group - ours never appears. The asset row displays the year,
 # which makes that look like a missing seed. It is not; the owner is what discriminates.
 ('asset YMM + owner',       'Bryan Smith', '2025 Freightliner M2',  'assets', '44833'),
 ('fuzzy: frieghtliner',     'frieghtliner', 'FREIGHTLINER',          'assets', '44841'),
 ('fuzzy: Petersn',          'Petersn', 'ZZAUTOTEST Peterson Hauling','customers','44839 44848'),
 ('fuzzy: Abrige',           'Abrige',  'ZZAUTOTEST Aabridge Freight','customers','44840'),
 ('fuzzy: Filbridge',        'Filbridge','ZZAUTOTEST Fibridge',       'customers','44842'),
 ('contact email',           'deshawn@fibridge-commercial.test', 'ZZAUTOTEST Fibridge Commercial',
  'customers', '44837 44895 45129'),
 ('contact phone',           '(264) 555-0142', 'ZZAUTOTEST Fibridge Commercial', 'customers',
  '44837 45139'),
 ('contact phone, digits',   '2645550142', 'ZZAUTOTEST Fibridge Commercial', 'customers', '44845'),
 ('customer own telephone',  '2643286723', 'ZZAUTOTEST Fibridge Commercial', 'customers', '44845'),
 ('contact-vs-name ranking', 'Deshawn', 'ZZAUTOTEST Deshawn Freight Lines', 'customers', '45139'),
 ('part number exact',       '65547', '65547',                        'parts', '44846'),
 ('part sale P-number',      'P2-58', 'P2-58',                        'part_sales', '44836 44849'),
 ('WO number, exact',        'S2-15440', 'S2-15440',                  None, '44843 44850'),
 ('WO number, no dash',      'S215440', 'S2-15440',                   None, '44843'),
 ('WO number, space',        'S2 15440', 'S2-15440',                  None, '44843'),
]

# (label, query, group, predicate on the total, cases)
COUNTS = [
 ('customers on Fib are FIVE OR FEWER', 'Fib', 'customers',       lambda n: 1 <= n <= 5, '44825'),
 ('assets on Fib are MORE THAN FIVE',   'Fib', 'assets',          lambda n: n > 5,       '44825'),
 ('work orders on Fib hit the 20 cap',  'Fib', 'work_orders',     lambda n: n >= 20,     '44822 44823 53476'),
 ('purchase orders on Fib',             'Fib', 'purchase_orders', lambda n: n >= 1,      '44899 45130'),
 ('vendor invoices on Fib',             'Fib', 'vendor_invoices', lambda n: n >= 3,      '44900 45131 45138'),
]

# a query that must return NOTHING — the negative half of a pair is a check too
NEGATIVES = [
 ('no such part sale', 'P2-59', 'part_sales', '44849'),
 ('no such work order', 'S2-15441', 'work_orders', '44847'),
 ('no such work order', 'S2-15450', 'work_orders', '44847'),
 ('matches nothing at all', 'S1- 56438', None, '44864'),
]

def main():
    call('/api/staff/my-workplaces')
    print(f'=== environment: {ENV} ===')
    bad = []
    print('\n=== IDENTITY CHECKS — is OUR record in the list? ===')
    for label, q, expect, gtype, cases in CHECKS:
        d, err = search(q)
        if err: print(f'  🔴 {label:26} {q!r:34} {err}'); bad.append((label, q, err)); continue
        found = [i for t, i in rows(d, gtype) if expect.lower() in blob(i).lower()]
        mark = '✅' if found else '🔴'
        who = str(found[0].get('primary'))[:30] if found else 'NOT FOUND'
        print(f'  {mark} {label:26} {q!r:34} -> {who:32} [C{cases.replace(" ", ", C")}]')
        if not found: bad.append((label, q, f'expected {expect!r}'))

    print('\n=== COUNT TARGETS — here the number IS the thing under test ===')
    for label, q, gtype, ok, cases in COUNTS:
        d, err = search(q)
        g = next((x for x in (d or {}).get('groups') or [] if x['type'] == gtype), None)
        n = g['total'] if g else 0
        mark = '✅' if ok(n) else '🔴'
        print(f'  {mark} {label:40} {gtype:17} = {n:3}  [C{cases.replace(" ", ", C")}]')
        if not ok(n): bad.append((label, q, f'total={n}'))

    print('\n=== NEGATIVES — these MUST return nothing, and a control proves the probe works ===')
    for label, q, gtype, cases in NEGATIVES:
        d, err = search(q)
        got = rows(d or {}, gtype)
        mark = '✅' if not got else '🔴'
        print(f'  {mark} {label:26} {q!r:20} -> {len(got)} row(s)  [C{cases.replace(" ", ", C")}]')
        if got: bad.append((label, q, f'{len(got)} rows returned'))

    print('\n=== summary ===')
    if bad:
        print(f'  🔴 {len(bad)} check(s) did not pass:')
        for b in bad: print(f'     {b[0]} / {b[1]!r}: {b[2]}')
        sys.exit(1)
    print(f'  ✅ all {len(CHECKS)+len(COUNTS)+len(NEGATIVES)} checks passed on {ENV}')

main()
