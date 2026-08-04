#!/usr/bin/env python3
"""Re-sync the LOCAL Schedule case source FROM LIVE TestRail before regenerating
anything.  This trap fired three times on 2026-08-04 on other projects: a stale local
source silently reverted provenance lines and once wiped 47 warnings.  So: live is the
truth, local is the mirror, and the mirror is refreshed FIRST.

Retired bodies (not live under group 4254) are left alone and marked so, never deleted.
"""
import json, os, glob, csv, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..')
LIVE = os.path.join(ROOT, 'build/schedule/viu-2026-08-04/snapshots/live-pull-after.json')

live = {c['id']: c for c in json.load(open(LIVE))['cases']}
idm = {r['testrail_case_id'].lstrip('C'): r['internal_id']
       for r in csv.DictReader(open(os.path.join(ROOT, 'build/schedule/testrail-id-map.csv')))}
by_internal = {v: int(k) for k, v in idm.items()}

changed = tot = retired = 0
for f in sorted(glob.glob(os.path.join(ROOT, 'build/schedule/cases/*.json'))):
    d = json.load(open(f))
    arr = d if isinstance(d, list) else d.get('cases', [])
    dirty = False
    for c in arr:
        tot += 1
        cid = by_internal.get(c.get('id') or c.get('internal_id'))
        if cid is None or cid not in live:
            if c.get('status') != 'Retired':
                c['status'] = 'Retired'; dirty = True
            retired += 1
            continue
        L = live[cid]
        for local_key, live_key in (('title', 'title'), ('preconditions', 'custom_preconds'),
                                    ('steps', 'custom_steps'), ('expected', 'custom_expected'),
                                    ('refs', 'refs')):
            if local_key in c and c[local_key] != L.get(live_key):
                c[local_key] = L.get(live_key); dirty = True; changed += 1
        if c.get('testrail_case_id') != cid:
            c['testrail_case_id'] = cid; dirty = True
    if dirty:
        json.dump(d, open(f, 'w'), indent=1, ensure_ascii=False)
        print('refreshed', os.path.basename(f))
print(f'local bodies {tot} | fields refreshed from live {changed} | not-live (Retired) {retired} | live {len(live)}')
