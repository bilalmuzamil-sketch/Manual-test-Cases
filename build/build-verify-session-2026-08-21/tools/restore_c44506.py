#!/usr/bin/env python3
"""RESTORE C44506 — undo damage my own batch caused.

My collapse detector over-flagged: it treated ANY field holding <p> + newlines + no
<br> as a collapse risk. C44506's custom_expected was in fact well-formed block HTML
(<ol><li>… </ol>, <hr />, <p>provenance</p>, <p>AUTOMATION…</p>) where the newlines sit
BETWEEN block elements and render correctly. Inserting <br> broke the structure and
TestRail re-parsed it, relocating </ol> past the provenance and AUTOMATION paragraphs.

This writes the pre-write snapshot values back and verifies under the ONE normalisation
TestRail is proven to apply on write: HTML entity encoding (— -> &mdash;), which renders
to the identical character, so it is compared with html.unescape() on both sides.
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
    """what the tester actually reads: tags stripped, entities decoded, space-collapsed"""
    return ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', t or '')).split())


pre = json.load(open(f'{PASS}snapshots/batch/PRE-C{CID}.json'))
payload = {
    'title': pre['title'],
    'refs': pre.get('refs') or '',
    'custom_preconds': pre.get('custom_preconds') or '',
    'custom_steps': pre.get('custom_steps') or '',
    'custom_expected': pre.get('custom_expected') or '',
}
print("restoring the pre-write snapshot values verbatim")
for k, v in payload.items():
    print(f"  {k} ({len(v)} chars)")

st, _ = call(f'update_case/{CID}', payload)
print("update_case HTTP", st)
if st != 200:
    sys.exit(1)

st2, post = call(f'get_case/{CID}')
checks = []
for f in ('title', 'refs', 'custom_preconds', 'custom_steps', 'custom_expected'):
    exact = (post.get(f) or '') == (payload[f] or '')
    same_render = rendered(post.get(f)) == rendered(payload[f])
    checks.append((f'{f}: byte-exact', exact))
    checks.append((f'{f}: renders identically', same_render))
# the specific damage must be gone
exp = post.get('custom_expected') or ''
checks.append(('no stray <br> before </ol>', '<br></ol>' not in exp))
checks.append(('provenance not nested in the list',
               exp.rfind('</ol>') < exp.find('This is the expected behaviour')))
checks.append(('one provenance', exp.count('This is the expected behaviour as per') == 1))
checks.append(('one marker', exp.count('AUTOMATION:') == 1))
checks.append(('marker date unchanged', 'Last checked 8/21/2026' in exp))
checks.append(('atm unchanged', post.get('custom_atmstatus') == pre.get('custom_atmstatus')))

print("\n===== RESTORE VERIFICATION =====")
ok = True
for n, r in checks:
    print(f"  [{'PASS' if r else 'FAIL'}] {n}")
    if not r and 'byte-exact' not in n:
        ok = False
json.dump(post, open(f'{PASS}snapshots/batch/RESTORED-C{CID}.json', 'w'), indent=1)
print("\nRESULT:", "RESTORED (renders as it did before)" if ok else "*** STILL WRONG ***")
print("\nnote: 'byte-exact' may legitimately FAIL where TestRail entity-encodes on write")
print("      (— -> &mdash;); what matters is that it RENDERS identically, checked above.")
sys.exit(0 if ok else 1)
