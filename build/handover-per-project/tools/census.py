#!/usr/bin/env python3
"""FULL live census of the three active suites — READ ONLY (get_* only).

Everything both deliverables need, derived live from TestRail:
  - ours vs live-total (foreign cases identified by created_by)
  - AUTOMATION marker + hold reason
  - Rule-54 provenance line: source read-date, spec version pin, build line
  - custom_atmstatus (TestRail's OWN Automated flag)
  - updated_on / updated_by  (to find today's + yesterday's writes)
  - run membership + graded results
"""
import json, sys, re, datetime
sys.path.insert(0, '/tmp/h3')
from tr import api

PROJECTS = {
    'Filters':      {'group': 4110, 'run': 352},
    'Schedule':     {'group': 4254, 'run': 357},
    'Report Suite': {'group': 4281, 'run': 359},
}
US = 3  # Bilal Muzamil — our account

MARKER = re.compile(r'AUTOMATION:\s*(READY - EXPECT FAIL[^\n]*|READY|HOLD[^\n]*)')
# Rule-54 sentence 2 — the build line
BUILDLINE = re.compile(r'[Ll]ast checked against build\s+([A-Za-z0-9._-]+)\s+on\s+([^.\n]+)')
# spec version pin inside the provenance sentence 1
SPECVER = re.compile(r'specification\s+version\s+(\d+[\w.]*)', re.I)


def paged(path, key):
    out, off = [], 0
    while True:
        d, s = api(f'{path}&limit=250&offset={off}')
        if s != 200:
            raise SystemExit(f'HTTP {s} on {path}: {d}')
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
print(f'live sections={len(secs)}  live cases(project)={len(cases)}', file=sys.stderr)

report = {}
for name, cfg in PROJECTS.items():
    ids = descendants(secs, cfg['group'])
    under = [c for c in cases if c.get('section_id') in ids]
    rows = []
    for c in under:
        exp = c.get('custom_expected') or ''
        m = MARKER.search(exp)
        marker = m.group(1).strip() if m else None
        kind = ('HOLD' if marker and marker.startswith('HOLD')
                else 'EXPECT FAIL' if marker and 'EXPECT FAIL' in marker
                else 'READY' if marker == 'READY' else 'NONE')
        reason = marker[len('HOLD'):].lstrip(' -').strip() if kind == 'HOLD' else None
        bm = BUILDLINE.search(exp)
        sv = SPECVER.search(exp)
        rows.append({
            'id': c['id'], 'title': c['title'], 'kind': kind, 'marker': marker,
            'reason': reason, 'section_id': c['section_id'],
            'created_by': c.get('created_by'), 'updated_by': c.get('updated_by'),
            'updated_on': c.get('updated_on'), 'created_on': c.get('created_on'),
            'atm': c.get('custom_atmstatus'),
            'refs': c.get('refs') or '',
            'build': bm.group(1) if bm else None,
            'build_date': bm.group(2).strip() if bm else None,
            'spec_ver': sv.group(1) if sv else None,
            'foreign': c.get('created_by') != US,
        })

    tests = paged(f'get_tests/{cfg["run"]}', 'tests')
    results = paged(f'get_results_for_run/{cfg["run"]}', 'results')
    by_test = {t['id']: t for t in tests}
    graded = {}
    for r in results:
        t = by_test.get(r['test_id'])
        if not t:
            continue
        cid = t['case_id']
        # keep the most recent result per case
        prev = graded.get(cid)
        if prev is None or r['created_on'] > prev['created_on']:
            graded[cid] = {'status_id': r['status_id'], 'created_on': r['created_on'],
                           'created_by': r['created_by'], 'comment': (r.get('comment') or '')[:200]}

    ours = [r for r in rows if not r['foreign']]
    report[name] = {
        'group': cfg['group'], 'run': cfg['run'],
        'live_total': len(rows), 'ours': len(ours),
        'foreign': len(rows) - len(ours),
        'foreign_ids': sorted(r['id'] for r in rows if r['foreign']),
        'foreign_authors': sorted({r['created_by'] for r in rows if r['foreign']}),
        'ready': sum(1 for r in ours if r['kind'] == 'READY'),
        'expect_fail': sum(1 for r in ours if r['kind'] == 'EXPECT FAIL'),
        'hold': sum(1 for r in ours if r['kind'] == 'HOLD'),
        'no_marker': sum(1 for r in ours if r['kind'] == 'NONE'),
        'run_tests': len(tests),
        'results_total': len(results),
        'graded': graded,
        'rows': rows,
    }
    r = report[name]
    print(f"{name:14} ours={r['ours']:4} live={r['live_total']:4} foreign={r['foreign']:3} "
          f"READY={r['ready']:4} EF={r['expect_fail']:3} HOLD={r['hold']:3} none={r['no_marker']} "
          f"| run {cfg['run']} tests={r['run_tests']} results={r['results_total']}", file=sys.stderr)
    gate = r['ready'] + r['expect_fail']
    other = r['ours'] - r['hold'] - r['no_marker']
    print(f"{'':14} GATE  READY+EF={gate}  ours-HOLD-none={other}  "
          f"{'PASSES' if gate == other else '*** DOES NOT PASS ***'}", file=sys.stderr)

json.dump(report, open('/tmp/h3/census.json', 'w'), indent=1)
print('\nwritten /tmp/h3/census.json', file=sys.stderr)
