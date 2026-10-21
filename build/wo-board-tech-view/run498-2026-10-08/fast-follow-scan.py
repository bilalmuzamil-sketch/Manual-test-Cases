# Which Failed/Blocked/Retest tests in a run sit on a Jira ticket labelled "fast-follow" (QA lead 21 Oct 2026:
# such cases are not tested; they move to the Fast Follow section and leave the run). Read-only.
# Tickets per test: title prefix, case refs, newest N results (comment + defects). Labels read live from Jira.
# Usage: python3 fast-follow-scan.py [run=498] [N=5]  -> prints the table and writes fast-follow-scan.json
import sys, re, json, subprocess
sys.path.insert(0, 'build/testing-tools')
import tr_client as tr
run = int(sys.argv[1]) if len(sys.argv) > 1 else 498
N = int(sys.argv[2]) if len(sys.argv) > 2 else 5
ST = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}
def body(r):
    r = r[1] if isinstance(r, tuple) else r
    for k in ('tests', 'results'):
        if isinstance(r, dict) and k in r: return r[k]
    return r
tests, off = [], 0
while True:
    t = body(tr.get(f'get_tests/{run}&limit=250&offset={off}')); tests += t
    if len(t) < 250: break
    off += 250
KEY = re.compile(r'\bSV-\d{4,6}\b')
rows, keys = [], set()
for t in tests:
    if t['status_id'] not in (2, 4, 5): continue
    ks = set(KEY.findall(t.get('title') or '')) | set(KEY.findall(t.get('refs') or ''))
    for x in body(tr.get(f'get_results/{t["id"]}&limit={N}')):
        ks |= set(KEY.findall((x.get('comment') or '') + ' ' + (x.get('defects') or '')))
    rows.append({'case': t['case_id'], 'test': t['id'], 'status': ST[t['status_id']], 'title': t['title'], 'keys': sorted(ks)}); keys |= ks
lab = {}
for k in sorted(keys):
    out = subprocess.run(['bash', 'build/atlassian-login/jira.sh', 'GET', f'/rest/api/2/issue/{k}?fields=labels,status,summary'], capture_output=True, text=True).stdout.split('\n__HTTP')[0]
    try: f = json.loads(out)['fields']; lab[k] = {'labels': f.get('labels') or [], 'status': f['status']['name'], 'summary': f['summary'][:80]}
    except Exception: lab[k] = {'labels': None, 'status': '?', 'summary': out[:80]}
ff = lambda k: any(re.sub(r'[\s_]', '-', l.lower()) in ('fast-follow', 'fastfollow') for l in (lab[k]['labels'] or []))
for r in rows:
    r['fast_follow'] = [k for k in r['keys'] if ff(k)]
    print(('FF  ' if r['fast_follow'] else '    ') + f"C{r['case']} | test {r['test']} | {r['status']} | {','.join(r['keys']) or '-'} | {r['title'][:70]}")
print('--- tickets'); [print(k, v['status'], v['labels'], v['summary']) for k, v in lab.items()]
json.dump({'run': run, 'rows': rows, 'tickets': lab}, open('build/wo-board-tech-view/run498-2026-10-08/fast-follow-scan.json', 'w'), indent=1)
