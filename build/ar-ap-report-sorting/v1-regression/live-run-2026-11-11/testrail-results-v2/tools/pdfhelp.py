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
