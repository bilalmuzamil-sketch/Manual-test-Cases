"""post_qa_passed.py — 26 Oct 2026. QA lead: for each fixed ticket "add the comment in the ticket with the annotated screenshots and a statement
telling that it is a --> QA Status: Passed, and then below that the evidences of annotated screenshot". House format (L0131, skill 06):
a SHORT comment "→ QA Status: Passed", one line naming the QA branch/build/date (and any note), then the pictures. Title, description and
status are never touched. Attaches each picture, posts the wiki comment, reads it back (rendered) and records comment id + image count.
  python3 post_qa_passed.py KEY "<tested-on line>" "<optional note or ''>" pic1.png [pic2.png ...]"""
import json, os, re, subprocess, sys
REPO = '/home/user/Manual-test-Cases'; J = f'{REPO}/build/atlassian-login/jira.sh'; HERE = os.path.dirname(os.path.abspath(__file__))
def jira(m, p, body=None):
    f = None
    if body is not None: f = '/tmp/atlassian/qa-passed-payload.json'; json.dump(body, open(f, 'w'))
    out = subprocess.run(['bash', J, m, p] + ([f] if f else []), capture_output=True, text=True).stdout
    txt, _, code = out.rpartition('\n__HTTP:'); return int(code or 0), txt
KEY, TESTED, NOTE, PICS = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
# 28 Oct: QA_STATUS=Failed posts the same short comment as "→ QA Status: Failed" (default Passed, unchanged)
STATUS = os.environ.get('QA_STATUS', 'Passed')
assert PICS and all(os.path.isfile(p) for p in PICS), 'pictures missing'
# 29 Oct (L0606, QA lead "never leave such gaps behind"): a Passed comment needs COVERAGE=<coverage.json> that ticket_coverage_gate.py passes —
# every description / How-to-check line observed on every surface the ticket names, with evidence and a set-up read-back.
if STATUS == 'Passed':
    COV = os.environ.get('COVERAGE', '')
    if not COV or not os.path.isfile(COV): sys.exit('REFUSED: set COVERAGE=<coverage.json> (ticket_coverage_gate.py --skeleton … drafts it); Passed needs every line × every view')
    g = subprocess.run([sys.executable, f'{REPO}/build/testing-tools/ticket_coverage_gate.py', COV], capture_output=True, text=True)
    if g.returncode == 3:  # complete except parts genuinely absent from this build: the note must say "Not checked yet" and name each one
        if 'Not checked yet' not in NOTE: sys.exit('REFUSED: some lines are not on this build — the note must say "Not checked yet: …" naming them:\n' + g.stdout)
    elif g.returncode != 0: sys.exit('REFUSED by ticket_coverage_gate.py:\n' + g.stdout)
log = {'key': KEY, 'attach': []}
s, t = jira('GET', f'/rest/api/2/issue/{KEY}?fields=status,attachment,comment')
f = json.loads(t)['fields']; log['status_before'] = f['status']['name']
if any(f'QA Status: {STATUS}' in (c.get('body') or '') and TESTED.split(',')[0] in c.get('body', '') for c in f['comment']['comments']): sys.exit('already posted for this branch')
have = {a['filename'] for a in f['attachment']}
for pth in PICS:
    name = os.path.basename(pth)
    if name in have: log['attach'].append({'file': name, 'http': 'already there'}); continue
    out = subprocess.run(['curl', '-s', '-w', '\n__HTTP:%{http_code}', '-b', '/tmp/atlassian/cookies.txt', '--cacert', '/root/.ccr/ca-bundle.crt',
        '-H', 'X-Atlassian-Token: no-check', '-H', 'Origin: https://shopview.atlassian.net', '-H', 'Referer: https://shopview.atlassian.net/browse/' + KEY,
        '-F', f'file=@{pth}', f'https://shopview.atlassian.net/rest/api/3/issue/{KEY}/attachments'], capture_output=True, text=True).stdout
    body, _, code = out.rpartition('\n__HTTP:'); a = json.loads(body)[0]
    log['attach'].append({'file': name, 'http': code, 'sizeOk': a['size'] == os.path.getsize(pth)})
lines = [f'→ *QA Status: {STATUS}*', '', TESTED] + ([NOTE] if NOTE else []) + [''] + [f'!{os.path.basename(p)}|width=1000!' for p in PICS]
s, t = jira('POST', f'/rest/api/2/issue/{KEY}/comment', {'body': '\n'.join(lines)}); log['comment_http'] = s; cid = json.loads(t).get('id'); log['comment_id'] = cid
s, t = jira('GET', f'/rest/api/2/issue/{KEY}/comment/{cid}?expand=renderedBody'); c = json.loads(t)
log['readback'] = {'hasStatus': f'QA Status: {STATUS}' in c['body'], 'imgsRendered': len(re.findall(r'<img ', c.get('renderedBody', ''))), 'pics': len(PICS)}
s, t = jira('GET', f'/rest/api/2/issue/{KEY}?fields=status'); log['status_after'] = json.loads(t)['fields']['status']['name']
json.dump(log, open(f'{HERE}/{KEY}-qa-{STATUS.lower()}.json', 'w'), indent=1); print(json.dumps(log))
