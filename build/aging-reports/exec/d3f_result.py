"""d3f_result.py — 11 Nov 2026: C715517 (A/R Summary export messages match Sales By Customer's). Steps 1-3 from d3d (CSV success message on both
reports: same text, green, 400x56 at 940,834; Location "Clear selection" -> "No locations"); steps 4-5 from d3f (A/R Summary with no location ticked:
Download (PDF) -> "Empty export / Export didn't yield any results", nothing downloads; Sales By Customer emptied by Product Type -> Clear selection
(with No locations it still lists rows), Download Summary (PDF) -> the same warning)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
a = json.load(open(PP + 'd3d/C715517.json')); f = json.load(open(PP + 'd3f/out.json')); C = 'C715517'
OK = 'check_circle Success Data exported successfully. Close'; EMPTY = "priority_high Empty export Export didn't yield any results Close"
assert a['arsCsv']['notes'] == [OK] == a['sbcCsv']['notes'] and a['arsCsvBox'] == a['sbcCsvBox'] and a['arsChip'].startswith('place Location: No locations')
assert f['arsPdf']['notes'] == [EMPTY] == f['sbcPdf']['notes'] and not f['arsPdf']['file'] and not f['sbcPdf']['file'] and f['sbcEmpty']
T = (930, 820, 420, 80)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/R Aging Summary, as of today, all locations; Sales By Customer in a second tab for comparison.',
    'Step 1: "Download (CSV)" downloads the file and shows "Success" / "Data exported successfully." with Close.',
    'Step 2: Sales By Customer\'s CSV download shows the same message - same words, the same green box, the same size and the same place at the bottom right.',
    'Step 3: Location menu "Clear selection" - the chip reads "Location: No locations" (nothing ticked).',
    'Step 4: "Download (PDF)" shows "Empty export" / "Export didn\'t yield any results" with Close, and nothing downloads.',
    'Step 5: Sales By Customer\'s own empty-export warning (with its table emptied) is the same: the same words, the same orange box, in the same place.'],
    'pictures': [P(C, 'd3d/ars-csv-toast-late.png', 'Step 1: A/R Aging Summary - "Success / Data exported successfully."', [T + ('good', 'Success')]),
                 P(C, 'd3d/sbc-csv-toast-late.png', 'Step 2: Sales By Customer - the same message, same look and place', [T + ('good', 'Same')]),
                 P(C, 'd3d/ars-cleared.png', 'Step 3: no location ticked', [(278, 118, 900, 32, 'good', 'No locations')]),
                 P(C, 'd3f/ars-pdf-toast-3.png', 'Step 4: "Empty export / Export didn\'t yield any results" - nothing downloads', [T + ('good', 'Empty export')]),
                 P(C, 'd3f/sbc-pdf-toast-3.png', 'Step 5: Sales By Customer\'s empty-export warning - the same', [T + ('good', 'Same')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3d + d3f C715517'}, 'results': R}, open(PP + 'RESULTS-d3f.json', 'w'), indent=1); print(list(R))
