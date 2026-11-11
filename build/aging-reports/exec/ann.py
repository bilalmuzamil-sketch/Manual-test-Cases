"""ann.py — 11 Nov 2026: annotate a 1x capture using boxes recorded by the probes ([text, x, y, w, h] lists). Each mark is
(regex, 'good'|'bad', sentence); the first box whose text matches the regex is marked (widest row match preferred for table rows).
Usage from python: from ann import ann; ann(src, out, title, boxes, [(re, kind, text), ...], extra=[(x,y,w,h,kind,text)])"""
import re, subprocess
TOOL = '/home/user/Manual-test-Cases/build/testing-tools/annotate_v2.py'
def ann(src, out, title, boxes, marks, extra=()):
    args = ['python3.12', TOOL, src, out, '--title', title, '--scale', '1']
    for rx, kind, text in marks:
        hits = [b for b in boxes if re.search(rx, b[0])]
        if not hits: raise SystemExit('no box for %r in %s' % (rx, src))
        b = max(hits, key=lambda b: b[3]) if len(hits) > 1 else hits[0]
        args += ['--mark', '%d,%d,%d,%d:%s:%s' % (b[1], b[2], b[3], b[4], kind, text)]
    for x, y, w, h, kind, text in extra: args += ['--mark', '%d,%d,%d,%d:%s:%s' % (x, y, w, h, kind, text)]
    r = subprocess.run(args, capture_output=True, text=True); print(r.stdout.strip() or r.stderr[-400:]); return out
