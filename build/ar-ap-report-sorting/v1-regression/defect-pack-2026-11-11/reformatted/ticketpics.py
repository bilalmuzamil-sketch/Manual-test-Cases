import json, subprocess, sys, shutil
S = '/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/'; sys.path.insert(0, S)
from pdfhelp import words, render
B = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/'
E = B + 'v1-regression/live-run-2026-11-11/evidence/'; D = B + 'v1-regression/defect-pack-2026-11-11/evidence/'
REL = B + 'release-2026-11-19/A-R A-P before release 2026-11-19/'
QP = B + 'v1-regression/live-run-2026-11-11/testrail-results-v2/pics/'
OUT = B + 'v1-regression/defect-pack-2026-11-11/reformatted/pics/'
OCR = json.load(open(S + 'ocr.json'))
def ann(src, out, title, marks, scale):
    a = []
    for (x, y, w, h), kind, cap in sorted(marks, key=lambda m: m[0][1]): a += ['--mark', '%d,%d,%d,%d:%s:%s' % (x, y, w, h, kind, cap)]
    r = subprocess.run(['python3', S + 'xtools/annotate_v2.py', src, OUT + out, '--title', title, '--scale', str(scale)] + a, capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr[-300:])
def wbox(ws, pred_first, n=3):
    i = next(k for k, w in enumerate(ws) if pred_first(ws, k)); grp = ws[i:i + n]
    return [int(2 * min(z[0] for z in grp)) - 6, int(2 * min(z[1] for z in grp)) - 5, int(2 * (max(z[2] for z in grp) - min(z[0] for z in grp))) + 12, int(2 * (max(z[3] for z in grp) - min(z[1] for z in grp))) + 10]
def linebox(ws, first):
    a = next(w for w in ws if w[4] == first); line = [w for w in ws if abs(w[1] - a[1]) < 3]
    return [int(2 * min(z[0] for z in line)) - 6, int(2 * min(z[1] for z in line)) - 5, int(2 * (max(z[2] for z in line) - min(z[0] for z in line))) + 12, int(2 * (max(z[3] for z in line) - min(z[1] for z in line))) + 10]
def ocrbox(f, needle, xmin=268):
    it = next(i for i in OCR[f] if needle.replace(' ', '').lower() in i[4].replace(' ', '').lower() and i[0] >= xmin)
    return [it[0] - 5, it[1] - 4, it[2] - it[0] + 10, it[3] - it[1] + 8]
def ocrrow(f, needle):
    it = next(i for i in OCR[f] if needle.replace(' ', '').lower() in i[4].replace(' ', '').lower() and i[0] >= 268)
    row = [i for i in OCR[f] if i[0] >= 268 and i[1] < it[3] - 3 and i[3] > it[1] + 3]
    return [282, min(i[1] for i in row) - 6, 1143, max(i[3] for i in row) - min(i[1] for i in row) + 12]
# --- SV-12544
ws = words(D + 'Sales By Customer - same build.pdf')[0]
ann(render(D + 'Sales By Customer - same build.pdf', 1, S + 'fresh/qa-sbc.png'), 'SV-12544-PIC2-qa-sales-by-customer-pdf.png',
    'QA branch (v26.45.2-6a8b89c): Sales By Customer PDF, Expanded View, downloaded 11 Nov 2026',
    [(wbox(ws, lambda w, k: w[k][4] == 'Nov' and w[k + 1][4] == '10' and w[k + 2][4] == '2026'), 'good', 'Dates print "Nov 10 2026": the form the PRD asks every report PDF to use.')], 2)
ws = words(REL + '3-files-and-links/Sales By Customer - expanded_pdf - sales-by-customer-expanded.pdf')[0]
ann(render(REL + '3-files-and-links/Sales By Customer - expanded_pdf - sales-by-customer-expanded.pdf', 1, S + 'fresh/prod-sbc.png'), 'SV-12544-PIC4-production-sales-by-customer-pdf.png',
    'Production (v26.45.3, captured 10 Nov 2026): Sales By Customer PDF, Expanded View',
    [(wbox(ws, lambda w, k: w[k][4] == 'Nov' and w[k + 1][4] == '02' and w[k + 2][4] == '2026'), 'good', 'Production\'s own report PDFs already print dates as "Nov 02 2026".')], 2)
render(REL + '1-six-reports/AR Aging Detail - print.pdf', 1, S + 'fresh/prod-ardetail.png')
ann(S + 'fresh/prod-ardetail.png', 'SV-12544-PIC3-production-ar-aging-detail-print.png',
    'Production (v26.45.3, captured 10 Nov 2026): A/R Aging Detail - Print',
    [((566, 450, 140, 770), 'good', 'Production\'s A/R Aging Detail print uses the older date form, "Dec 8, 2025" - the same as the QA branch. The PRD (S3-R7a) changes this to "Nov 04 2026".')], 2)
