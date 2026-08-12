#!/usr/bin/env python3
"""What actually MOVED on each case between the earliest committed 11-August PRE
snapshot and live now: the automation marker, the title, or the assertion body.

The PRE snapshots were taken by each project's read-dates pass — the first bulk write
of 11 August. Cases written EARLIER on 11 August (Schedule's panel-collapse, labels,
staged-push) are already post-those-writes in this baseline, and that is stated in the
deliverable rather than glossed.
"""
import json, re, sys
sys.path.insert(0, '/tmp/hand12')
from tr import api

ROOT = '/home/user/Manual-test-Cases'
PRE = {'Filters': 'filters', 'Schedule': 'schedule', 'Report Suite': 'report-suite'}
GROUPS = {'Filters': 4110, 'Schedule': 4254, 'Report Suite': 4281}
MARKER = re.compile(r'AUTOMATION:\s*(READY - EXPECT FAIL[^\n\r]*|READY|HOLD[^\n\r]*)')


def norm(s):
    return (s or '').replace('\r', '')


def marker(exp):
    m = MARKER.search(norm(exp))
    return m.group(1).strip() if m else None


def body(exp):
    e = norm(exp)
    return e.rsplit('\n---\n', 1)[0].strip() if '\n---\n' in e else e.strip()


def paged(path, key):
    out, off = [], 0
    while True:
        d, s = api(f'{path}&limit=250&offset={off}')
        it = d.get(key, d) if isinstance(d, dict) else d
        out += it
        if len(it) < 250:
            break
        off += 250
    return out


sections = paged('get_sections/1&suite_id=1', 'sections')
cases = paged('get_cases/1&suite_id=1', 'cases')


def desc(root):
    bp = {}
    for s in sections:
        bp.setdefault(s.get('parent_id'), []).append(s)
    out, stack = set(), [root]
    while stack:
        c = stack.pop(); out.add(c)
        for ch in bp.get(c, []):
            stack.append(ch['id'])
    return out


res = {}
for proj, slug in PRE.items():
    pre = json.load(open(f'{ROOT}/build/{slug}/read-dates-2026-08-11/snapshots/cases-PRE.json'))
    ids = desc(GROUPS[proj])
    live = {c['id']: c for c in cases if c.get('section_id') in ids and c.get('created_by') == 3}
    mv, tt, bd, new = [], [], [], []
    for cid, lc in live.items():
        p = pre.get(str(cid))
        if not p:
            new.append(cid); continue
        m0, m1 = marker(p.get('custom_expected')), marker(lc.get('custom_expected'))
        if m0 != m1:
            mv.append({'id': cid, 'from': m0, 'to': m1, 'title': lc['title']})
        if norm(p.get('title')) != norm(lc.get('title')):
            tt.append({'id': cid, 'from': p.get('title'), 'to': lc.get('title')})
        if body(p.get('custom_expected')) != body(lc.get('custom_expected')) \
           or norm(p.get('custom_steps')) != norm(lc.get('custom_steps')) \
           or norm(p.get('custom_preconds')) != norm(lc.get('custom_preconds')):
            bd.append(cid)
    res[proj] = {'marker_moved': mv, 'title_changed': tt, 'body_changed': sorted(bd),
                 'created_after_snapshot': sorted(new)}
    print(f'\n=== {proj}')
    print(f'  marker moved      : {len(mv)}')
    for x in mv:
        print(f'     C{x["id"]}  {x["from"]}  ->  {x["to"]}')
    print(f'  title changed     : {len(tt)}  {[x["id"] for x in tt]}')
    print(f'  steps/preconds/assertion changed : {len(bd)}  {res[proj]["body_changed"][:40]}')
    print(f'  created after the snapshot       : {len(new)}  {res[proj]["created_after_snapshot"]}')

json.dump(res, open('/tmp/hand12/markerdiff.json', 'w'), indent=1)
