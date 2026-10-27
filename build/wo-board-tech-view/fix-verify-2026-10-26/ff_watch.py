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
def ts(x):  # Jira times carry an offset (e.g. -0500); compare real instants, never the text
    return datetime.datetime.strptime(x, '%Y-%m-%dT%H:%M:%S.%f%z') if x else datetime.datetime.min.replace(tzinfo=datetime.timezone.utc)
def is_qa(name): return bool(name) and (name.upper() in TESTING or 'TESTING QA' in name.upper())
# Health check 27 Oct 2026: a ticket we passed, then sent back (REJECTED FROM TESTING / Ready to Fix) and returned to QA would have been
# read as "done" by our OLD comment. Our comment now counts only if it is newer than the ticket's LAST move into a QA status.
# A QA-status ticket with no QA Branch is reported as NO-BRANCH (needs a look), never silently as "done". A failed read stops the run loudly.
for r in rows:
    r['qa_status'] = is_qa(r['status'])
    if r['qa_status']:
        s, d = jira(f"/rest/api/2/issue/{r['key']}?fields=comment&expand=changelog")
        if s != 200: sys.exit(f"jira {s} reading {r['key']}: {str(d)[:200]}")
        ch = d.get('changelog', {})
        if ch.get('total', 0) > len(ch.get('histories', [])):
            s2, d2 = jira(f"/rest/api/2/issue/{r['key']}/changelog?maxResults=100&startAt={max(ch['total'] - 100, 0)}")
            if s2 == 200: ch = {'histories': d2.get('values', [])}
        r['entered_qa'] = max((h['created'] for h in ch.get('histories', []) for it in h['items'] if it['field'] == 'status' and is_qa(it.get('toString'))), key=ts, default='')
        cs = d['fields']['comment']['comments']
        if d['fields']['comment'].get('total', len(cs)) > len(cs): sys.exit(f"{r['key']}: comments are paged ({len(cs)} of {d['fields']['comment']['total']}) - read them all before judging")
        mine = [c for c in cs if 'QA Status: Passed' in (c.get('body') or '') and c['author'].get('displayName') == 'Bilal Muzamil']
        r['our_passed_comment'] = [c['id'] for c in mine if ts(c['created']) > ts(r['entered_qa'])]
        r['old_passed_comment'] = [c['id'] for c in mine if ts(c['created']) <= ts(r['entered_qa'])]
    r['testable_new'] = bool(r.get('qa_status') and r.get('branch') and not r.get('our_passed_comment'))
    r['no_branch'] = bool(r.get('qa_status') and not r.get('branch') and not r.get('our_passed_comment'))
stamp = datetime.datetime.utcnow().strftime('%Y%m%d-%H%M')
json.dump(rows, open(os.path.join(HERE, f'ff-watch-{stamp}.json'), 'w'), indent=1)
print(f'{len(rows)} children of SV-11593 | testable and not yet verified by us: {sum(r["testable_new"] for r in rows)} | in QA with no QA Branch: {sum(r["no_branch"] for r in rows)}')
for r in rows:
    if r.get('qa_status'):
        tag = 'NEW ' if r['testable_new'] else 'NO-BRANCH' if r['no_branch'] else 'done'
        print(tag, r['key'], r['status'], r['branch'], r['summary'][:70], r.get('our_passed_comment'), ('back in QA since ' + r['entered_qa'][:16] + ', older pass ' + str(r['old_passed_comment'])) if r.get('old_passed_comment') else '')
from collections import Counter; print(Counter(r['status'] for r in rows))
