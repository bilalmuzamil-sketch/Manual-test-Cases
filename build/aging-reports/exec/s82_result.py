"""s82_result.py — 11 Nov 2026: C715318 (A/R Collection) and C715321 (A/P Unpaid Invoices) - the Open Balance sort stays through a date change,
scrolling and filters - from exec/s82/<id>.json (s82b run, 15:18-15:22 UTC). Grouped reports: per PRD S2-R5 a header click sorts the rows INSIDE each
group and the groups never move, so "sorted" is judged on the rows of the open group. Writes RESULTS-s82b.json with annotated pictures."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
CHIPS = (278, 116, 1132, 36); HEAD = (278, 161, 1132, 48)
def pics(cid, d, titles):
    out = []
    steps = {st['label'][0]: st['shot'] for st in d['steps']}; first = d['steps'][0]['shot'].replace('//', '/'); d0 = first.rsplit('/', 1)[0]; n0 = int(first.rsplit('/', 1)[1][:2])
    steps.setdefault('4', '%s/%02d-%s-4_menu.png' % (d0, n0 + 3, cid))  # the menu step is not in steps[]; its picture is numbered between 3 and 5
    for k, t in zip('123456', titles):
        src = steps[k].replace('//', '/'); dst = PP + 'pics/%s-%s' % (cid, src.split('/')[-1]); ann(src, dst, t[0], [], [], [b for b in t[1]]); out.append(dst)
    return out
R = {}
d = json.load(open(PP + 's82/C715318.json'))
R['C715318'] = {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, all locations, 1440 px window. On these grouped reports a heading click sorts the invoices inside each customer; the customers themselves keep their order (PRD S2-R5).',
    'Step 1: after one click on "Open Balance" the heading carries the small down arrow; inside the open customer the rows read $8,600.85, -$4.56, -$12.34 - largest first.',
    'Step 2: as-of changed to 11/10/2026 - the report reloads for yesterday, the arrow is still on "Open Balance" and the open customer\'s rows are still largest first.',
    'Step 3: scrolled until every customer had loaded (120 customers); the arrow stays on "Open Balance" and the rows stay largest first.',
    'Step 4: the Customer menu opens.',
    'Step 5: ticking "ZZAUTOTEST LOC MIX" (documents at both locations) leaves only that customer, 23 documents: 22 invoices of $174.04, then the -$40.00 credit memo at the bottom - still largest first, arrow still on "Open Balance".',
    'Step 6: unticking "Staging Lethbridge - 4310" (and the third test location) - the chip reads "Location: Staging Heavy D..." and the customer drops to 21 documents (the two Lethbridge ones gone), still largest first, arrow still on "Open Balance".'],
    'pictures': pics('C715318', d, [('Step 1: Open Balance sorted, largest first', [HEAD + ('good', 'Arrow on Open Balance')]), ('Step 2: as of yesterday - still sorted', [CHIPS + ('good', 'As of: 11/10/2026'), HEAD + ('good', 'Arrow still on Open Balance')]),
        ('Step 3: all customers loaded - still sorted', [HEAD + ('good', 'Arrow still on Open Balance')]), ('Step 4: the Customer menu opens', []), ('Step 5: only customer A - still largest first', [CHIPS + ('good', 'Customer: ZZAUTOTEST LOC MIX'), HEAD + ('good', 'Still sorted by Open Balance')]),
        ('Step 6: only location A - 21 documents, still largest first', [CHIPS + ('good', 'Location: Staging Heavy Duty only'), HEAD + ('good', 'Arrow still on Open Balance')])])}
d = json.load(open(PP + 's82/C715321.json'))
R['C715321'] = {'verdict': 'Passed', 'observed': [
    'A/P Unpaid Invoices Report, as of today, all locations, 1440 px window. On these grouped reports a heading click sorts the bills inside each vendor; the vendors themselves keep their order (PRD S2-R5).',
    'Step 1: after one click on "Open Balance" the heading carries the small down arrow; inside the open vendor the rows read $215.25, -$3.21, -$7.89 - largest first.',
    'Step 2: as-of changed to 11/10/2026 - the report reloads for yesterday, still sorted by Open Balance, largest first.',
    'Step 3: scrolled until every vendor had loaded (503 vendors); the arrow stays on "Open Balance" and the rows stay largest first.',
    'Step 4: the Vendor menu opens.',
    'Step 5: ticking "ZZAUTOTEST LOC MIX V" (bills at both locations) leaves only that vendor, 24 bills: $33.00, $32.00, $31.00, $29.00 ... $10.00 - largest first.',
    'Step 6: unticking "Staging Lethbridge - 4310" (and the third test location) - the chip reads "Location: Staging Heavy D..." and the vendor drops to 23 bills (the $30.00 Lethbridge bill gone): $32.00 ... $10.00, still largest first, arrow still on "Open Balance".'],
    'pictures': pics('C715321', d, [('Step 1: Open Balance sorted, largest first', [HEAD + ('good', 'Arrow on Open Balance')]), ('Step 2: as of yesterday - still sorted', [CHIPS + ('good', 'As of: 11/10/2026'), HEAD + ('good', 'Arrow still on Open Balance')]),
        ('Step 3: all vendors loaded - still sorted', [HEAD + ('good', 'Arrow still on Open Balance')]), ('Step 4: the Vendor menu opens', []), ('Step 5: only vendor A - still largest first', [CHIPS + ('good', 'Vendor: ZZAUTOTEST LOC MIX V'), HEAD + ('good', 'Still sorted by Open Balance')]),
        ('Step 6: only location A - 23 bills, still largest first', [CHIPS + ('good', 'Location: Staging Heavy Duty only'), HEAD + ('good', 'Arrow still on Open Balance')])])}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s82b sort stays'}, 'results': R}, open(PP + 'RESULTS-s82b.json', 'w'), indent=1); print(list(R))
