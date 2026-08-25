#!/usr/bin/env python3
"""C44506 — one attempt to restore correct HTML STRUCTURE after my faulty batch.

Current state: the words are right and render right, but TestRail's sanitiser moved
</ol> to the very end, so <hr> and both <p> blocks now sit INSIDE the ordered list.
Writing the original bytes back did not fix it — the sanitiser re-parsed them the same
way, because the original had newlines BETWEEN block elements and the pipeline treats
those as content inside the open <ol>.

The hypothesis this tests: give the sanitiser nothing to re-parse — emit the blocks
CONTIGUOUSLY, with no newlines between them, so </ol> is unambiguously closed before
<hr> begins.

One attempt. If it does not hold, the case is reported as-is (content correct, structure
nested) rather than churned further — every write is another roll of this dice.
"""
import json, base64, urllib.request, urllib.error, re, html, sys

CID = 44506
C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
PASS = 'build/build-verify-session-2026-08-21/'


def call(path, payload=None):
    r = urllib.request.Request(B + path,
                               data=json.dumps(payload).encode() if payload is not None else None)
    r.add_header('Authorization', 'Basic ' + A)
    r.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(r, timeout=60) as x:
            return x.status, json.loads(x.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:300]


def rendered(t):
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', t or '')).split())


pre = json.load(open(f'{PASS}snapshots/batch/PRE-C{CID}.json'))
st, cur = call(f'get_case/{CID}')
assert st == 200

orig = pre['custom_expected']
# pull the pieces out of the ORIGINAL, authoritative text
items = re.findall(r'<li>(.*?)</li>', orig, re.S)
paras = re.findall(r'<p>(.*?)</p>', orig, re.S)
assert items, "no list items found in the original"
assert len(paras) == 2, f"expected provenance + marker paragraphs, found {len(paras)}"

rebuilt = ('<ol>' + ''.join(f'<li>{i.strip()}</li>' for i in items) + '</ol>'
           + '<hr />' + ''.join(f'<p>{p.strip()}</p>' for p in paras))

print("rebuilt, blocks contiguous (no newlines between them):")
print(repr(rebuilt[:200]))
print(" ...", repr(rebuilt[-140:]))
if rendered(rebuilt) != rendered(orig):
    print("\nSTOP — rebuilt text does not render identically to the original")
    print(" orig:", rendered(orig)[:200])
    print(" new :", rendered(rebuilt)[:200])
    sys.exit(1)
print("\n  [PASS] rebuilt renders identically to the ORIGINAL pre-damage text")

payload = {'title': pre['title'], 'refs': pre.get('refs') or '',
           'custom_preconds': pre.get('custom_preconds') or '',
           'custom_steps': pre.get('custom_steps') or '',
           'custom_expected': rebuilt}
st2, _ = call(f'update_case/{CID}', payload)
print("update_case HTTP", st2)
if st2 != 200:
    sys.exit(1)

st3, post = call(f'get_case/{CID}')
exp = post.get('custom_expected') or ''
ol_close = exp.rfind('</ol>')
prov = exp.find('This is the expected behaviour')
checks = [
    ('renders identically to the original', rendered(exp) == rendered(orig)),
    ('list is closed BEFORE the provenance', 0 <= ol_close < prov),
    ('no stray <br> before </ol>', '<br></ol>' not in exp),
    ('one provenance', exp.count('This is the expected behaviour as per') == 1),
    ('one marker', exp.count('AUTOMATION:') == 1),
    ('marker date still 8/21/2026', 'Last checked 8/21/2026' in exp),
    ('atm unchanged', post.get('custom_atmstatus') == pre.get('custom_atmstatus')),
]
print("\n===== STRUCTURAL REPAIR VERIFICATION =====")
ok = True
for n, r in checks:
    print(f"  [{'PASS' if r else 'FAIL'}] {n}")
    ok = ok and r
json.dump(post, open(f'{PASS}snapshots/batch/RESTRUCTURED-C{CID}.json', 'w'), indent=1)
print("\nstored now:", repr(exp[:150]))
print("        ...", repr(exp[-120:]))
print("\nRESULT:", "STRUCTURE RESTORED" if ok else "NOT FULLY RESTORED — reporting as-is, no further writes")
sys.exit(0)
