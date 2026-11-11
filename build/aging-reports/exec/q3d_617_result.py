"""q3d_617_result.py — 11 Nov 2026 21:25 UTC: C715617 (Sales By Customer link, PDF and CSV work as before the release); apostrophe guard proved pre-existing by prod/pr12.json. Before = production v26.45.3
(prod/q3p/out.json: Truck Hill 1 ticked -> address ?locationIds=<id>; link reopens it; PDF + CSV). After = QA q3d/out.json (Staging Lethbridge -
4310 ticked - not the current location, L0685). Different data on each side: rows/amounts compared with the screen, layout compared side by side."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
q = json.load(open(PP + 'q3d/out.json'))['C715617']; pr = json.load(open(PP + 'prod/q3p/out.json'))['C715617']; C = 'C715617'
assert 'locationIds=' in q['link'] and 'locationIds=' in pr['link'] and 'Lethbri' in q['chips2'][-1] and q['pdf']['name'] == pr['pdf']['name'] == 'sales-by-customer-summary.pdf' and q['csv']['csvHead'][3] == pr['csv']['csvHead'][3] and q['pdf']['pdfHead'][4] == pr['pdf']['pdfHead'][4] and json.load(open(PP + 'prod/pr12.json'))['rowsWithPN'][0].split(',')[1].startswith('"\'-')
R = {C: {'verdict': 'Passed', 'observed': [
    'Before the release (production v26.45.3-f5ba431), Sales By Customer with one location ticked: the address carries that location (".../reports/sales-by-customer?locationIds=<id>"), the copied link reopens with it ticked, the ⋯ menu offers "Download Summary (PDF)", "Download Expanded View (PDF)", "Download Summary (CSV)", "Download Expanded View (CSV)", and both Summary files download ("sales-by-customer-summary") with the title, company, location, "Date Range", "Product Type", "Locations:" lines and the columns Customer, Labor Delta, Labor Invoiced, Labor Margin, Parts Invoiced, Parts Margin, Shop Supplies, Adjustments, Margin, Margin %, Subtotal.',
    'Step 1: with "Staging Lethbridge - 4310" ticked, the copied link (".../reports/sales-by-customer?locationIds=<Lethbridge>") opened in a new tab shows Sales By Customer with "Location: Staging Lethbridge - 4310" ticked, as before.',
    'Steps 2-3: "Download Summary (PDF)" (the menu\'s wording; the case says "Download (PDF)") downloads "sales-by-customer-summary.pdf" with "Success - Data exported successfully"; the same lines, columns and layout as production\'s PDF; its rows and amounts are the screen\'s.',
    'Steps 4-5: "Download Summary (CSV)" downloads "sales-by-customer-summary.csv": the same three filter lines and the same column heading row as production\'s CSV, then one row per customer and a Totals row. A name starting with "-" is written with an apostrophe in front ("\'-1 Diesel"); production does the same before the release (a part described "-ZZAUTOTEST P98 apostrophe check" exported from production comes out as "\'-ZZAUTOTEST P98 apostrophe check").',
    'The two sides hold different data, so rows and amounts were compared with each report\'s own screen, and the layout side by side.'],
    'pictures': [P(C, 'q3d/C715617-sbc-2-link-opened.png', 'Step 1: the copied link opens Sales By Customer with Staging Lethbridge - 4310 ticked', [(278, 118, 1132, 32, 'good', 'Same filter as when copied')]),
                 P(C, 'prod/q3p/C715617-sbc-pdf-p1-1.png', 'Before the release (production): the Sales By Customer PDF, page 1', []),
                 P(C, 'q3d/C715617-sbc-pdf-p1-1.png', 'Step 3 on the new build: the same PDF layout', [(20, 40, 450, 125, 'good', 'Same heading lines'), (20, 185, 890, 36, 'good', 'Same columns')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, q3d + q3p'}, 'results': R}, open(PP + 'RESULTS-q3d-617.json', 'w'), indent=1); print(list(R))
