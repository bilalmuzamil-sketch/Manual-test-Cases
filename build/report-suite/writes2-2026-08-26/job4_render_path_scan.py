#!/usr/bin/env python3
"""JOB 4 (consequence scan) - which cases render their fields RAW and which ESCAPE them.

TestRail's case view emits each text field into one of two containers:
  <div class="markdown fr-view">  -> the stored value is emitted RAW (HTML renders)
  <div class="markdown">          -> the stored value is run through the markdown
                                     renderer, which ESCAPES any HTML tag in it, so a
                                     stored tag is shown to the tester as literal text
The API gives no flag for this, so it can only be read off the served view page.

This matters because add_case/update_case ALWAYS wrap a value that does not already
start with a block-level tag in <p>...</p>. On an fr-view case that wrapper is
invisible; on an escaping case it becomes literal "<p>" text on the tester's screen.
"""
import json, re, sys, time
import urllib.request, urllib.parse, http.cookiejar

C = json.load(open('/tmp/testrail/creds.json'))
BASE = 'https://shopview.testrail.io'
jar = http.cookiejar.CookieJar()
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
op.addheaders = [('User-Agent', 'QA-observation')]
op.open(BASE + '/index.php?/auth/login/', timeout=60).read()
op.open(BASE + '/index.php?/auth/login/',
        urllib.parse.urlencode({'name': C['email'], 'password': C['password'],
                                'submit_login': 'Log In'}).encode(), timeout=60).read()
print('logged in')

ids = [x.lstrip('C') for x in json.load(open(
    '../writes-2026-08-26/written.json'))] + ['30287', '30518', '30536']
seen, order = set(), []
for i in ids:
    if i not in seen:
        seen.add(i); order.append(i)

out = {}
for n, cid in enumerate(order, 1):
    try:
        page = op.open(f'{BASE}/index.php?/cases/view/{cid}', timeout=60).read().decode('utf-8', 'replace')
    except Exception as e:
        out[cid] = {'error': str(e)}; continue
    classes = re.findall(r'<div class="(markdown[^"]*)">', page)
    escaping = [c for c in classes if 'fr-view' not in c]
    # literal tag text a tester would read, taken only from the escaping containers
    literal = []
    for m in re.finditer(r'<div class="(markdown)">(.*?)</div>', page, re.S):
        for t in ('&lt;p&gt;', '&lt;/p&gt;', '&lt;ol&gt;', '&lt;li&gt;', '&lt;br&gt;', '&lt;hr&gt;'):
            if t in m.group(2):
                literal.append(t.replace('&lt;', '<').replace('&gt;', '>'))
    out[cid] = {'containers': classes, 'escaping_containers': len(escaping),
                'literal_tags_visible': sorted(set(literal))}
    if n % 25 == 0:
        print(f'  {n}/{len(order)}')

json.dump(out, open('logs/job4-render-path-scan.json', 'w'), indent=1)
bad = {k: v for k, v in out.items() if v.get('literal_tags_visible')}
esc = {k: v for k, v in out.items() if v.get('escaping_containers')}
print(f'\nscanned {len(out)} cases')
print(f'cases with at least one ESCAPING (non-fr-view) field container: {len(esc)}')
print(f'cases where a tester LITERALLY SEES a tag: {len(bad)}')
for k, v in bad.items():
    print(f'  C{k}: {v["literal_tags_visible"]}')
