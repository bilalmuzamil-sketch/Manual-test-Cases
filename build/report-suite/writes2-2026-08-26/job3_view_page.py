#!/usr/bin/env python3
"""JOB 3 - observe what the TestRail CASE VIEW page actually serves to a tester.

Playwright could not be used: this container resets chromium's outbound TCP for every
external host, with or without the agent proxy (example.com fails too), so no live
browser session is possible. Instead this logs in to the TestRail UI with the same
credentials over HTTP (which does work) and downloads the very HTML a tester's browser
would render for /index.php?/cases/view/<id>, then reports, per field, whether the
list markup arrives as REAL <ol>/<li> ELEMENTS (renders as a list) or as ESCAPED
&lt;ol&gt;/&lt;li&gt; TEXT (the tester literally reads the tags).

That distinction is decisive and is a direct observation of the served page, not an
inference from the field's configured format.
"""
import json, re, html, os, sys
import urllib.request, urllib.parse, http.cookiejar

C = json.load(open('/tmp/testrail/creds.json'))
BASE = 'https://shopview.testrail.io'
OUT = '/tmp/rs/viewpages'
os.makedirs(OUT, exist_ok=True)

jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
op.addheaders = [('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) QA-observation')]

# --- log in to the UI ---
op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
data = urllib.parse.urlencode({
    'name': C['email'], 'password': C['password'], 'rememberme': '1',
    'submit_login': 'Log In',
}).encode()
r = op.open(BASE + '/index.php?/auth/login/', data, timeout=60)
body = r.read().decode('utf-8', 'replace')
logged_in = 'auth/login' not in r.url or 'logout' in body.lower()
print(f'LOGIN -> HTTP {r.status} url={r.url} cookies={[c.name for c in jar]}')
print(f'LOGIN looks successful: {logged_in}')
if not logged_in:
    print('LOGIN FAILED - aborting'); sys.exit(1)

CASES = sys.argv[1:] or ['30124', '30143', '30151']
report = {}
for cid in CASES:
    r = op.open(f'{BASE}/index.php?/cases/view/{cid}', timeout=60)
    page = r.read().decode('utf-8', 'replace')
    open(f'{OUT}/C{cid}-view.html', 'w').write(page)

    # Isolate the case-detail area TestRail renders the three text fields into.
    seg = page
    m = re.search(r'id="content"(.*?)(?:<div id="footer|</body>)', page, re.S)
    if m:
        seg = m.group(1)

    real_ol = len(re.findall(r'<ol[\s>]', seg))
    real_li = len(re.findall(r'<li[\s>]', seg))
    real_p = len(re.findall(r'<p[\s>]', seg))
    esc_ol = seg.count('&lt;ol&gt;')
    esc_li = seg.count('&lt;li&gt;')
    esc_p = seg.count('&lt;p&gt;')
    esc_br = seg.count('&lt;br&gt;')

    # what a tester would read: strip tags, unescape, and look for tag text
    text = html.unescape(re.sub(r'<[^>]+>', ' ', seg))
    literal_tags = sorted({t for t in ('<ol>', '<li>', '</li>', '</ol>', '<p>', '<br>', '<hr>')
                           if t in text})

    title = re.search(r'<title>(.*?)</title>', page, re.S)
    report[cid] = {
        'title': html.unescape(title.group(1).strip()) if title else '',
        'real_elements': {'ol': real_ol, 'li': real_li, 'p': real_p},
        'escaped_entities': {'&lt;ol&gt;': esc_ol, '&lt;li&gt;': esc_li,
                             '&lt;p&gt;': esc_p, '&lt;br&gt;': esc_br},
        'tag_text_a_tester_would_read': literal_tags,
        'verdict': ('TAGS SHOWN LITERALLY' if literal_tags else 'RENDERS AS REAL MARKUP'),
        'html_saved': f'{OUT}/C{cid}-view.html',
    }
    print(f'\nC{cid}: {report[cid]["title"]}')
    print(f'  real elements in the case body area: {report[cid]["real_elements"]}')
    print(f'  escaped tag entities (would print as text): {report[cid]["escaped_entities"]}')
    print(f'  tag text a tester would actually read: {literal_tags or "NONE"}')
    print(f'  VERDICT: {report[cid]["verdict"]}')

json.dump(report, open('logs/job3-viewpage-observation.json', 'w'), indent=1)
print('\nsaved logs/job3-viewpage-observation.json')
