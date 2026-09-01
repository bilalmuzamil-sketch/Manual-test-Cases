#!/usr/bin/env python3
"""Add the TESTER NOTE that skill 04 section 4 requires, to the cases the brief tells the tester
not to run - or to run only part of.

WHY THIS PASS EXISTS. Skill 04 section 4, verbatim: "Every held case carries its reason IN ITS OWN
WORDS, at the end of its Expected Results, so a tester who opens the case is told the same thing the
brief tells them." A live check on 1 Sep found 14 of ours carrying NO such note. A tester who opens
the case straight from the run - which is what testers do - would try to set up a situation that does
not exist here, and then either guess or record the wrong result. The brief alone does not fix that;
the case has to say it too.

TWO CASES ALSO GET A DIFFERENT MARKER. C45107 and C45116 describe the printout of a work order with
no line items, and on the build the Print Work Order option is GREYED OUT in exactly that situation
(the specification asserts both). Nobody can ever run them, so "AUTOMATION: READY" would tell an
automation engineer to pick up a case that cannot pass. They become
"AUTOMATION: HOLD - <plain reason>", which is what HOLD is for. The arithmetic gate is re-derived
afterwards and still closes: 41 READY + 0 EXPECT-FAIL = 41, and 43 total - 2 HOLD = 41.

Nothing else in any case is touched: only custom_expected is written, and only by INSERTING one
block ahead of the provenance separator. Preconditions and steps are not in the payload at all.
"""
import json, base64, urllib.request, re, html, time, os, sys

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

NOTE = {
 44993: 'NOTE FOR THE TESTER: only the Paid status exists on this test system. Check the button on a '
        'Paid work order; Complete, Invoiced, Declined and Imported cannot be set up here, so mark '
        'this case Blocked and say which status you were able to check - do not pass it on Paid alone.',
 44994: 'NOTE FOR THE TESTER: only the Paid status exists on this test system. Check the control on a '
        'Paid work order; Complete, Invoiced, Declined and Imported cannot be set up here, so mark '
        'this case Blocked and say which status you were able to check - do not pass it on Paid alone.',
 44996: 'NOTE FOR THE TESTER: this case cannot be set up yet. Nothing other than the work order status '
        'is known to make a work order un-editable, so there is no way to produce the situation the '
        'case describes. Leave it Untested until the product owner has answered.',
 45034: 'NOTE FOR THE TESTER: this needs a second person changing the same part at the same moment as '
        'you. If you can arrange that, run it; otherwise leave it Untested and tell the QA lead.',
 45060: 'NOTE FOR THE TESTER: this needs a part with no cost and no sell price recorded at all. Every '
        'part on this test system holds 0.00 in those boxes, which is not the same as empty, so the '
        'case cannot be set up here yet.',
 45239: 'NOTE FOR THE TESTER: this needs a part that is not kept in any bin. Every part on this test '
        'system sits in at least one bin, so the case cannot be set up here yet.',
 45088: 'NOTE FOR THE TESTER: only the Estimate, Approved and Paid statuses exist on this test system. '
        'Check those three; the others cannot be set up here, so mark this case Blocked and say which '
        'statuses you were able to check - do not pass it on three out of ten.',
 45090: 'NOTE FOR THE TESTER: this needs a sign-in that cannot open work orders at all. Ask the QA lead '
        'to set one up; until then leave the case Untested.',
 45097: 'NOTE FOR THE TESTER: this needs a work order with no customer on it. Every work order on this '
        'test system has one, so the case cannot be set up here yet.',
 45098: 'NOTE FOR THE TESTER: this needs a work order with no vehicle on it. Every work order on this '
        'test system has one, so the case cannot be set up here yet.',
 45104: 'NOTE FOR THE TESTER: this needs a work order line whose status is Cancelled, and none of the '
        'work orders checked had one. If you can set a line to Cancelled yourself, do that and then run '
        'the case; otherwise leave it Untested.',
 45111: 'NOTE FOR THE TESTER: this needs a tech story of at least 500 characters - about a full '
        'paragraph. If you can paste that much text into a line’s tech story, do that and then run '
        'the case; otherwise leave it Untested.',
 45107: 'NOTE FOR THE TESTER: this case cannot be run at all. On a work order with no line items the '
        '“Print Work Order” option is greyed out, so the printout described here can never be '
        'opened. The written description asserts both things and the product owner has to settle it. '
        'Leave the case Untested.',
 45116: 'NOTE FOR THE TESTER: this case cannot be run at all, for the same reason as the case about '
        'printing a work order with no line items - the “Print Work Order” option is greyed '
        'out when there are no lines, so there is no printout to read a summary from. Leave it '
        'Untested.',
}
MARKER_OVERRIDE = {
 45107: 'AUTOMATION: HOLD - a work order with no line items cannot be printed at all, so this printout '
        'can never be reached; awaiting a product-owner ruling on the contradiction',
 45116: 'AUTOMATION: HOLD - a work order with no line items cannot be printed at all, so this summary '
        'can never be reached; awaiting a product-owner ruling on the contradiction',
}

