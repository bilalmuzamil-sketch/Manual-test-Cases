#!/usr/bin/env python3
"""verify_jira_write.py — Standing Rule 50 verification of a Jira write on SV-8821.

EXHAUSTIVE half: EVERY field of the issue is compared, not only the one we edited.
EXACT half:      the edited field is byte-compared against the intended payload, and every field
                 we did NOT intend to change is proven byte-identical to the pre-write snapshot.

Also proves the two images actually RENDER INLINE (a `mediaSingle` > `media` node whose attrs.id is a
36-char media-services UUID, plus a real <img src=.../attachment/content/...> in renderedFields) —
an attachment with no media node is attached but not inline, which fails the required ticket format.

Usage: verify_jira_write.py <pre.json> <intended-description.wiki> [fields-we-changed...]
"""
import json, subprocess, sys, re

PRE, WIKI = sys.argv[1], sys.argv[2]
CHANGED = set(sys.argv[3:]) or {'description'}
# fields Jira itself moves as a side effect of ANY edit — excluded from the "untouched" proof
# and reported separately so nothing is hidden.
SIDE_EFFECT = {'updated', 'attachment', 'comment', 'description'}


def jira(path, api='3'):
    out = subprocess.run(['bash', '/tmp/atlassian/jira.sh', 'GET', path],
                         capture_output=True, text=True).stdout
    body, code = out.rsplit('__HTTP:', 1)
    assert code.strip() == '200', f'GET {path} -> {code.strip()}'
    return json.loads(body)


pre = json.load(open(PRE))
intended = open(WIKI).read()

post3 = jira('/rest/api/3/issue/SV-8821?expand=renderedFields,changelog')
post2 = jira('/rest/api/2/issue/SV-8821?fields=description', api='2')
json.dump(post3, open('/tmp/sv8821/sv8821-post.json', 'w'), indent=1)

print('=' * 78)
print('1. THE EDITED FIELD — byte comparison against the intended payload')
print('=' * 78)
got = post2['fields']['description']
same = got == intended
print(f'   intended {len(intended)} bytes | stored {len(got)} bytes | BYTE-IDENTICAL: {same}')
if not same:
    for i, (a, b) in enumerate(zip(intended, got)):
        if a != b:
            print(f'   FIRST DIFFERENCE at byte {i}: intended {a!r} vs stored {b!r}')
            print(f'   intended ...{intended[max(0,i-60):i+60]!r}')
            print(f'   stored   ...{got[max(0,i-60):i+60]!r}')
            break
    else:
        print(f'   length differs only; tail intended={intended[len(got):]!r} stored={got[len(intended):]!r}')

print()
print('=' * 78)
print('2. EVERY OTHER FIELD — proven byte-identical to the pre-write snapshot')
print('=' * 78)
pf, qf = pre['fields'], post3['fields']
keys = sorted(set(pf) | set(qf))
diffs, checked = [], 0
for k in keys:
    if k in SIDE_EFFECT:
        continue
    a, b = json.dumps(pf.get(k), sort_keys=True), json.dumps(qf.get(k), sort_keys=True)
    checked += 1
    if a != b:
        diffs.append((k, a, b))
print(f'   fields compared: {checked} of {len(keys)} '
      f'(excluded as edit side effects: {sorted(SIDE_EFFECT)})')
if diffs:
    print(f'   ⚠️  {len(diffs)} FIELD(S) CHANGED THAT SHOULD NOT HAVE:')
    for k, a, b in diffs:
        print(f'      {k}: {a[:150]}  ->  {b[:150]}')
else:
    print('   ✅ ZERO unintended differences — every compared field byte-identical.')

print()
print('   the fields that matter most, spelled out:')
for k, label in [('status', 'status'), ('resolution', 'resolution'), ('priority', 'priority'),
                 ('parent', 'parent'), ('labels', 'labels'), ('summary', 'summary'),
                 ('issuetype', 'issue type'), ('customfield_10418', 'Severity'),
                 ('customfield_10153', 'Product Area')]:
    a, b = pf.get(k), qf.get(k)
    fmt = lambda v: (v.get('name') or v.get('value') or v.get('key')) if isinstance(v, dict) else v
    print(f'      {label:14} before={str(fmt(a))[:40]:42} after={str(fmt(b))[:40]:42} '
          f'{"SAME" if json.dumps(a, sort_keys=True) == json.dumps(b, sort_keys=True) else "*** CHANGED ***"}')

print()
print('   issue links (must be unchanged):')
lk = lambda f: sorted((l['type']['name'], (l.get('outwardIssue') or l.get('inwardIssue') or {}).get('key'))
                      for l in f.get('issuelinks', []))
print(f'      before={lk(pf)}\n      after ={lk(qf)}  '
      f'{"SAME" if lk(pf) == lk(qf) else "*** CHANGED ***"}')

print()
print('=' * 78)
print('3. ATTACHMENTS — the originals must survive, the new ones must be present')
print('=' * 78)
ab = {(a['filename'], a['size']) for a in pf.get('attachment', [])}
aa = {(a['filename'], a['size']) for a in qf.get('attachment', [])}
print(f'   before {len(ab)} -> after {len(aa)}')
print(f'   originals all still present: {ab <= aa}')
for f, s in sorted(aa - ab):
    print(f'   ADDED: {f} ({s} bytes)')
for f, s in sorted(ab - aa):
    print(f'   ⚠️ LOST: {f} ({s} bytes)')

print()
print('=' * 78)
print('4. INLINE RENDERING — attached is not the same as inline')
print('=' * 78)
media = []


def walk(n):
    if isinstance(n, dict):
        if n.get('type') == 'media':
            media.append(n.get('attrs', {}))
        for v in n.values():
            walk(v)
    elif isinstance(n, list):
        for v in n:
            walk(v)


walk(qf.get('description'))
print(f'   media nodes in the stored ADF: {len(media)}')
for m in media:
    mid = m.get('id', '')
    print(f'      id={mid} len={len(mid)} '
          f'{"✅ 36-char media-services UUID" if len(mid) == 36 else "⚠️ NOT a media UUID"}')
rendered = post3.get('renderedFields', {}).get('description', '') or ''
imgs = re.findall(r'<img[^>]+src="([^"]+)"', rendered)
print(f'   <img> tags in renderedFields.description: {len(imgs)}')
for i in imgs:
    print(f'      {i[:110]}')
mediasingle = json.dumps(qf.get('description')).count('"mediaSingle"')
print(f'   mediaSingle wrappers: {mediasingle}')

print()
print('=' * 78)
ok = same and not diffs and ab <= aa and len(media) == 2 and all(len(m.get("id", "")) == 36 for m in media) and len(imgs) >= 2
print('OVERALL:', '✅ PASS — write is byte-verified and images render inline'
      if ok else '⚠️ REVIEW THE ITEMS FLAGGED ABOVE')
print('=' * 78)
sys.exit(0 if ok else 5)
