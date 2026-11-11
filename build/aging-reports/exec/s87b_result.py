"""s87b_result.py — 11 Nov 2026: C715446 (A/R Collection: a customer with no phone shows no "Phone:" label, screen and PDF), with p73 as the
positive control (a customer WITH a phone gets "Phone: …" on the screen and in the same PDF route)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(f, t, b=()): dst = PP + 'pics/C715446-' + f.replace('/', '-'); ann(PP + f, dst, t, [], [], list(b)); return dst
R = {'C715446': {'verdict': 'Passed', 'observed': [
    'A/R Aging Collection, as of today, only customer "ZZAUTOTEST S1R5 Alpha" ticked - its customer card has no phone number.',
    'Step 1: the group row reads "ZZAUTOTEST S1R5 Alpha (4)  Credit term: COD  Total $1,334.30 $1,334.30" - no "Phone:" label at all.',
    'Step 2: "Download (PDF)" - the PDF downloads ("Data exported successfully.").',
    'Step 3: the customer\'s line in the PDF reads "ZZAUTOTEST S1R5 Alpha   Credit term: COD" - no "Phone:" label.',
    'Check that the PDF would show a phone when there is one: the same steps for "Andrews\' Truck & Trailer Repair LLC" (phone 343-203-3967) give "Phone: 343-203-3967" on its group row and "Andrews\' Truck & Trailer Repair LLC   Phone: 343-203-3967   Credit term: Net 30" in the PDF.'],
    'pictures': [P('s87/01-C715446-1-row.png', 'Step 1: no "Phone:" on the group row of a customer without a phone', [(278, 209, 1132, 48, 'good', 'Name and Credit term only')]),
                 P('s87/C715446-pdf-1.png', 'Step 3: the PDF line - no "Phone:" label'),
                 P('p73/ctl-pdf-1.png', 'For comparison: a customer WITH a phone - the PDF prints "Phone: 343-203-3967"')]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, C715446 with p73 control'}, 'results': R}, open(PP + 'RESULTS-s87b.json', 'w'), indent=1); print(list(R))
