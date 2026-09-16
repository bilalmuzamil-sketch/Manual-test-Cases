import sys, json, re
sys.path.insert(0, '.')
src = open('seed.py').read()
ns = {'__name__': 'notmain', '__file__': '/home/user/Manual-test-Cases/build/global-search/seeding/seed.py'}
exec(src[:src.index('# ─────')], ns)
call = ns['call']; ns['ensure_session']()
live = json.load(open('seed-state-live.json'))['live_ids']

blob = []          # every scalar value on every seeded record
def add(o, tag):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, (str, int, float)) and not isinstance(v, bool): blob.append((tag, k, str(v)))
            elif isinstance(v, (dict, list)): add(v, tag)
    elif isinstance(o, list):
        for x in o: add(x, tag)

def rows(path, coll='collection'):
    r = call(path)
    d = (r['json'] or {}).get('data', {}) or {}
    return d.get(coll) or (d if isinstance(d, list) else [])

for q, path, coll in [('ZZAUTOTEST', '/api/customers?search=ZZAUTOTEST&limit=25', 'collection'),
                      ('ZZT-4471', '/api/vehicles?search=ZZT-4471&limit=10', 'collection'),
                      ('ZZAUTOTEST', '/api/parts-catalogue/vendors?search=ZZAUTOTEST&limit=10', 'collection'),
                      ('ZZT-', '/api/parts-catalogue/catalogue-parts?search=ZZT-&limit=25', 'collection'),
                      ('ZZT-88', '/api/inventory/parts?search=ZZT-88&limit=10', 'collection'),
                      ('ZZAUTOTEST', '/api/part-sales?search=ZZAUTOTEST&limit=10', 'partSales')]:
    for x in rows(path, coll): add(x, path.split('?')[0])
# the company view carries contacts, and the work orders by id
c = call(f"/api/customers/view/{live['customer']}")
add(((c['json'] or {}).get('data') or {}).get('company') or {}, '/api/customers/view')
for wid in (live.get('work_orders') or []):
    w = call(f'/api/work-orders/view/{wid}')
    add(((w['json'] or {}).get('data') or {}).get('work_order') or {}, '/api/work-orders/view')

hay = {v.lower(): (tag, k) for tag, k, v in blob}
def carried(val):
    v = val.lower().strip()
    for hv, (tag, k) in hay.items():
        if v in hv: return f"{tag} · {k} = {hv[:44]}"
    squash = re.sub(r'[^a-z0-9]', '', v)
    if squash:
        for hv, (tag, k) in hay.items():
            if squash in re.sub(r'[^a-z0-9]', '', hv): return f"{tag} · {k} = {hv[:40]} (ignoring punctuation)"
    return None

vals = sorted({v for d in json.load(open('/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/mar/sweep-typed.json'))['with_values'].values() for v in d['typed']}, key=str.lower) \
    if False else sorted({v for d in json.load(open('/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/mar/sweep-typed.json'))['with_values'].values() for v in d['typed']}, key=str.lower)
ok, miss = [], []
for v in vals:
    w = carried(v)
    (ok if w else miss).append((v, w))
print(f"scalar values scanned across seeded records: {len(blob)}\n")
print(f"=== CARRIED BY A SEEDED RECORD ({len(ok)}) ===")
for v, w in ok: print(f"  OK   {v:<34} -> {w}")
print(f"\n=== NOT CARRIED BY ANY SEEDED RECORD ({len(miss)}) ===")
for v, _ in miss: print(f"  🔴   {v}")
json.dump({'carried': [v for v, _ in ok], 'missing': [v for v, _ in miss]}, open('/tmp/sweep-result.json', 'w'), indent=1)
