"""SV-9055 exhibits. Raw captures at 1600x1000 CSS, dpr 2; boxes in CSS px (getBoundingClientRect, or measured
from the pixels for FINAL-AFT-0 whose capture did not save its geometry)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'testing-tools'))
from ticket_exhibit import panel, stack, RED, GRN, BLU
EV = os.path.join(os.path.dirname(__file__), 'ev'); p = lambda n: os.path.join(EV, n)

before = panel(p('PR3-3-confirm-1.png'), (0, 60, 1600, 1000),
    'BEFORE - production (build v26.40.17-f5bf8f4), 14 Oct 2026',
    boxes=[(40, 88, 235, 145, BLU, 1), (1098, 911, 1502, 992, RED, 2)],
    notes=[(1, BLU, 'A customer whose only history is a payment that was reversed and an invoice that was reversed. Its work order, asset and contact were deleted.'),
           (2, RED, 'Delete -> red message "You cant delete company with existing transactions". The customer stays.')])
after = panel(p('FINAL-AFT-4-search-gone.png'), (0, 60, 1600, 450),
    'AFTER - QA branch sv9055 (build v26.40.17-f88c11c), 14 Oct 2026',
    boxes=[(1150, 77, 1370, 117, BLU, 1), (630, 290, 975, 420, GRN, 2)],
    notes=[(1, BLU, 'Same steps on a new customer (ZZAUTOTEST SV9055 AFTER-2 70540): Delete went through and opened the Customers list. Its name was then typed into Search.'),
           (2, GRN, '"No customers match the search": the customer is gone.')])
stack([before, after]).save(p('sv9055-01-before-after-hd.png'))

empty = panel(p('FINAL-AFT-0-invoices-empty.png'), (0, 60, 1600, 340),
    'QA branch: the customer just before Delete',
    boxes=[(28, 75, 290, 234, BLU, 1), (1014, 141, 1131, 186, BLU, 2), (744, 146, 880, 179, GRN, 3), (790, 284, 1112, 316, GRN, 4)],
    notes=[(1, BLU, 'Contacts 0, Assets 0.'), (2, BLU, 'Invoices tab with "Open only" switched off, so every invoice would show.'),
           (3, GRN, 'Balance $0.00.'), (4, GRN, 'Nothing is listed: the reversed invoice does not show here.')])
empty.save(p('sv9055-02-customer-empty-hd.png'))

blocked = panel(p('B2-1b-disabled-tooltip.png'), (0, 60, 1600, 1000),
    'QA branch: a customer with a paid work order is still blocked',
    boxes=[(335, 255, 495, 288, BLU, 1), (690, 911, 882, 955, RED, 2), (376, 960, 1196, 1000, RED, 3)],
    notes=[(1, BLU, 'Customer ZZAUTOTEST SV9055 B2 paid 16650 has a paid work order.'),
           (2, RED, 'In its Edit Customer pop-up the Delete button is greyed out.'),
           (3, RED, 'Hovering it explains why. Production shows the same button and the same text.')])
blocked.save(p('sv9055-03-still-blocked-hd.png'))

msg = panel(p('X2-3-confirm-1.png'), (0, 60, 1600, 1000),
    'QA branch: the message when something active is still on the account',
    boxes=[(40, 88, 235, 168, BLU, 1), (1098, 911, 1502, 992, RED, 2)],
    notes=[(1, BLU, 'Customer ZZAUTOTEST SV9055 X2 paid-invoice-reversed-only 97639 still has a cheque payment on its account that was never reversed.'),
           (2, RED, 'Delete -> "You cant delete company with existing transactions". It does not say what is blocking.')])
msg.save(p('sv9055-04-message-unchanged-hd.png'))
for n in ['01-before-after','02-customer-empty','03-still-blocked','04-message-unchanged']:
    from PIL import Image; im=Image.open(p(f'sv9055-{n}-hd.png')); print(n, im.size)
