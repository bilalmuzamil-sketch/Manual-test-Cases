#!/usr/bin/env python3
"""REPAIR: C44993 and C44994 — my write pass reverted a hand-made correction, and the audit found it.

WHAT HAPPENED. Both cases were narrowed by hand on 2026-09-01 from "Complete, Invoiced, Paid, Declined
or Imported" to "Complete, Invoiced, or Paid". On C44994 the correction landed at 08:17 and my write at
09:53 put the five-status wording back; on C44993 the title had already been narrowed before my
snapshot was taken, so my write left the title at three and the body at five. Either way both cases are
now internally inconsistent: **title says three, preconditions and expected say five.**
Audit that caught it: `build/handoff-2026-09-01/audit_clobbered.py`.

WHICH WORDING WINS, AND IT IS NOT A JUDGEMENT CALL. The narrowed one, on two independent grounds:
  · it is the LATER decision, and it was made by a person (Rule 32, latest wins);
  · it is the MEASURED truth - GET /api/work-orders/statuses returns exactly estimate, approved,
    in_progress, ready_for_review, complete, invoiced, paid. **"Declined" and "Imported" are not
    statuses this product has**, so a case asserting behaviour for them asserts nothing testable.
So preconditions, expected and the tester note are brought into line with the title.
"""
import json, base64, urllib.request, re, html, time, os

DIR = os.path.dirname(os.path.abspath(__file__))
BUILD_SENTENCE = 'Last checked against build v26.35.6-598cc8a on 9/1/2026.'
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
def blocks_of(h):
    ps = re.findall(r'<p>(.*?)</p>', h, re.S) or [h]
    out = []
    for p in ps:
        lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.split(r'<br\s*/?>', p)]
        out.append([l for l in lines if l != ''] or [''])
    return out

NOTE = ('NOTE FOR THE TESTER: of those three statuses only Paid exists in the data on this test '
        'system, so check it on a Paid work order and mark the case Blocked saying so — do not pass it '
        'on Paid alone. (Two statuses this case used to name, “Declined” and “Imported”, are not '
        'statuses this product has at all; the list is Estimate, Approved, In progress, Review, '
        'Complete, Invoiced, Paid.)')
FIVE = re.compile(r'Complete, Invoiced, Paid, Declined,? or Imported')
PLAN = {
 44993: dict(expected_line='1. The “Add Part” button is not displayed on any work order line when the '
                           'status is Complete, Invoiced, or Paid.'),
 44994: dict(expected_line='1. The Edit control is not displayed on part lines when the status is '
                           'Complete, Invoiced, or Paid.'),
}

intended, snap = {}, {}
for cid, plan in sorted(PLAN.items()):
    c = get(f'get_case/{cid}')
    assert c.get('custom_atmstatus') != 3 and c['created_by'] == 3, f'C{cid} is protected'
    # preconditions: narrow the status list, leave every other word alone
    pre_blocks = blocks_of(c['custom_preconds'])
    pre_blocks = [[FIVE.sub('Complete, Invoiced, or Paid', l) for l in b] for b in pre_blocks]
    # expected: the narrowed assertion, the refreshed note, provenance, marker
    exp = blocks_of(c['custom_expected'])
    prov_i = next(i for i, b in enumerate(exp) if b and b[0].strip() == '---')
    prov_sentence = next(l for b in exp for l in b if l.startswith('This is the expected behaviour'))
    new_exp = [[plan['expected_line']], [NOTE], ['---', prov_sentence, BUILD_SENTENCE],
               ['AUTOMATION: READY']]
    intended[str(cid)] = {
        'title': c['title'], 'verdict': 'repair of a reverted hand correction',
        'marker_override': 'AUTOMATION: READY', 'build_sentence': BUILD_SENTENCE,
        'fields': {
            'custom_preconds': {'blocks': pre_blocks,
                                'text': '\n\n'.join('\n'.join(b) for b in pre_blocks)},
            'custom_expected': {'blocks': new_exp,
                                'text': '\n\n'.join('\n'.join(b) for b in new_exp)},
        }}
    snap[str(cid)] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                      'section_id': c['section_id'], 'refs': c.get('refs'),
                      'provenance': [prov_sentence],
                      'before': {k: c[k] for k in ('custom_preconds', 'custom_steps', 'custom_expected')}}

json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
for k, v in sorted(intended.items()):
    print(f"C{k}  title: {v['title']}")
    print('  PRECONDS:', v['fields']['custom_preconds']['text'][:300].replace('\n', ' | '))
    print('  EXPECTED:', v['fields']['custom_expected']['text'][:200].replace('\n', ' | '))
