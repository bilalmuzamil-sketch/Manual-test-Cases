"""pull_sources.py — 10 Nov 2026. A/R & A/P Aging Reports rebuild (SV-11315), QA env sv11315. Pulls, read-only:
  - TestRail suite 1, section 90418 and every section under it: cases (id, title, section, created_by, automation status, refs, priority)
  - Jira SV-11315 + stories SV-11531..SV-11539 + bugs SV-11441, SV-12135..SV-12141 + verification tasks SV-11595..SV-11599: status, type, assignee, parent, description, ALL comments
Writes build/aging-reports/sources/{cases.json, tickets/<KEY>.json, tickets/<KEY>.md} and prints a summary."""
import sys, os, json, subprocess
sys.path.insert(0, '/home/user/Manual-test-Cases/build/testing-tools'); import tr_client as tr
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'sources'); os.makedirs(os.path.join(OUT, 'tickets'), exist_ok=True)
# --- TestRail
secs, off = [], 0
while True:
    s, r = tr.get(f'get_sections/1&limit=250&offset={off}'); page = r.get('sections', r) if isinstance(r, dict) else r
    secs += page
    if len(page) < 250: break
    off += 250
tree = {90418}; changed = True
while changed:
    changed = False
    for x in secs:
        if x.get('parent_id') in tree and x['id'] not in tree: tree.add(x['id']); changed = True
names = {x['id']: x['name'] for x in secs if x['id'] in tree}
cases = []
for sid in sorted(tree):
    off = 0
    while True:
        s, r = tr.get(f'get_cases/1&section_id={sid}&limit=250&offset={off}'); page = r.get('cases', r) if isinstance(r, dict) else r
        cases += [c for c in page if c['section_id'] == sid]
        if len(page) < 250: break
        off += 250
json.dump({'sections': {str(k): v for k, v in names.items()}, 'cases': cases}, open(os.path.join(OUT, 'cases.json'), 'w'), indent=1)
from collections import Counter
print(f'TestRail: {len(tree)} sections, {len(cases)} cases; by author {Counter(c["created_by"] for c in cases)}; automation status {Counter(c.get("custom_atmstatus") for c in cases)}')
for sid in sorted(tree): print(f'  section {sid} "{names[sid]}": {sum(c["section_id"] == sid for c in cases)} cases')
# --- Jira
def jira(p):
    out = subprocess.run(['bash', '/home/user/Manual-test-Cases/build/atlassian-login/jira.sh', 'GET', p], capture_output=True, text=True, timeout=60).stdout
    t, _, c = out.rpartition('\n__HTTP:'); return int(c or 0), (json.loads(t) if t.strip().startswith('{') else t)
keys = ['SV-11315'] + [f'SV-{n}' for n in range(11531, 11540)] + ['SV-11441'] + [f'SV-{n}' for n in range(12135, 12142)] + [f'SV-{n}' for n in range(11595, 11600)]  # + verification tasks (handoff note 80616)
for k in keys:
    s, d = jira(f'/rest/api/2/issue/{k}?fields=summary,status,issuetype,assignee,parent,description,comment,labels,customfield_10318,issuelinks,attachment')
    if s != 200: print('  ', k, 'HTTP', s); continue
    f = d['fields']; cs = f['comment']['comments']
    rec = {'key': k, 'summary': f['summary'], 'status': f['status']['name'], 'type': f['issuetype']['name'], 'assignee': (f.get('assignee') or {}).get('displayName'),
           'parent': (f.get('parent') or {}).get('key'), 'qa_branch': f.get('customfield_10318'), 'labels': f.get('labels'), 'description': f.get('description'),
           'comments': [{'id': c['id'], 'created': c['created'], 'author': c['author']['displayName'], 'body': c['body']} for c in cs], 'comments_total': f['comment'].get('total'),
           'attachments': [a['filename'] for a in f.get('attachment', [])], 'links': [(l.get('type', {}).get('outward'), (l.get('outwardIssue') or l.get('inwardIssue') or {}).get('key')) for l in f.get('issuelinks', [])]}
    json.dump(rec, open(os.path.join(OUT, 'tickets', f'{k}.json'), 'w'), indent=1)
    md = [f'# {k} — {rec["summary"]}', f'{rec["type"]} · {rec["status"]} · assignee {rec["assignee"]} · parent {rec["parent"]} · QA branch {rec["qa_branch"]}', '', '## Description', rec['description'] or '(none)', '']
    for c in rec['comments']: md += [f'## Comment {c["id"]} — {c["author"]}, {c["created"][:16]}', c['body'] or '', '']
    open(os.path.join(OUT, 'tickets', f'{k}.md'), 'w').write('\n'.join(md))
    print(f'  {k} {rec["type"]:12} {rec["status"]:18} {str(rec["assignee"])[:18]:18} comments {len(cs)}/{rec["comments_total"]} desc {len(rec["description"] or "")}ch  {rec["summary"][:70]}')