def blocks_of(h):
    """<p>..</p><p>..</p> -> [[line, line], [line]] with <br> as the within-block break."""
    ps = re.findall(r'<p>(.*?)</p>', h, re.S)
    if not ps: ps = [h]
    out = []
    for p in ps:
        lines = [html.unescape(re.sub(r'<[^>]+>', '', x)).strip() for x in re.split(r'<br\s*/?>', p)]
        out.append([l for l in lines if l != ''] or [''])
    return out

intended, snap = {}, {}
for cid, note in sorted(NOTE.items()):
    c = get(f'get_case/{cid}')
    if c.get('custom_atmstatus') == 3:
        print(f'C{cid} IS AUTOMATED - refusing to include it (Rule 71)'); continue
    if c['created_by'] != 3:
        print(f'C{cid} IS FOREIGN - refusing to include it (Rule 38)'); continue
    bl = blocks_of(c['custom_expected'])
    prov_i = next((i for i, b in enumerate(bl) if b and b[0].strip() == '---'), None)
    if prov_i is None:
        print(f'C{cid} HAS NO "---" PROVENANCE BLOCK - skipping rather than guessing'); continue
    if any('NOTE FOR THE TESTER' in l for b in bl for l in b):
        print(f'C{cid} already carries a tester note - skipping'); continue
    marker = [l for b in bl for l in b if l.startswith('AUTOMATION:')]
    assert len(marker) == 1, f'C{cid} marker count {len(marker)}'
    prov = [l for b in bl for l in b if l.startswith('This is the expected behaviour')]
    assert len(prov) == 1, f'C{cid} provenance sentence count {len(prov)}'
    bs = [l for b in bl for l in b if l.startswith('Last checked against build')]
    newbl = bl[:prov_i] + [[note]] + bl[prov_i:]
    intended[str(cid)] = {
        'title': c['title'],
        'verdict': 'held/partial - tester note added',
        'marker_override': MARKER_OVERRIDE.get(cid, marker[0]),
        'build_sentence': bs[0] if bs else None,
        'fields': {'custom_expected': {
            'blocks': newbl,
            'text': '\n\n'.join('\n'.join(b) for b in newbl),
        }},
    }
    if cid in MARKER_OVERRIDE:
        # the marker line itself has to change inside the blocks, not only in the assertion
        for b in intended[str(cid)]['fields']['custom_expected']['blocks']:
            for i, l in enumerate(b):
                if l.startswith('AUTOMATION:'): b[i] = MARKER_OVERRIDE[cid]
        intended[str(cid)]['fields']['custom_expected']['text'] = '\n\n'.join(
            '\n'.join(b) for b in intended[str(cid)]['fields']['custom_expected']['blocks'])
    snap[str(cid)] = {'title': c['title'], 'atm': c.get('custom_atmstatus'),
                      'section_id': c['section_id'], 'refs': c.get('refs'),
                      'provenance': [prov[0]],
                      'before': {'custom_expected': c['custom_expected']}}

json.dump(intended, open(f'{DIR}/intended-blocks.json', 'w'), indent=1, ensure_ascii=False)
json.dump(snap, open(f'{DIR}/PRE-snapshot.json', 'w'), indent=1, ensure_ascii=False)
print(f'\nprepared {len(intended)} cases: {sorted(int(k) for k in intended)}')
print(f'marker changed on: {sorted(MARKER_OVERRIDE)}')
