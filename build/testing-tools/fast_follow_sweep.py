#!/usr/bin/env python3
"""Move tests that wait on a FAST-FOLLOW ticket out of a run, into their suite's "Fast-follow" folder (QA lead 21 Oct 2026, restated
23 Oct 2026: "if any test is blocked or in retest or failed due to a ticket which is set to be fast follow that test case should not be
the part of the test run rather move that test case to the fast follow folder of that testing suite and if that fast follow folder is
not available for that testing suite create that folder").

  python3 build/testing-tools/fast_follow_sweep.py --run 498 --suite-root 13204            # dry run: lists what would move
  python3 build/testing-tools/fast_follow_sweep.py --run 498 --suite-root 13204 --write    # moves, then reads back

A test qualifies when its newest result is Failed / Blocked / Retest and a ticket named in that result (defects field, or an SV-key in
its comment) carries the Jira label "fast-follow" (read live). --suite-root is the top section of the testing suite; the folder is the
child section named "Fast-follow" (created under it if missing). Never Vladimir's cases (created_by 1); Automated cases (atm 3) are
listed but held unless --include-automated (his go-ahead; then tell the automation engineer). Writes an audit JSON beside --audit.
"""
import argparse, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import tr_client as t
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
NONPASS = {2: 'Blocked', 4: 'Retest', 5: 'Failed'}

def labels(key, cache={}):
    if key not in cache:
        out = subprocess.run(['bash', f'{REPO}/build/atlassian-login/jira.sh', 'GET', f'/rest/api/2/issue/{key}?fields=labels,status'], capture_output=True, text=True).stdout
        i = out.find('{')
        try: f = json.JSONDecoder().raw_decode(out[i:])[0]['fields']; cache[key] = (f.get('labels') or [], f['status']['name'])
        except Exception: cache[key] = (None, None)
    return cache[key]

def paged(path, key):
    out, off = [], 0
    while True:
        s, r = t.get(f'{path}&limit=250&offset={off}'); b = r[key] if isinstance(r, dict) else r; out += b
        if len(b) < 250: return out
        off += 250

ap = argparse.ArgumentParser(); ap.add_argument('--run', type=int, required=True); ap.add_argument('--suite-root', type=int, required=True)
ap.add_argument('--write', action='store_true'); ap.add_argument('--include-automated', action='store_true'); ap.add_argument('--audit')
a = ap.parse_args()
tests = paged(f'get_tests/{a.run}', 'tests')
found = []
for x in tests:
    if x['status_id'] not in NONPASS: continue
    s, r = t.get(f"get_results/{x['id']}&limit=1"); res = (r['results'] if isinstance(r, dict) else r) or []
    if not res: continue
    keys = set(re.findall(r'SV-\d+', (res[0].get('defects') or '') + ' ' + (res[0].get('comment') or '')))
    ff = [k for k in sorted(keys) if 'fast-follow' in (labels(k)[0] or [])]
    if ff: found.append({'case': x['case_id'], 'test': x['id'], 'status': NONPASS[x['status_id']], 'tickets': ff, 'title': x['title']})
# the suite's Fast-follow folder (child of --suite-root), created if missing
secs = paged('get_sections/1&suite_id=1', 'sections')
ffsec = next((s_ for s_ in secs if s_.get('parent_id') == a.suite_root and s_['name'].strip().lower() == 'fast-follow'), None)
print(f"run {a.run}: {len(tests)} tests; {len(found)} wait on a fast-follow ticket; folder: {ffsec['id'] if ffsec else 'MISSING (would be created)'}")
for f in found: print(' ', f)
if not a.write or not found:
    sys.exit(0)
if not ffsec:
    s, ffsec = t.post('add_section/1', {'suite_id': 1, 'parent_id': a.suite_root, 'name': 'Fast-follow'}); print('created folder', s, ffsec.get('id'))
move, held = [], []
for f in found:
    s, c = t.get(f"get_case/{f['case']}")
    if c['created_by'] == 1: held.append({**f, 'why': "Vladimir's case (Rule 38)"}); continue
    if c.get('custom_atmstatus') == 3 and not a.include_automated: held.append({**f, 'why': 'Automated - needs the QA lead\'s go-ahead (Rule 71)'}); continue
    move.append(f)
ids = [x['case_id'] for x in tests]; mv = {f['case'] for f in move}
if move:
    print('move', t.post(f"move_cases_to_section/{ffsec['id']}", {'suite_id': 1, 'case_ids': sorted(mv)})[0])
    print('update_run', t.post(f'update_run/{a.run}', {'include_all': False, 'case_ids': [i for i in ids if i not in mv]})[0])
after = paged(f'get_tests/{a.run}', 'tests')
kept = {x['case_id']: x['id'] for x in tests if x['case_id'] not in mv}; now = {x['case_id']: x['id'] for x in after}
print(f'run {len(tests)} -> {len(after)}; others unchanged: {kept == now}; held: {held}')
if a.audit:
    json.dump({'run': a.run, 'folder': ffsec['id'], 'moved': move, 'held': held, 'others_unchanged': kept == now}, open(a.audit, 'w'), indent=1)
