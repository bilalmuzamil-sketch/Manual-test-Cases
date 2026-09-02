#!/usr/bin/env python3
"""Build the DESIGN REFERENCE for every Invoice UI Refresh case whose source includes the design.

QA lead, 2026-09-01: *"if the source for something is the design, you can add the reference for the
design with this link https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354 . But do
tell where in the design that reference can be found."*

So a reference is never just the link. It is a ROUTE a person can follow inside the design document:

    Design Document (link) → <view button> → <document button> → <section>, with <toggle> on

The vocabulary is the design's own, read out of the downloaded copy he supplied:

  view buttons     Customer Documents · Authorizer Entry (Work Order) · Authorizer Entry (Parts Sale)
                   · Remit To · B&W print preview · Dark mode
  document buttons Estimate · Invoice · Paid Invoice (ShopPay portal) · Paid Invoice (shop app)
                   · Credit Invoice · Parts Sale Estimate · Parts Sale Invoice
  field toggles    WO = Doc # · No PO · Approval Code · No Unit · No Plate · No Mileage · No Eng Hrs
                   · Declined Work · Supplies % · Adjustments (+ the six fee/discount toggles)
  settings panel   Administration > Invoice Details (Labor rate · Labor hours · Labor price ·
                   Part number · Part quantity · Part price · Part description ·
                   Summarize parts total · Summarize labor total)

🛑 EVERY ANCHOR THIS SCRIPT CITES IS CHECKED AGAINST THE DESIGN TEXT BEFORE IT IS WRITTEN. That is the
same discipline as build/OBSERVED-UI-LABELS-sv9315.md, and for the same reason: earlier today a label
copied from a note instead of read from the source made a gate flag 42 correct cases. A location
nobody can find is worse than no location.

NOT every case gets one. Where the design shows nothing about a rule - a behaviour that has no visual,
such as who may be selected in a list - the case keeps its spec-only provenance and is listed at the
end as DESIGN: none.
"""
import csv, json, re, os, sys

DESIGN_LINK = 'https://claude.ai/code/artifact/c88ee207-3197-4f54-8cb9-bac3deb84354'
DESIGN_TEXT = '/tmp/design/design-text.txt'
ROOT = '/home/user/Manual-test-Cases/build/invoice-ui-refresh'

design = open(DESIGN_TEXT, encoding='utf-8').read()
flat = ' | '.join(l.strip() for l in design.split('\n') if l.strip())

def anchor_ok(a):
    return a in flat

