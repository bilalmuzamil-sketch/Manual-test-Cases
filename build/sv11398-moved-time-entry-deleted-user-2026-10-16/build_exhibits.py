"""SV-11398 exhibits. Captures at 1600x1000 CSS, dpr 2; boxes in CSS px (displayed/1.25)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, stack, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)
W = (25, 85, 1576, 520)

b = panel(p('m7-old-S2-35973.png'), (25, 85, 1576, 560), 'BEFORE - S2-35973: entry moved from line 1 to line 2 on staging build v26.40.17-a5c4210 (15 Oct 2026)',
    boxes=[(416, 478, 530, 510, BLU, 2), (416, 512, 520, 538, RED, 1)],
    notes=[(2, BLU, 'Esther Howard, whose time was moved here.'), (1, RED, 'An extra "Deleted user" entry. Nobody on this work order was deleted. (This row was made before the fix and is still there today.)')])
a = panel(p('m5r-6-after-move-reload.png'), W, 'AFTER - S2-36626: the same steps on staging build v26.40.19-edc8195 (16 Oct 2026), page reloaded',
    boxes=[(416, 478, 530, 510, GRN, 1), (416, 278, 516, 304, BLU, 2)],
    notes=[(1, GRN, 'Line 2 Labor lists only Tech ShopView, the technician whose time was moved. No "Deleted user".'),
           (2, BLU, 'Line 1 goes back to Unassigned.')])
stack([b, a]).save(p('sv11398-01-before-after-hd.png'))

s1 = panel(p('m5r-4-admin-before-move.png'), W, 'Step 1 - Tech ShopView clocked in and out on line 1 (S2-36626)',
    boxes=[(416, 278, 530, 304, BLU, 1), (416, 478, 516, 510, BLU, 2)],
    notes=[(1, BLU, 'Line 1 Labor: Tech ShopView (0.02 h).'), (2, BLU, 'Line 2 Labor: Unassigned.')])
s2 = panel(p('m5r-5-editdialog.png'), (300, 190, 1420, 700), 'Step 2 - three-dots button > Timesheets > pencil on the row > Edit Timesheet',
    boxes=[(312, 248, 1416, 276, BLU, 1), (521, 494, 1078, 533, BLU, 2), (1013, 630, 1074, 666, GRN, 3, 'right')],
    notes=[(1, BLU, "Tech ShopView's entry, on line 1."), (2, BLU, 'Line changed to 2 Replace - Suspension Air Bag.'), (3, GRN, 'Save.')])
stack([s1, s2]).save(p('sv11398-02-steps-hd.png'))

m3 = panel(p('m3-1-after-reload.png'), W, 'Row 4 - S2-36623: the technician already had time on line 2, then line 1\'s entry was moved there',
    boxes=[(416, 478, 545, 510, GRN, 1), (416, 278, 516, 304, BLU, 2)],
    notes=[(1, GRN, 'Line 2 still shows one Admin ShopView row (0.05 h + 0.02 h = 0.07 h). No second row, no "Deleted user".'), (2, BLU, 'Line 1 back to Unassigned.')])
m6 = panel(p('m6-2-wo-after-reload.png'), W, 'Row 6 - S2-36625: entry moved from Reports > Timesheet Activities (line 2 back to line 1)',
    boxes=[(416, 278, 530, 304, GRN, 1), (416, 478, 516, 510, BLU, 2)],
    notes=[(1, GRN, 'Line 1 lists only Tech ShopView.'), (2, BLU, 'Line 2 back to Unassigned. No "Deleted user".')])
stack([m3, m6]).save(p('sv11398-03-other-checks-hd.png'))
print('ok')
