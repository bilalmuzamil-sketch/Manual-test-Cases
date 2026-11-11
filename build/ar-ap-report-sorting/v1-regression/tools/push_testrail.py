#!/usr/bin/env python3
"""Publish cases/cases.json to TestRail: section "Regression Tests" under group 90418 (suite 1).
QA lead permission: 11 Nov 2026 ("You have my permission under this testing suite and name the test cases folder ... Regression Tests").
Idempotent: cases already in testrail/id-map.csv are skipped. Every add is read back; log in testrail/push-log.jsonl.
Credentials from /tmp/testrail/creds.json only."""
import base64, csv, html, json, re, sys, time, urllib.request
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT.parents[2] / 'build' / 'testing-tools'))
from testrail_add_case import add_case_payload  # canonical: custom_atmstatus 1
C = json.load(open('/tmp/testrail/creds.json'))
AUTH = 'Basic ' + base64.b64encode(f"{C['user']}:{C['key']}".encode()).decode()
GROUP, SUITE = 90418, 1
MAP = ROOT / 'testrail' / 'id-map.csv'; LOG = ROOT / 'testrail' / 'push-log.jsonl'

def req(path, payload=None):
    for _ in range(6):
        r = urllib.request.Request(C['host'] + '/index.php?/api/v2/' + path, data=None if payload is None else json.dumps(payload).encode(), headers={'Authorization': AUTH, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(r) as resp: return resp.status, json.load(resp)
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(int(e.headers.get('Retry-After', 5))); continue
            return e.code, e.read().decode()[:500]
    return 0, 'retries exhausted'

e = lambda s: html.escape(s, quote=False)
def render(c):
    pre = '<p><strong>Preconditions</strong></p><ul>' + ''.join(f'<li>{e(p)}</li>' for p in c['preconditions']) + '</ul>'
    steps = '<ol>' + ''.join(f'<li>{e(s)}</li>' for s in c['steps']) + '</ol>'
    exp = '<p><strong>Expected Result</strong></p>'
    for x in c['expected']:
        m = re.match(r'(Step \d+):\s*(.*)', x, re.S)
        exp += f'<p>{e(m.group(1))}:</p><ul><li>{e(m.group(2))}</li></ul>' if m else f'<ul><li>{e(x)}</li></ul>'
    exp += '<p></p>'
    if c.get('why'): exp += f'<p>Why this matters: {e(c["why"])}</p>'
    exp += f'<p>{e(c["source"])}</p><p>{e(c["provenance"])}</p><p></p><p>{e(c["marker"])}</p>'
    return pre, steps, exp

def section_id():
    off, secs = 0, []
    while True:
        s, b = req(f'get_sections/1&suite_id={SUITE}&limit=250&offset={off}'); secs += b['sections']
        if not b.get('_links', {}).get('next'): break
        off += 250
    for x in secs:
        if x.get('parent_id') == GROUP and x['name'] == 'Regression Tests': return x['id']
    s, b = req('add_section/1', {'suite_id': SUITE, 'parent_id': GROUP, 'name': 'Regression Tests',
        'description': 'What the six A/R and A/P reports could do before the 19 Nov 2026 upgrade (production v26.45.3) and must still do after it, unless the PRD clearly removes it.'})
    assert s == 200, (s, b); log({'op': 'add_section', 'id': b['id'], 'status': s}); return b['id']

def log(d):
    with open(LOG, 'a') as f: f.write(json.dumps(dict(d, at=time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()))) + '\n')

def main():
    cases = json.load(open(ROOT / 'cases' / 'cases.json')); cases = cases if isinstance(cases, list) else cases['cases']
    done = {r['key']: r['cid'] for r in csv.DictReader(open(MAP))} if MAP.exists() else {}
    sid = section_id(); print('section', sid)
    new = not MAP.exists()
    with open(MAP, 'a', newline='') as fm:
        w = csv.writer(fm)
        if new: w.writerow(['key', 'cid', 'title', 'link'])
        for c in cases:
            if c['id'] in done: continue
            pre, steps, exp = render(c)
            p = add_case_payload(title=c['title'], refs='SV-11315', preconds=pre, steps=steps, expected=exp, type_id=7, priority_id=2)
            s, b = req(f'add_case/{sid}', p)
            if s != 200: log({'op': 'add_case', 'key': c['id'], 'status': s, 'error': str(b)[:300]}); print('FAIL', c['id'], s); continue
            cid = b['id']; s2, rb = req(f'get_case/{cid}')
            ok = s2 == 200 and rb['title'] == c['title'] and rb['custom_preconds'] == pre and rb['custom_steps'] == steps and rb['custom_expected'] == exp and rb['custom_atmstatus'] == 1 and rb['section_id'] == sid
            log({'op': 'add_case', 'key': c['id'], 'cid': cid, 'status': s, 'readback_status': s2, 'readback_identical': ok})
            w.writerow([c['id'], cid, c['title'], f"https://shopview.testrail.io/index.php?/cases/view/{cid}"]); fm.flush()
            print(c['id'], f'C{cid}', 'OK' if ok else 'READBACK-MISMATCH')

if __name__ == '__main__': main()
