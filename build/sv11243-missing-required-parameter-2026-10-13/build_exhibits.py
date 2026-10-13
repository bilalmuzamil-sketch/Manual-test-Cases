"""SV-11243 reproduction exhibits — production app.shopview.com, build v26.40.17-f5bf8f4, 13 Oct 2026.
Raw captures (1600x1000 CSS, dpr 2) in ev/R-*.png; boxes are getBoundingClientRect() values (R.json)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev')
p = lambda n: os.path.join(EV, n)

a = panel(p('R-0-lines.png'), (300, 300, 1580, 520), '1. Work order S2-968, Lines tab: the part added from the Catalog',
          boxes=[(424, 342, 545, 374, BLU, 1), (1130, 345, 1232, 372, BLU, 2)],
          notes=[(1, BLU, 'Click the part number ZZ11243-920183 on this row.'),
                 (2, BLU, 'The row reads Auth To Order with an Order button: it was added from the Catalog, to be ordered from a vendor.')])
a.save(p('sv11243-01-lines-hd.png'))

b = panel(p('R-2-options.png'), (496, 250, 1104, 740), '2. The "Edit Part Request" pop-up, Part Number list open',
          boxes=[(521, 276, 680, 308, BLU, 1), (526, 377, 1074, 483, GRN, 2), (526, 483, 1074, 589, RED, 3)],
          notes=[(1, BLU, 'The pop-up is titled "Edit Part Request".'),
                 (2, GRN, 'Choose this option: the same part, marked "Inventory Qty".'),
                 (3, RED, 'This is the option the part was first added with ("Catalog").')])
b.save(p('sv11243-02-pick-inventory-hd.png'))

c = panel(p('R-3b-before-save.png'), (496, 187, 1104, 805), '3. After choosing the Inventory option, before saving',
          boxes=[(521, 212, 600, 245, BLU, 1), (977, 674, 1057, 714, BLU, 2), (963, 744, 1074, 780, BLU, 3)],
          notes=[(1, BLU, 'The title changes to "Edit Part" and an Inventory section appears.'),
                 (2, BLU, 'Type 1 in Amount.'),
                 (3, BLU, 'Click Save & Close.')])
c.save(p('sv11243-03-amount-1-hd.png'))

d = panel(p('R-4-after-save.png'), (496, 187, 1504, 1000), '4. After Save & Close: the error, and nothing is saved',
          boxes=[(1100, 937, 1500, 993, RED, 1), (496, 187, 1104, 805, RED, 2)],
          notes=[(1, RED, 'Red message: "Missing required parameter. Please try to resolve this."'),
                 (2, RED, 'The pop-up stays open. Closing it and reloading shows the part unchanged: still the Catalog part, Auth To Order.')])
d.save(p('sv11243-04-error-hd.png'))
for x in (a, b, c, d): print(x.size)
