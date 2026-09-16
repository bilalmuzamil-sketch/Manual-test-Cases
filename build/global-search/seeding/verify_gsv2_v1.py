#!/usr/bin/env python3
"""Proves the Fibridge seed is findable by the V1 search that PRODUCTION actually runs.

WHY A SECOND VERIFIER: production is V1. `/api/search` does not exist there (404), so verify_gsv2.py
cannot run against it, and running it anyway would report a dead environment that is perfectly fine.
V1 hands the browser the WHOLE collection from `GET /api/global-search/fetch` and filters client
side, so V1 behaviour can be reproduced exactly here, without a browser, by applying V1's own two
passes (useGlobalSearch.ts:66-93 @ 55767168):

    under 2 characters      -> history, not results
    pass 1                  label.toLowerCase().startsWith(query)
    pass 2                  search.toLowerCase().includes(query.replace(/\\s+/g, ''))
    MAX_PER_TYPE = 3        V1 shows at most THREE rows per group

🔴 THE POINT OF THIS FILE IS NOT "DOES V1 BEHAVE LIKE V2". It does not, and it is not supposed to.
The point is that the comparison the QA lead runs on production has the SAME RECORDS in front of it
as the QA branch does, so a difference he sees is a difference in the SEARCH and never a difference
in the data. A "V1 does not find this" line below is therefore information, not a failure.

Run:  SEED_PROFILE=/tmp/prod/cookies.json SEED_WORKPLACE="Trucks Hill 2" python3 verify_gsv2_v1.py
"""
import json, os, re, runpy, sys

HERE = os.path.dirname(os.path.abspath(__file__))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest-gs-v2.json')
os.environ.setdefault('SEED_PROFILE', '/tmp/prod/cookies.json')
_seed = runpy.run_path(f'{HERE}/seed.py', run_name='not_main')
call, ENV = _seed['call'], _seed['ENV_LABEL']

MAX_PER_TYPE = 3

def fetch_collection():
    r = call('/api/global-search/fetch')
    if r['status'] != 200:
        sys.exit(f"/api/global-search/fetch answered {r['status']} — this is the V1 endpoint; if you "
                 f"are pointed at the QA branch use verify_gsv2.py instead")
    d = (r['json'] or {}).get('data', r['json'])
    if isinstance(d, dict):
        for k in ('collection', 'items', 'results'):
            if isinstance(d.get(k), list): return d[k]
        for v in d.values():
            if isinstance(v, list): return v
    return d if isinstance(d, list) else []

def v1_search(rows, query):
    """V1's own two passes, transcribed. Deliberately not 'close enough'."""
    q = query.lower()
    if len(q) < 2: return []
    squashed = re.sub(r'\s+', '', q)
    out, per = [], {}
    for phase in (1, 2):
        for r in rows:
            label = str(r.get('label') or '').lower()
            blob = str(r.get('search') or '').lower()
            hit = label.startswith(q) if phase == 1 else squashed in blob
            if not hit: continue
            t = r.get('type')
            if r in out: continue
            if per.get(t, 0) >= MAX_PER_TYPE: continue
            per[t] = per.get(t, 0) + 1
            out.append(r)
    return out

# (label, query, substring that must appear in a returned row)
CHECKS = [
 ('customer by name',        'ZZAUTOTEST Fibridge Commercial', 'Fibridge Commercial'),
 ('customer, short prefix',  'ZZAUTOTEST Fib',                 'Fibridge'),
 ('vendor by name',          'ZZAUTOTEST Fibridge Mining',     'Fibridge Mining'),
 ('peterson customer',       'ZZAUTOTEST Peterson',            'Peterson Hauling'),
 ('aabridge customer',       'ZZAUTOTEST Aabridge',            'Aabridge Freight'),
 ('toboro customer',         'ZZAUTOTEST Toboro',              'Toboro Industries'),
 ('bryan smith customer',    'ZZAUTOTEST Bryan',               'Bryan Smith'),
 ('deshawn-named customer',  'ZZAUTOTEST Deshawn',             'Deshawn Freight'),
 ('asset by VIN',            '1FUJGLDR9CLBP8834',              '1FUJGLDR9CLBP8834'),
 ('asset by unit',           'TRK 412',                        'TRK 412'),
 ('contact surname',         'Oyelaran',                       'Oyelaran'),
 ('contact phone, V1 form',  '264-555-0142',                   '0142'),
]

# V1 differences that are EXPECTED and must not read as a broken seed
EXPECTED_MISSES = [
 ('contact email',  'deshawn@fibridge-commercial.test',
  "V1's customer query folds the contact's first name, last name, title and TELEPHONE - not the "
  "contact's email. This is the same customer/vendor asymmetry that produced the withdrawn "
  "SV-10110 (playbook O3)."),
 ('phone as plain digits', '2645550142',
  "V1 strips only SPACES from what you type, and stores the number with dashes, so plain digits "
  "never match. V2 normalizes digits and does match - that IS the difference under comparison."),
]

def main():
    rows = fetch_collection()
    print(f'=== environment: {ENV} — V1 collection: {len(rows)} rows ===')
    if not rows: sys.exit('the collection came back empty; nothing below would mean anything')
    bad = []
    print('\n=== V1 FINDS OUR SEEDED RECORDS ===')
    for label, q, expect in CHECKS:
        hits = v1_search(rows, q)
        # 🔴 COMPARE AGAINST THE SPACE-STRIPPED BLOB. V1 stores its `search` text with EVERY
        # space removed - a vehicle reads
        # "zzautotestfibridgecommercial2019freightlinercascadiatrk4121fujgldr9clbp8834ohzzt412" -
        # which is the other half of the rule everyone remembers only one side of: the query loses
        # its spaces because the STORED TEXT has none either. Looking for the literal 'TRK 412'
        # in there finds nothing and reads exactly like a missing asset. It is not; it is a
        # space. (The blob keeps DASHES, which is why the phone-format table in playbook O2 still
        # holds: 4195550143 does not match 419-555-0143.)
        def _sq(x): return re.sub(r'\s+', '', str(x).lower())
        found = [h for h in hits
                 if _sq(expect) in _sq(f"{h.get('label')} {h.get('search')}")]
        mark = '✅' if found else '🔴'
        who = str(found[0].get('label'))[:40] if found else f'NOT FOUND (of {len(hits)} rows)'
        print(f'  {mark} {label:24} {q!r:36} -> {who}')
        if not found: bad.append((label, q))

    print('\n=== EXPECTED V1 MISSES — these are the comparison, not a broken seed ===')
    for label, q, why in EXPECTED_MISSES:
        hits = v1_search(rows, q)
        mark = '✅ still true' if not hits else '🔶 V1 NOW FINDS IT — re-read the note'
        print(f'  {mark:32} {label:22} {q!r}')
        print(f'      {why}')

    print('\n=== summary ===')
    if bad:
        print(f'  🔴 {len(bad)} record(s) V1 could not find:')
        for b in bad: print(f'     {b[0]} / {b[1]!r}')
        sys.exit(1)
    print(f'  ✅ V1 on {ENV} returns every seeded record checked ({len(CHECKS)} checks)')

main()
