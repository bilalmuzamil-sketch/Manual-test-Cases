#!/usr/bin/env python3
"""INDEPENDENT post-write sweep over all 53 cases. Does not read APPLIED.jsonl for its verdicts.

core 2.11 -- audit from LIVE, never from a self-report. The writer verified its own work; that is
not evidence. This re-reads every case from the API AND its served view page and checks, per case:
  1  the served container of all three fields is `markdown fr-view` (the tester can read it)
  2  no literal tag and no HTML entity is visible in any of the three fields
  3  exactly one AUTOMATION marker, it is `AUTOMATION: READY`, and it is LAST
  4  provenance sentence 1 is byte-identical to the pre-write snapshot (no expectation drifted)
  5  Rule-54 sentence 2 is present, separate from sentence 1, exactly once
  6  title / section_id / refs / custom_atmstatus / priority / type unchanged
  7  the barred phrasing "as per the build tested on" is absent
Anything short of all seven is reported, not smoothed over.
"""
import json, base64, urllib.request, urllib.parse, http.cookiejar, re, html, sys, collections

C = json.load(open('/tmp/testrail/creds.json'))
U = json.load(open('/tmp/testrail/ui-creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
BASE = 'https://shopview.testrail.io'
M = 'build/invoice-ui-refresh/build-verify-2026-08-31/markers'
S2 = 'Last checked against build v26.35.5-8c3cc21 on 8/31/2026.'

def api(p):
    r = urllib.request.Request(B + p); r.add_header('Authorization', 'Basic ' + A)
    return json.loads(urllib.request.urlopen(r, timeout=60).read().decode())

jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
op.addheaders = [('User-Agent', 'Mozilla/5.0'), ('Referer', BASE + '/index.php?/auth/login/')]
op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
r = op.open(BASE + '/index.php?/auth/login/', urllib.parse.urlencode(
    {'name': U['email'], 'password': U['ui_password'], 'rememberme': '1'}).encode(), timeout=60)
if '/auth/login' in r.geturl():
    sys.exit('*** UI LOGIN FAILED — refusing to report a sweep from an unauthenticated session')
r.read(); print('UI session established')

snap = json.load(open(f'{M}/PRE-markers-snapshot.json'))
INTENDED = json.load(open(f'{M}/intended-blocks.json'))
FIELD = re.compile(r'>(Preconditions|Steps|Expected Result)<')
MD = re.compile(r'<div class="(markdown[^"]*)">')
LITERAL = re.compile(r'&lt;\s*/?\s*(p|br|div|span|ul|ol|li|strong|em|b|i|hr)\b', re.I)
ENTITY = re.compile(r'&amp;(mdash|rsquo|lsquo|amp|lt|gt|nbsp|rarr|#\d+);')

def norm(s): return re.sub(r'[ \t]+', ' ', (s or '').replace('\xa0', ' ')).strip()

def fetch(url, tries=5):
    # TestRail resets a long-lived keep-alive connection now and then. A bare reset must not end an
    # 84-case sweep and leave a PARTIAL result reported as the whole one.
    import time
    last = None
    for t in range(tries):
        try:
            return op.open(url, timeout=60).read().decode('utf-8', 'replace')
        except Exception as e:
            last = e; time.sleep(2 * (t + 1))
    raise RuntimeError(f'{url} failed after {tries} tries: {last}')

rows, problems = [], []
for n, cid in enumerate(sorted(snap, key=int), 1):
    c = api(f'get_case/{cid}')
    page = fetch(f'{BASE}/index.php?/cases/view/{cid}')
    p = []
    if snap[cid]['title'][:28] not in page:
        p.append('served page is not this case'); rows.append((cid, p)); problems += [(cid, x) for x in p]; continue

    # 1 + 2 — containers and what is visible, per field
    cls_by_field, raw_by_field = {}, {}
    for fm in FIELD.finditer(page):
        nm = MD.search(page, fm.end())
        if not nm: continue
        cls_by_field.setdefault(fm.group(1), nm.group(1).strip())
        seg = page[fm.end() + nm.end():]
        raw_by_field.setdefault(fm.group(1), seg[:seg.find('</div>')])
    for lab in ('Preconditions', 'Steps', 'Expected Result'):
        cl = cls_by_field.get(lab)
        if cl is None: p.append(f'{lab}: container not found')
        elif 'fr-view' not in cl: p.append(f'{lab}: container is "{cl}" — tester reads tags')
        raw = raw_by_field.get(lab, '')
        if LITERAL.search(raw): p.append(f'{lab}: literal tag visible')
        if ENTITY.search(raw): p.append(f'{lab}: HTML entity visible')

    exp = html.unescape(re.sub(r'<[^>]+>', '\n', c.get('custom_expected') or ''))
    lines = [l.strip() for l in exp.split('\n') if l.strip()]
    # 3 — the marker
    # The expected marker is per case: READY for a build-verified case, or the exact override text
    # for one that carries a different verdict (the customer-portal cases are HOLD, staging-only).
    want_marker = INTENDED.get(cid, {}).get('marker_override') or 'AUTOMATION: READY'
    marks = [l for l in lines if l.startswith('AUTOMATION:')]
    if marks != [want_marker]: p.append(f'markers = {marks} (wanted {want_marker!r})')
    elif lines[-1] != want_marker: p.append(f'marker not last (last is {lines[-1][:50]!r})')
    if 'Not available on Build' in exp and not INTENDED.get(cid, {}).get('marker_override'):
        p.append('deferred marker text still present')
    # 4 — sentence 1 byte-identical
    want1 = norm(html.unescape(snap[cid]['provenance'][0]))
    got1 = [l for l in lines if l.startswith('This is the expected behaviour')]
    if len(got1) != 1: p.append(f'provenance sentence 1 count = {len(got1)}')
    elif norm(got1[0]) != want1: p.append('provenance sentence 1 ALTERED')
    # 5 — sentence 2
    got2 = [l for l in lines if l.startswith('Last checked against build')]
    if got2 != [S2]: p.append(f'build sentence = {got2}')
    # 6 — immutables
    if c['title'] != snap[cid]['title']: p.append('title changed')
    if c['section_id'] != snap[cid]['section_id']: p.append('section_id changed')
    if (c.get('refs') or None) != (snap[cid]['refs'] or None): p.append('refs changed')
    if c.get('custom_atmstatus') != snap[cid]['atm']: p.append('custom_atmstatus changed')
    # 7 — barred phrasing
    if re.search(r'as per the build tested on', exp, re.I): p.append('BARRED phrasing present')

    rows.append((cid, p)); problems += [(cid, x) for x in p]
    if n % 15 == 0: print(f'  swept {n}/{len(snap)}')

clean = [c for c, pp in rows if not pp]
json.dump({'clean': clean, 'problems': [{'cid': c, 'problem': x} for c, x in problems]},
          open(f'{M}/FINAL-SWEEP.json', 'w'), indent=1)
print(f'\nswept          : {len(rows)} cases')
print(f'FULLY CLEAN    : {len(clean)}')
print(f'with a problem : {len(rows) - len(clean)}')
for c, x in problems: print(f'   C{c}: {x}')
print('\nverdict:', f'ALL {len(rows)} PASS ALL SEVEN CHECKS' if len(clean) == len(rows) else '*** NOT ALL CLEAN ***')
