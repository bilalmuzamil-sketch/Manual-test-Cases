#!/usr/bin/env python3
"""The Printer Friendly preconditions claim the More menu "holds five items". On a Paid work order it
holds THREE. Fixing 42 preconditions so a tester does not report the difference as a fault.

MEASURED 2026-09-01 (/tmp/moremenu.mjs, two work orders):
  S9315-14846, Estimate -> Audit Log · Timesheets (0) · Add Work Order Fee / Discount ·
                           Print Work Order · Delete Work Order          (five)
  S2-15522,    Paid     -> Audit Log · Timesheets (4) · Print Work Order (THREE - no Fee / Discount,
                           no Delete)

This matters most on C45088, which checks the Print option across statuses: a tester told the menu has
five items, looking at a Paid work order, would see three and reasonably flag it.

The slash in "Fee / Discount" is CORRECT and stays. An earlier note in this repo had it as "&", I
copied that into the observed-labels file, and the new label gate then flagged these 42 cases as wrong.
The cases were right; the reference file was wrong, and it has been corrected.

Preconditions only, exact string replacement, every intended case asserted to have changed.
"""
import json, base64, urllib.request, re, html, time, os

DIR = os.path.dirname(os.path.abspath(__file__))
C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def get(p):
    for a in range(5):
        try:
            r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/' + p,
                                       headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == 4: raise
            time.sleep(2 ** a)
def paged(p, key):
    out, off = [], 0
    while True:
        j = get(f'{p}&limit=250&offset={off}'); ch = j[key] if isinstance(j, dict) else j
        out += ch
        if len(ch) < 250: break
        off += 250
    return out
def blocks_of(h):
    parts = re.findall(r'<li>(.*?)</li>|<p>(.*?)</p>', h, re.S)
    chunks = [a or b for a, b in parts] or [h]
    out = []
    for p in chunks:
        p = re.sub(r'</p>\s*<p>', '<br>', p)
        lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.split(r'<br\s*/?>', p)]
        lines = [l for l in lines if l != '']
        if lines: out.append(lines)
    return out

OLD = ('The menu holds five items in this order: “Audit Log”, “Timesheets”, '
       '“Add Work Order Fee / Discount”, “Print Work Order”, “Delete Work Order”.')
NEW = ('On a work order you can still change, the menu holds five items in this order: “Audit Log”, '
       '“Timesheets”, “Add Work Order Fee / Discount”, “Print Work Order”, “Delete Work Order”. On a '
       'Paid work order it holds only three — “Audit Log”, “Timesheets”, “Print Work Order” — so do '
       'not treat the two missing items as a fault. “Timesheets” always shows a count in brackets.')

intended, snap, skipped = {}, {}, []
cases = []
for sid in [6761, 6762, 6763, 6764, 6765, 6766]:
    cases += paged(f'get_cases/1&section_id={sid}', 'cases')
for c in cases:
    pre = c.get('custom_preconds') or ''
    if 'five items' not in html.unescape(re.sub(r'<[^>]+>', '', pre)):
        continue
    if c['created_by'] != 3:
        skipped.append((c['id'], 'foreign (Rule 38)')); continue
    if c.get('custom_atmstatus') == 3:
        skipped.append((c['id'], 'Automated, no per-case go-ahead (Rule 71)')); continue
    blocks, changed = blocks_of(pre), 0
    new_blocks = []
    for b in blocks:
        nb = []
        for line in b:
            if OLD in line:
                line = line.replace(OLD, NEW); changed += 1
            nb.append(line)
        new_blocks.append(nb)
    if changed != 1:
        skipped.append((c['id'], f'expected exactly one match, found {changed} — LOOK AT IT')); continue
    exp = blocks_of(c.get('custom_expected') or '')
    flat = [l for bb in exp for l in bb]
    intended[str(c['id'])] = {
        'title': c['title'], 'verdict': 'More-menu precondition corrected: five items only when editable',
        'marker_override': next(l for l in flat if l.upper().startswith('AUTOMATION:')),
        'build_sentence': next((l for l in flat if l.startswith('Last checked against build')), None),
        'fields': {'custom_preconds': {'blocks': new_blocks,
                                       'text': '\n\n'.join('\n'.join(b) for b in new_blocks)}},
    }
    snap[str(c['id'])] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                          'section_id': c['section_id'], 'refs': c.get('refs'),
                          'provenance': [l for l in flat if l.startswith('This is the expected behaviour')],
                          'own_source': [l for l in flat if l.lower().startswith('source:')],
                          'before': {'custom_preconds': pre}}

json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print(f'to write: {len(intended)}')
print(f'skipped : {len(skipped)}')
for cid, why in skipped: print(f'   C{cid}: {why}')
