#!/usr/bin/env python3
"""PRE-WRITE SNAPSHOT of the 53 build-verified cases + the shape of their expected field.

Nothing is written here. This establishes, per case:
  * the exact current AUTOMATION: marker line (there must be exactly one)
  * the exact current provenance line(s) (Rule 54 sentence 1, and whether sentence 2 exists)
  * the field's block structure, so the replacement can be surgical
A snapshot is taken FIRST so any damage is diffable (Rule 87).
"""
import json, base64, urllib.request, re, collections, os

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
OUT = f'{DIR}/markers'

def get(p):
    r = urllib.request.Request(B + p)
    r.add_header('Authorization', 'Basic ' + A)
    with urllib.request.urlopen(r, timeout=60) as x:
        return json.loads(x.read().decode())

ver = json.load(open(f'{DIR}/verification.json'))
cids = sorted(int(c) for c, r in ver['cases'].items() if r['verdict'] == 'RUNNABLE')
print(f'build-verified cases to mark: {len(cids)}')

snap, shapes = {}, collections.Counter()
for i, cid in enumerate(cids, 1):
    c = get(f'get_case/{cid}')
    exp = c.get('custom_expected') or ''
    markers = re.findall(r'AUTOMATION:[^\n<]*', exp)
    prov = re.findall(r'This is the expected behaviour as per[^\n<]*', exp)
    last = re.findall(r'Last checked against build[^\n<]*', exp)
    snap[cid] = {'id': cid, 'title': c['title'], 'section_id': c['section_id'],
                 'atm': c.get('custom_atmstatus'), 'refs': c.get('refs'),
                 'updated_by': c.get('updated_by'), 'created_by': c.get('created_by'),
                 'custom_expected': exp, 'custom_steps': c.get('custom_steps'),
                 'custom_preconds': c.get('custom_preconds'),
                 'markers': markers, 'provenance': prov, 'build_sentence': last}
    shapes[(len(markers), len(prov), len(last))] += 1
    if i % 15 == 0: print(f'  {i}/{len(cids)}')

os.makedirs(OUT, exist_ok=True)
json.dump(snap, open(f'{OUT}/PRE-markers-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print('\n(markers, provenance-lines, build-sentences) -> cases')
for k, v in sorted(shapes.items()): print(f'  {k} -> {v}')
print('\ndistinct marker texts:')
for m, n in collections.Counter(m for s in snap.values() for m in s['markers']).most_common():
    print(f'  {n:>3}x  {m!r}')
print('\ndistinct build sentences:')
for m, n in collections.Counter(m for s in snap.values() for m in s['build_sentence']).most_common():
    print(f'  {n:>3}x  {m!r}')
print(f'\natm values: {collections.Counter(s["atm"] for s in snap.values())}')
print(f'created_by: {collections.Counter(s["created_by"] for s in snap.values())}')
