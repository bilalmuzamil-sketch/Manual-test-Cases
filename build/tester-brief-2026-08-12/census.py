#!/usr/bin/env python3
"""Live census of the three active suites: markers, hold reasons, and run contents.

Every number in the tester brief is derived HERE, from TestRail, not from any
document.  The counts have moved repeatedly today and a stale brief is worse
than none.
"""
import json, sys, re
sys.path.insert(0, '/tmp/job12')
from tr import api

PROJECTS = {
    'Filters':      {'group': 4110, 'run': 352},
    'Schedule':     {'group': 4254, 'run': 357},
    'Report Suite': {'group': 4281, 'run': 359},
}
MARKER = re.compile(r'AUTOMATION:\s*(READY - EXPECT FAIL[^\n]*|READY|HOLD[^\n]*)')

def all_sections(pid=1, sid=1):
    out, off = [], 0
    while True:
        d, s = api(f'get_sections/{pid}&suite_id={sid}&limit=250&offset={off}')
        secs = d.get('sections', d) if isinstance(d, dict) else d
        out += secs
        if isinstance(d, dict) and d.get('_links', {}).get('next'):
            off += 250; continue
        if len(secs) == 250: off += 250; continue
        break
    return out

def descendants(sections, root):
    by_parent = {}
    for s in sections: by_parent.setdefault(s.get('parent_id'), []).append(s)
    out, stack = set(), [root]
    while stack:
        cur = stack.pop()
        out.add(cur)
        for ch in by_parent.get(cur, []): stack.append(ch['id'])
    return out

def all_cases(pid=1, sid=1):
    out, off = [], 0
    while True:
        d, s = api(f'get_cases/{pid}&suite_id={sid}&limit=250&offset={off}')
        cs = d.get('cases', d) if isinstance(d, dict) else d
        out += cs
        if len(cs) < 250: break
        off += 250
    return out

def run_tests(rid):
    out, off = [], 0
    while True:
        d, s = api(f'get_tests/{rid}&limit=250&offset={off}')
        ts = d.get('tests', d) if isinstance(d, dict) else d
        out += ts
        if len(ts) < 250: break
        off += 250
    return out

secs = all_sections()
cases = all_cases()
print(f'live sections={len(secs)}  live cases={len(cases)}', file=sys.stderr)

report = {}
for name, cfg in PROJECTS.items():
    ids = descendants(secs, cfg['group'])
    mine = [c for c in cases if c.get('section_id') in ids]
    rows = []
    for c in mine:
        exp = c.get('custom_expected') or ''
        m = MARKER.search(exp)
        marker = m.group(1).strip() if m else None
        kind = ('HOLD' if marker and marker.startswith('HOLD')
                else 'EXPECT FAIL' if marker and 'EXPECT FAIL' in marker
                else 'READY' if marker == 'READY' else 'NONE')
        reason = marker[len('HOLD'):].lstrip(' -').strip() if kind == 'HOLD' else None
        rows.append({'id': c['id'], 'title': c['title'], 'kind': kind,
                     'marker': marker, 'reason': reason, 'section_id': c['section_id']})
    tests = run_tests(cfg['run'])
    run_cids = sorted(t['case_id'] for t in tests)
    report[name] = {
        'group': cfg['group'], 'run': cfg['run'],
        'total': len(rows),
        'ready': sum(1 for r in rows if r['kind'] == 'READY'),
        'expect_fail': sum(1 for r in rows if r['kind'] == 'EXPECT FAIL'),
        'hold': sum(1 for r in rows if r['kind'] == 'HOLD'),
        'no_marker': sum(1 for r in rows if r['kind'] == 'NONE'),
        'run_tests': len(run_cids),
        'in_suite_not_in_run': sorted(set(r['id'] for r in rows) - set(run_cids)),
        'in_run_not_in_suite': sorted(set(run_cids) - set(r['id'] for r in rows)),
        'rows': rows,
    }
    r = report[name]
    print(f"{name:14} total={r['total']:4} READY={r['ready']:4} EXPECT-FAIL={r['expect_fail']:3} "
          f"HOLD={r['hold']:3} no-marker={r['no_marker']:3} | run {cfg['run']} tests={r['run_tests']} "
          f"| suite-not-in-run={len(r['in_suite_not_in_run'])} run-not-in-suite={len(r['in_run_not_in_suite'])}", file=sys.stderr)
    gate = r['ready'] + r['expect_fail']
    print(f"{'':14} gate: READY+EXPECT-FAIL={gate}  total-HOLD-noMarker={r['total']-r['hold']-r['no_marker']}  "
          f"{'PASSES' if gate == r['total']-r['hold']-r['no_marker'] else 'DOES NOT PASS'}", file=sys.stderr)

json.dump(report, open('/tmp/job12/census.json', 'w'), indent=1)
