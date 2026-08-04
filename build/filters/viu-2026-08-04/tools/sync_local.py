#!/usr/bin/env python3
"""Re-sync the LOCAL Filters case source FROM LIVE TestRail (read-only on TestRail).

The trap this exists to stop: a stale local source silently reverts provenance lines
and wipes warning text on the next push.  So the local bodies are made byte-identical
to live BEFORE anything is planned.
"""
import json, os, sys, glob, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..', '..'))
CASEDIR = os.path.join(ROOT, 'build', 'filters', 'cases')
LIVE = json.load(open('/tmp/fviu/live-cases-4110.json'))
live_by_id = {c['id']: c for c in LIVE}

idmap = {}
for ln in open(os.path.join(ROOT, 'build', 'filters', 'testrail-id-map.csv')).read().splitlines()[1:]:
    if not ln.strip():
        continue
    import csv, io
    r = next(csv.reader(io.StringIO(ln)))
    idmap[r[0]] = r[1]

def fmt(v):
    return v if isinstance(v, str) else ('' if v is None else str(v))

changed, missing = [], []
for f in sorted(glob.glob(os.path.join(CASEDIR, 'cases-*.json'))):
    data = json.load(open(f))
    dirty = False
    for c in data:
        if str(c.get('viu_status', '')).startswith('Retired'):
            continue
        cid = idmap.get(c['id'])
        if not cid:
            missing.append(c['id']); continue
        L = live_by_id.get(int(cid[1:]) if cid.startswith('C') else int(cid))
        if not L:
            missing.append(c['id']); continue
        want = {'title': L['title'], 'preconditions': fmt(L.get('custom_preconds')),
                'steps': fmt(L.get('custom_steps')), 'expected': fmt(L.get('custom_expected')),
                'refs': fmt(L.get('refs')), 'section_id': L['section_id'],
                'testrail_id': cid}
        for k, v in want.items():
            if c.get(k) != v:
                changed.append((c['id'], cid, k))
                c[k] = v
                dirty = True
    if dirty:
        json.dump(data, open(f, 'w'), indent=1, ensure_ascii=False)
        print('rewrote', os.path.basename(f))
print('fields re-synced from live:', len(changed))
import collections
print(collections.Counter(k for _, _, k in changed))
print('unmapped:', missing)
