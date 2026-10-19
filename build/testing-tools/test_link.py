"""Print each case's links IN A RUN, read live (Rule 8 amendment; L0450: a run link given from memory was wrong).
Usage: python3 test_link.py <run_id> C96916 368214 ...   ->  C96916 · case link · run N · /tests/view/<test id> · current status"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__)); import tr_client
run = int(sys.argv[1]); want = [int(x.lstrip('Cc')) for x in sys.argv[2:]]
STATUS = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}
tests, off = [], 0
while True:  # get_tests is paged (250 a page); an unpaged read silently misses tests
    st, b = tr_client.get(f'get_tests/{run}&limit=250&offset={off}'); assert st == 200, (st, b)
    page = b.get('tests', b) if isinstance(b, dict) else b; tests += page
    if len(page) < 250: break
    off += 250
by = {t['case_id']: t for t in tests}
B = 'https://shopview.testrail.io/index.php?/'
for c in want:
    t = by.get(c)
    print(f'C{c} · {B}cases/view/{c} · ' + (f'run {run} · {B}tests/view/{t["id"]} · {STATUS.get(t["status_id"], t["status_id"])}' if t else f'NOT IN RUN {run}'))
