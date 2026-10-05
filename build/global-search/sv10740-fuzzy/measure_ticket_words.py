#!/usr/bin/env python3
"""SV-10740 — measure the ticket's own words on an environment (read-only).
For each row: search the CORRECT word, then the one-letter TYPO, on the tab the ticket names.
"Found" is judged by IDENTITY (Rule 110): a record the correct word returns must also be in the
typo's results - a non-empty list is not a pass (Part Sales 'Adrxan' returned ten wrong rows).
    SEED_PROFILE=/tmp/sv10740/cookies.json python3 measure_ticket_words.py
"""
import json, os, sys, time, urllib.parse, runpy
SEED = '/home/user/Manual-test-Cases/build/global-search/seeding'
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest.json'); sys.argv = ['seed.py']
cwd = os.getcwd(); os.chdir(SEED); S = runpy.run_path('seed.py', run_name='x'); os.chdir(cwd)
call = S['call']
ROWS = [  # tab group, correct word, typo  — verbatim from SV-10740 "Every tab, measured"
 ('all', 'Maria', 'Maxia'), ('work_orders', 'Santa', 'Saxta'), ('customers', 'Greene', 'Grexne'),
 ('assets', 'Johnson', 'Johxson'), ('parts', 'Cleaner', 'Clexner'), ('vendors', 'Ranking', 'Ranxing'),
 ('part_sales', 'Adrian', 'Adrxan'), ('purchase_orders', 'Adams', 'Adxms'),
 ('vendor_invoices', 'Abadi', 'Abxdi')]
def groups(q):
    r = call('/api/search?q=' + urllib.parse.quote(q))
    if r['status'] != 200: return None, r['status']
    return {g['type']: g for g in r['json']['data']['groups']}, 200
def rows(gs, tab):
    gl = gs.values() if tab == 'all' else [gs.get(tab) or {}]
    return [(g.get('type'), i) for g in gl for i in (g.get('items') or [])]
out = {'measured': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'host': S['C']['host'] if 'C' in S else None,
       'types': None, 'rows': []}
for tab, good, typo in ROWS:
    g1, s1 = groups(good); g2, s2 = groups(typo)
    if out['types'] is None and g1: out['types'] = sorted(g1)
    if g1 is None or g2 is None:
        out['rows'].append({'tab': tab, 'word': good, 'typo': typo, 'error': f'HTTP {s1}/{s2}'})
        print(f"{tab:16} {good:8} 🔴 search answered HTTP {s1}/{s2} - NOT MEASURED"); continue
    r1, r2 = rows(g1, tab), rows(g2, tab)
    ids1 = {i['id'] for _, i in r1}; ids2 = {i['id'] for _, i in r2}
    both = [i for _, i in r2 if i['id'] in ids1]
    row = {'tab': tab, 'word': good, 'typo': typo,
           'correct_count': len(r1), 'correct_sample': [i.get('primary') for _, i in r1[:3]],
           'correct_fields': sorted({(i.get('match') or {}).get('field') for _, i in r1} - {None}),
           'typo_count': len(r2), 'typo_has_record': bool(both),
           'typo_sample': [i.get('primary') for _, i in r2[:3]],
           'verdict': ('NO DATA - the correct word finds nothing here' if not r1 else
                       'FOUND (typo forgiven)' if both else
                       'NOTHING AT ALL' if not r2 else 'RESULTS, BUT NOT THE RECORD')}
    out['rows'].append(row)
    print(f"{tab:16} {good:8} {len(r1):3} | {typo:8} {len(r2):3}  -> {row['verdict']:40} {row['correct_fields']}")
env = os.path.basename(os.path.dirname(os.environ.get('SEED_PROFILE', '')))
json.dump(out, open(f'ticket-words-{env}.json', 'w'), indent=1)
print(f'written ticket-words-{env}.json')

# A DATA gap fails the step; a product verdict (typo not forgiven, or an identifier fuzzy-matched)
# does NOT - that is what the tester is there to record, and it is the same on an unfixed build.
if any(r.get('verdict','').startswith('NO DATA') or 'error' in r for r in out['rows']):
    sys.exit('🔴 DATA GAP - a row has no record to test on this environment; reseed before testing')
