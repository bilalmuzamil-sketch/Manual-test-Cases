#!/usr/bin/env python3
"""Re-sync the LOCAL case source FROM LIVE TestRail before regenerating deliverables.

Read-only against TestRail.  The 2026-08-06 live pass rewrote all 168 expected
fields and 20 preconds/steps in TestRail without the local source being updated,
so regenerating the import from stale local text would ship stale rows.
Text fields only - viu_status and notes are our own metadata and are not touched.
"""
import json, glob, os
live = {c['id']: c for c in json.load(open('/tmp/sch-panel/tr/live-snapshot-POST.json'))}
base = '/home/user/Manual-test-Cases/build/schedule/cases'
changed = {'title': 0, 'preconditions': 0, 'steps': 0, 'expected': 0, 'refs': 0}
files = 0
for f in sorted(glob.glob(base + '/*.json')):
    arr = json.load(open(f))
    if not isinstance(arr, list):
        continue
    dirty = False
    for c in arr:
        cid = c.get('testrail_case_id')
        if not cid or cid not in live:
            continue
        L = live[cid]
        for local_key, live_key in [('title', 'title'), ('preconditions', 'custom_preconds'),
                                    ('steps', 'custom_steps'), ('expected', 'custom_expected'),
                                    ('refs', 'refs')]:
            new = L.get(live_key) or ''
            cur = c.get(local_key)
            cur = '\n'.join(cur) if isinstance(cur, list) else (cur or '')
            if cur != new:
                c[local_key] = new
                changed[local_key] += 1
                dirty = True
    if dirty:
        json.dump(arr, open(f, 'w'), indent=1, ensure_ascii=False)
        files += 1
print('files rewritten:', files)
print('fields synced from live:', changed)
