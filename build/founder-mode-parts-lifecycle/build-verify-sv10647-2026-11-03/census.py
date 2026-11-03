# Live census of TestRail group 20439 (Parts Lifecycle) — paged, read-only; snapshots every case to before/.
import sys, os, json, re, collections, time
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); ROOT = 20439
secs, off = [], 0
while True:
    r = L.call(f'get_sections/1&suite_id=1&limit=250&offset={off}'); s = r['sections'] if isinstance(r, dict) else r
    secs += s
    if len(s) < 250: break
    off += 250
by = {s['id']: s for s in secs}
def under(i):
    while i:
        if i == ROOT: return True
        i = by[i]['parent_id']
    return False
mine = [s for s in secs if under(s['id'])]
cases = []
for s in mine:
    off = 0
    while True:
        r = L.call(f'get_cases/1&suite_id=1&section_id={s["id"]}&limit=250&offset={off}'); c = r['cases'] if isinstance(r, dict) else r
        cases += c
        if len(c) < 250: break
        off += 250
print('sections', len(mine), 'cases', len(cases))
for s in sorted(mine, key=lambda s: (s['depth'], s['display_order'])):
    n = sum(1 for c in cases if c['section_id'] == s['id'])
    print(f"  S{s['id']} d{s['depth']} {s['name'][:70]} -> {n}")
print('created_by', collections.Counter(c['created_by'] for c in cases))
print('updated_by', collections.Counter(c['updated_by'] for c in cases))
print('atmstatus', collections.Counter(c.get('custom_atmstatus') for c in cases))
mk = collections.Counter()
for c in cases:
    m = re.findall(r'AUTOMATION:[^<]*', c.get('custom_expected') or '')
    mk[(m[0][:70] if len(m) == 1 else f'{len(m)} markers')] += 1
for k, v in mk.most_common(): print(f'  {v:4d} {k}')
st = collections.Counter(('stamped' if 'Last checked against build' in (c.get('custom_expected') or '') else 'not stamped') for c in cases); print(st)
print('last update', time.strftime('%Y-%m-%d %H:%M', time.gmtime(max(c['updated_on'] for c in cases))))
for c in cases: json.dump(c, open(f"{D}/before/C{c['id']}.json", 'w'), indent=1)
json.dump({'sections': mine, 'ids': [c['id'] for c in cases]}, open(f'{D}/census.json', 'w'), indent=1)
