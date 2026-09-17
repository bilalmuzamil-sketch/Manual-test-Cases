#!/usr/bin/env python3
"""RULE 111 SWEEP — finds every literal identifier named in the 99 cases and asks the live build
whether it is real, reachable, and (where the case needs a negative) genuinely absent.

Reports; it does not write. Correcting is a separate, deliberate step per case.

WHAT COUNTS AS AN IDENTIFIER HERE: work-order / part-sale / purchase-order numbers, part numbers,
VINs, telephone numbers and email addresses — the things a tester TYPES and that the environment
either holds or does not. Names are excluded: they are not branch-assigned, and a name mismatch is a
seeding gap rather than a stale identifier.
"""
import os, re, sys, json, html, runpy, urllib.parse
sys.path.insert(0, '/tmp')
import trlib
_s = runpy.run_path('/home/user/Manual-test-Cases/build/global-search/seeding/seed.py', run_name='not_main')
call = _s['call']

CORE = [6721,6722,6723,6724,6725,6726,6727,6728,6729,6730,6732,6733,6734,6737,6738,6739,6740,6774,8056]

def txt(s):
    s = re.sub(r'<br\s*/?>', '\n', s or ''); s = re.sub(r'</p>', '\n', s); s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s).replace('\r', '')

PATTERNS = [
    ('work order / part sale / PO number', re.compile(r"\b([SIP]\d*-\s?\d{2,6})\b")),
    ('VIN',                                re.compile(r"\b([A-HJ-NPR-Z0-9]{17})\b")),
    ('telephone',                          re.compile(r"(\(\d{3}\)\s?\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b|\b\d{10}\b)")),
    ('email',                              re.compile(r"\b([\w.+-]+@[\w-]+\.[\w.]+)\b")),
    ('bare part number',                   re.compile(r"'(\d{4,6})'")),
]
# phrases that mark the identifier as one that MUST NOT be found
NEGATIVE_HINTS = ('no work order', 'no part sale', 'does not exist', 'matches nothing',
                  'near-miss', 'near miss', 'one digit off', 'returns no', 'no match')

def search(q):
    r = call('/api/search?q=' + urllib.parse.quote(q))
    return (r['json'] or {}).get('data', {}) or {}

def probe(ident):
    d = search(ident)
    pin = d.get('pinned')
    rows = sum(len(g['items']) for g in d.get('groups') or [])
    total = rows + (1 if pin else 0)
    openable = None
    if pin and pin.get('type') == 'work_orders':
        v = call(f"/api/work-orders/view/{pin['id']}")
        openable = v['status'] == 200
    return total, (pin or {}).get('primary'), openable

cases = {}
off = 0
while True:
    r = trlib.api(f'get_cases/1&suite_id=1&limit=250&offset={off}')
    b = r['cases'] if isinstance(r, dict) else r
    for c in b:
        if c['section_id'] in CORE: cases[c['id']] = c
    if len(b) < 250: break
    off += 250
print(f'scanning {len(cases)} cases in sections {CORE}\n')

seen, findings = {}, []
for cid, c in sorted(cases.items()):
    body = ' '.join(txt(c.get(f)) for f in ('custom_preconds', 'custom_steps', 'custom_expected'))
    low = body.lower()
    for label, pat in PATTERNS:
        for m in set(pat.findall(body)):
            ident = m.strip()
            if ident.lower() in ('example.com',): continue
            key = (ident, label)
            if key not in seen: seen[key] = probe(ident)
            total, pinned, openable = seen[key]
            # is this identifier named as something that must NOT be found?
            around = low[max(0, low.find(ident.lower()) - 160): low.find(ident.lower()) + 60]
            negative = any(h in around for h in NEGATIVE_HINTS)
            if negative:
                verdict = 'OK (absent as required)' if total == 0 else f'🔴 SHOULD BE ABSENT but returns {total}'
            else:
                if total == 0: verdict = '🔴 NAMED BUT NOT FOUND'
                elif openable is False: verdict = '🔴 FOUND BUT NOT OPENABLE at this workplace'
                else: verdict = 'OK'
            if not verdict.startswith('OK'):
                findings.append((cid, label, ident, verdict, pinned, total))

print('=== FINDINGS — identifiers a tester would type and not get what the case promises ===')
if not findings:
    print('  ✅ none. Every identifier named in the 99 cases behaves as its case requires.')
for cid, label, ident, verdict, pinned, total in findings:
    print(f'  C{cid}  {label:34} {ident!r:24} {verdict}   (pinned={pinned}, rows={total})')
print(f'\nchecked {len(seen)} distinct identifiers across {len(cases)} cases')
json.dump([{'case': c, 'kind': l, 'identifier': i, 'verdict': v} for c, l, i, v, _, _ in findings],
          open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'SWEEP-FINDINGS.json'), 'w'), indent=1)
