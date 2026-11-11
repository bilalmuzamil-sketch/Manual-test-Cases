"""s84c_result.py — 11 Nov 2026: C715389 (A/R Detail: each row belongs to its own document's location) from exec/s84/C715389.json (s84c run 15:38)."""
import json
from ann import ann
PP = '/home/user/Manual-test-Cases/build/aging-reports/exec/'
def P(n, t, b=()): src = PP + 's84/' + n; dst = PP + 'pics/C715389-%s' % n; ann(src, dst, t, [], [], list(b)); return dst
CH = (278, 116, 1132, 36); ROWS = (278, 209, 1132, 400)
R = {'C715389': {'verdict': 'Passed', 'observed': [
    'A/R Aging Detail, as of today, only the new customer "ZZX Own Loc P68" ticked, every bucket open: invoice S11315-17896 ($500.00, made at Staging Heavy Duty - 9919, $200.00 paid by a payment taken at Staging Lethbridge - 4310), credit memo CM11315-4318 (-$40.00, Lethbridge) and deposit DEP11315-4717 (-$25.00, Lethbridge).',
    'Step 1: the Location column reads "Staging Heavy Duty - 9919" for the invoice and "Staging Lethbridge - 4310" for the credit memo and the deposit.',
    'Step 2: unticking Lethbridge (and the site\'s third test location) - the chip reads "Location: Staging Heavy D..." and the Location column is hidden (headings: Date, Transaction Type, ID, Customer Full Name, Due Date, Amount, Open Balance).',
    'Step 3: only the invoice remains, Open Balance $300.00 ($500.00 - $200.00); Totals $500.00 / $300.00 - the payment taken at Lethbridge does not move it.',
    'Steps 4-5: the Location menu opens; Lethbridge is ticked again ("2 selected").',
    'Step 6: Heavy Duty unticked - "1 selected", the chip reads "Location: Staging Lethbri...".',
    'Step 7: only the credit memo (-$40.00) and the deposit (-$25.00) remain; Totals -$65.00.'],
    'pictures': [P('01-C715389-1-both.png', 'Step 1: the invoice shows Heavy Duty; the credit memo and the deposit show Lethbridge', [ROWS + ('good', 'Each row shows its own document\'s location')]),
                 P('02-C715389-2-3-location-A.png', 'Steps 2-3: Heavy Duty only - Location column hidden, only the invoice, open balance $300.00', [CH + ('good', 'Location: Staging Heavy D...'), ROWS + ('good', 'Invoice only, $300.00')]),
                 P('03-C715389-4-menu.png', 'Step 4: the Location menu opens'),
                 P('04-C715389-5-B-ticked.png', 'Step 5: Lethbridge ticked again'),
                 P('05-C715389-6-location-B.png', 'Step 6: Heavy Duty unticked - Lethbridge only', [CH + ('good', 'Location: Staging Lethbri...')]),
                 P('06-C715389-7-rows.png', 'Step 7: only the credit memo and the deposit remain', [ROWS + ('good', 'Credit memo -$40.00, deposit -$25.00')])]}}
json.dump({'pass_meta': {'note': '11 Nov 2026, run 557, s84c C715389'}, 'results': R}, open(PP + 'RESULTS-s84c.json', 'w'), indent=1); print(list(R))
