"""q3d_618_result.py — 11 Nov 2026 21:25 UTC: C715618 (Work In Progress link, PDF and CSV work as before the release). Before = production v26.45.3
(prod/q3p/out.json: Truck Hill 1 ticked -> address ?locationIds=<id>; link reopens it; PDF + CSV). After = QA q3d/out.json (Staging Lethbridge -
4310 ticked - not the current location, L0685). Different data on each side: rows/amounts compared with the screen, layout compared side by side."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q = json.load(open(PP + 'q3d/out.json'))['C715618']; pr = json.load(open(PP + 'prod/q3p/out.json'))['C715618']; C = 'C715618'
assert 'locationIds=' in q['link'] and 'locationIds=' in pr['link'] and 'Lethbri' in q['chips2'][-1] and q['pdf']['name'] == pr['pdf']['name'] == 'wip-2-report.pdf' and q['csv']['csvHead'][3] == pr['csv']['csvHead'][3] and q['pdf']['pdfHead'][4] == pr['pdf']['pdfHead'][4]
R = {C: {'verdict': 'Passed', 'observed': [
    'Before the release (production v26.45.3-f5ba431), Work In Progress with one location ticked: the address carries that location (".../reports/work-in-progress?locationIds=<id>"), the copied link reopens with it ticked, "Download (PDF)" and "Download (CSV)" both download "wip-2-report" with the title, company, location, "As of", "Tab: Approved - partially completed", "Locations:" lines and the columns WO #, Status, Customer, Unit, Advisor, Days Open, Earned, Remaining, Adjustments, Total.',
    'Step 1: with "Staging Lethbridge - 4310" ticked, the copied link (".../reports/work-in-progress?locationIds=<Lethbridge>") opened in a new tab shows Work In Progress with "Location: Staging Lethbridge - 4310" ticked, as before.',
    'Steps 2-3: "Download (PDF)" downloads "wip-2-report.pdf" (5 pages) with "Success - Data exported successfully"; the same lines, columns and layout as production\'s PDF; its rows and amounts are the screen\'s.',
    'Steps 4-5: "Download (CSV)" downloads "wip-2-report.csv": the same three filter lines ("As of", "Tab", "Locations: Staging Lethbridge - 4310") and the same column heading row as production\'s CSV, then one row per work order and a Totals row.',
    'The two sides hold different data (production\'s and the QA site\'s), so rows and amounts were compared with each report\'s own screen, and the layout side by side.'],
    'pictures': [P(C, 'q3d/C715618-wip-2-link-opened.png', 'Step 1: the copied link opens Work In Progress with Staging Lethbridge - 4310 ticked', [(278, 118, 1132, 32, 'good', 'Same filter as when copied')]),
                 P(C, 'prod/q3p/C715618-wip-pdf-p1-1.png', 'Before the release (production): the Work In Progress PDF, page 1', []),
                 P(C, 'q3d/C715618-wip-pdf-p1-1.png', 'Step 3 on the new build: the same PDF layout', [(20, 40, 450, 125, 'good', 'Same heading lines'), (20, 185, 890, 36, 'good', 'Same columns')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q3d + q3p'}, 'results': R}, open(PP + 'RESULTS-q3d-618.json', 'w'), indent=1); print(list(R))
