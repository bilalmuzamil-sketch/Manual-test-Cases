"""SV-11071 exhibits. Captures at 1600x1000 CSS, dpr 2; boxes in CSS px (measured from the pixels: displayed/1.25)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, stack, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)

b1 = panel(p('P-M2-2-after-save.png'), (240, 70, 1100, 915), 'BEFORE - production (v26.40.17-f5bf8f4): Save on a vendor that already exists',
    boxes=[(250, 185, 820, 280, RED, 1), (250, 857, 1090, 903, RED, 2)],
    notes=[(1, RED, 'The list is in no particular order.'), (2, RED, 'After Save the window just closes: no message, and the second "ZZAUTOTEST Xtreme Driveline 11071" is added at the end.')])
b2 = panel(p('prod-search-xtreme.png'), (240, 70, 1600, 300), 'Production: searching the name finds two identical vendors',
    boxes=[(250, 185, 1570, 281, RED, 1)], notes=[(1, RED, 'Same name, same address, saved twice.')])
a1 = panel(p('V1-new-2-after-save.png'), (1040, 900, 1560, 1000), 'QA branch: Save on a new vendor',
    boxes=[(1100, 932, 1500, 990, GRN, 1)], notes=[(1, GRN, '"Vendor "ZZAUTOTEST Xtreme Driveline 11071" created" and the vendor\'s page opens.')])
a2 = panel(p('M2-exact-2-after-save.png'), (400, 140, 1600, 995), 'AFTER - QA branch sv11071 (v26.40.17-5d3a257): Save the same vendor again',
    boxes=[(425, 178, 1175, 218, BLU, 1), (425, 234, 1175, 386, BLU, 2), (1100, 913, 1500, 990, GRN, 3)],
    notes=[(1, BLU, 'Same name.'), (2, BLU, 'Same address (12 Test Road, Calgary, T2P 1A1).'),
           (3, GRN, 'Refused: "A vendor with this name and address already exists." Nothing is created.')])
stack([b1, b2]).save(p('sv11071-01-before-production-hd.png'))
stack([a2, a1]).save(p('sv11071-02-after-branch-hd.png'))

w = panel(p('M5-warn-cancel-2-after-save.png'), (400, 140, 1600, 760), 'QA branch: same name, different postal code (T3A 0B1)',
    boxes=[(496, 395, 1104, 596, GRN, 1)], notes=[(1, GRN, '"A vendor named ... already exists. Create another one?" Cancel creates nothing; Create saves it.')])
l = panel(p('M13-branch-after-reset-list.png'), (240, 70, 1600, 520), 'QA branch: the Vendors list with no sort chosen',
    boxes=[(250, 185, 820, 505, GRN, 1)], notes=[(1, GRN, 'Name A to Z. All 1,046 vendors checked: none out of order, and each page continues the last.')])
stack([w, l]).save(p('sv11071-03-warning-and-order-hd.png'))
print('ok')
