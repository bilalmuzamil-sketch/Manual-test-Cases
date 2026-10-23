#!/usr/bin/env python3
"""23 Oct 2026: one line per test of the production pass of run 498 — the NEWEST judgement for each C-id across
evidence/prod-2026-10-22/judge/verdicts-*.json (batch order by number, decisions file last), whether it was POSTED (a production
result on the test, read live from TestRail), and for Unsure whether it is route-only. Writes evidence/prod-2026-10-22/prod-summary-1023.json
and prints counts. Read only against TestRail."""
import json, glob, os, re, sys
H = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(H, '..', '..', 'testing-tools'))
import tr_client as tr
b = lambda r: r[1] if isinstance(r, tuple) else r
J = os.path.join(H, 'evidence', 'prod-2026-10-22', 'judge')
def key(f):
    m = re.search(r'batch(\d+)', f); return (0, int(m.group(1))) if m else (1, 0)
latest = {}
for f in sorted(glob.glob(os.path.join(J, 'verdicts-*.json')), key=key):
    for c, v in json.load(open(f)).items():
        latest[c] = {'verdict': v.get('verdict'), 'file': os.path.basename(f), 'route_only': 'ROUTE-ONLY: yes' in (v.get('reason_for_reviewer') or ''),
                     'failed_steps': v.get('failed_steps'), 'todo': v.get('todo')}
ts, off = [], 0
while True:
    t = b(tr.get(f'get_tests/498&limit=250&offset={off}')); t = t['tests'] if isinstance(t, dict) else t; ts += t
    if len(t) < 250: break
    off += 250
by = {f"C{x['case_id']}": x for x in ts}
out = {}
for c, v in latest.items():
    t = by.get(c); posted = None; status = None
    if t:
        rs = b(tr.get(f"get_results/{t['id']}&limit=5")); rs = rs['results'] if isinstance(rs, dict) else rs
        p = next((r for r in rs if 'on production' in (r.get('comment') or '')[:200]), None)
        posted = {1: 'Passed', 5: 'Failed', 2: 'Blocked', 4: 'Retest'}.get(p['status_id'], str(p['status_id'])) if p else None
        status = {1: 'Passed', 5: 'Failed', 2: 'Blocked', 4: 'Retest', 3: 'Untested'}.get(t['status_id'], str(t['status_id']))
    out[c] = {**v, 'in_run': bool(t), 'test_id': t['id'] if t else None, 'posted_prod': posted, 'run_status': status, 'title': (t or {}).get('title')}
# production results posted for tests never in a verdict file (batches 3-13 posted by an older pipeline)
for c, t in by.items():
    if c in out: continue
    rs = b(tr.get(f"get_results/{t['id']}&limit=3")); rs = rs['results'] if isinstance(rs, dict) else rs
    p = next((r for r in rs if 'on production' in (r.get('comment') or '')[:200]), None)
    out[c] = {'verdict': None, 'in_run': True, 'test_id': t['id'], 'posted_prod': ({1: 'Passed', 5: 'Failed', 2: 'Blocked'}.get(p['status_id'], str(p['status_id'])) if p else None),
              'run_status': {1: 'Passed', 5: 'Failed', 2: 'Blocked', 4: 'Retest', 3: 'Untested'}.get(t['status_id']), 'title': t['title']}
json.dump(out, open(os.path.join(H, 'evidence', 'prod-2026-10-22', 'prod-summary-1023.json'), 'w'), indent=1)
from collections import Counter
print('tests in run 498:', len(by))
print('posted on production:', Counter(v['posted_prod'] for v in out.values() if v['posted_prod']))
print('not posted, newest judgement:', Counter(v['verdict'] for v in out.values() if not v['posted_prod'] and v['verdict']))
print('not posted, route-only Unsure:', sorted(c for c, v in out.items() if not v['posted_prod'] and v['verdict'] == 'Unsure' and v.get('route_only')))
print('no production result and no judgement:', sorted(c for c, v in out.items() if not v['posted_prod'] and not v['verdict']))
print('judged but not in run 498:', sorted(c for c, v in out.items() if not v['in_run']))
