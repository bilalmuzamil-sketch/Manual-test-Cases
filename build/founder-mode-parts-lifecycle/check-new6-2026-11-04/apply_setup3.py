# QA lead, 4 Nov 2026: "1. Yes (a)" -> C913767, C913768, C913769 move to "Setup needed before testing" (S114049) with a separate, plain
# Setup section (Rule 119); and "if some test was not successfully checked and you believe that can be checked after today's release then do
# it for only that/those tests" -> C425751 (ordering now seen: Order -> Awaiting Receive, probe 38) and C425728 (Edit Delivery Item, probe 41).
# Every label below seen on v26.45.0-2c807b5 (probes 32-41). Guards: ours, not Automated, last edited by us; read back.
import sys, os, re, json, time, html
sys.path.insert(0, '/home/user/Manual-test-Cases/build/expected-step-labels-2026-10-12'); import labels as L
D = os.path.dirname(os.path.abspath(__file__)); log = open(f'{D}/write-log.txt', 'a')
E = lambda s: html.escape(s, quote=False).replace("'", '&#39;')
STAMP = '<p>Last checked against build v26.45.0-2c807b5 (QA site sv10647) on 11/4/2026.</p>'
PARTLY = lambda what: f'<p>Partly checked against build v26.45.0-2c807b5 (QA site sv10647) on 11/4/2026; not yet seen on that build: {E(what)}.</p>'
INV = 'Click Parts in the top bar, Inventory in the left menu, then New Inventory Part. Fill in: '
def part(c, l, end, q, extra=''): return (f'Make part {l}', f'{INV}Description: ZZAUTOTEST PL C{c} PART {l}{(" " + end) if end else ""}; Part Number: ZZAUTOTEST-PL-C{c}-{l}; Category: any one; Cost: 10.00; Sell Price: 20.00; Quantity (in the bin row): {q}.{extra} Click Save.')
WO = ('Make work order 1', 'Click Work Orders in the top bar, then Create Work Order. Pick any Customer and any Asset. Click Save. In the New Line window that opens, type ZZAUTOTEST PL C{c} LINE 1 in Title and press Tab, pick any Labor Rate, tick Line Approved, then click Save & Close.')
ORDER = ('Order it', 'On that row click Order. The status changes to Awaiting Receive, and Purchase Orders lists a new purchase order named after the work order.')
RECV = ('Receive it', 'Click Parts in the top bar, then Purchase Orders in the left menu, and click Receive on that purchase order&#39;s row. If Vendor is empty, pick any vendor. Type any number in Vendor Invoice # (Invoice Date is already filled in), type 10.00 in Cost and 1 in Qty received, then click Receive Parts (1).')
NEW = {
 913767: ([part(913767, 'A', 'ALPHA', 5), part(913767, 'C', 'CHARLIE', 3),
           part(913767, 'B', 'BRAVO', 5, ' Click Add Bin Location, pick a second bin location in the new row, type 0 as its Quantity, and click Default on that row.'),
           (WO[0], WO[1].format(c=913767)),
           ('Take 3 of part B onto the work order', 'On that work order&#39;s Lines tab, in the line&#39;s Parts row click + Add Part. Type ZZAUTOTEST-PL-C913767-B in Part number and pick the result that shows Inventory Qty. Type 3 in Qty *. Click Save. This is meant to take the 3 from part B&#39;s second (Default) bin, bringing it to -3; check on part B&#39;s page that its bins read 5 and -3 before you start.')],
          'which bin a work order line takes the part from (the part row on a work order has no bin choice)'),
 913768: ([part(913768, 'A', '', 0),
           ('Delete part A, so only its Part Library entry stays', 'On the Inventory page click Search, type ZZAUTOTEST-PL-C913768-A, click its row, then click Delete Part. The part goes at once; its Part Library entry (entry A) stays with Total parts 0.'),
           (WO[0], WO[1].format(c=913768)),
           ('Request entry A&#39;s part from the Part Library', 'On the work order&#39;s Lines tab, in the line&#39;s Parts row click + Add Part. Type ZZAUTOTEST-PL-C913768-A in Part number and pick the result marked Part Library. Type 1 in Qty *. Click Save. The row shows Auth To Order.'),
           ORDER, RECV], None),
 913769: ([part(913769, 'A', '', 2),
           ('Make return A', 'Click Parts in the top bar, Returns in the left menu, then Create Return. Pick any vendor under Vendor. Type ZZAUTOTEST-PL-C913769-A in Part Number and pick it. Type 1 in Quantity. Click Save Return.'),
           ('Credit return A', 'On the Returns list tick return A&#39;s row and click Receive Credit. Type any Credit Memo Number, pick a Credit Date, then click Post Credit.')],
          'the Receive Credit and Process Return screens (seen on 3 Nov 2026 on the build before)'),
}
def setup_html(items): return '<p><strong>Setup</strong></p><ol>' + ''.join(f'<li>{lab if "&#39;" in lab else E(lab)}: {t if "&#39;" in t else E(t)}</li>' for lab, t in items) + '</ol>'
write = '--write' in sys.argv
for c, (items, partly) in NEW.items():
    cur = L.call(f'get_case/{c}'); assert cur['created_by'] == 3 and cur['custom_atmstatus'] != 3 and cur['updated_by'] == 3, c
    p = cur['custom_preconds']; assert 'Setup</strong>' not in p and p.endswith('</ul>'), c
    p = p + setup_html(items)
    e = cur['custom_expected']; assert e.count(STAMP) == 1, c
    if partly: e = e.replace(STAMP, PARTLY(partly))
    if not write: print(c, len(items), 'items; line', 'partly' if partly else 'full'); continue
    r = L.call(f'update_case/{c}', {'custom_preconds': p, 'custom_expected': e}); time.sleep(0.6); ok = r['custom_preconds'] == p and r['custom_expected'] == e
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C{c} (Setup section, {len(items)} items; build line {'partly' if partly else 'full'}) fields=['custom_expected','custom_preconds'] verify={'OK' if ok else 'MISMATCH'}"
    print(line); log.write(line + '\n')
