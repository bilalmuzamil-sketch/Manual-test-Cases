"""s92b_result.py — 11 Nov 2026: C1062575 (A/P Detail: "Invoice" and "Vendor Credit" under Transaction Type, sort A-Z / Z-A) from s92/C1062575.json;
seeded vendor ZZY Types P92 (COD): bill ZZY925996616 $44 and vendor credit C-13685 $5, both dated Nov 1 (10 days ago)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's92/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's92/C1062575.json'))
ty = lambda rows: ['Vendor Credit' if 'Vendor Credit' in r else 'Invoice' for r in rows]
assert ty(o['rows1']) == ['Invoice', 'Vendor Credit'] and ty(o['rows2']) == ['Vendor Credit', 'Invoice'] and not any(' Credit C-' in r and 'Vendor Credit' not in r for r in o['rows0'])
assert o['sort1'] == ['Transaction Type:ascending'] and o['sort2'] == ['Transaction Type:descending']
C = 'C1062575'; TT = (585, 400, 150, 96); HD = (585, 165, 130, 36)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/P Aging Detail, as of today, Vendor filter ticked to a new vendor ZZY Types P92 with an unpaid bill ($44.00) and an unused vendor credit ($-5.00), both dated Nov 1, 2026 (10 days ago), the bill due the same day.',
    'Step 1: "1-30 days past due (2)" opens; the bill reads "Invoice" and the vendor credit reads "Vendor Credit" under Transaction Type; no row reads just "Credit".',
    'Step 2: clicking "Transaction Type" puts the small up arrow on it and sorts A to Z: Invoice, then Vendor Credit.',
    'Step 3: clicking it again turns the arrow down and reverses the order: Vendor Credit, then Invoice.'],
    'pictures': [P(C, 'C1062575-1-bucket.png', 'Step 1: "Invoice" and "Vendor Credit" under Transaction Type', [TT + ('good', 'Invoice / Vendor Credit')]),
                 P(C, 'C1062575-2-sorted-az.png', 'Step 2: Transaction Type A to Z - Invoice, then Vendor Credit', [HD + ('good', 'Up arrow'), TT + ('good', 'A to Z')]),
                 P(C, 'C1062575-3-sorted-za.png', 'Step 3: Z to A - Vendor Credit, then Invoice', [HD + ('good', 'Down arrow'), TT + ('good', 'Z to A')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s92 C1062575'}, 'results': R}, open(PP + 'RESULTS-s92-575.json', 'w'), indent=1); print(list(R))
