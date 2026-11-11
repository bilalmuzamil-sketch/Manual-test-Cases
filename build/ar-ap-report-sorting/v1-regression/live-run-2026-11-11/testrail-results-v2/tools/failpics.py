import json, subprocess, sys
S = '/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/'; sys.path.insert(0, S)
from pdfhelp import words, render, box_line, box_block
E = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/evidence/'
R = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/defect-pack-2026-11-11/evidence/'
OUT = '/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/testrail-results-v2/pics/'
def ann(src, out, title, marks, scale):
    a = []
    for (x, y, w, h), kind, cap in sorted(marks, key=lambda m: m[0][1]): a += ['--mark', '%d,%d,%d,%d:%s:%s' % (x, y, w, h, kind, cap)]
    r = subprocess.run(['python3', S + 'xtools/annotate_v2.py', src, out, '--title', title, '--scale', str(scale)] + a, capture_output=True, text=True); print(r.stdout.strip() or r.stderr[-300:]); return out
made = {}
made['V1R-07'] = [ann(E + 'V1R-07 - step 4 picking the last day of next month.png', OUT + 'C1078980-1-fail-days-after-today-greyed.png',
    'QA branch: A/R Aging Summary, date menu open on 11 Nov 2026 - the last day of next month cannot be reached',
    [((428, 168, 22, 26), 'bad', 'The next-month arrow does nothing, so December (and 31 Dec 2026) cannot be reached.'),
     ((458, 262, 104, 30), 'bad', 'Every day after 11/11/2026 is greyed out: 12, 13, 14 ...'), ((296, 294, 266, 94), 'bad', '... and 15 to 30 November too - none of them can be picked.'),
     ((288, 117, 152, 32), 'bad', 'The chip stays on today: As of: 11/11/2026.')], 1)]
made['V1R-08'] = [ann(E + 'V1R-08 - step 5 date chip after opening the link.png', OUT + 'C1078981-1-fail-link-opens-on-today.png',
    'QA branch: A/P Aging Summary opened from a link ending ?asOfDate=2026-12-31',
    [((288, 120, 172, 28), 'bad', 'The chip reads As of: 11/11/2026 (today), not 12/31/2026; the date was dropped from the address.')], 1)]
o = json.load(open(S + 'ocr.json'))['V1R-35 - step 3 empty bucket count.png']
b = next(i for i in o if '61-90' in i[4] and i[0] > 268)
row = [i for i in o if i[0] > 268 and abs((i[1] + i[3]) / 2 - (b[1] + b[3]) / 2) < 8]
f = R + 'rerun-2026-11-11/V1R-35 - step 5 A-R Detail PDF.pdf'; w = words(f)
made['V1R-35'] = [ann(render(f, 1, S + 'fresh/35p1.png'), OUT + 'C1079008-1-fail-pdf-empty-buckets-missing.png',
    'QA branch: A/R Aging Detail PDF for ZZAUTOTEST AR R13 Payment After (downloaded 11 Nov 2026 13:05 UTC)',
    [(box_line(w[0], '31-60'), 'bad', 'Only "31-60 days past due" is printed. "61-90 days past due" and its "Total for 61-90 days past due $0.00" line are missing, as are the other empty buckets.')], 2),
    ann(E + 'V1R-35 - step 3 empty bucket count.png', OUT + 'C1079008-2-screen-61-90-bucket-0.png',
    'QA branch: the same report on screen, before downloading',
    [((282, min(i[1] for i in row) - 6, 1143, max(i[3] for i in row) - min(i[1] for i in row) + 12), 'good', 'On screen the empty bucket is there: "61-90 days past due (0)", Total $0.00 $0.00.')], 1)]
f = R + 'rerun-2026-11-11/V1R-36 - step 5 A-R Collection PDF.pdf'; w = words(f)
made['V1R-36'] = [ann(render(f, 1, S + 'fresh/36p1.png'), OUT + 'C1079009-1-fail-pdf-subtotal.png',
    'QA branch: A/R Aging Collection PDF with only ZZAUTOTEST AR R36 Collect X picked (downloaded 11 Nov 2026 13:05 UTC)',
    [(box_line(w[0], 'Subtotal'), 'bad', 'The customer\'s closing line reads "Subtotal $110.00 $110.00", not "Total for ZZAUTOTEST AR R36 Collect X".')], 2)]
f = R + 'AR Aging Detail - run 1.pdf'; w = words(f)
line = [z for z in w[15] if abs(z[1] - next(q for q in w[15] if q[4] == 'CM11315-4209')[1]) < 3]
def bx(ws): return [int(2 * min(z[0] for z in ws)) - 6, int(2 * min(z[1] for z in ws)) - 5, int(2 * (max(z[2] for z in ws) - min(z[0] for z in ws))) + 12, int(2 * (max(z[3] for z in ws) - min(z[1] for z in ws))) + 10]
xs = sorted(line, key=lambda z: z[0])
date1 = xs[:3]; due = [z for z in xs if z[0] > 500 and z[4] in ('Oct', '26,', '2026')]; amt = [z for z in xs if z[4].startswith('(-$')]
print([z[4] for z in xs])
made['V1R-80'] = [ann(render(f, 16, S + 'fresh/80p16.png'), OUT + 'C1095436-1-fail-pdf-date-with-comma.png',
    'QA branch: A/R Aging Detail PDF, page 16 - credit memo CM11315-4209 of ZZAUTOTEST AR R42 Memo Line (downloaded 11 Nov 2026 12:55 UTC)',
    [(bx(date1), 'bad', 'Date prints "Oct 26, 2026" (with a comma), not "Oct 26 2026".'),
     (bx(due), 'bad', 'Due Date prints "Oct 26, 2026" the same way.'),
     (bx(amt), 'good', 'The amount prints "(-$5.00)" in brackets with a minus sign, as required.')], 2)]
json.dump(made, open(S + 'pics-fail.json', 'w'), indent=1)
