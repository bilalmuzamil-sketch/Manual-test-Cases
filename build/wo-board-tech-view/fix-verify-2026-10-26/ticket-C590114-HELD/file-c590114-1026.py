"""26 Oct 2026 — C590114 padlock tooltip (QA lead: "Yes do file the report ... SV-11593 ... sv11500"). Adapted from file-c590121-1026.py. Earlier text: QA lead: "Create the ticket tell Chris everything and ask him to confirm if this is acceptable this way but also tell him
the reference from where this issue is being rose with the annotated screenshots from Design VS Build." (C590121 step 3, … button beside the pill).
Adapted from run498-2026-10-08/file-scroll-1023.py: dup check → create Bug under SV-11593 → attach → wiki description → size_pics → relates SV-10046 → read back."""
import json, os, subprocess, sys, urllib.parse
REPO = '/home/user/Manual-test-Cases'; HERE = os.path.dirname(os.path.abspath(__file__))
J = f'{REPO}/build/atlassian-login/jira.sh'
def jira(m, p, body=None):
    f = None
    if body is not None:
        f = '/tmp/atlassian/c590114-payload.json'; json.dump(body, open(f, 'w'))
    out = subprocess.run(['bash', J, m, p] + ([f] if f else []), capture_output=True, text=True).stdout
    txt, _, code = out.rpartition('\n__HTTP:'); return int(code or 0), txt
DRAFT = open(f'{HERE}/C590114-padlock-tooltip-HELD.wiki').read()
TITLE = DRAFT.splitlines()[0].replace('TITLE: ', '').strip()
DESC = DRAFT[DRAFT.index('h2. Description'):]
PICS = [f'{HERE}/C590114-sv11500-padlock-no-tooltip.png', f'{HERE}/C590114-1-padlock-no-tooltip.png']
log = {}
s, t = jira('GET', '/rest/api/3/search/jql?maxResults=30&fields=summary,status&jql=' + urllib.parse.quote('project = SV AND (summary ~ "padlock" OR summary ~ "lock icon" OR summary ~ "tooltip" OR summary ~ "lock tooltip") AND created >= -45d'))
log['dup'] = [(i['key'], i['fields']['summary'], i['fields']['status']['name']) for i in json.loads(t).get('issues', [])]
print('dup check:', log['dup'])
if any(('padlock' in x[1].lower() or 'lock icon' in x[1].lower()) and 'tooltip' in x[1].lower() for x in log['dup']): sys.exit('possible duplicate')
s, t = jira('POST', '/rest/api/2/issue', {'fields': {'project': {'key': 'SV'}, 'issuetype': {'id': '10008'}, 'parent': {'key': 'SV-11593'}, 'customfield_10153': {'id': '10120'},
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
s, t = jira('POST', '/rest/api/2/issueLink', {'type': {'name': 'Relates'}, 'inwardIssue': {'key': KEY}, 'outwardIssue': {'key': 'SV-10047'}}); log['link'] = s; print('link', s)
s, t = jira('GET', f'/rest/api/2/issue/{KEY}?fields=summary,issuetype,parent,priority,labels,status,issuelinks,attachment,description')
f = json.loads(t)['fields']; log['readback'] = {'summary': f['summary'], 'type': f['issuetype']['name'], 'parent': f['parent']['key'], 'priority': f['priority']['name'],
    'labels': f['labels'], 'status': f['status']['name'], 'links': [(l['type']['name'], (l.get('outwardIssue') or l.get('inwardIssue'))['key']) for l in f['issuelinks']],
    'attachments': [x['filename'] for x in f['attachment']], 'descHasPics': all(os.path.basename(p) in f['description'] for p in PICS), 'endsWithCaseLink': 'cases/view/590114' in f['description'][-300:]}
print(json.dumps(log['readback'], indent=1))
json.dump(log, open(f'{HERE}/filed.json', 'w'), indent=1)
