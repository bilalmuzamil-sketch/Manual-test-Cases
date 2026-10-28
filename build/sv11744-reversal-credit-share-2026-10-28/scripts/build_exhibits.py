# SV-11744 exhibits (scale=1: screenshots are 1900x1100 CSS px). Coordinates read off the captured screens.
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
T='/tmp/s11744/'; O='ev/'
C=(380,140,1900,435)
# 1 BEFORE vs AFTER (same shape: cash on the first invoice, one credit-memo payment for the rest of both, then reversed)
b=panel(T+'prod-P4/newpay-result.png',C,'BEFORE - production (v26.43.2-537378f), 28 Oct 2026, after reversing the credit-memo payment',
  [(1600,308,1752,332,RED,1,'right'),(1595,357,1752,381,RED,2,'right'),(1625,198,1898,247,RED,3)],
  [(1,RED,'S2-1772 shows a $0.00 balance but is still "Partially Paid". Its $118.00 credit share was never given back.'),
   (2,RED,'S2-1771 owes $147.95. It should owe $29.95 ($149.95 less the $120.00 cash). It took the other invoice\'s share.'),
   (3,RED,'With both open invoices selected, New Payment is greyed out: "Payments cannot be made on a Paid invoice."')],scale=1)
a=panel(T+'branch-S4/newpay-ticked.png',C,'AFTER - QA branch sv11744 (v26.43.2-b517d96, PR head deedf48), 28 Oct 2026, same steps',
  [(1600,308,1752,332,GRN,1,'right'),(1595,357,1752,381,GRN,2,'right'),(1717,148,1865,183,GRN,3,'below'),(1525,260,1752,284,GRN,4,'right')],
  [(1,GRN,'S11744-17587 owes its full $52.20 again and shows "Unpaid".'),
   (2,GRN,'S11744-17586 owes $247.96 ($347.96 less the $100.00 cash, which still counts) and shows "Partially Paid".'),
   (3,GRN,'With both selected, New Payment is available and opens (next picture).'),
   (4,GRN,'The credit memo has all $400.00 available again ("Unapplied").')],scale=1)
stack([b,a]).save(O+'01-before-vs-after.png')
# 2 New Payment opens on the branch
panel(T+'branch-S4/newpay-result.png',(350,330,1552,765),'After the reversal: Open only on, both invoices selected, New Payment clicked (branch)',
  [(662,462,1532,610,GRN,1)],[(1,GRN,'The New Customer Payment window opens with both invoices at their correct balances, $247.96 and $52.20. Nothing is refused.')],scale=1).save(O+'02-new-payment-opens.png')
# 3 checklist 2: one payment with cash and credit together
p1=panel(T+'branch-S5/3-cashcredit-paid-payments.png',(380,140,1900,380),'Checklist 2 - one payment: $100.16 cash + $300.00 credit memo over two invoices',
  [(1640,200,1810,224,BLU,1),(1640,344,1810,368,BLU,2)],[(1,BLU,'The payment: $100.16 cash, both invoices Paid.'),(2,BLU,'The same payment used credit memo CM-4190 for $300.00.')],scale=1)
p2=panel(T+'branch-S5/4-cashcredit-reversed-invoices-all.png',C,'After reversing that payment (branch)',
  [(1540,260,1752,284,GRN,1,'right'),(1610,308,1752,332,GRN,2,'right'),(1610,357,1752,381,GRN,3,'right')],
  [(1,GRN,'The credit memo has its $300.00 back.'),(2,GRN,'S11744-17589 owes $52.20, Unpaid.'),(3,GRN,'S11744-17588 owes $347.96, Unpaid. The $100.16 cash is gone from the account (the payment is no longer listed).')],scale=1)
stack([p1,p2]).save(O+'03-cash-and-credit-reversed.png')
# 4 checklist 3: cash-only reversal, deposit reversal
q1=panel(T+'branch-S5/6-cash-reversed-invoices-all.png',C,'Checklist 3a - a cash-only payment of $347.96 on S11744-17588, then reversed (branch)',
  [(1610,357,1752,381,GRN,1,'right')],[(1,GRN,'S11744-17588 owes its full $347.96 again and shows "Unpaid". Its work order is back to "Invoiced".')],scale=1)
q2=panel(T+'branch-S5/7-deposit-paid-payments.png',(380,140,1900,380),'Checklist 3b - one payment using the customer\'s $387.80 leftover deposit + $12.36 cash',
  [(1640,200,1810,224,BLU,1),(1640,344,1810,368,BLU,2)],[(1,BLU,'The payment: $12.36 cash, both invoices Paid.'),(2,BLU,'It used deposit DEP11744-4705 for $387.80.')],scale=1)
q3=panel(T+'branch-S5/9-deposits-after-reverse.png',(380,80,1900,240),'After reversing that payment: Deposits tab (branch)',
  [(1150,200,1405,224,GRN,1)],[(1,GRN,'DEP-4705 is back: $387.80 open balance, "Held". Both invoices owe their full amounts again ($347.96 and $52.20, Unpaid).')],scale=1)
stack([q1,q2,q3]).save(O+'04-cash-only-and-deposit-reversed.png')
# 5 the reported shape with three invoices (credit paid part of one, a later payment paid the rest)
panel(T+'branch-S6/3-credit-reversed-invoices-all.png',(380,140,1900,440),'The reported shape, three invoices: $100 cash on S11744-17591, then one credit payment ($400.16) for the rest of 17591, all of 17592 and $100 of 17593, then $160.98 cash for the rest of 17593. The credit payment is reversed (branch).',
  [(1525,260,1752,284,GRN,1,'right'),(1595,308,1752,332,GRN,2,'right'),(1600,357,1752,381,GRN,3,'right'),(1595,405,1752,429,GRN,4,'right')],
  [(1,GRN,'The credit memo has all $400.16 back.'),(2,GRN,'S11744-17593 owes $100.00, exactly its credit share. The later $160.98 cash still counts. Partially Paid.'),
   (3,GRN,'S11744-17592 owes $52.20, Unpaid.'),(4,GRN,'S11744-17591 owes $247.96. The first $100.00 cash still counts. Partially Paid.')],scale=1).save(O+'05-three-invoices-reported-shape.png')
print('ok')
