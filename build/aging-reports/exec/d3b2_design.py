"""d3b2_design.py — 11 Nov 2026: design-picture tests judged from the d3b2 light-theme re-run (each judged by eye against its design picture; entries
added as each case lands). Usage: python3.12 d3b2_design.py C715534 [...] -> RESULTS-d3b2-design-<ids>.json."""
import json, sys
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b=()): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], list(b)); return dst
CH = (278, 70, 1132, 80); HD = (278, 160, 1132, 48); PIN = (278, 208, 1132, 48)
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
 'C715539': (['A/R Aging Collection, as of today, customers "Desert Edge Truck Service & Repair" (74) and "Tucson Truck Center" (39) ticked and open, 1440 px, light theme; compared with the design picture "The customer row stays pinned".',
   'Step 1: scrolling into Desert Edge\'s rows, its group row stays just under the column headings while its invoices slide beneath it; as in the picture it shows the blue chevron, the bold name and count, and the grey "Phone: 605-175-8825" and "Credit term: Net 45".',
   'Step 2: when Tucson Truck Center\'s row reaches the top it takes the pinned place ("Phone: 913-614-9479", "Credit term: Net 30") and Desert Edge\'s row is gone; only one group row is pinned at a time.',
   'Step 3: at 1536 px nothing overlaps, is cut off or clipped; the layout is the same as at 1440 px.'],
   [('design-pics/ar-ap-p3-the-customer-row-stays-pinned.png', 'The design picture', ()),
    ('d3b/C715539-2-scroll-3300.png', 'Step 1: Desert Edge\'s row pinned under the headings, rows sliding beneath', (PIN + ('good', 'Pinned, as designed'),)),
    ('d3b/C715539-3-scroll-3700.png', 'Step 2: Tucson Truck Center has taken the pinned place - one pinned row', (PIN + ('good', 'Customer B pinned'),)),
    ('d3b/C715539-4-1536.png', 'Step 3: 1536 px - nothing clipped, same layout', ())]),
 'C715541': (['A/R Aging Collection, as of today, all locations, every group closed, 1440 px; compared with the design pictures "Info icon beside the title, light" and "…, dark".',
   'Step 1: the title "A/R Aging Collection", the info icon directly right of it and the "⋯" at the right end, on one line; the filter row below.',
   'Step 2: the chevron in the top-left header cell points right - every group is closed.',
   'Step 3: each group row shows a blue chevron pointing right, the bold name with its count, grey "Credit term: " and the term (and grey "Phone: " and the number where the customer card has one, e.g. Andrews\' Truck & Trailer Repair LLC), "Total" under Past Due and the two bold sums.',
   'Step 4: "Totals" with the two bold sums at the bottom.',
   'Step 5: in dark theme the page is dark with white text, as in the dark picture; the "As of" and "Location" chips are dark-blue pills with white text; "Customer" and "Past due" are white text with no fill; Phone and Credit term are grey; everything is readable.',
   'Step 6: at 1536 px (dark) nothing overlaps, is cut off or clipped; the layout is the same as at 1440 px.'],
   [('design-pics/ar-ap-p6-info-icon-beside-the-title-light.png', 'Design picture, light', ()),
    ('d3b/C715541-1-light.png', 'Steps 1-4: light theme - as designed', (CH + ('good', 'Title row and chips'), (278, 208, 1132, 300, 'good', 'Closed groups'))),
    ('design-pics/ar-ap-p6-info-icon-beside-the-title-dark.png', 'Design picture, dark', ()),
    ('d3b/C715541-2-dark.png', 'Step 5: dark theme - as designed, readable', (CH + ('good', 'Dark-blue pills, white text'),)),
    ('d3b/C715541-3-dark-1536.png', 'Step 6: 1536 px - nothing clipped', ())]),
 'C715543': (['A/P Aging Detail, as of today, all locations, the "91 or more days past due" bucket open, 1440 px; compared with the design pictures "Open Balance pinned, light" and "Same, dark".',
   'Step 1: scrolled a little inside the bucket, the bucket row "91 or more days past due (11936)" stays pinned under the column headings and the bold Totals row sits at the bottom while the rows scroll under it. All nine columns show at 1440 px: the chevron, "Date", "Location", "Transaction Type", "No.", "Vendor Name" (small up arrow), "Due Date", "Past Due", "Amount", "Open Balance", each heading on one line. Location wraps onto two lines ("Staging Heavy Duty -" / "9919"); dates, numbers and money stay on one line; document numbers at this location are blue links (a bill made at Staging Lethbridge - 4310 is plain text, as the location rule says); Open Balance is bold on every row.',
   'Step 2: in dark theme, as in the dark picture, the links are blue and readable on the dark page; Open Balance and the Totals row are bold and white.',
   'Step 3: at 1536 px (dark) nothing overlaps, is cut off or clipped; the layout is the same as at 1440 px.'],
   [('design-pics/ar-ap-p6-open-balance-pinned-light.png', 'Design picture, light', ()),
    ('d3b/C715543-1-light.png', 'Step 1: bucket row pinned, Totals at the bottom, nine columns, Location on two lines', (PIN + ('good', 'Pinned bucket'), (278, 852, 1132, 46, 'good', 'Totals at the bottom'))),
    ('design-pics/ar-ap-p6-same-dark-2.png', 'Design picture, dark', ()),
    ('d3b/C715543-2-dark.png', 'Step 2: dark theme - links blue and readable, Open Balance and Totals bold white', ()),
    ('d3b/C715543-3-dark-1536.png', 'Step 3: 1536 px - nothing clipped', ())]),
}
ids = sys.argv[1:]; R = {}
for c in ids:
    obs, pics = E[c]; R[c] = {'verdict': 'Passed', 'observed': obs, 'pictures': [P(c, a, t, b) for a, t, b in pics]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b2 design ' + ' '.join(ids)}, 'results': R}, open(PP + 'RESULTS-d3b2-design-%s.json' % '-'.join(ids), 'w'), indent=1); print(list(R))
