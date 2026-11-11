"""p77b_result.py — 11 Nov 2026: C715537 (the PDF-too-large message matches the design picture "PDF over 2,000 rows is refused"; Close closes it).
Step 1 from d3a (C715537-toast-3, message fully shown) + p77b (one message, exact text, no download, Totals unchanged); step 2 from p77b (Close clicked
by the message's own button; picture after shows no message)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, path, t, b): src = PP + path; dst = PP + 'pics/%s-%s' % (cid, path.replace('/', '-')); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'p77b/out.json')); C = 'C715537'
assert o['count'] == 1 and o['text'] == 'warning This report is too large for PDF. Export it as CSV, or narrow the filters, then try again. Close' and o['btns'] == ['Close'] and o['download'] is None and o['t0'] == o['t1']
T = (930, 790, 420, 100)
R = {C: {'verdict': 'Passed', 'observed': [
    'A/P Unpaid Invoices, as of today, all vendors and all locations (about 13,900 lines - over the PDF limit); compared with the design picture "PDF over 2,000 rows is refused".',
    'Step 1: "Download (PDF)" shows one message at the bottom right and nothing downloads: a solid red box with a white warning triangle at the left, white text and a white "Close" at the right, no title line - as in the picture. It reads "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." The report behind it does not change (Totals $4,764,225.51 / $4,763,345.55 before and after).',
    'Step 2: clicking "Close" closes the message.'],
    'pictures': [P(C, 'design-pics/ar-ap-p2-pdf-over-2-000-rows-is-refused.png', 'The design picture', [T + ('good', 'Design')]),
                 P(C, 'd3a/C715537-toast-3.png', 'Step 1: the same red message at the bottom right, exact wording, no title', [T + ('good', 'As designed')]),
                 P(C, 'p77b/02-2-closed.png', 'Step 2: after "Close" the message is gone; the report is unchanged', [T + ('good', 'Closed')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3a + p77b C715537'}, 'results': R}, open(PP + 'RESULTS-p77b.json', 'w'), indent=1); print(list(R))
