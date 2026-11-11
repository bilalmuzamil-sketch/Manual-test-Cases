"""d3j_result.py — 11 Nov 2026: C715556 Passed (two customers ticked, B with nothing open - d3j) and C715555 FAILED (Vendor menu order differs from Inventory
Value's - d3b2 pictures + d3j full lists; ticket held, draft 06)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b=()): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], list(b)); return dst
o = json.load(open(PP + 'd3j/out.json')); a = o['C715556']; v = o['C715555']
assert a['rows'][0][0] == 'Desert Edge Truck Service & Repair' and len([r for r in a['rows'] if r[0] != 'Totals']) == 1 and a['totals'][2:] == a['rows'][0][2:] if a['rows'][0][2] else True
assert v['nA'] == v['nB'] == 1119 and not v['onlyA'] and not v['onlyB'] and not v['sameOrder']
R = {'C715556': {'verdict': 'Passed', 'observed': [
    'A/R Aging Summary, as of today, all locations, 1440 px, light theme; compared with the design picture "Two customers ticked". Customer A = "Desert Edge Truck Service & Repair"; customer B = "4 Star Truck Repair" (listed in the menu, nothing open).',
    'Step 1: the Customer menu opens.',
    'Step 2: both are ticked; as in the picture both names show as blue tags, each with an "×", inside the search box, with a circled "×" at the box\'s top right; "All customers" is unticked with "2 selected" at its right; the helper line is gone; the ticked customers keep their place in the A to Z list; the chip reads "Customer: 2 customers" in a blue pill.',
    'Step 3: the menu closes; one row is listed - Desert Edge Truck Service & Repair (4 Star Truck Repair has nothing open, so it is not listed). The Totals row equals that row ($12,528.70 / $57,121.79 / $74,012.51 / $88,255.94 / $231,918.94), the empty Current bucket reading $0.00.'],
    'pictures': [P('C715556', 'design-pics/ar-ap-p7-two-customers-ticked.png', 'The design picture'),
                 P('C715556', 'd3j/C715556-1-ticked.png', 'Step 2: two blue tags in the search box, "2 selected", chip "Customer: 2 customers"', [(700, 115, 420, 200, 'good', 'Tags and count')]),
                 P('C715556', 'd3j/C715556-2-closed.png', 'Step 3: one row - customer A; Totals = that row, Current $0.00', [(278, 208, 1132, 100, 'good', 'One row, Totals equal')])]},
     'C715555': {'verdict': 'Failed', 'failed_steps': 'Failed at step 2: the vendors are not in the same order as in Inventory Value\'s Vendor menu.', 'bold_steps': [2],
    'source': 'PRD "A/R and A/P Report Sorting, Export and Location Filter" (Confluence 947650561, version 11, 5 Nov 2026), Story 5, S5-R13: "Vendor exactly as Inventory Value\'s Vendor filter (truck icon, "Search vendors"; as there, the search box shows only when there are more than 8 vendors)."',
    'observed': ['Set up: open A/P Aging Summary and Inventory Value (Reports menu), as of today.',
                 'Step 2: open the Vendor menu on both and compare the order of the vendors.',
                 'You see: both menus hold the same 1,119 vendors, but the order differs at the top. A/P Aging Summary: #1 Diesel, -1 Diesel, 10 Trucking, 2 Trucking, 5 Star Truck Repair, @Home Towing, A-1 Towing. Inventory Value: -1 Diesel, @Home Towing, #1 Diesel, 10 Trucking, 2 Trucking, 5 Star Truck Repair, A-1 Towing.',
                 'The test says the vendors are in the same order as Inventory Value\'s Vendor menu.'],
    'ticket': 'Ticket prepared and with the QA lead for approval (number added here when filed).', 'ticket_held': True,
    'todo': 'What needs to be done: nothing for the tester now; re-run this test once the ticket is fixed.',
    'pictures': [P('C715555', '../defects/06-vendor-menu-order-differs-from-inventory-value/PIC1-vendor-menus-side-by-side.png', 'Step 2: the two Vendor menus side by side - same vendors, different order at the top', [])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b2 + d3j'}, 'results': R}, open(PP + 'RESULTS-d3j.json', 'w'), indent=1); print(list(R))
