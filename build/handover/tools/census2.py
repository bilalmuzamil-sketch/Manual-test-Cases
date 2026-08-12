#!/usr/bin/env python3
"""Census pass 2 — stores the provenance tail per case so source/build verification
can be measured offline. READ ONLY (get_* only)."""
import json, sys, re
sys.path.insert(0, '/tmp/hand12')
from tr import api

PROJECTS = {'Filters': 4110, 'Schedule': 4254, 'Report Suite': 4281}
US = 3


def paged(path, key):
    out, off = [], 0
    while True:
        d, s = api(f'{path}&limit=250&offset={off}')
        if s != 200:
            raise SystemExit(f'HTTP {s}: {d}')
        items = d.get(key, d) if isinstance(d, dict) else d
        out += items
        if len(items) < 250:
            break
        off += 250
    return out


def descendants(sections, root):
    by_parent = {}
    for s in sections:
        by_parent.setdefault(s.get('parent_id'), []).append(s)
    out, stack = set(), [root]
    while stack:
        cur = stack.pop()
        out.add(cur)
        for ch in by_parent.get(cur, []):
            stack.append(ch['id'])
    return out


secs = paged('get_sections/1&suite_id=1', 'sections')
cases = paged('get_cases/1&suite_id=1', 'cases')

out = {}
for name, grp in PROJECTS.items():
    ids = descendants(secs, grp)
    rows = []
    for c in cases:
        if c.get('section_id') not in ids:
            continue
        exp = (c.get('custom_expected') or '').replace('\r', '')
        # provenance block = everything after the last '---' separator
        tail = exp.rsplit('\n---\n', 1)[-1] if '\n---\n' in exp else exp[-800:]
        rows.append({
            'id': c['id'], 'title': c['title'],
            'created_by': c.get('created_by'), 'updated_by': c.get('updated_by'),
            'updated_on': c.get('updated_on'), 'created_on': c.get('created_on'),
            'atm': c.get('custom_atmstatus'), 'refs': c.get('refs') or '',
            'foreign': c.get('created_by') != US,
            'prov': tail,
        })
    out[name] = rows
    print(f'{name}: {len(rows)} cases captured', file=sys.stderr)

json.dump(out, open('/tmp/hand12/prov.json', 'w'), indent=1)
print('written /tmp/hand12/prov.json', file=sys.stderr)