# route = (view, document, section-description, [anchors that must exist], optional toggle note)
CD = 'Customer Documents'
AREA = {
 'Masthead and Letterhead':      (CD, 'Estimate', 'the masthead at the top of the sheet — the shop block, the document number and the date labels',
                                  ['Estimate date:', 'Invoice date:', 'Due date:', 'Issue date:'], None),
 'Addresses':                    (CD, 'Invoice', 'the "Addresses" band under the masthead',
                                  ['Bill To', 'Remit Payment To', 'Credit To'],
                                  'turn the "Remit To" view button off to see Bill To span the full width'),
 'Order Reference Fields':       (CD, 'Invoice', 'the order-reference row under the Asset band',
                                  ['Work Order', 'Customer PO', 'Authorizer', 'Approval Code', 'Terms'],
                                  'the "Approval Code", "WO = Doc #" and "No PO" field toggles change what shows'),
 'Authorizer Entry (Work Order)':('Authorizer Entry (Work Order)', None,
                                  'the work order page mock: the customer contact card on the left, its "Authorizer" row, the open dropdown, and the "Contacts on the customer record" table beneath',
                                  ['Authorizer', 'No authorizer', 'Only contacts with "Approves Work" on',
                                   'Contacts on the customer record', 'Approves Work', 'Work order invoiced'], None),
 'Asset Section':                (CD, 'Invoice', 'the "Asset" band',
                                  ['Asset', 'Unit', 'Plate', 'Mileage', 'Eng Hrs', 'VIN / Serial'],
                                  'the "No Unit", "No Plate", "No Mileage" and "No Eng Hrs" toggles hide each field'),
 'Work Section':                 (CD, 'Invoice', 'the "Work Performed" block — the numbered lines, their Scope of work, the Labor and Parts rows and the line footer',
                                  ['Work Performed', 'Work Summary', 'Scope of work', 'Labor', 'Parts', 'Line total'],
                                  'the "Administration > Invoice Details" panel toggles which per-line figures print'),
 'Declined Work':                (CD, 'Invoice', 'the "Declined Work" block below the work lines',
                                  ['Declined Work'], 'needs the "Declined Work" field toggle on'),
 'Financial Summary':            (CD, 'Invoice', 'the "Summary" block — Labor, Parts, Shop supplies, Adjustments, Subtotal, tax and Total',
                                  ['Summary', 'Shop supplies', 'Adjustments', 'Subtotal', 'Total'],
                                  'the "Supplies %" and "Adjustments" toggles add those rows'),
 'Paid Banner, Payments and Balance': (CD, 'Paid Invoice (ShopPay portal)',
                                  'the "Payment Receipt - Payments by ShopView" banner at the very top, and the "Payments" and "Balance" rows at the foot of the Summary block',
                                  ['Payment Receipt - Payments by ShopView', 'PAID IN FULL', 'Payments', 'Balance'],
                                  'switch to "Paid Invoice (shop app)" to see the same document WITHOUT the banner'),
 'Disclaimer, Signature and Footer': (CD, 'Invoice',
                                  'the disclaimer paragraph above the Summary, the signature row beneath it, and the page footer',
                                  ['Customer Signature', 'Printed Name', 'Powered by'], None),
 'Estimate and Invoice Specifics':(CD, 'Estimate', 'the masthead date label and the boxed figure at the foot of the Summary block; switch between "Estimate", "Invoice" and "Paid Invoice (shop app)" to see all three',
                                  ['Estimate date:', 'Estimated Total', 'Balance', 'Paid date:'], None),
 'Credit Invoice':               (CD, 'Credit Invoice',
                                  'the whole credit sheet — masthead "Credit: CM-4176", the "Credit To" block, the Credit Number / Status / Invoice Number table, the credited-items table and the totals block',
                                  ['Credit: CM-4176', 'Credit To', 'Credit Number', 'Status', 'Invoice Number',
                                   'Restocking Fee', 'Total Credit', 'Balance'], None),
 'Document Visual Standard':     (CD, None, 'any document, then the "B&W print preview" and "Dark mode" view buttons for the grayscale and dark checks',
                                  ['B&W print preview', 'Dark mode'], None),
 'Parts Sale Estimate and Invoice': (CD, 'Parts Sale Estimate',
                                  'the parts-sale sheet — the flat item table in place of the work lines; switch to "Parts Sale Invoice" for the invoiced variant, and to the "Authorizer Entry (Parts Sale)" view for its authorizer row',
                                  ['Parts Sale Estimate', 'Parts Sale Invoice', 'Authorizer Entry (Parts Sale)',
                                   'Parts sale invoiced'], None),
}
# The two sections the id-map never contained, because they were added after our authoring pass.
AREA['Cross-Cutting and Regression'] = (
    CD, None,
    'any document — this area is checked across all of them; use the "B&W print preview" and '
    '"Dark mode" view buttons and the document switcher to compare',
    ['B&W print preview', 'Dark mode'], None)
AREA['API — Authorizer Entry'] = (None, None, None, [], None)   # no design; see NO_DESIGN below

# 🛑 NO CASE IS EXCLUDED ON A GUESS. The first version of this script excluded C44913 on the hunch
# that "field order and label punctuation" had no picture - it does: the order-reference row shows
# Work Order / Customer PO / Authorizer / Approval Code / Terms in that order, unpunctuated. Checked
# before excluding, and the exclusion list is now empty.
# ...but a case whose subject the design genuinely does not depict gets NO reference, with the reason
# stated. The design shows printed documents and the two authorizer screens. It shows nothing about
# API responses, e-mail delivery, stored snapshots, or permissions.
NO_DESIGN = {
 'C45169': 'API behaviour — the design shows documents, not API responses (Rule 4)',
 'C45170': 'API behaviour — the design shows documents, not API responses (Rule 4)',
 'C45185': 'a stored pre-redesign snapshot — the design shows no snapshot data',
 'C45186': 'a stored post-redesign snapshot — the design shows no snapshot data',
 'C45187': 'e-mail delivery — the design shows no mail path',
 'C45190': 'the customer card across record types — the design shows only the work order and parts sale',
 'C45191': 'a permission state — the design shows no permission behaviour',
 'C45197': 'depends on a reversed originating invoice — a record state the design does not depict',
}

