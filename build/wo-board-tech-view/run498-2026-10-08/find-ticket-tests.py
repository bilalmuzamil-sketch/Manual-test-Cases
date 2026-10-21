# Find every test in a run tied to Jira keys (L0493): key in the title (Rule 133 prefix), in the
# case refs, or in any of the test's newest N results (comment or defects field).
# Usage: python3 find-ticket-tests.py SV-1,SV-2 [run=498] [N=15]
import sys
sys.path.insert(0, 'build/testing-tools')
import tr_client as tr
KEYS = sys.argv[1].split(',')
run = int(sys.argv[2]) if len(sys.argv) > 2 else 498
N = int(sys.argv[3]) if len(sys.argv) > 3 else 15
ST = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}

def body(r):
    r = r[1] if isinstance(r, tuple) else r
    for k in ('tests', 'results'):
        if isinstance(r, dict) and k in r:
            return r[k]
    return r

tests, off = [], 0
while True:
    t = body(tr.get(f'get_tests/{run}&limit=250&offset={off}'))
    tests += t
    if len(t) < 250:
        break
    off += 250
for t in tests:
    where = [f'{k}:title' for k in KEYS if k in (t.get('title') or '')]
    where += [f'{k}:refs' for k in KEYS if k in (t.get('refs') or '')]
    for x in body(tr.get(f'get_results/{t["id"]}&limit={N}')):
        blob = (x.get('comment') or '') + ' ' + (x.get('defects') or '')
        where += [f'{k}:result' for k in KEYS if k in blob and f'{k}:result' not in where]
    if where:
        print(f'C{t["case_id"]} | test {t["id"]} | {ST.get(t["status_id"], t["status_id"])} | {",".join(where)} | {t["title"][:90]}')
print('tests in run', len(tests))
