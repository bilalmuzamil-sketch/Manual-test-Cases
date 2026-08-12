#!/usr/bin/env python3
"""The 91 held cases: hold reason, and the latest GRADED result recorded against them.

A result row with status_id = None is a comment/assignment update, NOT a grading, and is
excluded — counting those would overstate how many held cases carry a verdict.
READ ONLY (get_* only).
"""
import json, sys
sys.path.insert(0, '/tmp/h3')
from tr import api

C = json.load(open('/tmp/h3/census.json'))
STATUS = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}
RUNS = {'Filters': 352, 'Schedule': 357, 'Report Suite': 359}


def paged(p, k):
    out, off = [], 0
    while True:
        d, s = api(f'{p}&limit=250&offset={off}')
        it = d.get(k, d) if isinstance(d, dict) else d
        out += it
        if len(it) < 250:
            break
        off += 250
    return out


users = {}
for uid in range(1, 15):
    d, s = api(f'get_user/{uid}')
    if s == 200 and d.get('name'):
        users[uid] = d['name']

out, tot, gtot, ptot = {}, 0, 0, 0
tally = {}
for proj, run in RUNS.items():
    res = paged(f'get_results_for_run/{run}', 'results')
    holds = [r for r in C[proj]['rows'] if not r['foreign'] and r['kind'] == 'HOLD']
    hid = {h['id'] for h in holds}
    latest = {}
    for r in res:
        cid = r.get('case_id')
        if cid in hid and r.get('status_id') in STATUS:      # GRADED only
            p = latest.get(cid)
            if p is None or r['created_on'] > p['created_on']:
                latest[cid] = r
    rows = []
    for h in sorted(holds, key=lambda x: x['id']):
        r = latest.get(h['id'])
        rows.append({
            'id': h['id'], 'title': h['title'], 'reason': h['reason'],
            'status': STATUS[r['status_id']] if r else None,
            'graded_by': users.get(r['created_by'], str(r['created_by'])) if r else None,
            'graded_on': r['created_on'] if r else None,
        })
    n_g = sum(1 for x in rows if x['status'])
    n_p = sum(1 for x in rows if x['status'] == 'Passed')
    n_o = n_g - n_p
    tot += len(rows); gtot += n_g; ptot += n_p
    tally[proj] = {'held': len(rows), 'graded': n_g, 'passed': n_p, 'other': n_o}
    out[proj] = rows
    print(f'{proj:14} held={len(rows):3}  graded={n_g:3}  Passed={n_p:3}  other={n_o:3}')
    for x in rows:
        if x['status']:
            print(f'     C{x["id"]}  {x["status"]:8} by {x["graded_by"]}')

print(f'\nTOTAL held={tot}  graded={gtot}  Passed={ptot}  other={gtot-ptot}')
json.dump({'rows': out, 'users': users, 'tally': tally},
          open('/tmp/h3/holds.json', 'w'), indent=1)