shutil.copy(QP + 'C1095436-1-fail-pdf-date-with-comma.png', OUT + 'SV-12544-PIC1-qa-ar-aging-detail-pdf.png')
# --- SV-12545
f = 'V1R-07 - V1 as of 2026-12-31.png'
ann(E + f, 'SV-12545-PIC3-production-as-of-2026-12-31.png', 'Production (v26.45.3-f5ba431, 11 Nov 2026): A/R Aging Summary with 31 Dec 2026 picked',
    [(ocrbox(f, 'Date'), 'good', 'The chip reads Date: 2026-12-31 - a date after today can be picked.'),
     (ocrrow(f, 'aqeel transport 56'), 'good', 'aqeel transport 56 is worked out for 31 Dec: nothing left under Current.')], 1)
f = 'V1R-08 - V1 step 5 after opening the link.png'
ann(E + f, 'SV-12545-PIC4-production-saved-link-2026-12-31.png', 'Production (v26.45.3-f5ba431, 11 Nov 2026): A/P Aging Summary opened from a link ending ?asOfDate=2026-12-31',
    [(ocrbox(f, 'Date'), 'good', 'The report opens on Date: 2026-12-31, the date in the link.')], 1)
shutil.copy(QP + 'C1078980-1-fail-days-after-today-greyed.png', OUT + 'SV-12545-PIC1-qa-date-menu.png')
shutil.copy(QP + 'C1078981-1-fail-link-opens-on-today.png', OUT + 'SV-12545-PIC2-qa-saved-link.png')
# --- SV-12546
pp = E + 'V1R-35 - V1 step 5 print PDF.pdf'; ws = words(pp)[0]
a = next(w for w in ws if w[4] == '91'); b = next(w for w in ws if w[4] == 'Totals')
blk = [int(2 * 28), int(2 * a[1]) - 8, int(2 * (max(w[2] for w in ws if a[1] <= w[1] <= b[3]) - 28)) + 12, int(2 * (b[3] - a[1])) + 16]
ann(render(pp, 1, S + 'fresh/prod-35.png'), 'SV-12546-PIC3-production-ar-aging-detail-print.png', 'Production (v26.45.3-f5ba431, 11 Nov 2026): A/R Aging Detail - Print, Date 2025-07-01 (every bucket empty)',
    [(blk, 'good', 'All five buckets are printed, each with its "Total for ... days past due $0.00" line, then Totals.')], 2)
shutil.copy(QP + 'C1079008-2-screen-61-90-bucket-0.png', OUT + 'SV-12546-PIC1-qa-screen-61-90-bucket-0.png')
shutil.copy(QP + 'C1079008-1-fail-pdf-empty-buckets-missing.png', OUT + 'SV-12546-PIC2-qa-pdf-empty-buckets-missing.png')
# --- SV-12547
shutil.copy(QP + 'C1079009-1-fail-pdf-subtotal.png', OUT + 'SV-12547-PIC1-qa-ar-collection-pdf-subtotal.png')
pp = E + 'V1R-36 - V1 step 5 print PDF.pdf'; ws = words(pp)[3]
ann(render(pp, 4, S + 'fresh/prod-36.png'), 'SV-12547-PIC2-production-ar-collection-print.png', 'Production (v26.45.3-f5ba431, 11 Nov 2026): A/R Aging Collection - Print, customer aqeel transport 56 (page 4 of 4)',
    [(linebox(ws, 'Total'), 'good', 'The customer\'s block ends with "Total for aqeel transport 56".')], 2)
pp = D + 'rerun-2026-11-11/V1R-35 - step 5 A-R Detail PDF.pdf'; ws = words(pp)[0]
ann(render(pp, 1, S + 'fresh/qa-35b.png'), 'SV-12547-PIC3-qa-ar-detail-pdf-subtotal.png', 'QA branch (v26.45.2-6a8b89c): A/R Aging Detail PDF, only ZZAUTOTEST AR R13 Payment After ticked (11 Nov 2026 13:05 UTC)',
    [(linebox(ws, 'Subtotal'), 'bad', 'The bucket ends with "Subtotal $100.00 $60.00", not "Total for 31-60 days past due".')], 2)
pp = E + 'V1R-35 - V1 step 5 print PDF.pdf'; ws = words(pp)[0]
t = [w for w in ws if w[4] == 'Total']; t31 = next(w for w in t if any(z[4] == '31-60' and abs(z[1] - w[1]) < 3 for z in ws))
line = [w for w in ws if abs(w[1] - t31[1]) < 3]
bx = [int(2 * min(z[0] for z in line)) - 6, int(2 * t31[1]) - 5, int(2 * (max(z[2] for z in line) - min(z[0] for z in line))) + 12, int(2 * (t31[3] - t31[1])) + 10]
ann(S + 'fresh/prod-35.png', 'SV-12547-PIC4-production-ar-detail-print-total-for.png', 'Production (v26.45.3-f5ba431, 11 Nov 2026): A/R Aging Detail - Print, Date 2025-07-01',
    [(bx, 'good', 'Each bucket ends with "Total for <bucket name>", e.g. "Total for 31-60 days past due".')], 2)
