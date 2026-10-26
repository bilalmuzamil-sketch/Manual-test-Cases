"""ff_watch.py — 26 Oct 2026 (QA lead: "keep an eye on SV-11593 every 2 hours; as soon as any ticket becomes available for testing start testing
that ticket on the QA branch linked"). Lists every child of the Fast Follow epic SV-11593 with its LIVE status, QA Branch (customfield_10318) and
whether we already posted a "QA Status: Passed" comment. TESTABLE = status Ready for QA / TESTING QA / QA (any status naming QA testing),
a QA Branch set, and no QA-passed comment from us yet. Writes ff-watch-<UTC stamp>.json next to this file; prints a short table. Read only."""
import json, os, subprocess, sys, urllib.parse, datetime
REPO = '/home/user/Manual-test-Cases'; HERE = os.path.dirname(os.path.abspath(__file__))
def jira(p):
    out = subprocess.run(['bash', f'{REPO}/build/atlassian-login/jira.sh', 'GET', p], capture_output=True, text=True).stdout
    t, _, c = out.rpartition('\n__HTTP:'); return int(c or 0), (json.loads(t) if t.strip().startswith('{') else t)
rows = []; start = 0
while True:
    jql = urllib.parse.quote('parent = SV-11593 ORDER BY key')
    s, d = jira(f'/rest/api/3/search/jql?maxResults=100&fields=summary,status,customfield_10318,labels,updated,issuetype&jql={jql}' + (f'&nextPageToken={start}' if start else ''))
    if s != 200: sys.exit(f'jira {s}: {str(d)[:200]}')
    for i in d.get('issues', []):
        f = i['fields']; rows.append({'key': i['key'], 'summary': f['summary'], 'status': f['status']['name'], 'branch': f.get('customfield_10318'), 'updated': f['updated'][:16], 'type': f['issuetype']['name']})
    start = d.get('nextPageToken')
    if not start or d.get('isLast', True): break
TESTING = ('READY FOR QA', 'TESTING QA', 'IN QA', 'QA')
for r in rows:
    r['qa_status'] = r['status'].upper() in TESTING or 'TESTING QA' in r['status'].upper()
    if r['qa_status']:
        s, d = jira(f"/rest/api/2/issue/{r['key']}?fields=comment")
        cs = d['fields']['comment']['comments'] if s == 200 else []
        r['our_passed_comment'] = [c['id'] for c in cs if 'QA Status: Passed' in (c.get('body') or '') and c['author'].get('displayName') == 'Bilal Muzamil']
    r['testable_new'] = bool(r.get('qa_status') and r.get('branch') and not r.get('our_passed_comment'))
stamp = datetime.datetime.utcnow().strftime('%Y%m%d-%H%M')
json.dump(rows, open(os.path.join(HERE, f'ff-watch-{stamp}.json'), 'w'), indent=1)
print(f'{len(rows)} children of SV-11593 | testable and not yet verified by us: {sum(r["testable_new"] for r in rows)}')
for r in rows:
    if r.get('qa_status') or r['testable_new']: print(('NEW ' if r['testable_new'] else 'done') , r['key'], r['status'], r['branch'], r['summary'][:70], r.get('our_passed_comment'))
from collections import Counter; print(Counter(r['status'] for r in rows))
