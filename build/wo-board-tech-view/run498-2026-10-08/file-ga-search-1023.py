"""23 Oct 2026 — QA lead: "Then file with clear statement from where it is going against the PRD and what it is doing now vs what it should be
doing with annotated screenshot for easy understanding of a lay man. And tag Chris ward in that and ask him if that needs to be obsoleted or
fast followed." Files C97027's Bug (search text in the GA page address, PRD v74 S12-R5) under the Fast Follow epic SV-11593, then a
comment tagging Chris Ward. Adapted from file-scroll-1023.py."""
import json, os, subprocess, sys
REPO = '/home/user/Manual-test-Cases'; HERE = os.path.dirname(os.path.abspath(__file__))
J = f'{REPO}/build/atlassian-login/jira.sh'
def jira(m, p, body=None):
    f = None
    if body is not None:
        f = '/tmp/atlassian/ga-payload.json'; json.dump(body, open(f, 'w'))
    out = subprocess.run(['bash', J, m, p] + ([f] if f else []), capture_output=True, text=True).stdout
    txt, _, code = out.rpartition('\n__HTTP:'); return int(code or 0), txt
DRAFT = open(f'{HERE}/defect-drafts/tickets/ga-search-1023/C97027-search-text-in-analytics.wiki').read()
TITLE = DRAFT.splitlines()[0].replace('TITLE: ', '').strip()
DESC = DRAFT[DRAFT.index('h2. Description'):]
PICS = [f'{HERE}/defect-drafts/tickets/ga-search-1023/C97027-search-text-sent-to-google.png']
log = {}
# duplicate check, last time before the write
s, t = jira('GET', '/rest/api/3/search/jql?maxResults=20&fields=summary&jql=' + __import__('urllib.parse').parse.quote('project = SV AND (summary ~ "analytics" OR summary ~ "Google Analytics" OR description ~ "page_location") AND created >= -30d'))
log['dup'] = [(i['key'], i['fields']['summary']) for i in json.loads(t).get('issues', [])]
print('dup check:', log['dup'])
if any('search' in x[1].lower() and 'analytic' in x[1].lower() for x in log['dup']): sys.exit('possible duplicate: %s' % log['dup'])
s, t = jira('POST', '/rest/api/2/issue', {'fields': {'project': {'key': 'SV'}, 'issuetype': {'id': '10008'}, 'parent': {'key': 'SV-11593'}, 'customfield_10153': {'id': '10120'},
    'summary': TITLE, 'priority': {'name': 'Medium'}, 'labels': ['board-tech-view'], 'description': 'Filing in progress.'}})
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
s, t = jira('POST', '/rest/api/2/issueLink', {'type': {'name': 'Relates'}, 'inwardIssue': {'key': KEY}, 'outwardIssue': {'key': 'SV-10593'}}); log['link'] = s; print('link', s)
s, t = jira('GET', f'/rest/api/2/issue/{KEY}?fields=summary,issuetype,parent,priority,labels,status,issuelinks,attachment,description')
f = json.loads(t)['fields']; log['readback'] = {'summary': f['summary'], 'type': f['issuetype']['name'], 'parent': f['parent']['key'], 'priority': f['priority']['name'],
    'labels': f['labels'], 'status': f['status']['name'], 'links': [(l['type']['name'], (l.get('outwardIssue') or l.get('inwardIssue'))['key']) for l in f['issuelinks']],
    'attachments': [x['filename'] for x in f['attachment']], 'descHasPics': all(os.path.basename(p) in f['description'] for p in PICS), 'endsWithRunLink': 'tests/view/3481965' in f['description'][-300:]}
print(json.dumps(log['readback'], indent=1))
json.dump(log, open(f'{HERE}/defect-drafts/tickets/ga-search-1023/filed.json', 'w'), indent=1)