# WHERE THE AREA ROUTE IS TOO COARSE, the case gets its own. Seven Credit Invoice cases all pointing
# at "the whole credit sheet" is not a location; each of these names the block it is about.
PER_CASE = {
 'C44964': (CD, 'Credit Invoice', 'the masthead — it reads "Credit: CM-4176" and "Issue date: Jan 28, 2026", and carries no money figure',
            ['Credit: CM-4176', 'Issue date:'], None),
 'C44965': (CD, 'Credit Invoice', 'the "Credit To" block in the Addresses band — it spans the full width, with no "Remit Payment To" beside it',
            ['Credit To'], 'compare with "Invoice", where "Remit Payment To" sits alongside'),
 'C44966': (CD, 'Credit Invoice', 'the status table — "Credit Number" / "Status" / "Invoice Number", showing CM-4176, Unapplied, INV-S3-4176',
            ['Credit Number', 'Status', 'Invoice Number', 'CM-4176', 'Unapplied'], None),
 'C44967': (CD, 'Credit Invoice', 'the credited-items table — the returned part "TH-2247 - Thermostat, heavy duty" at -1, $175.16, a $10.00 restocking fee and -$165.16, and beneath it the money-only line "Goodwill adjustment — warranty follow-up" showing "--" for Quantity and Rate, a $0.00 restocking fee and -$50.00',
            ['Restocking Fee', 'TH-2247 - Thermostat, heavy duty', 'Goodwill adjustment', '-$165.16', '-$50.00'], None),
 'C44968': (CD, 'Credit Invoice', 'the returned-part row of the credited-items table — -1 at $175.16 with a $10.00 restocking fee gives -$165.16',
            ['TH-2247 - Thermostat, heavy duty', '$175.16', '$10.00', '-$165.16'], None),
 'C44969': (CD, 'Credit Invoice', 'the totals block — Subtotal -$215.16, Tax -$10.76, Total Credit -$225.92, the "Payments" label, and Balance $225.92 (the open balance on an Unapplied credit)',
            ['Subtotal', 'Total Credit', '-$225.92', 'Payments', 'Balance', '$225.92'], None),
 'C44970': (CD, 'Credit Invoice', 'the disclaimer paragraph and the signature row above the footer',
            ['Customer Signature', 'Printed Name'], None),
 'C44923': ('Authorizer Entry (Work Order)', None, 'the "Contacts on the customer record" table under the work order mock — Darren Bravo, Sasha Bravo and Priya Sharma-Vanderbroek carry the "Approves Work" tick and appear in the dropdown; Kelly Ortiz and Miguel Torres do not',
            ['Contacts on the customer record', 'Approves Work', 'Kelly Ortiz', 'Miguel Torres'], None),
 'C44922': ('Authorizer Entry (Work Order)', None, 'the "Work order invoiced" toggle beneath the mock — turn it on and the Authorizer row locks',
            ['Work order invoiced'], None),
 'C44920': ('Authorizer Entry (Work Order)', None, 'the open Authorizer dropdown — its first option is "No authorizer", and the footnote reads "Only contacts with \'Approves Work\' on"',
            ['No authorizer', 'Only contacts with "Approves Work" on'], None),
 'C44921': ('Authorizer Entry (Work Order)', None, 'the contact card — the "Phone" row that sits directly under the selected Authorizer\'s name; the contacts table shows Priya Sharma-Vanderbroek with "no phone entered" for the no-phone case',
            ['Authorizer', 'Phone', 'no phone entered'], None),
}

