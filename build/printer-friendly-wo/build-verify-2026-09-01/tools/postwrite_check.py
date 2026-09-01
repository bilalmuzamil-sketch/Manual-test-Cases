#!/usr/bin/env python3
"""THE REQUIRED POST-WRITE CHECKS for suite 6617, read LIVE from TestRail.

Three things, and all three are mandatory after any write pass (CLAUDE.md, 2026-08-31):
  1 THE RUNNABILITY GATE, against the live cases rather than the generated text.
  2 THE MARKER ARITHMETIC: exactly one AUTOMATION marker per case, and READY + EXPECT-FAIL =
    total - HOLD, read back from the live cases.
  3 RULE 54: provenance sentence 1 present and unaltered, sentence 2 present ONLY on the cases this
    pass actually observed, and the two never merged.

The served-page container scan (markdown fr-view) is the fourth required step and needs a UI login,
so it lives in served_page_scan.mjs.
"""
import sys, json, os, re, html, base64, urllib.request, collections, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', 'verdicts'))
from verdicts import V                                                    # noqa: E402
spec = importlib.util.spec_from_file_location('crc', '/home/user/Manual-test-Cases/build/testing-tools/check_runnable_cases.py')
crc = importlib.util.module_from_spec(spec); spec.loader.exec_module(crc)

C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
BASE = 'https://shopview.testrail.io/index.php?/api/v2/'
def get(p):
    r = urllib.request.Request(BASE + p, headers={'Authorization': 'Basic ' + AUTH})
    return json.load(urllib.request.urlopen(r, timeout=120))
def paged(p, key):
    out, off = [], 0
    while True:
        j = get(f'{p}&limit=250&offset={off}')
        chunk = j[key] if isinstance(j, dict) else j
        out += chunk
        if len(chunk) < 250: break
        off += 250
    return out
def txt(h):
    if not h: return ''
    s = re.sub(r'<(br|/p|/li|/div|hr)[^>]*>', '\n', h)
    return html.unescape(re.sub(r'<[^>]+>', '', s))

SECS = [6761, 6762, 6763, 6764, 6765, 6766]
cases = []
for s in SECS:
    cases += paged(f'get_cases/1&section_id={s}', 'cases')
print(f'read {len(cases)} live cases')

BUILD = 'Last checked against build v26.35.6-598cc8a on 9/1/2026.'
gate_fail, marker_fail, prov_fail = [], [], []
markers = collections.Counter()
for c in cases:
    cid = c['id']
    foreign = c['created_by'] == 1 or c.get('custom_atmstatus') == 3   # Automated cases were not written
    f = crc.audit(c)
    if f and not foreign: gate_fail.append((cid, f))
    e = txt(c.get('custom_expected') or '')
    lines = [l.strip() for l in e.split('\n') if l.strip()]
    ms = [l for l in lines if l.startswith('AUTOMATION:')]
    if foreign:
        continue
    if len(ms) != 1:
        marker_fail.append((cid, f'{len(ms)} markers'))
    else:
        markers[ms[0]] += 1
        if lines[-1] != ms[0]:
            marker_fail.append((cid, f'marker is not the last line; last is {lines[-1][:50]!r}'))
    s1 = [l for l in lines if l.startswith('This is the expected behaviour')]
    s2 = [l for l in lines if l.startswith('Last checked against build')]
    if len(s1) != 1: prov_fail.append((cid, f'provenance sentence 1 count = {len(s1)}'))
    verdict = V.get(cid, (None,))[0]
    should = verdict in ('PASS', 'FAIL', 'PARTIAL', 'UNREACHABLE')
    if should and len(s2) != 1: prov_fail.append((cid, f'verdict {verdict} but build sentence count = {len(s2)}'))
    if not should and len(s2) != 0: prov_fail.append((cid, f'verdict {verdict or "NOT VERIFIED"} but a build sentence is present'))
    if len(s2) == 1 and s2[0] != BUILD: prov_fail.append((cid, f'build sentence text: {s2[0][:60]!r}'))
    if re.search(r'as per the build tested on', e, re.I): prov_fail.append((cid, 'BARRED phrasing present'))

print('\n1 RUNNABILITY GATE (live) :', 'PASS' if not gate_fail else f'{len(gate_fail)} FAILING')
for cid, f in gate_fail[:10]: print(f'    C{cid}: {f}')
print('\n2 MARKER ARITHMETIC')
for m, n in markers.most_common(): print(f'    {n:4d}  {m}')
total = sum(markers.values())
ready = sum(n for m, n in markers.items() if m == 'AUTOMATION: READY')
expfail = sum(n for m, n in markers.items() if 'EXPECT FAIL' in m)
hold = sum(n for m, n in markers.items() if 'HOLD' in m)
print(f'    READY {ready} + EXPECT-FAIL {expfail} = {ready + expfail}; total {total} - HOLD {hold} = {total - hold}')
print('    arithmetic:', 'BALANCES' if ready + expfail == total - hold else 'DOES NOT BALANCE')
print('    marker problems:', 'none' if not marker_fail else marker_fail[:10])
print('\n3 RULE 54 PROVENANCE :', 'PASS' if not prov_fail else f'{len(prov_fail)} PROBLEMS')
for cid, f in prov_fail[:12]: print(f'    C{cid}: {f}')
titles = [(c['id'], len(c['title'])) for c in cases if len(c['title']) > 80]
print('\n4 TITLES OVER 80 CHARACTERS :', 'none' if not titles else titles)
ok = not gate_fail and not marker_fail and not prov_fail and not titles and ready + expfail == total - hold
print('\nPOST-WRITE CHECK:', 'ALL CLEAN' if ok else 'PROBLEMS ABOVE')
sys.exit(0 if ok else 1)
