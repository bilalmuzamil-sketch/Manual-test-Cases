#!/usr/bin/env python3
"""SV-10740 — the "What correctly does NOT match" table, made runnable on THIS environment.
The ticket's values (S3-31627, I3-721, P3-132 ...) are staging numbers; a QA branch assigns its
own (S10740-..., I10740-..., P10740-...). For each identifier field this finds a REAL value here,
then proves three things by IDENTITY (Rule 110/111): exact -> our record; punctuation stripped ->
our record; one character wrong -> genuinely returns no record of that type (probed, not assumed).
    SEED_PROFILE=/tmp/sv10740/cookies.json python3 measure_identifiers.py
"""
import json, os, re, sys, urllib.parse, runpy
SEED = '/home/user/Manual-test-Cases/build/global-search/seeding'
os.environ.setdefault('SEED_MANIFEST', 'seed-manifest.json'); sys.argv = ['seed.py']
cwd = os.getcwd(); os.chdir(SEED); S = runpy.run_path('seed.py', run_name='x'); os.chdir(cwd)
call = S['call']
def items(q, typ):
    r = call('/api/search?q=' + urllib.parse.quote(q))
    if r['status'] != 200: return None
    return [i for g in r['json']['data']['groups'] if g['type'] == typ for i in (g.get('items') or [])]
def pick(q, typ, pat):
    """A real value: search q, keep the first row of this type whose primary matches pat."""
    for i in items(q, typ) or []:
        if re.fullmatch(pat, i.get('primary') or ''): return i
def wrong_variants(v):
    """One character changed, last digit/letter first - a near miss, never a guess at absence."""
    out = []
    for pos in range(len(v) - 1, -1, -1):
        c = v[pos]
        pool = '0123456789' if c.isdigit() else ('ABCDEFGHJKLMNPRSTUVWXYZ' if c.isalpha() else '')
        for n in pool:
            if n != c: out.append(v[:pos] + n + v[pos + 1:])
    return out
ROWS = [  # tab, field, how to find a real value here, primary pattern
 ('work_orders', 'WO number', 'S10740-17584', r'S\d+-\d+'),
 ('purchase_orders', 'PO number', 'I10740-1402', r'I\d+-\d+'),
 ('vendor_invoices', 'Invoice number', 'ZZTINV-FZABADI-DI01', r'.+'),
 ('assets', 'VIN', '1FUJGLDR9CLBP8834', r'.+'),
 ('parts', 'Part number', 'ZZFIELDPN-7781', r'.+'),
 ('part_sales', 'P-number', 'P10740-256', r'P\d+-\d+'),
]
res = []
for typ, field, seedval, pat in ROWS:
    rec = pick(seedval, typ, pat)
    if not rec:
        res.append({'tab': typ, 'field': field, 'value': seedval, 'verdict': 'NO VALUE FOUND HERE'})
        print(f'{typ:16} {field:15} {seedval:22} NO VALUE FOUND'); continue
    rid, val = rec['id'], (seedval if typ in ('assets', 'parts') else rec['primary'])
    stripped = re.sub(r'[^A-Za-z0-9]', '', val)
    exact_ok = any(i['id'] == rid for i in items(val, typ) or [])
    strip_ok = any(i['id'] == rid for i in items(stripped, typ) or [])
    # 🔴 NEVER "the first variant that returns nothing": a variant that wrongly fuzzy-matches OUR
    # record would be skipped and the very defect this row tests would be hidden. Walk the variants
    # in order; our record coming back is a FINDING; a variant that IS another real record (its own
    # exact value exists here) is skipped as not a near miss; anything else is the near miss.
    norm = lambda x: re.sub(r'[^A-Za-z0-9]', '', x or '').upper()
    wrong, fuzzy_hit = None, None
    for w in wrong_variants(val)[:40]:
        got = items(w, typ) or []
        if any(i['id'] == rid for i in got):
            fuzzy_hit = w; break
        if any(norm(i.get('primary')) == norm(w) for i in got):
            continue
        wrong = w; break
    row = {'tab': typ, 'field': field, 'value': val, 'record_id': rid, 'primary': rec.get('primary'),
           'exact_finds_record': exact_ok, 'stripped': stripped, 'stripped_finds_record': strip_ok,
           'one_char_wrong': wrong, 'one_char_wrong_returned_our_record': fuzzy_hit,
           'verdict': ('PRODUCT FINDING - one character wrong still returns the record' if fuzzy_hit
                       else 'READY' if (exact_ok and strip_ok and wrong) else 'NOT READY')}
    res.append(row)
    print(f"{typ:16} {field:15} {val:22} exact {'✅' if exact_ok else '🔴'}  {stripped:20} "
          f"{'✅' if strip_ok else '🔴'}  wrong {wrong or fuzzy_hit or '🔴 none found':22} -> {row['verdict']}")
env = os.path.basename(os.path.dirname(os.environ.get('SEED_PROFILE', '')))
json.dump(res, open(f'identifiers-{env}.json', 'w'), indent=1); print(f'written identifiers-{env}.json')

# A DATA gap fails the step; a product verdict (typo not forgiven, or an identifier fuzzy-matched)
# does NOT - that is what the tester is there to record, and it is the same on an unfixed build.
if any(r['verdict'] in ('NO VALUE FOUND HERE', 'NOT READY') for r in res):
    sys.exit('🔴 DATA GAP - a row has no record to test on this environment; reseed before testing')
