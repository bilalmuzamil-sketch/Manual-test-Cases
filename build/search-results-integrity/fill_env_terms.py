#!/usr/bin/env python3
"""Bring an environment's terms file up to the REFERENCE environment's coverage - measured, never copied.

For every field-key the reference (production, 111/111) holds and this environment does not, try
candidate terms in order and keep the FIRST one the search proves: the response must carry a row
of the right group whose match.field is the field the case tests (Rule 110 attribution), or - for
'exact' identifiers - the row whose number IS the term (identity). Candidates are this environment's
OWN values first (branch-assigned numbers, VINs, staff names - Rule 111), then the reference term,
which is right only when it is one of our seeded words and so the same everywhere.
    SEED_PROFILE=/tmp/sv10740/cookies.json python3 fill_env_terms.py [--write]
"""
import json, os, re, sys, time, urllib.parse, runpy
WRITE = '--write' in sys.argv   # read BEFORE argv is reset for seed.py
HERE = os.path.dirname(os.path.abspath(__file__))
SEED = os.path.join(HERE, '..', 'global-search', 'seeding')
PROF = os.environ.get('SEED_PROFILE', '/tmp/qa/cookies.json')
ENV = 'qa' if PROF == '/tmp/qa/cookies.json' else os.path.basename(os.path.dirname(PROF))
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest.json'); sys.argv = sys.argv[:1] + ['x']
cwd = os.getcwd(); os.chdir(SEED); S = runpy.run_path('seed.py', run_name='x'); os.chdir(cwd)
call = S['call']
REF = json.load(open(os.path.join(HERE, 'discovered-terms-prod.json')))
TF = os.path.join(HERE, f'discovered-terms-{ENV}.json'); T = json.load(open(TF))
def jload(name):
    try: return json.load(open(os.path.join(SEED, name)))
    except Exception: return {}
staff = jload(f'wo-staff-assignment-{ENV}.json')
ids = jload(f'identifiers-{ENV}.json') or json.load(open(os.path.join(HERE, '..', 'global-search',
                                                                   'sv10740-fuzzy', f'identifiers-{ENV}.json')))
idv = {r['field']: r['value'] for r in ids if r.get('value')}
po = idv.get('PO number', '')
# This environment's OWN values for the keys whose answer is environment data.
OWN = {
 'work_orders.number_typed': [idv.get('WO number')],
 'assets.vin_full': [idv.get('VIN')],
 'purchase_orders.number_variants': [re.sub(r'^[A-Z]+', '', po).replace('-', ''), po.replace('-', '')],
 'work_orders.lead_technician_name': [(staff.get('tech') or [None, None, None])[2]],
 'work_orders.service_advisor_name': [(staff.get('advisor') or [None, None, None])[2]],
 # the display name of whoever seeded this environment's purchase orders (read off the PO list's
 # orderedBy: 'Admin ShopView' on sv10740, 'No Reports' on production)
 'purchase_orders.created_by': ['Admin ShopView', 'No Reports'],
}
# Pairs whose reference term is environment data: a truck model shared by 2+ work orders.
OWN_PAIRS = {'work_orders.asset_model': ['389', '567', 'T680', '328']}
def probe(term, group, field, kind):
    r = call('/api/search?q=' + urllib.parse.quote(term))
    if r['status'] != 200: return None
    d = r['json']['data']
    rows = [i for g in d['groups'] if g['type'] == group for i in (g.get('items') or [])]
    if d.get('pinned') and d['pinned'].get('type') == group: rows.insert(0, d['pinned'])
    norm = lambda x: re.sub(r'[^A-Za-z0-9]', '', x or '').upper()
    if field == 'status':
        # 'status' is not a match field - the status_spread row needs ONE term whose work-order rows
        # carry several different statuses. Proven by the statuses actually returned (3 or more).
        sts = {(i.get('fields') or {}).get('status') for i in rows} - {None}
        return rows[0] if len(sts) >= 3 else None
    for i in rows:
        m = i.get('match') or {}
        if m.get('field') == field or (kind == 'exact' and norm(i.get('primary')) == norm(term)):
            return i
    return None
added, still = [], []
for key, ref in REF['found'].items():
    if key in T['found']: continue
    cands = [c for c in OWN.get(key, []) if c] + [ref['term']]
    hit = None
    for c in cands:
        for attempt in range(2):
            i = probe(c, ref['group'], ref['field'], ref.get('kind'))
            if i: hit = (c, i); break
            time.sleep(2)
        if hit: break
    if not hit:
        still.append(key); print(f'🔴 {key:38} no candidate proven ({cands})'); continue
    c, i = hit
    T['found'][key] = dict(ref, term=c, highlight=(i.get('match') or {}).get('highlight') or c,
                          primary=i.get('primary'), secondary=i.get('secondary'),
                          note=f'measured on {ENV} {time.strftime("%Y-%m-%d")} by fill_env_terms.py; '
                               f'match field {(i.get("match") or {}).get("field")} '
                               f'({"own value" if c != ref["term"] else "same seeded word as production"})')
    added.append(key); print(f'✅ {key:38} {c!r:28} -> {i.get("primary")}  [{(i.get("match") or {}).get("field")}]')
for key, ref in REF['pairs'].items():
    if key in T['pairs']: continue
    rows, term = [], None
    for c in OWN_PAIRS.get(key, []) + [ref['term']]:
        r = call('/api/search?q=' + urllib.parse.quote(c))
        rows = [i for g in r['json']['data']['groups'] if g['type'] == ref['group'] for i in g['items']
                if (i.get('match') or {}).get('field') == ref['field']]
        if len({i['id'] for i in rows}) >= 2: term = c; break
    if term:
        T['pairs'][key] = dict(ref, term=term, count=len(rows), note=f'measured on {ENV} {time.strftime("%Y-%m-%d")}',
                               rows=[{'primary': i.get('primary'), 'secondary': i.get('secondary')} for i in rows[:6]])
        added.append('pair ' + key); print(f'✅ pair {key:33} {term!r} -> {len(rows)} distinct rows')
    else:
        still.append('pair ' + key); print(f'🔴 pair {key:33} {ref["term"]!r} -> {len(rows)} rows (needs 2)')
print(f'\n{len(added)} added, {len(still)} still unproven: {still}')
if WRITE:
    json.dump(T, open(TF, 'w'), indent=1); print(f'written {os.path.basename(TF)}')
