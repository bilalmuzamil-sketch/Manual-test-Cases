"""Exhibits for the follow-up ticket: a paid work order can be deleted by a direct request. Production, build
v26.40.17-f5bf8f4, 14 Oct 2026. Raw captures 1600x1000 CSS, dpr 2; boxes in CSS px."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, stack, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)

before = panel(p('NT1-2-menu.png'), (0, 60, 1600, 1000),
    'Work order S2-973 after it was invoiced and paid - production, 14 Oct 2026',
    boxes=[(219, 100, 268, 126, BLU, 1), (1145, 88, 1282, 262, RED, 2), (1078, 928, 1308, 970, BLU, 3)],
    notes=[(1, BLU, 'The work order shows Paid.'),
           (2, RED, 'Its menu (the three dots left of Customer PO) has only Audit Log, Timesheets and Print Work Order. There is no Delete.'),
           (3, BLU, 'A $100.00 cheque payment is recorded against it; the balance is $0.00.')])
before.save(p('nt-01-paid-no-delete-hd.png'))

wo = panel(p('NT2-WorkOrdersi.png'), (0, 60, 1600, 360),
    'Same customer after the request was sent',
    boxes=[(334, 86, 416, 117, RED, 1), (800, 284, 1106, 314, RED, 1)],
    notes=[(1, RED, 'Work Orders tab: the paid work order S2-973 is gone.')])
pay = panel(p('NT2-Paymentsi.png'), (0, 60, 1600, 360),
    'Payments tab of the same customer',
    boxes=[(832, 86, 917, 117, BLU, 2), (344, 256, 1568, 290, BLU, 2)],
    notes=[(2, BLU, 'The $100.00 payment ZZ9055-NT1 is still here, now with no work order or invoice behind it.')])
toast = panel(p('NT1-3-after.png'), (900, 840, 1600, 1000),
    'Opening the work order link again',
    boxes=[(1100, 868, 1500, 990, RED, 3)],
    notes=[(3, RED, 'The app says "Not found".')])
stack([wo, pay, toast]).save(p('nt-02-after-delete-hd.png'))
