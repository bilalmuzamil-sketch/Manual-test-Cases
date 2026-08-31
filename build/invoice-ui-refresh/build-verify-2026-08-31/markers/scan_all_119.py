#!/usr/bin/env python3
"""Served-page readability scan over ALL 119 cases in the Invoice UI Refresh suite.

The marker pass repaired only the 53 build-verified cases. This establishes how many of the
remaining 66 are ALSO unreadable, so the number is known rather than assumed. Read-only.
"""
import json, re, sys, urllib.request, urllib.parse, http.cookiejar, collections

U = json.load(open('/tmp/testrail/ui-creds.json'))
BASE = 'https://shopview.testrail.io'
DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
ver = json.load(open(f'{DIR}/verification.json'))

jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
op.addheaders = [('User-Agent', 'Mozilla/5.0'), ('Referer', BASE + '/index.php?/auth/login/')]
op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
r = op.open(BASE + '/index.php?/auth/login/', urllib.parse.urlencode(
    {'name': U['email'], 'password': U['ui_password'], 'rememberme': '1'}).encode(), timeout=60)
if '/auth/login' in r.geturl():
    sys.exit('*** UI LOGIN FAILED — refusing to report from an unauthenticated session')
r.read(); print('UI session established')

FIELD = re.compile(r'>(Preconditions|Steps|Expected Result)<')
MD = re.compile(r'<div class="(markdown[^"]*)">')
def fetch(url, tries=5):
    # TestRail resets a long-lived keep-alive connection now and then; a bare reset must not be
    # allowed to end a 119-case sweep and leave a partial picture reported as the whole one.
    last = None
    for t in range(tries):
        try:
            return op.open(url, timeout=60).read().decode('utf-8', 'replace')
        except Exception as e:
            last = e
            import time; time.sleep(2 * (t + 1))
    raise RuntimeError(f'{url} failed after {tries} tries: {last}')

out = {}
for n, cid in enumerate(sorted(ver['cases'], key=int), 1):
    page = fetch(f'{BASE}/index.php?/cases/view/{cid}')
    title_ok = ver['cases'][cid]['title'][:28] in page
    byf = {}
    for fm in FIELD.finditer(page):
        nm = MD.search(page, fm.end())
        if nm: byf.setdefault(fm.group(1), nm.group(1).strip())
    n_esc = sum(1 for v in byf.values() if 'fr-view' not in v)
    out[cid] = {'verdict': ver['cases'][cid]['verdict'], 'atm': ver['cases'][cid]['atm'],
                'title_ok': title_ok, 'fields': byf, 'escaping_fields': n_esc,
                'readable': bool(title_ok and len(byf) == 3 and n_esc == 0)}
    if n % 20 == 0: print(f'  {n}/{len(ver["cases"])}')

json.dump(out, open(f'{DIR}/markers/readability-all-119.json', 'w'), indent=1)
tot = collections.Counter()
byv = collections.defaultdict(collections.Counter)
for cid, v in out.items():
    k = 'readable' if v['readable'] else ('unreadable' if v['fields'] else 'unknown')
    tot[k] += 1; byv[v['verdict']][k] += 1
print(f"\n{'':<22}{'READABLE':>10}{'UNREADABLE':>12}{'UNKNOWN':>9}")
for verd in sorted(byv):
    c = byv[verd]
    print(f"{verd:<22}{c['readable']:>10}{c['unreadable']:>12}{c['unknown']:>9}")
print(f"{'TOTAL':<22}{tot['readable']:>10}{tot['unreadable']:>12}{tot['unknown']:>9}")
bad = sorted((c for c, v in out.items() if not v['readable'] and v['fields']), key=int)
print(f"\nstill unreadable ({len(bad)}): {['C'+c for c in bad]}")
