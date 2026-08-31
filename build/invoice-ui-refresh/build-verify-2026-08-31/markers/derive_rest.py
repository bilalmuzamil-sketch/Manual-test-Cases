#!/usr/bin/env python3
"""Derive plain-text content for the 56 UNREADABLE, NOT-YET-BUILD-VERIFIED cases.

QA lead authorised this on 2026-08-31 ("1. Yes") in answer to: repair the 56 unreadable cases.

🛑 THIS IS A RENDERING FIX ONLY. Unlike the 53-case marker pass:
  * the existing AUTOMATION marker is carried VERBATIM -- these cases are NOT build-verified, so
    nothing is lifted to READY and no marker date is moved;
  * NO Rule-54 sentence 2 is added, for the same reason;
  * the provenance line is carried byte-for-byte.
The ONLY change is that the stored HTML becomes plain text, so the escaping container stops
showing the tester "<ol><li>". Words in, same words out.

The 5 cases TestRail flags Automated (custom_atmstatus = 3) are EXCLUDED -- Rule 71 needs the QA
lead's go-ahead per case and Rule 65 needs Vlad told. They are listed for a separate decision.
"""
import json, base64, urllib.request, re, html, sys, collections

C = json.load(open('/tmp/testrail/creds.json'))
A = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
B = C['host'] + '/index.php?/api/v2/'
DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31'
M = f'{DIR}/markers'

def get(p):
    r = urllib.request.Request(B + p); r.add_header('Authorization', 'Basic ' + A)
    return json.loads(urllib.request.urlopen(r, timeout=60).read().decode())

rest = json.load(open(f'{M}/rest-to-repair.json'))
TAGS = re.compile(r'</?([a-zA-Z]+)[^>]*>')

def items(v):
    body = re.split(r'<hr\s*/?>', v or '', flags=re.I)[0]
    out = []
    for m in re.finditer(r'<li>(.*?)</li>', body, re.S | re.I):
        t = html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))
        t = re.sub(r'\s+', ' ', t).strip()
        if t: out.append(t)
    if not out:   # not a list -- fall back to paragraph blocks
        for m in re.finditer(r'<p>(.*?)</p>', body, re.S | re.I):
            t = html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))
            t = re.sub(r'\s+', ' ', t).strip()
            if t: out.append(t)
    return out

def numbered(l): return [f'{i}. {t}' for i, t in enumerate(l, 1)]

snap, out, problems = {}, {}, []
for i, cid in enumerate(rest, 1):
    c = get(f'get_case/{cid}')
    exp = c.get('custom_expected') or ''
    marks = re.findall(r'AUTOMATION:[^\n<]*', exp)
    provs = re.findall(r'This is the expected behaviour[^\n<]*', exp)
    snap[cid] = {'id': cid, 'title': c['title'], 'section_id': c['section_id'], 'refs': c.get('refs'),
                 'atm': c.get('custom_atmstatus'), 'custom_expected': exp,
                 'custom_steps': c.get('custom_steps'), 'custom_preconds': c.get('custom_preconds'),
                 'markers': marks, 'provenance': provs}
    if c.get('custom_atmstatus') == 3:
        problems.append(f'C{cid}: Automated — must not be written (Rules 65/71)'); continue
    if len(marks) != 1:
        problems.append(f'C{cid}: {len(marks)} AUTOMATION markers'); continue
    if len(provs) != 1:
        problems.append(f'C{cid}: {len(provs)} provenance lines'); continue
    body, pre, stp = items(exp), items(c.get('custom_preconds')), items(c.get('custom_steps'))
    if not body or not pre or not stp:
        problems.append(f'C{cid}: empty body/preconds/steps after parse '
                        f'(body={len(body)} pre={len(pre)} steps={len(stp)})'); continue
    marker = html.unescape(marks[0]).strip()
    prov = html.unescape(provs[0]).strip()
    exp_blocks = [numbered(body), ['---', prov], [marker]]
    fields = {'custom_expected': {'blocks': exp_blocks,
                                  'text': '\n\n'.join('\n'.join(b) for b in exp_blocks)}}
    for f, src in (('custom_preconds', pre), ('custom_steps', stp)):
        fields[f] = {'blocks': [numbered(src)], 'text': '\n'.join(numbered(src))}
    for f, d in fields.items():
        left = sorted(set(m.group(0).lower() for m in TAGS.finditer(d['text'])))
        if left: problems.append(f'C{cid} {f}: residual tags {left}')
    out[cid] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                'section_id': c['section_id'], 'escaping': True,
                'marker_carried': marker, 'fields': fields}
    if i % 15 == 0: print(f'  {i}/{len(rest)}')

json.dump(snap, open(f'{M}/PRE-rest-snapshot.json', 'w'), indent=1, ensure_ascii=False)
json.dump(out, open(f'{M}/intended-blocks-rest.json', 'w'), indent=1, ensure_ascii=False)
print(f'\nderived : {len(out)} of {len(rest)}')
print(f'problems: {len(problems)}')
for p in problems: print('   ', p)
print('\nmarkers being CARRIED VERBATIM (nothing lifted to READY):')
for m, n in collections.Counter(v['marker_carried'] for v in out.values()).most_common():
    print(f'  {n:>3}x  {m!r}')
if problems: sys.exit(1)
