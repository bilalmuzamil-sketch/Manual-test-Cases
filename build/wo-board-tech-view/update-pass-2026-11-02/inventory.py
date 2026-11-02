"""inventory.py — 2 Nov 2026 update pass (QA lead: check every WO Board / Tech View test, above all those Blocked / Retest / Failed
against tickets being fixed, update them to the fixed behaviour, keep them runnable; list the Automated ones changed after automation).
Live: every case in the WO Board tree (section 13204), run 498's tests and statuses, every ticket key a case carries (title prefix,
Known-problem block, EXPECT FAIL marker, anywhere in the text) with its live Jira status. Writes inventory.json + prints a summary."""
import sys, json, re, os, subprocess, collections
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools'); import tr_client as tr
HERE = os.path.dirname(os.path.abspath(__file__)); J = '/home/user/Manual-test-Cases/build/atlassian-login/jira.sh'
def jira(p):
    out = subprocess.run(['bash', J, 'GET', p], capture_output=True, text=True).stdout
    t, _, c = out.rpartition('\n__HTTP:'); return int(c or 0), (json.loads(t) if t.strip() else {})
secs = tr.get_sections(); kids = collections.defaultdict(list); names = {}
for s in secs: kids[s.get('parent_id')].append(s['id']); names[s['id']] = s['name']
tree, st = set(), [13204]
while st: x = st.pop(); tree.add(x); st += kids.get(x, [])
cases = [c for c in tr.get_cases() if c['section_id'] in tree]
tests, off = {}, 0
while True:
    s, b = tr.get(f'get_tests/498&limit=250&offset={off}'); ts = b.get('tests', [])
    for t in ts: tests[t['case_id']] = {'test_id': t['id'], 'status': t['status_id']}
    if len(ts) < 250: break
    off += 250
STATUS = {1: 'Passed', 2: 'Blocked', 3: 'Untested', 4: 'Retest', 5: 'Failed'}
rows, keys = [], set()
for c in cases:
    body = ' '.join(str(c.get(k) or '') for k in ('custom_preconds', 'custom_steps', 'custom_expected'))
    tk = sorted(set(re.findall(r'\bSV-\d{4,5}\b', c['title'] + ' ' + body)))
    prefix = re.match(r'^(SV-\d+)\s*-\s*', c['title'])
    known = re.findall(r'Known problem[^<]{0,40}?(SV-\d+)', body); ef = re.findall(r'EXPECT FAIL[^<]{0,10}\(?(SV-\d+)', body)
    marker = re.findall(r'AUTOMATION:\s*([A-Za-z][^<]{0,60})', body)
    t = tests.get(c['id'])
    rows.append({'id': c['id'], 'title': c['title'], 'section': names.get(c['section_id']), 'section_id': c['section_id'], 'by': c['created_by'],
                 'atm': c.get('custom_atmstatus'), 'automated': c.get('custom_atmstatus') == 3, 'run': STATUS.get(t['status']) if t else None,
                 'test_id': t['test_id'] if t else None, 'prefix': prefix.group(1) if prefix else None, 'known': sorted(set(known)), 'expect_fail': sorted(set(ef)),
                 'marker': marker[-1].strip()[:60] if marker else None, 'tickets': tk, 'updated_on': c.get('updated_on')})
    keys.update(tk)
tick = {}
for i in range(0, len(keys), 50):
    chunk = sorted(keys)[i:i + 50]
    s, d = jira('/rest/api/2/search?maxResults=100&fields=status,summary&jql=' + __import__('urllib.parse').parse.quote(f'key in ({",".join(chunk)})'))
    for it in d.get('issues', []): tick[it['key']] = {'status': it['fields']['status']['name'], 'summary': it['fields']['summary'][:80]}
json.dump({'cases': rows, 'tickets': tick}, open(os.path.join(HERE, 'inventory.json'), 'w'), indent=1)
print('cases in tree', len(cases), '| in run 498', sum(1 for r in rows if r['run']), '| automated', sum(r['automated'] for r in rows))
print('run status', collections.Counter(r['run'] for r in rows))
print('sections', collections.Counter(r['section'] for r in rows if not r['run']).most_common(6))
flag = [r for r in rows if r['run'] in ('Blocked', 'Retest', 'Failed') or r['prefix'] or r['known'] or r['expect_fail'] or (r['marker'] and not r['marker'].upper().startswith('READY'))]
print('flagged', len(flag))
for r in flag: print(f"C{r['id']} by{r['by']} {'AUTO ' if r['automated'] else ''}run={r['run']} prefix={r['prefix']} known={r['known']} ef={r['expect_fail']} marker={r['marker']} | {r['title'][:60]} | " + ', '.join(f"{k}:{tick.get(k,{}).get('status','?')}" for k in sorted(set((r['prefix'] and [r['prefix']] or []) + r['known'] + r['expect_fail']))))
