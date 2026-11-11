import json, re, subprocess, sys, os
from html.parser import HTMLParser
S='/tmp/claude-0/-home-user/ef40c1d4-3e84-5396-9a66-1a25d97a7768/scratchpad/'; F=S+'fresh/'
OUT='/home/user/Manual-test-Cases/build/ar-ap-report-sorting/v1-regression/live-run-2026-11-11/testrail-results-v2/pics/'
def words(pdf):
    h = subprocess.run(['pdftotext', '-bbox', pdf, '-'], capture_output=True, text=True).stdout
    pages, cur = [], None
    for line in h.splitlines():
        if '<page ' in line: cur = []; pages.append(cur)
        m = re.search(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*)</word>', line)
        if m and cur is not None: cur.append([float(m.group(i)) for i in range(1, 5)] + [m.group(5)])
    return pages
def render(pdf, page, out):
    subprocess.run(['pdftoppm', '-r', '144', '-f', str(page), '-l', str(page), '-png', '-singlefile', pdf, out[:-4]], check=True); return out
def box_line(ws, first, last=None):
    # box from the word starting `first` to the end of its line (or to word `last`)
    a = next(w for w in ws if w[4] == first)
    line = [w for w in ws if abs(w[1] - a[1]) < 3]
    if last: line = [w for w in line if w[0] >= a[0] and w[2] <= next(z for z in line if z[4] == last)[2] + 1]
    x0 = min(w[0] for w in line); y0 = min(w[1] for w in line); x1 = max(w[2] for w in line); y1 = max(w[3] for w in line)
    return [int(2 * x0) - 8, int(2 * y0) - 6, int(2 * (x1 - x0)) + 16, int(2 * (y1 - y0)) + 12]
def box_block(ws, first, lastword):
    a = next(w for w in ws if w[4] == first); b = next(w for w in ws if w[4] == lastword and w[1] >= a[1])
    blk = [w for w in ws if a[1] - 1 <= w[1] <= b[3]] ; x0 = min(w[0] for w in blk); x1 = max(w[2] for w in blk)
    return [int(2 * x0) - 8, int(2 * a[1]) - 6, int(2 * (x1 - x0)) + 16, int(2 * (b[3] - a[1])) + 12]
def annotate(src, out, title, marks):
    args = []
    for (x, y, w, h), kind, cap in sorted(marks, key=lambda m: m[0][1]): args += ['--mark', '%d,%d,%d,%d:%s:%s' % (x, y, w, h, kind, cap)]
    r = subprocess.run(['python3', S + 'xtools/annotate_v2.py', src, out, '--title', title, '--scale', '2'] + args, capture_output=True, text=True); print(r.stdout.strip() or r.stderr[-300:])
    return out
made = {}
RE = 'Re-downloaded 11 Nov 2026 13:25 UTC on the same build; the money figures have moved since the morning test because the site\'s data changed during the day.'
# V1R-34 C1079007
p = words(F + 'V1R-34.pdf'); n = len(p)
a = annotate(render(F + 'V1R-34.pdf', 1, S + 'fresh/34p1.png'), OUT + 'C1079007-1-pdf-page-1.png', 'A/R Aging Summary PDF, page 1 (landscape). ' + RE,
    [(box_block(p[0], 'A/R', 'locations'), 'good', 'Report name, organization name, "As of Nov 11, 2026" and Locations.'),
     (box_line(p[0], 'Software'), 'good', '"Software Powered by ShopView" in the middle, "Page 1 of 7" on the right.')])
b = annotate(render(F + 'V1R-34.pdf', n, S + 'fresh/34pN.png'), OUT + 'C1079007-2-pdf-last-page.png', 'A/R Aging Summary PDF, last page (page %d of %d). ' % (n, n) + RE,
    [(box_line(p[-1], 'Totals'), 'good', 'The last row is Totals; empty buckets in the customer rows above are blank, not $0.00.')])
made['V1R-34'] = [a, b]
# V1R-83 C1095439
p = words(F + 'V1R-83.pdf')
made['V1R-83'] = [annotate(render(F + 'V1R-83.pdf', 1, S + 'fresh/83p1.png'), OUT + 'C1095439-2-pdf-heading-as-of-oct-15.png', 'A/R Aging Summary PDF downloaded with the date chip on 10/15/2026 (re-downloaded 11 Nov 2026 13:25 UTC, same build)',
    [(box_line(p[0], 'As'), 'good', '"As of Oct 15, 2026": the date picked, not the 16th, under the report and organization names.')])]
# V1R-91 C1095447
p = words(F + 'V1R-91.pdf'); n = len(p)
made['V1R-91'] = [annotate(render(F + 'V1R-91.pdf', 1, S + 'fresh/91p1.png'), OUT + 'C1095447-2-pdf-page-1-headings.png', 'A/P Aging Summary PDF, page 1 (re-downloaded 11 Nov 2026 13:25 UTC, same build)',
    [(box_line(p[0], 'Vendor'), 'good', 'Vendor, Location, Current, 1-30 Days, 31-60 Days, 61-90 Days, 91 And Over, Total - the same headings as the screen.')]),
    annotate(render(F + 'V1R-91.pdf', n, S + 'fresh/91pN.png'), OUT + 'C1095447-3-pdf-last-page-totals.png', 'A/P Aging Summary PDF, last page (page %d of %d). ' % (n, n) + RE,
    [(box_line(p[-1], 'Totals'), 'good', 'The last row is Totals.')])]
json.dump(made, open(S + 'pics-pdf.json', 'w'), indent=1)
