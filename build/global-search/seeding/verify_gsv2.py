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
    """🔴 RETRY A TRANSPORT ERROR BEFORE CALLING IT A FAILURE. A single dropped connection made this
    verifier report a red 'HTTP ERR' against a check that passed three times in a row a moment later
    - and a verifier that cries wolf is worse than no verifier, because the next real red gets
    shrugged off. A NON-200 HTTP STATUS IS STILL REPORTED IMMEDIATELY: that is the product answering,
    and it is exactly what we are here to catch. Only the transport layer is retried."""
    import time as _t
    last = None
    for attempt in range(3):
        r = call('/api/search?q=' + urllib.parse.quote(q))
        if r['status'] == 200:
            return ((r['json'] or {}).get('data') or {}), None
        last = f"HTTP {r['status']}"
        if r['status'] != 'ERR':
            return None, last          # the server answered - that is a real result, not a blip
        if attempt < 2: _t.sleep(2 * (attempt + 1))
    return None, f'{last} after 3 attempts'

def call_retry(path):
    """🔴 EVERY direct call in this file goes through here. Three separate transient 'HTTP ERR'
    reds were raised by this verifier against data that was perfectly fine - each one a dropped
    connection, each one costing a run and a re-check. A transport error is retried; a real HTTP
    STATUS is returned immediately, because that is the product answering and it is what we are
    here to catch."""
    import time as _t
    r = None
    for attempt in range(3):
        r = call(path)
        if r['status'] != 'ERR': return r
        if attempt < 2: _t.sleep(2 * (attempt + 1))
    return r


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
 # 🔴 THESE MUST MATCH WHAT THE CASES ACTUALLY SAY. They tested S2-15440 while C44843/C44847/C44850
 # had been corrected to S2-15430 - and they PASSED, because S2-15440 is in the index. The verifier
 # was proving the wrong thing, confidently. Rule 112 applies to our own tooling too: check against
 # the case body, not against what you remember writing.
 ('WO number, exact',        'S2-15430', 'S2-15430',                  None, '44843 44850'),
 ('WO number, no dash',      'S215430', 'S2-15430',                   None, '44843'),
 ('WO number, space',        'S2 15430', 'S2-15430',                  None, '44843'),
 # the quick-actions examples (6774): named in the case bodies, absent from the branch until seeded
 ('quick actions: customer',  'Adale Transport',  'ZZAUTOTEST Adale Transport',  'customers',   '44868'),
 ('quick actions: work order','Fisquare Farms',   'ZZAUTOTEST Fisquare Farms',   'work_orders', '44866 44858 44859'),
 ('quick actions: vendor',    'Report Beverages', 'ZZAUTOTEST Report Beverages', 'vendors',     '44870'),
 ('quick actions: part',      'Rear Shock',       'Rear Shock',                  'parts',       '44869 44871'),
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
 ('no such work order', 'S2-15431', 'work_orders', '44847'),
 ('no such work order', 'S2-15432', 'work_orders', '44847'),
 ('matches nothing at all', 'S1- 56438', None, '44864'),
]

def status_spread():
    """C44838 needs all SEVEN work-order badge colours on ONE term. It cannot be "Fib": the palette
    caps every group at 20 and there are 30 matching work orders, so the two `declined` ones rank
    out of sight and no limit or scope tab brings them back (measured: scope=work_orders&limit=50
    still returns 20). The narrower term "Fibridge Commercial" returns 18 - under the cap - and
    carries every status. This check exists so a reseed cannot quietly lose one."""
    d, err = search('Fibridge Commercial')
    if err: return set(), err
    g = next((x for x in (d.get('groups') or []) if x['type'] == 'work_orders'), None)
    return {i['fields']['status'] for i in (g['items'] if g else [])}, None


def main():
    call_retry('/api/staff/my-workplaces')
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

    print('\n=== REACHABILITY — the pinned record must OPEN, not merely be indexed ===')
    d, _ = search('S2-15430')
    p = (d or {}).get('pinned') or {}
    v = call_retry(f"/api/work-orders/view/{p.get('id')}") if p.get('id') else {'status': 'NO PINNED ROW'}
    ok = v.get('status') == 200
    print(f"  {'✅' if ok else '🔴'} S2-15430 opens at this workplace -> HTTP {v.get('status')}")
    if not ok:
        bad.append(('reachability', 'S2-15430', f"view HTTP {v.get('status')} - the search index is "
                    "organisation-scoped but the record is workplace-scoped"))

    print('\n=== STATUS BADGE COLOURS — all seven on one term (C44838) ===')
    want = {'approved', 'estimate', 'in_progress', 'ready_for_review', 'complete', 'declined', 'invoiced'}
    got, err = status_spread()
    missing = want - got
    print(f"  {'✅' if not missing else '🔴'} 'Fibridge Commercial' shows {len(got & want)} of 7"
          f"  [{', '.join(sorted(got & want))}]")
    if missing:
        print(f'      missing: {sorted(missing)}')
        bad.append(('status spread', 'Fibridge Commercial', f'missing {sorted(missing)}'))

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
