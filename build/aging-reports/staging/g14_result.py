"""g14_result.py - 12 Nov 2026, run 557, STAGING after the release (v26.45.4-b8c04e2), browser Asia/Karachi, QA lead's session.
C715475 Inventory Value: the link saved before the release (before-iv/, from session "5", captured 12 Nov 06:52 UTC, only DVI Test ticked) opens
with "Location: DVI Test" and As of 11/12/2026 (s5_iv.mjs); Download (PDF) and Download (CSV) both give "Success"; the CSV is byte-identical to
the saved CSV (cmp) and the PDF's text is identical (pdftotext) and its page renders pixel-identical at 80 dpi (pdftoppm + PIL, no difference box).
"""
import json, sys, filecmp
sys.path.insert(0, '/home/user/Manual-test-Cases/build/aging-reports/exec')
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/staging/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 's5/out.json'))
assert any('Location: DVI Test' in c for c in o['chips']) and any('As of: 11/12/2026' in c for c in o['chips'])
assert 'Data exported successfully.' in o['pdf']['notes'][0] and 'Data exported successfully.' in o['csv']['notes'][0]
assert filecmp.cmp(PP + 'before-iv/Inventory Value (DVI Test) - csv - inventory-value-report.csv', PP + 's5/3-csv-inventory-value-report.csv', shallow=False)
from PIL import Image, ImageChops
a = Image.open(PP + 's5/render/before-1.png').convert('RGB'); b = Image.open(PP + 's5/render/after-1.png').convert('RGB'); assert ImageChops.difference(a, b).getbbox() is None
R = {'C715475': {'verdict': 'Passed', 'observed': [
        'Run on staging (build v26.45.4-b8c04e2) after the release, as Admin. The link, PDF and CSV were saved from Inventory Value earlier today, before the release, with only the "DVI Test" location ticked.',
        'Step 1: the saved link opens Inventory Value with "Location: DVI Test" and "As of: 11/12/2026", the same filter as before.',
        'Step 2: Download (PDF) shows "Success - Data exported successfully." and the file downloads.',
        'Step 3: the new PDF has the same rows, amounts and layout as the saved one: its text is identical and the page looks identical, dot for dot.',
        'Step 4: Download (CSV) shows "Success - Data exported successfully." and the file downloads.',
        'Step 5: the new CSV is exactly the same file as the saved CSV, character for character.',
        'Test run 557: https://shopview.testrail.io/index.php?/runs/view/557'],
     'pictures': [P('C715475', 's5/01-1-link-opened.png', 'Step 1: the link saved before the release opens with the same filter', [(283, 125, 185, 28, 'good', 'As of 11/12/2026'), (930, 125, 184, 28, 'good', 'Location: DVI Test (as saved)')]),
                  P('C715475', 's5/02-2-pdf.png', 'Step 2: Download (PDF) - Success', [(940, 834, 400, 56, 'good', 'Success')]),
                  P('C715475', 's5/render/side-by-side.png' if False else 's5/render/after-1.png', 'Step 3: the new PDF - text and page identical to the PDF saved before the release', []),
                  P('C715475', 's5/03-3-csv.png', 'Steps 4-5: Download (CSV) - Success; the file is identical to the saved CSV', [(940, 834, 400, 56, 'good', 'Success')])]}}
json.dump({'pass_meta': {'note': '12 Nov 2026, run 557, g14: staging Inventory Value link/PDF/CSV vs before the release'}, 'results': R}, open(PP + 'RESULTS-g14.json', 'w'), indent=1); print(list(R))
