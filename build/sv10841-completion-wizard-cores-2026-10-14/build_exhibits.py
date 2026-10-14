"""SV-10841 exhibits. Raw captures at 1600x1000 CSS, dpr 2; boxes in CSS px (getBoundingClientRect where saved,
otherwise measured from the pixels: displayed px / 1.25)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, stack, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)
DLG = (366, 0, 1192, 0)

# 1. BEFORE (production) vs AFTER (QA branch): same set-up, one part received 1 + 2 on two vendor invoices
before = panel(p('PR1-cores0.png'), (366, 250, 1192, 745),
    'BEFORE - production (build v26.40.17-f5bf8f4), 14 Oct 2026',
    boxes=[(433, 410, 1166, 452, BLU, 1), (434, 506, 1166, 606, RED, 2)],
    notes=[(1, BLU, 'Work order S2-976: a part with a $25.00 core, quantity 3, received 1 on one vendor invoice and 2 on a second. Clicking Complete opens Resolve cores: "0 / 1 resolved".'),
           (2, RED, 'Only ONE core is listed ("Core $25.00", no invoice number). The other delivery\'s core is never asked about.')])
after = panel(p('S1-cores0.png'), (366, 197, 1192, 795),
    'AFTER - QA branch sv10841 (build v26.40.17-c177759), 14 Oct 2026',
    boxes=[(433, 359, 1166, 401, BLU, 1), (434, 454, 1166, 556, GRN, 2), (434, 557, 1166, 659, GRN, 3)],
    notes=[(1, BLU, 'Same set-up on work order S10841-17580 (received 1 on ZZ10841-A1, then 2 on ZZ10841-A2): "0 / 2 resolved".'),
           (2, GRN, 'Delivery ZZ10841-A2: "Core $50.00" with "2 x $25.00" in the subtitle.'),
           (3, GRN, 'Delivery ZZ10841-A1: "Core $25.00". Each row names its own vendor invoice number.')])
stack([before, after]).save(p('sv10841-01-before-after-hd.png'))

# 2. decisions + total, then what was billed
dec = panel(p('S1-decided.png'), (366, 194, 1192, 798),
    'QA branch: one row OK, the other Not OK',
    boxes=[(434, 451, 1166, 556, RED, 1), (434, 557, 1166, 662, GRN, 2), (433, 356, 1166, 398, BLU, 3)],
    notes=[(1, RED, 'ZZ10841-A2 marked "Not OK - Keep + Charge": note reads "added to invoice".'),
           (2, GRN, 'ZZ10841-A1 marked "OK - Returned": note reads "no charge".'),
           (3, BLU, '"2 / 2 resolved" and "+$50.00 to invoice".')])
billed = panel(p('S1-lines-after.png'), (30, 95, 1576, 475),
    'After Complete All Lines - Lines tab of S10841-17580',
    boxes=[(206, 101, 267, 125, BLU, 1, 'right'), (420, 339, 1564, 367, GRN, 2), (420, 409, 1564, 437, RED, 3)],
    notes=[(1, BLU, 'The work order moved to Review.'),
           (2, GRN, 'The OK core (quantity 1) shows "Returned" and is not billed.'),
           (3, RED, 'The Not OK core (quantity 2) is billed $25.00 x 2 = $50, the same as the wizard total.')])
stack([dec, billed]).save(p('sv10841-02-decide-and-bill-hd.png'))

# 3. three deliveries
three = panel(p('S4-lines-after.png'), (30, 95, 1576, 560),
    'QA branch: one part received in three deliveries (1 + 1 + 3, $10.00 core), all three Not OK',
    boxes=[(206, 101, 267, 125, BLU, 1, 'right'), (420, 373, 1564, 401, RED, 2), (420, 444, 1564, 472, RED, 3), (420, 515, 1564, 543, RED, 4)],
    notes=[(1, BLU, 'S10841-17583: the wizard listed three rows (ZZ10841-D1 $10.00, ZZ10841-D2 $10.00, ZZ10841-D3 "3 x $10.00" $30.00) and read "+$50.00 to invoice". After finishing the work order is in Review.'),
           (2, RED, 'Core from delivery D1 billed $10.'), (3, RED, 'Core from delivery D2 billed $10.'),
           (4, RED, 'Core from delivery D3 billed $10.00 x 3 = $30. Total $50, matching the wizard.')])
three.save(p('sv10841-03-three-deliveries-hd.png'))

# 4. special order partly received
so = panel(p('S8-decided.png'), (366, 89, 1192, 903),
    'QA branch: special order of 5 ($3.00 core), received 1 + 2, 2 still owed, all Not OK',
    boxes=[(434, 399, 1166, 504, BLU, 1), (434, 504, 1166, 609, BLU, 2), (434, 662, 1166, 767, GRN, 3), (1035, 312, 1158, 336, BLU, 4)],
    notes=[(1, BLU, 'Received on ZZ10841-H2: "2 x $3.00", Core $6.00.'), (2, BLU, 'Received on ZZ10841-H1: Core $3.00.'),
           (3, GRN, 'Special order cores: the pending row is priced for the 2 owed units only, "2 x $3.00" = $6.00 (not 5 x $3.00).'),
           (4, BLU, '"3 / 3 resolved" and "+$15.00 to invoice".')])
sofin = panel(p('S8-final-lines.png'), (30, 95, 1576, 560),
    'After receiving the 2 owed units (ZZ10841-H3) - Lines tab of S10841-17587',
    boxes=[(206, 101, 267, 125, BLU, 1, 'right'), (420, 373, 1564, 401, RED, 2), (420, 444, 1564, 472, RED, 3), (420, 515, 1564, 543, RED, 4)],
    notes=[(1, BLU, 'The work order completed to Review without asking about the cores again.'),
           (2, RED, 'Core billed $6.'), (3, RED, 'Core billed $3.'), (4, RED, 'Core billed $6. Total $15, matching the wizard.')])
stack([so, sofin]).save(p('sv10841-04-special-order-hd.png'))

# 5. back to Resolve cores keeps each decision
back = panel(p('S8-back.png'), (366, 274, 1192, 718),
    'QA branch: Save Core Decisions, then back to Resolve cores',
    boxes=[(433, 380, 553, 407, BLU, 1), (434, 432, 1166, 634, GRN, 2)],
    notes=[(1, BLU, 'From the Receive parts step, the "Resolve cores" step button was clicked.'),
           (2, GRN, 'All three cores are still there, once each, with their own subtitle, amount and "Not OK - keep + charge".')])
back.save(p('sv10841-05-back-keeps-decisions-hd.png'))

# 6. decided before pick
pre = panel(p('S9b-p2-okbeforepick.png'), (366, 222, 1192, 770),
    'QA branch: inventory part P550848 ($7.00 core, qty 2) not picked yet - OK chosen first',
    boxes=[(433, 326, 1025, 354, BLU, 1), (434, 530, 1166, 635, GRN, 2)],
    notes=[(1, BLU, '"Pick parts" is not done yet; the "Resolve cores" step was opened first.'),
           (2, GRN, 'Marked "OK - Returned": "no charge", "1 / 1 resolved".')])
post = panel(p('S9b-p4-afterpick.png'), (366, 222, 1192, 770),
    'Same work order after Pick All',
    boxes=[(433, 326, 1025, 354, BLU, 1), (434, 530, 1166, 635, GRN, 2)],
    notes=[(1, BLU, '"Pick parts" now has a tick.'),
           (2, GRN, 'The OK decision is still selected on the picked core and the step does not ask again. After finishing, the core shows "Returned" on the Lines tab and the work order is in Review (S10841-17589).')])
stack([pre, post]).save(p('sv10841-06-decided-before-pick-hd.png'))

# 7. one delivery left undecided is still asked
c3 = panel(p('S11-markreviewed.png'), (30, 95, 1192, 790),
    'QA branch: cores left undecided, then Mark Reviewed',
    boxes=[(206, 101, 267, 125, BLU, 1, 'right'), (433, 366, 1166, 410, BLU, 2), (434, 462, 1166, 564, GRN, 3), (434, 564, 1166, 666, GRN, 4)],
    notes=[(1, BLU, 'S10841-17593 was completed with "Continue Without Resolving" and is in Review.'),
           (2, BLU, 'Mark Reviewed opens Resolve cores: "0 / 2 resolved".'),
           (3, GRN, 'Delivery ZZ10841-K1 ($25.00) is listed.'), (4, GRN, 'Delivery ZZ10841-K2 ($50.00) is listed too - neither hides the other.')])
c3.save(p('sv10841-07-undecided-still-listed-hd.png'))
print('ok')
