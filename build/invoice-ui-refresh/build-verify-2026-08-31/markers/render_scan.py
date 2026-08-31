#!/usr/bin/env python3
"""Classify the EXPECTED-RESULT render container of each of the 53 cases BEFORE any write.

core 2.1b/c: update_case re-renders any field you SEND, and whether that is harmless depends on a
per-case container flag get_case does NOT expose:
    <div class="markdown fr-view">  -> stored value emitted RAW, block HTML renders  -> API-safe
    <div class="markdown">          -> stored value ESCAPED, tester literally reads "<p>"

TRAP (found 2026-08-31): /tmp/testrail/creds.json['password'] holds the TESTRAIL API KEY, not the
account password. Posting it into the UI login form fails silently -- you land back on the login
page, every case fetch returns the 24 KB login shell, the container regex matches NOTHING, and the
scan reports "0 escaping containers" for every case. That is a detector that CANNOT FIRE reported
as a clean bill of health. The UI password lives in /tmp/testrail/ui-creds.json (chmod 600).

So this script CONTROLS ITSELF: it asserts the session is really logged in and that the expected
container was actually located, per case. A case whose container could not be read is UNKNOWN,
never "safe".
Read-only: GETs of the case view page. No writes.
"""
import json, re, sys, urllib.request, urllib.parse, http.cookiejar, collections

U = json.load(open('/tmp/testrail/ui-creds.json'))
BASE = 'https://shopview.testrail.io'
DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31/markers'

jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
op.addheaders = [('User-Agent', 'Mozilla/5.0'), ('Referer', BASE + '/index.php?/auth/login/')]
op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
r = op.open(BASE + '/index.php?/auth/login/', urllib.parse.urlencode(
    {'name': U['email'], 'password': U['ui_password'], 'rememberme': '1'}).encode(), timeout=60)
land = r.geturl(); r.read()
if '/auth/login' in land:
    sys.exit('*** UI LOGIN FAILED — landed back on the login form. Refusing to report container '
             'classifications from an unauthenticated session.')
print(f'UI login OK (landed on {land.split("?")[-1]})')

FIELD = re.compile(r'>(Preconditions|Steps|Expected Result)<')
MD = re.compile(r'<div class="(markdown[^"]*)">')

def containers_by_field(page):
    """Map each field label to the class of the FIRST markdown div that follows it."""
    out = {}
    for fm in FIELD.finditer(page):
        nm = MD.search(page, fm.end())
        if nm:
            out.setdefault(fm.group(1), nm.group(1).strip())
    return out

snap = json.load(open(f'{DIR}/PRE-markers-snapshot.json'))
out = {}
for n, cid in enumerate(sorted(snap, key=int), 1):
    page = op.open(f'{BASE}/index.php?/cases/view/{cid}', timeout=60).read().decode('utf-8', 'replace')
    ok_page = snap[cid]['title'][:28] in page
    byf = containers_by_field(page)
    exp_cls = byf.get('Expected Result')
    # what the tester actually reads in the expected block
    literal = []
    if exp_cls is not None and 'fr-view' not in exp_cls:
        for t in ('&lt;p&gt;', '&lt;ol&gt;', '&lt;li&gt;', '&lt;br&gt;', '&lt;hr&gt;'):
            if t in page: literal.append(t.replace('&lt;', '<').replace('&gt;', '>'))
    out[cid] = {'page_is_the_case': ok_page, 'containers_by_field': byf,
                'expected_container': exp_cls,
                'api_safe': bool(ok_page and exp_cls and 'fr-view' in exp_cls),
                'literal_tags_visible': sorted(set(literal))}
    if n % 15 == 0: print(f'  {n}/{len(snap)}')

json.dump(out, open(f'{DIR}/render-containers.json', 'w'), indent=1)
safe    = [c for c, v in out.items() if v['api_safe']]
unsafe  = [c for c, v in out.items() if v['expected_container'] and 'fr-view' not in v['expected_container']]
unknown = [c for c, v in out.items() if not v['expected_container'] or not v['page_is_the_case']]
print(f"\nscanned {len(out)} cases")
print(f"  API-SAFE (Expected Result in fr-view) : {len(safe)}")
print(f"  ESCAPING (needs the UI editor)        : {len(unsafe)}  {['C'+c for c in unsafe][:20]}")
print(f"  UNKNOWN  (container not readable)     : {len(unknown)}  {['C'+c for c in unknown][:20]}")
print('\ncontainer signature per field:')
for k, v in collections.Counter(tuple(sorted(v['containers_by_field'].items())) for v in out.values()).most_common():
    print(f'  {v:>3}x  {k}')
if len(safe) + len(unsafe) + len(unknown) != len(out):
    print('*** classification does not partition the set — investigate before writing')
