"""SV-10072 exhibits. Captures at 1600x1000 CSS, dpr 2; boxes in CSS px from getBoundingClientRect."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, stack, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)
STOCK = (1210, 193, 1295, 224); INV = (220, 150, 1600, 250)

def run(env, label, pn, name, a, b, row, out):
    i1 = panel(p(f'{env}-before-inventory.png'), INV, f'{label}: Parts > Inventory, part {pn} ({name}) before',
               boxes=[(*STOCK, BLU, 1)], notes=[(1, BLU, f'{a} Available.')])
    i2 = panel(p(f'{env}-after-inventory.png'), INV, 'The same row after adding 2 of this part to a vendor return',
               boxes=[(*STOCK, GRN, 1)], notes=[(1, GRN, f'{b} Available: exactly 2 came off.')])
    h = panel(p(f'{env}-after-history.png'), (220, 140, 1600, row[3] + 6), 'Part History for the same part',
              boxes=[(*row, GRN, 1)], notes=[(1, GRN, f'"Returned qty 2 ... Qty: {a} -> {b} (-2)".')])
    stack([i1, i2, h]).save(p(out))

run('STG', 'Staging (build v26.40.17-ddb9ba1), 14 Oct 2026', '201.6215', 'WHEEL STUD', 11, 9, (335, 185, 1570, 241),
    'sv10072-01-staging-before-after-hd.png')
run('PROD', 'Production (build v26.40.17-f5bf8f4), 14 Oct 2026', '1238231', 'A445', 88, 86, (335, 185, 1570, 240),
    'sv10072-02-production-before-after-hd.png')

eight = panel(p('H-eight.png'), (220, 140, 1600, 388), 'Part History - 201.6215 WHEEL STUD (the old code would have taken 18,658,006)',
    boxes=[(335, 327, 1570, 382, GRN, 1), (335, 271, 1570, 327, GRN, 2), (335, 215, 1570, 271, GRN, 3)],
    notes=[(1, GRN, 'Sent 2 (as text): 16 -> 14.'), (2, GRN, 'Sent 3 (as a number): 14 -> 11.'), (3, GRN, 'Sent 2 again: 11 -> 9.')])
zero = panel(p('H-zero.png'), (220, 140, 1600, 277), 'Part History - MD668D ATF (the old code would have taken 19)',
    boxes=[(335, 215, 1570, 271, GRN, 1)], notes=[(1, GRN, 'Sent 2: 280 -> 278.')])
letter = panel(p('H-letter.png'), (220, 140, 1600, 307), 'Part History - ZLWMS-18 lockwasher (the old code would have taken nothing)',
    boxes=[(335, 246, 1570, 301, GRN, 1)], notes=[(1, GRN, 'Sent 2: 43 -> 41.')])
dec = panel(p('H-dec.png'), (220, 140, 1600, 277), 'Part History - SH550045136 engine oil (decimal quantity)',
    boxes=[(335, 215, 1570, 271, GRN, 1)], notes=[(1, GRN, 'Sent 1.5: 39.7 -> 38.2.')])
stack([eight, zero, letter, dec]).save(p('sv10072-03-part-history-hd.png'))
print('ok')
