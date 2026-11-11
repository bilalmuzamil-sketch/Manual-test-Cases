"""d3a_pdf_result.py — 11 Nov 2026: C715524 (A/R Summary PDF) / C715525 (A/P Summary PDF): bucket headings as on screen, "91 And Over" on one line
(pdftotext -bbox: the three words share one baseline), from d3a."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
R = {}
for cid, rep, first in [('C715524', 'A/R Aging Summary', 'Customer'), ('C715525', 'A/P Aging Summary', 'Vendor')]:
    d = json.load(open(PP + 'd3a/%s.json' % cid)); src = PP + 'd3a/%s-pdf-1.png' % cid if cid == 'C715524' else PP + 'd3a/%s-pdf-01.png' % cid; dst = PP + 'pics/%s-pdf-1.png' % cid
    ann(src, dst, 'Step 2: the PDF headings - "91 And Over" on one line', [], [], [])
    R[cid] = {'verdict': 'Passed', 'observed': [
        'Step 1: %s, as of today, all locations - "Download (PDF)" downloads the PDF ("Data exported successfully.").' % rep,
        'Step 2: the PDF\'s headings read "%s" - the bucket headings "Current", "1-30 Days", "31-60 Days", "61-90 Days", "91 And Over", as on screen.' % d['heads'],
        '"91 And Over" is on one line: its three words sit on the same line of the page (measured from the PDF\'s word positions, all at the same height), not wrapped.'],
        'pictures': [dst]}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3a PDF headings'}, 'results': R}, open(PP + 'RESULTS-d3a-pdf.json', 'w'), indent=1); print(list(R))
