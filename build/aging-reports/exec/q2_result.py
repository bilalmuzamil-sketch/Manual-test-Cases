"""q2_result.py — 11 Nov 2026: C715582 (a drill-down link saved before the release still opens on its customer / vendor). Before = production
v26.45.3 (prod/pr5.json): A/R Summary's drill-down writes /reports/ar-aging-collection?customerName=…&customerId=…, A/P Summary's writes
/reports/ap-unpaid-invoices?vendorName=…&vendorId=…. After = QA (q2/out.json): links in exactly that old form, pasted from Dashboard."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
pr = json.load(open(PP + 'prod/pr5.json')); q = json.load(open(PP + 'q2/out.json')); C = 'C715582'
assert '?customerName=' in pr['ar']['drill'] and '&customerId=' in pr['ar']['drill'] and '?vendorName=' in pr['ap']['drill'] and '&vendorId=' in pr['ap']['drill']
ar, ap = q['ar'], q['ap']
assert '?customerName=' in ar['link'] and ar['title'] == 'A/R Aging Collection' and not ar['notes'] and any('Customer: #1 Diesel' in c for c in ar['chips']) and len(ar['groups']) == 1 and '#1 Diesel (' in ar['groups'][0]
assert '?vendorName=' in ap['link'] and ap['title'] == 'A/P Unpaid Invoices Report' and not ap['notes'] and any('Vendor: #1 Diesel' in c for c in ap['chips']) and len(ap['groups']) == 1 and '#1 Diesel (' in ap['groups'][0]
CH = (278, 118, 900, 32); G = (278, 208, 1132, 48)
R = {C: {'verdict': 'Passed', 'observed': [
    'Before the release (production v26.45.3-f5ba431) the drill-down from A/R Aging Summary writes the address as ".../reports/ar-aging-collection?customerName=<name>&customerId=<id>" and from A/P Aging Summary as ".../reports/ap-unpaid-invoices?vendorName=<name>&vendorId=<id>". Addresses in exactly that old form were used, for customer "#1 Diesel" and vendor "#1 Diesel".',
    'Step 1: from Dashboard, pasting the old A/R Collection address opens A/R Aging Collection with no error message; the chip reads "Customer: #1 Diesel" and only #1 Diesel\'s group is listed (1 document, $174.04).',
    'Step 2: pasting the old A/P Unpaid Invoices address opens "A/P Unpaid Invoices Report" with no error message; the chip reads "Vendor: #1 Diesel" and only #1 Diesel\'s group is listed (1 document, $36.00).',
    'The address bar then shows the new form (customerIds= / vendorIds=).'],
    'pictures': [P(C, 'prod/91-C715582-prod-ar-drill.png', 'Before the release (production): the old A/R drill-down address form', []),
                 P(C, 'q2/01-C715582-ar.png', 'Step 1: old A/R address on the new build - Customer: #1 Diesel, only its group', [CH + ('good', 'Customer chip'), G + ('good', 'Only its group')]),
                 P(C, 'q2/02-C715582-ap.png', 'Step 2: old A/P address on the new build - Vendor: #1 Diesel, only its group', [CH + ('good', 'Vendor chip'), G + ('good', 'Only its group')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q2 + pr5'}, 'results': R}, open(PP + 'RESULTS-q2.json', 'w'), indent=1); print(list(R))