# C425751: the first of its two "Request part A" items gets vendor A and the Order clicks; the second gets vendor A and "do not order".
cur = L.call('get_case/425751'); assert cur['created_by'] == 3 and cur['updated_by'] == 3
p = cur['custom_preconds']; req = re.findall(r'<li>Request part A on the line: [^<]*</li>', p); assert len(req) == 2, len(req)
r1 = req[0].replace(' Do not receive it. Order this first request; then</li>', ' This is Part Request 1: on its row click Order (it then shows Awaiting Receive, and Purchase Orders lists purchase order A, named after the work order). Do not receive it.</li>')
r2 = req[1].replace(' Do not receive it. Leave the second one not ordered.</li>', ' This is Part Request 2: do not click Order on it yet.</li>')
assert r1 != req[0] and r2 != req[1]
p = p.replace(req[0], r1, 1); i = p.rfind(req[1]); p = p[:i] + r2 + p[i + len(req[1]):]
e = cur['custom_expected']; old = re.findall(r'<p>Partly checked against build v26\.43\.4-999c51d[^<]*</p>', e); assert len(old) == 1
e = e.replace(old[0], STAMP)
if not write: print(425751, html.unescape(r1)[-260:])
else:
    r = L.call('update_case/425751', {'custom_preconds': p, 'custom_expected': e}); ok = r['custom_preconds'] == p and r['custom_expected'] == e
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C425751 (Order clicks in Setup; build line full on v26.45.0-2c807b5) fields=['custom_expected','custom_preconds'] verify={'OK' if ok else 'MISMATCH'}"; print(line); log.write(line + '\n')
# C425728: step 1 names the control seen; build line names what is still not seen.
cur = L.call('get_case/425728'); assert cur['created_by'] == 3 and cur['updated_by'] == 3
s0 = cur['custom_steps']; a = '<li>Click the control on the line that changes which part it points to.</li>'; assert s0.count(a) == 1
s = s0.replace(a, '<li>Click the edit icon at the end of line 1: the Edit Delivery Item window opens, with the line&#39;s Part Number.</li>')
e = cur['custom_expected']; old = re.findall(r'<p>Partly checked against build v26\.43\.4-999c51d[^<]*</p>', e); assert len(old) == 1
e = e.replace(old[0], PARTLY('typing in Part Number in the Edit Delivery Item window (whether it offers a list of parts)'))
if write:
    r = L.call('update_case/425728', {'custom_steps': s, 'custom_expected': e}); ok = r['custom_steps'] == s and r['custom_expected'] == e
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} update_case C425728 (step 1 = edit icon / Edit Delivery Item; partly line updated) fields=['custom_expected','custom_steps'] verify={'OK' if ok else 'MISMATCH'}"; print(line); log.write(line + '\n')
    try: L.call('move_cases_to_section/114049', {'suite_id': 1, 'case_ids': [913767, 913768, 913769]})
    except Exception as ex: print('move call:', ex)
    time.sleep(3); back = [L.call(f'get_case/{c}')['section_id'] for c in (913767, 913768, 913769)]
    line = f"{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())} move_cases_to_section S114049 [913767, 913768, 913769] (from {[20473, 20478, 20478]}); read back {back}"; print(line); log.write(line + '\n')
