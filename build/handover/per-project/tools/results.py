#!/usr/bin/env python3
"""Latest GRADED result per case, per run — READ ONLY (get_* only).

A result row with status_id = None is a comment/assignment update, not a grading,
and is excluded: counting those would overstate how many cases carry a verdict.
"""
import json
import sys

sys.path.insert(0, '/tmp/h3')
from tr import api

ST = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}
RUNS = {'Filters': 352, 'Schedule': 357, 'Report Suite': 359}


def paged(p, k):
    out, off = [], 0
    while True:
        d, s = api(f'{p}&limit=250&offset={off}')
        if s != 200:
            raise SystemExit(f'HTTP {s} on {p}')
        it = d.get(k, d) if isinstance(d, dict) else d
        out += it
        if len(it) < 250:
            break
        off += 250
    return out


users = {}
for u in range(1, 16):
    d, s = api(f'get_user/{u}')
    if s == 200 and d.get('name'):
        users[u] = d['name']

out = {}
for proj, run in RUNS.items():
    tests = paged(f'get_tests/{run}', 'tests')
    res = paged(f'get_results_for_run/{run}', 'results')
    bt = {t['id']: t['case_id'] for t in tests}
    latest = {}
    for r in res:
        cid = bt.get(r['test_id'])
        if cid and r.get('status_id') in ST:
            if cid not in latest or r['created_on'] > latest[cid]['created_on']:
                latest[cid] = r
    out[proj] = {str(c): {'status': ST[r['status_id']],
                          'by': users.get(r['created_by'], str(r['created_by'])),
                          'on': r['created_on']}
                 for c, r in latest.items()}
    from collections import Counter
    print(proj, 'run', run, 'tests', len(tests), 'result rows', len(res),
          'graded cases', len(latest), dict(Counter(v['status'] for v in out[proj].values())))

json.dump({'users': users, 'results': out}, open('/tmp/h3/results.json', 'w'), indent=1)
