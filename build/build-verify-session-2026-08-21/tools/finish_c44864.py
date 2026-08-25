#!/usr/bin/env python3
"""FINISH C44864 — the two field instances I dropped from the corrected batch.

Its TITLE was repaired earlier. Its `refs` and its `custom_expected` provenance line
still carry the swallowed <query> as a double space, and its expected body still carries
the literal backslashes the import left behind. Both were in the approved item-1 scope;
I omitted this case when I rewrote the batch. Correcting that.

Three substitutions, all placeholder/encoding repairs, no wording change:
  refs      : 'No results for  +'  ->  'No results for [query] +'
  expected  : 'No results for  + quick-create chips' -> '...[query] + quick-create chips'
  expected  : reads 'No results for \\'S1- 56438\\''  ->  reads "No results for 'S1- 56438'"
"""
import json, base64, urllib.request, urllib.error, re, html, sys

CID = 44864
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


P_BLOCK = re.compile(r'<p\b[^>]*>(.*?)</p>', re.S | re.I)


def genuine_collapse(t):
    for inner in P_BLOCK.findall(t or ''):
        if '\n' in inner.strip() and '<br' not in inner.lower():
            return True
    return False


st, pre = call(f'get_case/{CID}')
assert st == 200
json.dump(pre, open(f'{PASS}snapshots/batch/PRE-FINISH-C{CID}.json', 'w'), indent=1)
if pre.get('custom_atmstatus') == 3:
    print("Automated - Rule 71 ask needed. Not written.")
    sys.exit(0)

refs = pre.get('refs') or ''
exp = pre.get('custom_expected') or ''

SUBS_REFS = [("No results for  +", "No results for [query] +")]
SUBS_EXP = [("No results for  + quick-create chips", "No results for [query] + quick-create chips"),
            ("""reads 'No results for \\'S1- 56438\\''""", '''reads "No results for 'S1- 56438'"''')]

changes = []
for old, new in SUBS_REFS:
    if old not in refs:
        print(f"STOP - refs substring not found: {old!r}")
        sys.exit(1)
    refs = refs.replace(old, new)
    changes.append("refs: [query] restored")
for old, new in SUBS_EXP:
    if old not in exp:
        print(f"STOP - expected substring not found: {old!r}")
        sys.exit(1)
    exp = exp.replace(old, new)
changes.append("expected: [query] restored in the provenance anchor")
changes.append("expected: literal backslashes removed from the message quote")

payload = {'title': pre['title'], 'refs': refs,
           'custom_preconds': pre.get('custom_preconds') or '',
           'custom_steps': pre.get('custom_steps') or '',
           'custom_expected': exp}

print("DRY RUN:")
print("  refs     :", repr(payload['refs']))
print("  expected :", repr(payload['custom_expected'][:190]))
assert '[query]' in payload['refs']
assert '[query]' in payload['custom_expected']
assert '\\' not in payload['custom_expected'], "backslashes must be gone"
assert '<' not in payload['title']
print("  [PASS] dry-run assertions")

st2, _ = call(f'update_case/{CID}', payload)
print("update_case HTTP", st2)
if st2 != 200:
    sys.exit(1)

st3, post = call(f'get_case/{CID}')
e = post.get('custom_expected') or ''
checks = [('refs holds [query]', '[query]' in (post.get('refs') or '')),
          ('expected holds [query]', '[query]' in e),
          ('no double-space artefact left in refs', 'for  +' not in (post.get('refs') or '')),
          ('backslashes gone', '\\' not in e),
          ('refs renders as intended', rendered(post.get('refs')) == rendered(payload['refs'])),
          ('expected renders as intended', rendered(e) == rendered(payload['custom_expected'])),
          ('title untouched', post['title'] == pre['title']),
          ('no genuine collapse', not genuine_collapse(e)),
          ('one provenance', e.count('This is the expected behaviour as per') == 1),
          ('one marker', e.count('AUTOMATION:') == 1),
          ('marker date still 8/21/2026', 'Last checked 8/21/2026' in e),
          ('atm unchanged', post.get('custom_atmstatus') == pre.get('custom_atmstatus'))]
print("\n===== VERIFICATION =====")
ok = True
for n, r in checks:
    print(f"  [{'PASS' if r else 'FAIL'}] {n}")
    ok = ok and r
json.dump(post, open(f'{PASS}snapshots/batch/POST-FINISH-C{CID}.json', 'w'), indent=1)
print("\nfinal refs:", repr(post.get('refs')))
print("RESULT:", "C44864 COMPLETE" if ok else "*** FAILED ***")
sys.exit(0 if ok else 1)