# 🛑 THE CASE LIST COMES FROM TESTRAIL, NOT FROM testrail-id-map.csv.
# The id-map is a snapshot of what OUR authoring pass created. Sourcing from it made this script
# report "89 cases" when the suite holds 119 - the QA lead caught it. The other 30 are the manual QA
# tester Mudassir Qamar's, and Rule 38 as amended says the designated tester's cases are IN SCOPE,
# not foreign. Third "conclusion drawn from the wrong list" of the day; the fix is to always ask the
# system of record. get_sections and get_cases are PAGED - unpaged returns 250 and silently finds
# nothing (core 3.3).
import base64, urllib.request, time, collections
_C = json.load(open('/tmp/testrail/creds.json'))
_A = base64.b64encode(f"{_C['email']}:{_C['password']}".encode()).decode()
def _get(pth):
    for a in range(6):
        try:
            r = urllib.request.Request('https://shopview.testrail.io/index.php?/api/v2/' + pth,
                                       headers={'Authorization': 'Basic ' + _A})
            return json.load(urllib.request.urlopen(r, timeout=180))
        except Exception:
            if a == 5: raise
            time.sleep(2 ** a)
def _paged(pth, key):
    out, off = [], 0
    while True:
        j = _get(f'{pth}&limit=250&offset={off}')
        ch = j[key] if isinstance(j, dict) else j
        out += ch
        if len(ch) < 250: break
        off += 250
    return out
GROUP = 6559
_secs = _paged('get_sections/1', 'sections')
_byparent = collections.defaultdict(list)
for _s in _secs: _byparent[_s.get('parent_id')].append(_s)
_ids, _stack = [GROUP], [GROUP]
_names = {GROUP: 'Invoice UI Refresh'}
while _stack:
    for _ch in _byparent.get(_stack.pop(), []):
        _ids.append(_ch['id']); _stack.append(_ch['id']); _names[_ch['id']] = _ch['name']
_live = []
for _sid in _ids:
    _live += _paged(f'get_cases/1&section_id={_sid}', 'cases')
rows = [{'testrail_case_id': f"C{c['id']}", 'internal_id': '', 'title': c['title'],
         'section': _names.get(c['section_id'], str(c['section_id'])), 'refs': c.get('refs') or ''}
        for c in _live]
print(f'live cases in group {GROUP}: {len(rows)} across {len(_ids)} sections')
out, skipped, bad = {}, [], []
for r in rows:
    cid, area = r['testrail_case_id'], r['section']
    if area not in AREA:
        bad.append((cid, f'no design route defined for area {area!r}')); continue
    view, doc, where, anchors, toggle = PER_CASE.get(cid, AREA[area])
    if view is None:
        skipped.append((cid, r['title'][:52], f'area {area!r} has no design counterpart')); continue
    missing = [a for a in anchors if not anchor_ok(a)]
    if missing:
        bad.append((cid, f'anchors NOT in the design: {missing}')); continue
    if cid in NO_DESIGN:
        skipped.append((cid, r['title'][:52], NO_DESIGN[cid])); continue
    path = f'"{view}"'
    if doc: path += f' → "{doc}"'
    sentence = (f'Design: the Design Document ({DESIGN_LINK}) — open {path}, then {where}.')
    if toggle: sentence += f' ({toggle[0].upper() + toggle[1:]}.)'
    out[cid] = {'internal_id': r['internal_id'], 'area': area, 'title': r['title'],
                'design_sentence': sentence, 'anchors': anchors}

json.dump(out, open(f'{ROOT}/design-refs.json', 'w'), indent=1, ensure_ascii=False)
print(f'design reference built for {len(out)} of {len(rows)} cases')
print(f'deliberately no design reference: {len(skipped)}')
for cid, iid, why in skipped: print(f'   {cid} {iid} — {why}')
if bad:
    print(f'\nPROBLEMS ({len(bad)}):')
    for cid, why in bad: print(f'   {cid}: {why}')
print('\n--- one per area, as it will read:')
seen = set()
for cid, v in out.items():
    if v['area'] in seen: continue
    seen.add(v['area'])
    print(f'\n{cid} ({v["area"]})\n   {v["design_sentence"]}')
sys.exit(1 if bad else 0)
