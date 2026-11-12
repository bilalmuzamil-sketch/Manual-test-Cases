"""g11_result.py — 12 Nov 2026, run 557, build v26.45.3-34788b2, in the QA lead's NEW EMPTY ORGANIZATION on sv11315 (account reportsFM, one
location "Loc1"; he moved C797943 and C715468 there and allowed any seeding: "pass the test cases if the test cases pass now").
Seed (q17 + q17b): 1 vendor "ZZORG Vendor A" with unpaid bills; 2,000 customers with a $1.00 credit memo dated 10 Nov (date A) and one more
("ZZORG C2001 Late") dated 11 Nov (date B) - counts read back from the report itself: 2,000 / 2,001.
C797943 PASSED: 1 vendor -> no search box. The test's wording also names an "All vendors" row first; the native menu has none with 8 vendors or
fewer - Inventory Value's own Vendor filter in the same organization is identical (q18b), and PRD S5-R13 says "Vendor exactly as Inventory Value's
Vendor filter (... as there, the search box shows only when there are more than 8 vendors)". Wording divergence reported, Expected untouched (114).
C715468 PASSED: 2,000 -> PDF in 21 s with "Success" (2,000 customer rows in the file); 2,001 -> exactly one "This report is too large for PDF..."
message and no file in 30 s (q18)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q = json.load(open(PP + 'q18/out.json')); iv = json.load(open(PP + 'q18/iv.json')); a = q['C715468']; v = q['C797943']
assert v['menu']['inputs'] == [] and v['vendorCount'] == ['ZZORG Vendor A'] and 'ZZORG Vendor A' in v['menu']['lines'] and iv['iv']['lines'] == v['menu']['lines']
assert a['totalA'] == 2000 and a['totalB'] == 2001 and a['pdfA']['file'] and 'Data exported successfully' in a['pdfA']['notes'][0]['text']
assert a['pdfB']['file'] is None and len(a['pdfB']['notes']) == 1 and 'This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.' in a['pdfB']['notes'][0]['text']
ORG = 'Run in the QA lead\'s new empty organization on the QA site (one location, "Loc1"), set up for this test on 12 Nov 2026.'
R = {'C797943': {'verdict': 'Passed', 'observed': [ORG,
        'Set up: the organization has exactly one vendor, "ZZORG Vendor A", with an unpaid $30.00 bill dated today.',
        'Step 1: the Vendor menu opens with no search box, then the line "All vendors are included. Pick one or more to narrow.", then "ZZORG Vendor A", then "Clear selection".',
        'The test\'s wording also expects an "All vendors" row at the top. With 8 vendors or fewer the native menu has none: Inventory Value\'s own Vendor filter, in the same organization, reads exactly the same. The PRD (S5-R13) says the menu is "exactly as Inventory Value\'s Vendor filter", so it passes; the wording difference is reported to the QA lead.'],
        'pictures': [P('C797943', 'q18/01-C797943-menu.png', 'Step 1: one vendor - the Vendor menu has no search box', [(482, 154, 339, 129, 'good', 'No search box; the line, then vendor A')]),
                     P('C797943', 'q18/01-C797943-iv-menu.png', 'Same organization: Inventory Value\'s own Vendor filter reads exactly the same', [])]},
     'C715468': {'verdict': 'Passed', 'observed': [ORG,
        'Set up: 2,000 customers with an open credit memo dated 10 Nov 2026 (date A) and one more dated 11 Nov 2026 (date B).',
        'Step 1: as of 11/10/2026 the report lists 2,000 customers.',
        'Step 2: Download (PDF) gives "Success - Data exported successfully." after %d seconds; the file holds 2,000 customer rows.' % a['pdfA']['secs'],
        'Step 3: as of 11/11/2026 the report lists 2,001 customers.',
        'Step 4: Download (PDF) shows exactly one message, "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.", and no file is downloaded (watched for 30 seconds).'],
        'pictures': [P('C715468', 'q18/03-C715468-2-pdfA-after-download.png', 'Steps 1-2: as of 11/10/2026 (2,000 customers) - the PDF downloads', [(283, 120, 185, 28, 'good', 'Date A'), (940, 832, 400, 58, 'good', 'Success')]),
                     P('C715468', 'q18/05-C715468-4-pdfB-message.png', 'Steps 3-4: as of 11/11/2026 (2,001 customers) - the PDF is refused', [(283, 120, 185, 28, 'good', 'Date B'), (940, 848, 400, 52, 'good', 'This report is too large for PDF...')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g11: new empty organization'}, 'results': R}, open(PP + 'RESULTS-g11.json', 'w'), indent=1); print(list(R))
