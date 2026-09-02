#!/usr/bin/env python3
"""Write the design reference into every Invoice UI Refresh case (QA lead, 2026-09-01).

His instruction, verbatim: *"if the source for something is the design, you can add the reference for
the design with this link … But do tell where in the design that reference can be found."*

So each case gains ONE sentence inside its existing provenance block, after the Rule-54 sentence and
before the automation marker:

    Design: the Design Document (<link>) — open "<view>" → "<document>", then <the block it is about>.

The route and every anchor in it were built and VERIFIED against the downloaded design he supplied
(`build_design_refs.py`, `design-refs.json`). Nothing else in any case changes: not the expectation,
not the preconditions, not the steps, not the Rule-54 sentence, not the marker.
"""
import json, base64, urllib.request, re, html, time, os

DIR = os.path.dirname(os.path.abspath(__file__))
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

intended, snap, skipped = {}, {}, []
for key, meta in sorted(REFS.items()):
    cid = int(key.lstrip('C'))
    c = get(f'get_case/{cid}')
    if c['created_by'] != 3:
        skipped.append((cid, 'foreign (Rule 38)')); continue
    if c.get('custom_atmstatus') == 3:
        skipped.append((cid, 'Automated, no per-case go-ahead (Rule 71)')); continue
    bl = blocks_of(c['custom_expected'])
    flat = [l for b in bl for l in b]
    if any(l.startswith('Design: the Design Document') for l in flat):
        skipped.append((cid, 'already carries a design reference')); continue
    prov_i = next((i for i, b in enumerate(bl) if b and b[0].strip() == '---'), None)
    if prov_i is None:
        skipped.append((cid, 'no "---" provenance block — LOOK AT IT')); continue
    prov_sentence = next((l for l in flat if l.startswith('This is the expected behaviour')), None)
    marker = next((l for l in flat if l.upper().startswith('AUTOMATION:')), None)
    if not prov_sentence or not marker:
        skipped.append((cid, 'missing provenance sentence or marker — LOOK AT IT')); continue
    build_sentence = next((l for l in flat if l.startswith('Last checked against build')), None)
    # rebuild: expectation blocks unchanged, then --- + sentence 1 + the DESIGN sentence
    # (+ build sentence if it had one), then the marker, carried verbatim
    head = [b for b in bl[:prov_i] if b]
    prov = ['---', prov_sentence, meta['design_sentence']]
    if build_sentence: prov.append(build_sentence)
    new = head + [prov, [marker]]
    intended[str(cid)] = {
        'title': c['title'], 'verdict': 'design reference added (QA lead, 2026-09-01)',
        'marker_override': marker, 'build_sentence': build_sentence,
        'fields': {'custom_expected': {'blocks': new,
                                       'text': '\n\n'.join('\n'.join(b) for b in new)}}}
    snap[str(cid)] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                      'section_id': c['section_id'], 'refs': c.get('refs'),
                      'provenance': [prov_sentence], 'own_source': [],
                      'before': {'custom_expected': c['custom_expected']}}

json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print(f'to write: {len(intended)}   skipped: {len(skipped)}')
for cid, why in skipped: print(f'   C{cid}: {why}')
k = sorted(intended)[0]
print(f'\n--- C{k} will read:\n')
print(intended[k]['fields']['custom_expected']['text'])
