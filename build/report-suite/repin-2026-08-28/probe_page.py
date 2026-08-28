#!/usr/bin/env python3
"""One-off structural probe: how the TestRail case view page lays out its
markdown containers, so a container can be mapped to the FIELD it renders."""
import json, re, sys, urllib.request, urllib.parse, http.cookiejar

C = json.load(open('/tmp/testrail/creds.json'))
BASE = 'https://shopview.testrail.io'
jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
op.addheaders = [('User-Agent', 'QA-observation')]
op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
op.open(BASE + '/index.php?/auth/login/',
        urllib.parse.urlencode({'name': C['email'], 'password': C['password'],
                                'submit_login': 'Log In'}).encode(), timeout=60).read()
cid = sys.argv[1]
page = op.open(f'{BASE}/index.php?/cases/view/{cid}', timeout=60).read().decode('utf-8', 'replace')
open(f'/tmp/rspin/page-{cid}.html', 'w').write(page)
for m in re.finditer(r'<div class="(markdown[^"]*)"', page):
    ctx = page[max(0, m.start() - 700):m.start()]
    labs = re.findall(r'>([A-Z][A-Za-z /]{2,30})</', ctx)
    print(m.group(1), '||', labs[-4:])
