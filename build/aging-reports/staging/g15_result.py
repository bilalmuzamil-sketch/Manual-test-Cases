"""g15_result.py - 12 Nov 2026, run 557, STAGING after the release (v26.45.4-b8c04e2; PDF service limit 120 s here per the SV-12539 developer
note), QA lead's session, browser Asia/Karachi. C715469 (s6_pdf2000.mjs): chosen vendors Fate Roadside Truck Repair + New Castle Diesel
Performance + Grand Haven Diesel Services LLC = 2,000 open lines (bucket counts on screen 1820+74+83+23+0); CSV 2,000 document rows; PDF
downloaded with "Success" after ~70 s, 84 pages, 2,000 document rows (pdftotext); + vendor B Tehachapi Truck Center = 2,001; PDF -> exactly one
message "This report is too large for PDF...", no file in 60 s. On the QA site the same PDF stopped at 30 s (shared PDF service), hence Blocked
there; staging is where the developer asked for it to be re-tested."""
import json, sys, csv, glob, subprocess, re
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's6/out.json'))
rows = list(csv.reader(open(PP + 's6/2-csv-ap-aging-detail.csv', encoding='utf-8-sig')))[4:-1]
txt = subprocess.run(['pdftotext', '-layout', PP + 's6/3-pdf-2000-ap-aging-detail.pdf', '-'], capture_output=True, text=True).stdout
pdfrows = len(re.findall(r'(?m)^\s*[A-Z][a-z]{2} \d{2} \d{4}\s', txt))
assert o['sumA'] == 2000 and len(rows) == 2000 and pdfrows == 2000 and o['pdfA']['file'] and o['sumB'] == 2001 and o['pdfB']['file'] is None and len(o['pdfB']['notes']) == 1
assert 'This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.' in o['pdfB']['notes'][0]['text'] and 'Data exported successfully' in o['csv']['notes'][0]['text']
R = {'C715469': {'verdict': 'Passed', 'observed': [
        'Run on staging (build v26.45.4-b8c04e2) after the release, as Admin, As of 11/12/2026. Chosen vendors: Fate Roadside Truck Repair, New Castle Diesel Performance and Grand Haven Diesel Services LLC, whose open lines today add up to 2,000. Vendor B: Tehachapi Truck Center (one open line).',
        'Step 1: with the three vendors ticked, the chip reads "Vendor: 3 vendors" and only their lines remain: 1,820 + 74 + 83 + 23 + 0 = 2,000 across the five aging groups.',
        'Step 2: Download (CSV) gives "Success - Data exported successfully."',
        'Step 3: the CSV holds exactly 2,000 document rows (heading lines and the Totals row left out).',
        'Step 4: Download (PDF) gives "Success - Data exported successfully." after about 70 seconds; the PDF has 84 pages and exactly 2,000 document rows.',
        'Step 5: with vendor B also ticked the chip reads "Vendor: 4 vendors" and the report holds 2,001 document rows.',
        'Step 6: Download (PDF) shows exactly one message, "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again.", and no PDF downloads (watched for 60 seconds).',
        'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'],
     'pictures': [P('C715469', 's6/01-1-three-vendors.png', 'Step 1: the three chosen vendors - 2,000 open lines', [(482, 120, 185, 28, 'good', 'Vendor: 3 vendors'), (278, 209, 1132, 240, 'good', '1,820 + 74 + 83 + 23 + 0 = 2,000')]),
                  P('C715469', 's6/04-3-pdf-2000-after.png', 'Step 4: 2,000 lines - Download (PDF) succeeds', [(940, 834, 400, 56, 'good', 'Success')]),
                  P('C715469', 's6/pdfp-01.png', 'Step 4: the downloaded PDF (page 1 of 84; 2,000 document rows)', []),
                  P('C715469', 's6/01-step6-message-settled.png', 'Step 6: 2,001 lines - the PDF is refused with one message, no file', [(482, 120, 185, 28, 'good', 'Vendor: 4 vendors'), (940, 811, 400, 79, 'good', 'This report is too large for PDF...')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g15: staging A/P Detail PDF 2,000/2,001'}, 'results': R}, open(PP + 'RESULTS-g15.json', 'w'), indent=1); print(list(R))
