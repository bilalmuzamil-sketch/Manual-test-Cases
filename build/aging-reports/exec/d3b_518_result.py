"""d3b_518_result.py — 11 Nov 2026: C715518 (A/P Detail: PDF too large + offline CSV messages) from d3b/C715518.json and pictures."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, d, n, t, b): src = PP + d + '/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
o = json.load(open(PP + 'd3b/C715518.json')); C = 'C715518'; T = (930, 800, 420, 95)
assert o['big']['notes'] == ['warning This report is too large for PDF. Export it as CSV, or narrow the filters, then try again. Close'] and not o['big']['file']
assert o['offline']['notes'] == ["warning We couldn't export this report. Please try again. Close"] and not o['offline']['file']
R = {C: {'verdict': 'Passed', 'observed': [
    'A/P Aging Detail, as of today, all locations, light theme, 1440 px.',
    'Step 1: "Download (PDF)" shows one red error message at the bottom right: "This report is too large for PDF. Export it as CSV, or narrow the filters, then try again." with Close; nothing downloads. It looks and sits the same as the same message on A/P Unpaid Invoices.',
    'Step 2: the network connection was switched off.',
    'Step 3: "Download (CSV)" shows one red error message in the same place: "We couldn\'t export this report. Please try again." with Close; nothing downloads.',
    'Step 4: the connection was switched back on.'],
    'pictures': [P(C, 'd3b', 'C715518-big-toast-3.png', 'Step 1: one error message - "This report is too large for PDF..."', [T + ('good', 'Exact wording, one message')]),
                 P(C, 'd3b', 'C715518-offline-toast-3.png', 'Step 3: offline - one error message "We couldn\'t export this report. Please try again."', [T + ('good', 'Exact wording, one message')]),
                 P(C, 'd3a', 'C715537-toast-3.png', 'For comparison: the same too-large message on A/P Unpaid Invoices - same look and place', [T + ('good', 'Same style and position')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, d3b C715518'}, 'results': R}, open(PP + 'RESULTS-d3b-518.json', 'w'), indent=1); print(list(R))
