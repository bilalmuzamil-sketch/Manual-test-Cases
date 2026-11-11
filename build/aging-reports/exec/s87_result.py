"""s87_result.py — 11 Nov 2026: C715423 (A/R Detail: credit memo and deposit numbers plain text, nothing opens) from exec/s87/C715423.json. The
invoice in the same customer is the positive control (blue link). C715446 waits for p73 (a customer WITH a phone, to prove the PDF prints "Phone:")."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(cid, n, t, b): src = PP + 's87/' + n; dst = PP + 'pics/%s-%s' % (cid, n); ann(src, dst, t, [], [], b); return dst
CM = (762, 450, 135, 44); DEP = (762, 498, 135, 44); INV = (762, 546, 135, 44)
R = {'C715423': {'verdict': 'Passed', 'observed': [
    'A/R Aging Detail, as of today, only customer "ZZX Types P68" ticked, Current expanded: credit memo CM11315-4319 (-$30.00), deposit DEP11315-4719 (-$20.00) and invoice S11315-17898 ($90.00), all at Staging Heavy Duty - 9919 (my current location).',
    'Step 1: hovering CM11315-4319 - black text, no underline, the pointer stays an arrow (no hand): plain text, not a link.',
    'Step 2: clicking it - nothing opens: same page and address, no new tab, no window.',
    'Step 3: hovering DEP11315-4719 - black text, the pointer stays an arrow: plain text.',
    'Step 4: clicking it - nothing opens: same page and address, no new tab, no window.',
    'Check that the test could see a link: the invoice S11315-17898 in the same list is blue - a link - so the credit memo and deposit are plain by design, not because nothing on the page links.'],
    'pictures': [P('C715423', '03-C715423-1-2-credit-hover.png', 'Steps 1 and 3: credit memo and deposit numbers are plain black text; the invoice is a blue link', [CM + ('good', 'Credit memo: plain text'), DEP + ('good', 'Deposit: plain text'), INV + ('good', 'Invoice: link (for comparison)')]),
                 P('C715423', '04-C715423-1-2-credit-clicked.png', 'Step 2: after clicking the credit memo number - nothing opened, same page', [CM + ('good', 'Clicked - nothing opened')]),
                 P('C715423', '06-C715423-3-4-deposit-clicked.png', 'Step 4: after clicking the deposit number - nothing opened, same page', [DEP + ('good', 'Clicked - nothing opened')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s87 C715423'}, 'results': R}, open(PP + 'RESULTS-s87-a.json', 'w'), indent=1); print(list(R))
