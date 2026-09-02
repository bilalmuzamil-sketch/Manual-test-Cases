#!/usr/bin/env python3
"""C45254 — correct the automation marker's casing. QA lead, 2026-09-02: "OK correct the Marker then".

WHAT IS WRONG. He authored C45254 at 08:27 and its last line reads `AUTOMATION: Ready`. The marker is
a machine-findable LITERAL (CLAUDE.md deliverable conventions): exactly one of `AUTOMATION: READY`,
`AUTOMATION: READY - EXPECT FAIL (SV-xxxx)` or `AUTOMATION: HOLD - <reason>`. The arithmetic gate is a
text match on those literals, so mixed case makes the case invisible to it -- it was the only one of
123 the gate could not classify.

WHAT CHANGES. Five characters: `Ready` -> `READY`. Nothing else in the field is touched; the
provenance line ("Source: Manually added (QA lead, 2026-09-01).") is his and is preserved verbatim.
The case is NOT flagged Automated (custom_atmstatus = 1), so Rule 71 does not apply.
"""
import base64, html, json, pathlib, re, sys, urllib.request
sys.path.insert(0, 'build/testing-tools')
from load_creds import testrail_creds

email, key = testrail_creds()
AUTH = 'Basic ' + base64.b64encode(f'{email}:{key}'.encode()).decode()
r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/get_case/45254',
                           headers={'Authorization': AUTH})
c = json.load(urllib.request.urlopen(r, timeout=90))

raw = c['custom_expected'] or ''
# the editor stores one <p> per paragraph, lines inside it separated by <br>
s = re.sub(r'</p>\s*<p>', '\n\n', raw)
s = re.sub(r'<br\s*/?>', '\n', s, flags=re.I)
s = re.sub(r'<hr\s*/?>', '---', s, flags=re.I)
s = re.sub(r'<[^>]+>', '', s)
lines = [l.strip() for l in html.unescape(s).split('\n')]

found = [i for i, l in enumerate(lines) if l.upper().startswith('AUTOMATION:')]
assert len(found) == 1, f'expected one marker line, found {found} -> {[lines[i] for i in found]}'
i = found[0]
assert lines[i] == 'AUTOMATION: Ready', f'unexpected marker text {lines[i]!r} - stopping rather than guessing'
lines[i] = 'AUTOMATION: READY'

# rebuild as paragraphs: blank lines separate <p> blocks, the rest are <br> lines within one block
blocks, cur = [], []
for l in lines:
    if l == '':
        if cur: blocks.append(cur); cur = []
    else:
        cur.append(l)
if cur: blocks.append(cur)

D = pathlib.Path('build/marker-fix-2026-09-02')
payload = {'45254': {
    'title': c['title'], 'verdict': 'PASS', 'marker_override': 'AUTOMATION: READY',
    'build_sentence': next((l for l in lines if l.startswith('Last checked against build')), None),
    'fields': {'custom_expected': {
        'blocks': blocks,
        'text': '\n\n'.join('\n'.join(b) for b in blocks)}}}}
snap = {'45254': {'title': c['title'], 'atm': c.get('custom_atmstatus'), 'section_id': c['section_id'],
                  'refs': c.get('refs'), 'provenance': [],
                  'before': {'custom_expected': raw}}}
json.dump(payload, open(D / 'intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(D / 'PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print('marker line was:', repr('AUTOMATION: Ready'), '-> now:', repr(lines[i]))
print('atmstatus:', c.get('custom_atmstatus'), '(1 = not Automated, so Rule 71 does not apply)')
print('\n--- the field it will write:')
print(payload['45254']['fields']['custom_expected']['text'])
