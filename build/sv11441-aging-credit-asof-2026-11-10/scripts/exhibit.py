import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
X0,X1=275,1575
a=panel('ev/prod/ar-collection-alpha.png',crop=(X0,140,X1,615),
  title='BEFORE - production (build v26.45.3-fc08f23), 10 Nov 2026: A/R Aging Collection, date 2026-11-10',
  boxes=[(278,516,X1-5,564,RED,1)],
  notes=[(1,RED,'Credit memo CM2-4410, made today (10 Nov), shows Past Due 1 and the type "Credit".')])
b=panel('ev/br-ar-collection/screen.png',crop=(X0,160,X1,430),
  title='AFTER - QA branch sv11315 (build v26.45.2-6a8b89c), 10 Nov 2026: A/R Aging Collection, As of 11/10/2026',
  boxes=[(278,353,X1-5,401,GRN,1),(278,305,X1-5,353,GRN,2)],
  notes=[(1,GRN,'Credit memo CM11315-4190, made today, shows its own date as Due Date and Past Due 0.'),
         (2,GRN,'Credit memo CM11315-4191, dated yesterday (9 Nov), shows Past Due 1, as before.')])
stack([a,b]).save('ev/exhibits/01-before-after-ar-collection.png')
c=panel('ev/br-ar-detail-3160/screen.png',crop=(X0,60,X1,600),
  title='AFTER - sv11315: A/R Aging Detail, As of 11/10/2026, Past due 31-60 ticked',
  boxes=[(278,449,X1-5,545,GRN,1)],
  notes=[(1,GRN,'Today\'s credit memo CM11315-4190 and today\'s unused deposit DEP11315-4705 are in Current, and stay listed with a Past due range ticked.')])
d=panel('ev/br-ap-detail-abadi/screen.png',crop=(X0,60,X1,600),
  title='AFTER - sv11315: A/P Aging Detail, As of 11/10/2026, Vendor: Abadi\'s Diesel Repair',
  boxes=[(278,449,X1-5,545,GRN,1)],
  notes=[(1,GRN,'Vendor credits C-13665 and C-13666, made today, are in Current with Past Due 0. On production a vendor credit made today (C-18194) sits in 1-30 days past due with Past Due 1.')])
stack([c,d]).save('ev/exhibits/02-after-ar-ap-detail.png')
