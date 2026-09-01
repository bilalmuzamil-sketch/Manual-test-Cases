#!/usr/bin/env python3
"""SECOND write pass, 2026-09-01: the five Printer Friendly cases whose verdict CHANGED once the
data states were seeded instead of reported missing.

QA lead, 2026-09-01, verbatim: "You are never supposed to create defect, you are supposed to make the
tests RUNNABLE" and, on the no-view sign-in, "You can change the permission of a Tech to make this
happen." Standing Rule 14 already said it: never mark anything NOT-VERIFIED for a missing data state -
seed it. So five cases move off "not checked yet":

  C45090  NOT VERIFIED -> PASS         verified by removing the technician's work-orders view group
  C45111  NOT VERIFIED -> PASS         verified by seeding a 560-character tech story
  C45097  NOT VERIFIED -> UNREACHABLE  the app answers "Customer is a required field"
  C45098  NOT VERIFIED -> UNREACHABLE  the app answers "Asset is a required field"
  C45104  NOT VERIFIED -> UNREACHABLE  there is NO Cancelled line status in the product

The two PASS cases lose their tester note and gain the Rule-54 build sentence. The three UNREACHABLE
cases get a note that says what was actually tried and what the app answered - so the tester is not
sent to look for a state the product forbids - and their marker moves from READY to HOLD, because
telling an automation engineer a case is ready when nobody can reach its state is a false claim.
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

# note = the replacement TESTER NOTE, or None to remove it entirely
# marker = the marker the case must end with
# build_sentence = True to add/keep sentence 2, False to leave it absent
# preconds = a full replacement precondition text, block per paragraph, or None to leave it alone
PLAN = {
 45090: dict(
   note=None, marker='AUTOMATION: READY', build_sentence=True,
   preconds=[[
     '1. Sign in as a user whose role cannot view work orders, or have an administrator create one. '
     'To set a role up that way: open “Settings” from the menu behind your name at the top right, '
     'click “Roles & Permissions” in the sidebar, then click the pencil on the role in question and '
     'switch its work-order viewing permission off.',
     '2. Switching work-order viewing off on its own is not enough — the role keeps it. Switch off '
     'the work-order line editing and part-picking permissions in the same role as well, save, and '
     'the viewing permission then stays off.',
     '3. Then, in the top menu, try to reach “Work Orders” at all.',
   ]]),
 45111: dict(
   note=None, marker='AUTOMATION: READY', build_sentence=True,
   preconds=[[
     '1. In the top menu click “Work Orders” and open a work order by clicking its row. Open its '
     '“Lines” tab, click a line to open it, and paste at least 500 characters — about a full '
     'paragraph — into its “Tech Story” box, then save the line.',
     '2. Back on the work order’s toolbar click the three-dots button at the top right, then choose '
     '“Print Work Order”. The menu holds five items in this order: “Audit Log”, “Timesheets”, “Add '
     'Work Order Fee / Discount”, “Print Work Order”, “Delete Work Order”. Choosing it opens your '
     'browser’s own print dialog — the printout is what you are checking, so use your browser’s '
     'print preview to look at it.',
   ]]),
 45097: dict(
   note='NOTE FOR THE TESTER: this case cannot be run on this build, and it was tried properly rather '
        'than assumed. On the “New Work Order” window, leaving “Customer” empty and clicking “Save” '
        'answers “Customer is a required field” and nothing is created — so a work order with no '
        'customer cannot exist here at all, and the placeholder this case describes can never be '
        'printed. It is waiting on a product-owner ruling. Leave the case Untested.',
   marker='AUTOMATION: HOLD - a work order cannot be created without a customer ("Customer is a '
          'required field"), so this printout can never be reached; awaiting a product-owner ruling',
   build_sentence=True, preconds=None),
 45098: dict(
   note='NOTE FOR THE TESTER: this case cannot be run on this build, and it was tried properly rather '
        'than assumed. On the “New Work Order” window, choosing a customer and then clicking “Save” '
        'with “Add Asset” left empty answers “Asset is a required field” and nothing is created — so a '
        'work order with no vehicle cannot exist here at all. The nearest real work order, S2-6107, '
        'has a vehicle with only a year recorded and prints it as “Vehicle: 1993”, which is sparse '
        'data rather than none. Waiting on a product-owner ruling. Leave the case Untested.',
   marker='AUTOMATION: HOLD - a work order cannot be created without a vehicle ("Asset is a required '
          'field"), so this printout can never be reached; awaiting a product-owner ruling',
   build_sentence=True, preconds=None),
 45104: dict(
   note='NOTE FOR THE TESTER: this case cannot be run on this build. There is no “Cancelled” status '
        'for a work order line in this product — a line offers only “Authorization required”, '
        '“Declined”, “Authorized” and “Complete”, and those are the only four the system will accept. '
        'So no line can be put into the status this case describes. It is waiting on a product-owner '
        'ruling on what the requirement means. Leave the case Untested.',
   marker='AUTOMATION: HOLD - the product has no Cancelled line status (only Authorization required, '
          'Declined, Authorized and Complete), so this state cannot be reached; awaiting a '
          'product-owner ruling',
   build_sentence=True, preconds=None),
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

    # rebuild: the expectation blocks (minus any old note), then the note if there is one, then the
    # provenance block with sentence 2 as the plan requires, then the marker on its own.
    head = [[l for l in b if not l.startswith('NOTE FOR THE TESTER')] for b in bl[:prov_i]]
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
    print(f"  C{k}: fields={list(v['fields'])} marker={v['marker_override'][:60]}")
