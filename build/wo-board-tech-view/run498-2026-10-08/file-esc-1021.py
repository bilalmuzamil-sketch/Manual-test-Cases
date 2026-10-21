"""21 Oct 2026 — QA lead: "Yes, file it if the current behavior is against the PRD, and move the test case to the fast-follow folder."
Re-checked first: PRD 845185030 still v73 and S11-R5 unchanged; staging still v26.40.20-c627fc7 (reproduced 15:21 UTC). Files the
Story Defect from defect-drafts/tickets/D-S11R5-escape-technician-search-2026-10-21.wiki: create → attach pictures (sizes compared) →
wiki description → size_pics.py → relates-to link → read back. Labels board-tech-view + fast-follow (it goes to the Fast-follow folder)."""
import json, os, subprocess, sys
REPO = '/home/user/Manual-test-Cases'; HERE = os.path.dirname(os.path.abspath(__file__))
J = f'{REPO}/build/atlassian-login/jira.sh'
def jira(m, p, body=None):
    f = None
    if body is not None:
        f = '/tmp/atlassian/esc-payload.json'; json.dump(body, open(f, 'w'))
    out = subprocess.run(['bash', J, m, p] + ([f] if f else []), capture_output=True, text=True).stdout
    txt, _, code = out.rpartition('\n__HTTP:'); return int(code or 0), txt
DRAFT = open(f'{HERE}/defect-drafts/tickets/D-S11R5-escape-technician-search-2026-10-21.wiki').read()
TITLE = DRAFT.splitlines()[0].replace('TITLE: ', '').strip()
DESC = DRAFT[DRAFT.index('h2. Description'):]
PICS = [f'{HERE}/defect-drafts/tickets/esc-1021/ESC-board-escape-compare.png', f'{HERE}/defect-drafts/tickets/esc-1021/ESC-tech-escape-compare.png']
log = {}
# duplicate check, last time before the write
s, t = jira('GET', '/rest/api/3/search/jql?maxResults=20&fields=summary&jql=' + __import__('urllib.parse').parse.quote('project = SV AND summary ~ "Escape" AND created >= -2d'))
log['dup'] = [(i['key'], i['fields']['summary']) for i in json.loads(t).get('issues', [])]
if any('Search' in x[1] for x in log['dup']): sys.exit('duplicate found: %s' % log['dup'])
s, t = jira('POST', '/rest/api/2/issue', {'fields': {'project': {'key': 'SV'}, 'issuetype': {'name': 'Story Defect'}, 'parent': {'key': 'SV-10054'},
    'summary': TITLE, 'priority': {'name': 'Medium'}, 'labels': ['board-tech-view', 'fast-follow'], 'description': 'Filing in progress.'}})
log['create'] = s; KEY = json.loads(t)['key']; log['key'] = KEY; print('created', s, KEY)
for pth in PICS:
    out = subprocess.run(['curl', '-s', '-w', '\n__HTTP:%{http_code}', '-b', '/tmp/atlassian/cookies.txt', '--cacert', '/root/.ccr/ca-bundle.crt',
        '-H', 'X-Atlassian-Token: no-check', '-H', 'Origin: https://shopview.atlassian.net', '-H', 'Referer: https://shopview.atlassian.net/browse/' + KEY,
        '-F', f'file=@{pth}', f'https://shopview.atlassian.net/rest/api/3/issue/{KEY}/attachments'], capture_output=True, text=True).stdout
    body, _, code = out.rpartition('\n__HTTP:'); a = json.loads(body)[0]
    log.setdefault('attach', []).append({'file': os.path.basename(pth), 'http': code, 'size': a['size'], 'local': os.path.getsize(pth)}); print('attach', code, a['size'] == os.path.getsize(pth))
s, t = jira('PUT', f'/rest/api/2/issue/{KEY}', {'fields': {'description': DESC}}); log['description'] = s; print('description', s)
log['size_pics'] = subprocess.run(['python3', f'{REPO}/build/testing-tools/size_pics.py', KEY] + PICS, capture_output=True, text=True, env={**os.environ, 'PYTHONPATH': '/tmp/pylib'}).stdout[-400:]
print(log['size_pics'])
s, t = jira('POST', '/rest/api/2/issueLink', {'type': {'name': 'Relates'}, 'inwardIssue': {'key': KEY}, 'outwardIssue': {'key': 'SV-10054'}}); log['link'] = s; print('link', s)
s, t = jira('GET', f'/rest/api/2/issue/{KEY}?fields=summary,issuetype,parent,priority,labels,status,issuelinks,attachment,description')
f = json.loads(t)['fields']; log['readback'] = {'summary': f['summary'], 'type': f['issuetype']['name'], 'parent': f['parent']['key'], 'priority': f['priority']['name'],
    'labels': f['labels'], 'status': f['status']['name'], 'links': [(l['type']['name'], (l.get('outwardIssue') or l.get('inwardIssue'))['key']) for l in f['issuelinks']],
    'attachments': [x['filename'] for x in f['attachment']], 'descHasPics': all(os.path.basename(p) in f['description'] for p in PICS), 'endsWithTestCase': 'C707079' in f['description'][-300:]}
print(json.dumps(log['readback'], indent=1))
json.dump(log, open(f'{HERE}/defect-drafts/tickets/esc-1021/filed.json', 'w'), indent=1)
