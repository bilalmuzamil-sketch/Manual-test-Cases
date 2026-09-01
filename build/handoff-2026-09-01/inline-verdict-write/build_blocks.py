#!/usr/bin/env python3
"""THIRD write pass, 2026-09-01: the four Inline cases whose verdict changed once the data states were
seeded instead of reported missing.

  C45239  NOT VERIFIED -> PASS   a catalogue part on no bin location: 19,496 of them exist
  C45060  NOT VERIFIED -> FAIL   the fields open 0.00, not empty, and Save SUCCEEDS at 0.00
  C44996  NOT VERIFIED -> FAIL   a line whose status is Complete still shows "+ Add Part"
  C45034  stays NOT VERIFIED     it genuinely needs a second person; no build sentence is added

NO TICKET IS PREPARED FOR THE TWO DEVIATIONS. QA lead, 2026-09-01, verbatim: "You are never supposed
to create defect, you are supposed to make the tests RUNNABLE." So each carries the three-outcome
instruction Rule 61 defines instead, and keeps AUTOMATION: READY - an EXPECT FAIL marker would need a
live ticket behind it and there is none (skill 04 s4: no backing, no marker; the tester discovers the
outcome and records it).

Preconditions are also made concretely runnable, which is the point of the whole exercise: the two
that used to say "select a part that has no cost on record" or "mark the line complete" now say
exactly how, with the part number and the click path this pass actually used.
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

PERM = ('2. Your user has the ‘Work Order Line - Create and Edit’ permission enabled. To check it: '
        'open “Settings”, click “Roles & Permissions” in the sidebar, then click the pencil on the '
        'role your user is on, and look for “Work Order Line - Create and Edit”.')
ENTRY = ('1. In the top menu click “Work Orders”, then open a work order whose status is Estimate, '
         'Approved, In Progress, or Review (click its row in the list). Open its “Lines” tab. Each work '
         'order line has its own Parts section beneath it: the “Add Part” button sits in that section, '
         'and every part already on the line has an “edit” control at the right-hand end of its row '
         '— that control stays invisible until you move the mouse over the row.')

PLAN = {
 45239: dict(note=None, marker='AUTOMATION: READY', build_sentence=True, preconds=None),
 45060: dict(
   note='WHAT YOU SHOULD SEE TODAY, AND IT IS A PROBLEM: the two boxes do NOT open empty — they open '
        'showing “0.00”, and the part saves at 0.00 without you typing anything. '
        '(1) If that is exactly what you see, mark the case FAILED and raise nothing new. '
        '(2) If it fails DIFFERENTLY, that is a new problem — please report it. '
        '(3) If the boxes DO open empty and the save is refused until you fill them, the fix has '
        'shipped — tell the QA lead.',
   marker='AUTOMATION: READY', build_sentence=True,
   preconds=[[ENTRY, PERM,
     '3. Click “Add Part” on a line, then in the “Part number” box type a catalog part number that '
     'is not stocked anywhere — “F40010212” (Slack Adjuster) is one, and the suggestion list marks '
     'it “Catalog”. Click that suggestion. Then look at the “Cost” and “Sell price” boxes.']]),
 44996: dict(
   note='WHAT YOU SHOULD SEE TODAY, AND IT IS A PROBLEM: the “Add Part” button is STILL shown on the '
        'line after its status becomes “Complete”. '
        '(1) If that is exactly what you see, mark the case FAILED and raise nothing new. '
        '(2) If it fails DIFFERENTLY, that is a new problem — please report it. '
        '(3) If “Add Part” is gone from that line, the fix has shipped — tell the QA lead.',
   marker='AUTOMATION: READY', build_sentence=True,
   preconds=[[ENTRY, PERM,
     '3. Pick a line that has NO parts on it yet — a line with parts on it cannot be completed at all, '
     'the app refuses with “Line can’t be completed with unfulfilled part requests.”',
     '4. On that line click “Approve”, and once its status reads “Authorized” mark it Complete from '
     'the same row. Its status badge should then read “Complete”. Going straight to Complete is not '
     'allowed — the app makes you approve it first.',
     '5. Now look at that line’s own Parts section.']]),
 45034: dict(
   note='NOTE FOR THE TESTER: this one really does need a second person. Ask a colleague to open the '
        'same part and change or delete it while your edit row is sitting open, then press Save. If '
        'you cannot arrange that, leave the case Untested and tell the QA lead — do not mark it '
        'Passed or Failed on a guess. We tried to reproduce it from a second connection rather than a '
        'second person and could not get the row open at the right moment, so nothing is known about '
        'this behaviour either way.',
   marker='AUTOMATION: READY', build_sentence=False, preconds=None),
}

intended, snap = {}, {}
for cid, plan in sorted(PLAN.items()):
    c = get(f'get_case/{cid}')
    if c.get('custom_atmstatus') == 3:
        print(f'C{cid} IS AUTOMATED — refusing (Rule 71)'); continue
    if c['created_by'] != 3:
        print(f'C{cid} IS FOREIGN — refusing (Rule 38)'); continue
    bl = blocks_of(c['custom_expected'])
    prov_i = next((i for i, b in enumerate(bl) if b and b[0].strip() == '---'), None)
    assert prov_i is not None, f'C{cid} has no provenance separator'
    prov_sentence = next(l for b in bl for l in b if l.startswith('This is the expected behaviour'))
    head = [[l for l in b if not (l.startswith('NOTE FOR THE TESTER')
                                  or l.startswith('WHAT YOU SHOULD SEE TODAY'))] for b in bl[:prov_i]]
    head = [b for b in head if b]
    new = list(head)
    if plan['note']:
        new.append([plan['note']])
    prov_block = ['---', prov_sentence]
    if plan['build_sentence']:
        prov_block.append(BUILD_SENTENCE)
    new.append(prov_block)
    new.append([plan['marker']])
    fields = {'custom_expected': {'blocks': new, 'text': '\n\n'.join('\n'.join(b) for b in new)}}
    if plan['preconds']:
        fields['custom_preconds'] = {'blocks': plan['preconds'],
                                     'text': '\n\n'.join('\n'.join(b) for b in plan['preconds'])}
    intended[str(cid)] = {'title': c['title'], 'verdict': 'verdict changed 2026-09-01',
                          'marker_override': plan['marker'],
                          'build_sentence': BUILD_SENTENCE if plan['build_sentence'] else None,
                          'fields': fields}
    snap[str(cid)] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                      'section_id': c['section_id'], 'refs': c.get('refs'),
                      'provenance': [prov_sentence],
                      'before': {k: c[k] for k in ('custom_preconds', 'custom_steps', 'custom_expected')}}

json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print(f'prepared {len(intended)}: {sorted(int(k) for k in intended)}')
for k, v in sorted(intended.items()):
    print(f"  C{k}: fields={list(v['fields'])} build_sentence={bool(v['build_sentence'])}")
