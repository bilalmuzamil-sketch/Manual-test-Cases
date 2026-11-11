"""s86b_result.py — 11 Nov 2026: C715451 (A/P Summary) and C715453 (A/P Unpaid) - 30 vendors at a time, none repeated or skipped - from the s86b
re-run (exact Totals-row match, so the vendor "Total Truck & Trailer Repair - Indian Lake" is no longer mistaken for the Totals row, L0660)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): dst = PP + 'pics/%s-%s' % (cid, n); ann(PP + 's86/' + n, dst, t, [], [], b); return dst
HEAD = (278, 161, 1132, 48); TOT = (278, 852, 1132, 46)
R = {}
for cid, rep, col, csvdesc, list3, files in [('C715451', 'A/P Aging Summary', 'Total', '504 rows', 484, ['01-C715451-3-first.png', '02-C715451-5-end.png', '03-C715451-7-sorted.png', '04-C715451-9-two-ranges.png', '05-C715451-10-filtered.png']),
                                              ('C715453', 'A/P Unpaid Invoices Report', 'Open Balance', '13,918 bill lines for 504 vendors', 490, ['06-C715453-3-first.png', '07-C715453-5-end.png', '08-C715453-7-sorted.png', '09-C715453-9-two-ranges.png', '10-C715453-10-filtered.png'])]:
    a, b, c, d, e = files
    R[cid] = {'verdict': 'Passed', 'observed': [
        '%s, as of today, all locations: the downloaded spreadsheet lists 504 vendors (%s), each once.' % (rep, csvdesc),
        'Before any scrolling the screen shows exactly 30 vendors; the 30th is "Bandy Truck Center - Vacaville", the same as the 30th in the spreadsheet.',
        'Scrolling loads the next vendors below, with no page buttons: the first new one is "Bangs\' Truck Repair" - the 31st in the spreadsheet, not a repeat. They arrive 30 at a time.',
        'Scrolled to the end: 504 vendors, each exactly once, none missing - the same 504 as the spreadsheet. (The spreadsheet starts two names with an apostrophe, \'-1 Diesel and \'@Home Towing; on screen they read -1 Diesel and @Home Towing - the same vendors. "Total Truck & Trailer Repair - Indian Lake" is listed as a vendor like any other.)',
        'Clicking "%s" sorts largest first (arrow on the heading); scrolled to the end again: 504 vendors, each once, none missing.' % col,
        'Past due "1-30 days": the chip reads "Past due: 1-30 days"; adding "91+ days": the chip reads "Past due: 2 ranges" and the report reloads.',
        'Scrolled to the end with the two ranges: %d vendors, each exactly once, none repeated as more loaded.' % list3,
        'The test asks for 31-90 vendors; this site has 504, so the list loads 17 times instead of twice - a stronger check of the same thing.'],
        'pictures': [P(cid, a, 'Step 3: the first 30 vendors before scrolling', [HEAD + ('good', 'First 30 rows, last is "Bandy Truck Center - Vacaville"')]),
                     P(cid, b, 'Step 5: scrolled to the end - 504 vendors, none repeated', [TOT + ('good', 'End of list reached; Totals row')]),
                     P(cid, c, 'Steps 6-7: sorted by %s, largest first' % col, [(1290, 165, 115, 40, 'good', 'Sorted largest first')]),
                     P(cid, d, 'Step 9: chip reads "Past due: 2 ranges"', [(690, 118, 200, 32, 'good', 'Past due: 2 ranges')]),
                     P(cid, e, 'Step 10: %d vendors with the two ranges, each once' % list3, [TOT + ('good', 'End of the filtered list')])]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s86b paging A/P'}, 'results': R}, open(PP + 'RESULTS-s86b.json', 'w'), indent=1); print(list(R))
