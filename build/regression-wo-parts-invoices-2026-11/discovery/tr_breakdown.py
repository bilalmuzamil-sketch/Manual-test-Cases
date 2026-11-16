#!/usr/bin/env python3
"""Read-only: case counts per child section under given TestRail section ids (project 1, suite 1). SECRET-FREE."""
import sys, json, collections
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools')
import tr_client as T
def paged(path, key):
    out, off = [], 0
    while True:
        st, r = T.get(f"{path}&limit=250&offset={off}"); assert st == 200, (st, str(r)[:200])
        out += r.get(key, []); 
        if not r.get('_links', {}).get('next'): break
        off += 250
    return out
secs = paged('get_sections/1&suite_id=1', 'sections'); byid = {s['id']: s for s in secs}
cases = paged('get_cases/1&suite_id=1', 'cases'); cnt = collections.Counter(c['section_id'] for c in cases)
def desc(i):
    d = {i}; ch = True
    while ch:
        ch = False
        for s in secs:
            if s.get('parent_id') in d and s['id'] not in d: d.add(s['id']); ch = True
    return d
out = {}
for root in map(int, sys.argv[2:]):
    kids = [s for s in secs if s.get('parent_id') == root]
    rows = [{'id': k['id'], 'name': k['name'], 'cases': sum(cnt[i] for i in desc(k['id'])),
             'updated_latest': max([c['updated_on'] for c in cases if c['section_id'] in desc(k['id'])] or [0])} for k in kids]
    out[root] = {'name': byid[root]['name'], 'own': cnt[root], 'children': sorted(rows, key=lambda r: -r['cases'])}
    print('==', root, byid[root]['name'], 'own', cnt[root])
    import datetime
    for r in out[root]['children']: print(f"  {r['cases']:4d}  S{r['id']}  {r['name'][:90]}  last-updated {datetime.datetime.utcfromtimestamp(r['updated_latest']).date() if r['updated_latest'] else '-'}")
json.dump(out, open(sys.argv[1], 'w'), indent=1)
