"""d3b2_design.py — 11 Nov 2026: design-picture tests judged from the d3b2 light-theme re-run (each judged by eye against its design picture; entries
added as each case lands). Usage: python3.12 d3b2_design.py C715534 [...] -> RESULTS-d3b2-design-<ids>.json."""
import json, sys
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b=()): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], list(b)); return dst
CH = (278, 70, 1132, 80); HD = (278, 160, 1132, 48)
E = {
 'C715534': (['A/P Aging Detail, as of today, all locations, every bucket closed, 1440 px, light theme; compared with the design picture "A/P Aging Detail opens by vendor name".',
   'Step 1: the title "A/P Aging Detail" with the info icon and the "⋯" at the right; chips "As of: 11/11/2026" (blue pill), "Vendor: All vendors" (truck icon, no fill), "Past due: Any" (hourglass, no fill), "Location: All locations" (blue pill).',
   'Step 2: a grey chevron pointing right in the top-left header cell, then "Date", "Location", "Transaction Type", "No.", "Vendor Name" with a small up arrow, "Due Date", "Past Due", "Amount", "Open Balance".',
   'Step 3: five buckets in order, each with a blue chevron pointing right, its name in bold with its count, "Total" under Past Due and two bold sums: 91 or more days past due (11936), 61-90 days past due (708), 31-60 days past due (724), 1-30 days past due (524), Current (37).',
   'Step 4: "Totals" with the Amount and Open Balance sums ($4,764,225.51 / $4,763,345.55) in bold.',
   'Step 5: at 1536 px nothing overlaps, is cut off or clipped; the layout is the same as at 1440 px.'],
   [('design-pics/ar-ap-p1-a-p-aging-detail-opens-by-vendor-name.png', 'The design picture', ()),
    ('d3b/C715534-1-1440.png', 'Steps 1-4: A/P Aging Detail at 1440 px - as designed', (CH + ('good', 'Title and chips'), HD + ('good', 'Header row'), (278, 208, 1132, 300, 'good', 'Five buckets, Totals'))),
    ('d3b/C715534-2-1536.png', 'Step 5: 1536 px - nothing clipped, same layout', ())]),
 'C715536': (['A/P Aging Summary, as of today, all locations, 1440 px, light theme; compared with the design picture "A/P gets the same menu".',
   'Step 1: the title "A/P Aging Summary", the info icon right of it and the grey "⋯" at the far right; no print icon.',
   'Step 2: "As of: 11/11/2026" (blue pill), "Vendor: All vendors" (truck icon, no fill), "Past due: Any" (hourglass, no fill), "Location: All locations" (blue pill).',
   'Step 3: "Vendor" with a small up arrow, "Location", "Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", "Total".',
   'Step 4: vendor names are blue, A to Z; a Location cell reads a location\'s name, or "Multiple" for a vendor with documents at both (Abadi\'s Diesel Repair); Total is bold.',
   'Step 5: at 1536 px nothing overlaps, is cut off or clipped; the layout is the same as at 1440 px.'],
   [('design-pics/ar-ap-p2-a-p-gets-the-same-menu.png', 'The design picture', ()),
    ('d3b/C715536-1-1440.png', 'Steps 1-4: A/P Aging Summary at 1440 px - as designed, no print icon', (CH + ('good', 'Title, info icon, ⋯, chips'), HD + ('good', 'Headings'))),
    ('d3b/C715536-2-1536.png', 'Steps 4-5: 1536 px - "Multiple" for a vendor at both locations; nothing clipped', ((520, 540, 200, 40, 'good', 'Multiple'),))]),
}
ids = sys.argv[1:]; R = {}
for c in ids:
    obs, pics = E[c]; R[c] = {'verdict': 'Passed', 'observed': obs, 'pictures': [P(c, a, t, b) for a, t, b in pics]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b2 design ' + ' '.join(ids)}, 'results': R}, open(PP + 'RESULTS-d3b2-design-%s.json' % '-'.join(ids), 'w'), indent=1); print(list(R))
