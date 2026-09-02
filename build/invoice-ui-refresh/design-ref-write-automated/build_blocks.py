#!/usr/bin/env python3
"""The five Automated Invoice UI Refresh cases, under the QA lead's go-ahead of 2026-09-02.

His words, verbatim: *"Go ahead with that too but after completing everything else."* — so this pass
runs LAST, after the other 84 were written and checked. Register row INV-DEV-3.

  C44919, C44920, C44921, C44922   the work-order Authorizer cases
  C44985                           the parts-sale Authorizer case

All five carry TestRail's own Automated flag (`custom_atmstatus = 3`), which is why they were skipped
by the main pass under Rule 71. The change is identical to the other 84: ONE sentence added to the
provenance block naming where in the design the case can be found. Nothing else moves — not the
expectation, not the preconditions, not the steps, not the Rule-54 sentence, not the marker, and not
the Automated flag itself, which is re-read before and after.

Rule 65 duty applies: Vlad is told, in `FOR-VLAD-automated-cases-changed-2026-09-02.md`.

⚠️ THIS GO-AHEAD DOES NOT REACH THE SIX *INLINE* AUTOMATED CASES (C45005, C45026, C45223, C45224,
C45227, C45237, register row HO-11). Different suite, different change, still held.
"""
import json, base64, urllib.request, re, html, time, os

DIR = os.path.dirname(os.path.abspath(__file__))
AUTHORISED = ['44919', '44920', '44921', '44922', '44985']
REFS = json.load(open('/home/user/Manual-test-Cases/build/invoice-ui-refresh/design-refs.json'))
C = json.load(open('/tmp/testrail/creds.json'))
AUTH = base64.b64encode(f"{C['email']}:{C['password']}".encode()).decode()
def get(p):
    for a in range(6):
        try:
            r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/' + p,
                                       headers={'Authorization': 'Basic ' + AUTH})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == 5: raise
            time.sleep(2 ** a)
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

intended, snap, notes = {}, {}, []
for cid in AUTHORISED:
    c = get(f'get_case/{cid}')
    meta = REFS.get('C' + cid)
    assert meta, f'C{cid} has no design route'
    assert c['created_by'] == 3, f'C{cid} is not ours'
    notes.append((cid, c['title'], c.get('custom_atmstatus')))
    bl = blocks_of(c['custom_expected'])
    flat = [l for b in bl for l in b]
    if any(l.startswith('Design: the Design Document') for l in flat):
        print(f'C{cid} already has a design reference — skipping'); continue
    prov_i = next(i for i, b in enumerate(bl) if b and b[0].strip() == '---')
    prov_sentence = next(l for l in flat if l.startswith('This is the expected behaviour'))
    marker = next(l for l in flat if l.upper().startswith('AUTOMATION:'))
    build_sentence = next((l for l in flat if l.startswith('Last checked against build')), None)
    head = [b for b in bl[:prov_i] if b]
    prov = ['---', prov_sentence, meta['design_sentence']]
    if build_sentence: prov.append(build_sentence)
    new = head + [prov, [marker]]
    intended[cid] = {'title': c['title'],
                     'verdict': 'design reference added under the 2026-09-02 go-ahead (Rule 71)',
                     'marker_override': marker, 'build_sentence': build_sentence,
                     'fields': {'custom_expected': {'blocks': new,
                                'text': '\n\n'.join('\n'.join(b) for b in new)}}}
    snap[cid] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                 'section_id': c['section_id'], 'refs': c.get('refs'),
                 'provenance': [prov_sentence], 'own_source': [],
                 'before': {'custom_expected': c['custom_expected']}}

# the writer's Rule 71 gate needs the explicit per-case allow-list, never a blanket flag
json.dump(AUTHORISED, open(f'{DIR}/automated-authorised.json', 'w'), indent=1)
json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print(f'\nto write: {len(intended)}')
for cid, title, atm in notes:
    print(f'  C{cid}  atmstatus={atm}  {title[:60]}')
