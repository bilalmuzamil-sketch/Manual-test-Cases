#!/usr/bin/env python3
"""Derive the INTENDED plain-text content for the 53 build-verified cases.

TWO changes are being made, and only these two:
  (a) the AUTOMATION marker is lifted from
          "AUTOMATION: Not available on Build to test Yet - Last checked <date>"
      to  "AUTOMATION: READY"
      because the case has now passed all five runnability checks on v26.35.5-8c3cc21.
  (b) Rule 54 SENTENCE 2 is added:
          "Last checked against build v26.35.5-8c3cc21 on 8/31/2026."
      Sentence 1 (documents only) is carried through BYTE-FOR-BYTE. The build never enters
      sentence 1, and the barred phrasing "as per the build tested on" is never emitted.

No expected BEHAVIOUR is changed. Rule 57: the expectation comes from the documents; the build
supplied only the labels/navigation and the pass verdict.

Output format is the repo's canonical repaired shape (Rule 16 -- mirror the established format,
proven in build/report-suite/damage-2026-08-26/intended-blocks.json): PLAIN TEXT, numbered
"1. " lines, a "---" separator, the provenance sentences, then the marker as its own block.
Plain text is what fixes the render: the 48 escaping cases currently store HTML into a
container that ESCAPES it, so the tester literally reads "<ol><li>".
"""
import json, re, html, sys, collections

DIR = 'build/invoice-ui-refresh/build-verify-2026-08-31/markers'
BUILD = 'v26.35.5-8c3cc21'
SENT2 = f'Last checked against build {BUILD} on 8/31/2026.'
NEW_MARKER = 'AUTOMATION: READY'

snap = json.load(open(f'{DIR}/PRE-markers-snapshot.json'))
rc = json.load(open(f'{DIR}/render-containers.json'))

TAGS = re.compile(r'</?([a-zA-Z]+)[^>]*>')

def items(v):
    """The <li> texts of an <ol>, in order, as plain text."""
    body = re.split(r'<hr\s*/?>', v or '', flags=re.I)[0]
    out = []
    for m in re.finditer(r'<li>(.*?)</li>', body, re.S | re.I):
        t = html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))
        t = re.sub(r'\s+', ' ', t).strip()
        if t:
            out.append(t)
    return out

def numbered(lines):
    return [f'{i}. {t}' for i, t in enumerate(lines, 1)]

out, problems = {}, []
for cid, s in sorted(snap.items(), key=lambda kv: int(kv[0])):
    exp = s['custom_expected'] or ''
    # ---- integrity gates before deriving anything ----
    if len(s['markers']) != 1:
        problems.append(f'C{cid}: {len(s["markers"])} AUTOMATION markers'); continue
    if len(s['provenance']) != 1:
        problems.append(f'C{cid}: {len(s["provenance"])} provenance lines'); continue
    if s['build_sentence']:
        problems.append(f'C{cid}: already carries a build sentence: {s["build_sentence"]}'); continue
    if s['atm'] == 3:
        problems.append(f'C{cid}: custom_atmstatus=3 (Automated) — held, Rules 65/71'); continue

    prov1 = html.unescape(s['provenance'][0]).strip()
    if 'build' in prov1.lower():
        problems.append(f'C{cid}: sentence 1 mentions the build — refusing to carry it'); continue

    body = items(exp)
    pre = items(s['custom_preconds'])
    stp = items(s['custom_steps'])
    if not body or not pre or not stp:
        problems.append(f'C{cid}: empty body/preconds/steps after parse'); continue

    # every escaping case gets all three fields rewritten (the tester reads tags in all three);
    # an fr-view case renders correctly already, so only the expected field is touched.
    escaping = not rc[cid]['api_safe']
    fields = {}
    exp_blocks = [numbered(body), ['---', prov1, SENT2], [NEW_MARKER]]
    fields['custom_expected'] = {'blocks': exp_blocks,
                                 'text': '\n\n'.join('\n'.join(b) for b in exp_blocks)}
    if escaping:
        for f, src in (('custom_preconds', pre), ('custom_steps', stp)):
            b = [numbered(src)]
            fields[f] = {'blocks': b, 'text': '\n\n'.join('\n'.join(x) for x in b)}

    # residual-tag gate: nothing we are about to store may contain a tag
    for f, d in fields.items():
        left = sorted(set(m.group(0).lower() for m in TAGS.finditer(d['text'])))
        if left:
            problems.append(f'C{cid} {f}: residual tags {left}')
    out[cid] = {'title': s['title'], 'atm': s['atm'], 'section_id': s['section_id'],
                'escaping': escaping, 'fields': fields}

json.dump(out, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
print(f'derived           : {len(out)} of {len(snap)} cases')
print(f'all three fields  : {sum(1 for v in out.values() if len(v["fields"]) == 3)}  (escaping — tester reads tags today)')
print(f'expected only     : {sum(1 for v in out.values() if len(v["fields"]) == 1)}  (already fr-view)')
print(f'problems          : {len(problems)}')
for p in problems: print('   ', p)
if problems:
    print('\n*** refusing to proceed with a partial derivation — fix the above first')
    sys.exit(1)
k = sorted(out, key=int)[1]
print(f'\n--- SAMPLE C{k} custom_expected as the tester will read it ---')
print(out[k]['fields']['custom_expected']['text'])
print(f'\n--- SAMPLE C{k} custom_preconds ---')
print(out[k]['fields'].get('custom_preconds', {}).get('text', '(unchanged)'))
