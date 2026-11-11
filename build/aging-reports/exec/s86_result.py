"""s86_result.py — 11 Nov 2026: results for C715450, C715452 (30 at a time, none repeated or skipped) and C715612-C715614 (Totals cover every row),
from exec/s86/<id>.json (s86_paging.mjs run of 15:00 UTC). Writes RESULTS-s86-a.json with annotated pictures."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, title, boxes): src = PP + 's86/' + n; out = PP + 'pics/%s-%s' % (cid, n); ann(src, out, title, [], [], boxes); return out
HEAD = (278, 161, 1132, 48); TOT = (278, 852, 1132, 46)
R = {}
def thirty(cid, rep, who, col, nCsv, n3, csvlines, loads, list3, files):
    a, b, c, d, e = files
    R[cid] = {'verdict': 'Passed', 'observed': [
        '%s, as of today, all locations: the downloaded spreadsheet lists %d %s (%s), each once.' % (rep, nCsv, who, csvlines),
        'Before any scrolling the screen shows exactly 30 %s; the 30th is "Inland Heavy Duty Truck Repair", the same as the 30th in the spreadsheet.' % who,
        'Scrolling loads the next %s below, with no page buttons: the first new one is "La Mesa Diesel Repair" - the 31st in the spreadsheet, not a repeat. They arrive 30 at a time (%s).' % (who, loads),
        'Scrolled to the end: %d %s, each exactly once, none missing - the same %d as the spreadsheet. (The spreadsheet starts three names with an apostrophe, e.g. \'-1 Diesel; on screen they read -1 Diesel - the same customers.)' % (nCsv, who, nCsv),
        'Clicking "%s" sorts largest first (arrow on the heading); scrolled to the end again: %d %s, each once, none missing.' % (col, nCsv, who),
        'Past due "1-30 days": the chip reads "Past due: 1-30 days"; adding "91+ days": the chip reads "Past due: 2 ranges" and the report reloads.',
        'Scrolled to the end with the two ranges: %d %s, each exactly once, none repeated as more loaded.' % (list3, who),
        'The test asks for 31-90 %s; this site has %d, so the list loads five times instead of twice - a stronger check of the same thing.' % (who, nCsv)],
        'pictures': [P(cid, a.split('/')[-1], 'Step 3: the first 30 %s before scrolling' % who, [HEAD + ('good', 'First 30 rows, last is "Inland Heavy Duty Truck Repair"'),]),
                     P(cid, b.split('/')[-1], 'Step 5: scrolled to the end - %d %s, none repeated' % (nCsv, who), [TOT + ('good', 'End of list reached; Totals row')]),
                     P(cid, c.split('/')[-1], 'Steps 6-7: sorted by %s, largest first' % col, [(1290, 165, 115, 40, 'good', 'Sorted largest first'), HEAD + ('good', '')]),
                     P(cid, d.split('/')[-1], 'Step 9: chip reads "Past due: 2 ranges"', [(720, 118, 192, 32, 'good', 'Past due: 2 ranges')]),
                     P(cid, e.split('/')[-1], 'Step 10: %d %s with the two ranges, each once' % (list3, who), [(720, 118, 192, 32, 'good', 'Two ranges on'), TOT + ('good', 'End of the filtered list')])]}
thirty('C715450', 'A/R Aging Summary', 'customers', 'Total', 147, 30, '147 rows', '30, 30, 30, 30, 27', 100, ['01-C715450-3-first.png', '02-C715450-5-end.png', '03-C715450-7-sorted.png', '04-C715450-9-two-ranges.png', '05-C715450-10-filtered.png'])
thirty('C715452', 'A/R Aging Collection', 'customers', 'Open Balance', 144, 30, '610 invoice lines for 144 customers', '30, 30, 30, 30, 24', 118, ['11-C715452-3-first.png', '12-C715452-5-end.png', '13-C715452-7-sorted.png', '14-C715452-9-two-ranges.png', '15-C715452-10-filtered.png'])
def tot(cid, rep, who, col, rows, csvt, screen, n3, n4):
    R[cid] = {'verdict': 'Passed', 'observed': [
        '%s, as of today, all locations: the downloaded spreadsheet has %d %s and its Totals row reads %s.' % (rep, rows, who, csvt),
        'I added up every row of the spreadsheet myself: the sum matches its Totals row in every column.',
        'Back on the report, with only the first 30 %s loaded, the Totals row reads %s - the same %s as the spreadsheet, so it counts every %s, not only those loaded.' % (who, screen, col, who[:-1]),
        'After scrolling until more %s loaded, the Totals row reads exactly the same.' % who,
        'The test asks for 31-90 %s; this site has %d - more not-yet-loaded rows, a stronger check of the same thing.' % (who, rows)],
        'pictures': [P(cid, n3, 'Step 3: Totals with only the first 30 loaded = spreadsheet %s' % csvt, [TOT + ('good', 'Totals = spreadsheet: ' + csvt)]),
                     P(cid, n4, 'Step 4: Totals read again after scrolling to the end of the list - unchanged', [TOT + ('good', 'Same Totals after all rows loaded')])]}
tot('C715612', 'A/R Aging Summary', 'customers', 'Total', 147, '$521,344.25', '$521,344.25 (Current $3,247.00, 1-30 $105,705.77, 31-60 $167,713.30, 61-90 $126,336.92, 91+ $118,341.26)', '26-C715612-3-totals.png', '27-C715612-4-after-more.png')
tot('C715613', 'A/P Aging Summary', 'vendors', 'Total', 504, '$4,763,441.95', '$4,763,441.95 (Current $4,247.34, 1-30 $124,557.80, 31-60 $268,967.36, 61-90 $320,924.53, 91+ $4,044,744.92)', '28-C715613-3-totals.png', '29-C715613-4-after-more.png')
tot('C715614', 'A/R Aging Collection', 'customers', 'Open Balance', 144, '$517,894.25', 'Amount $547,870.57, Open Balance $517,894.25', '30-C715614-3-totals.png', '31-C715614-4-after-more.png')
R['C715614']['observed'][0] = 'A/R Aging Collection, as of today, all locations: the downloaded spreadsheet has 610 overdue invoice lines for 144 customers; its Totals row reads Amount $547,870.57, Open Balance $517,894.25.'
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s86 paging + totals'}, 'results': R}, open(PP + 'RESULTS-s86-a.json', 'w'), indent=1); print(list(R))
# C715615 (finished 15:13): separate file so the five above are not re-posted
R.clear()
tot('C715615', 'A/P Unpaid Invoices Report', 'vendors', 'Open Balance', 504, '$4,763,441.95', 'Amount $4,764,321.91, Open Balance $4,763,441.95', '32-C715615-3-totals.png', '33-C715615-4-after-more.png')
R['C715615']['observed'][0] = 'A/P Unpaid Invoices Report, as of today, all locations: the downloaded spreadsheet has 13,918 unpaid bill lines for 504 vendors; its Totals row reads Amount $4,764,321.91, Open Balance $4,763,441.95.'
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s86 totals C715615'}, 'results': R}, open(PP + 'RESULTS-s86-b.json', 'w'), indent=1); print(list(R))
