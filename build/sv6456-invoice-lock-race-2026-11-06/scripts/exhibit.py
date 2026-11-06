import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
a=panel('ev/prod-tab1-after.png',crop=(20,70,1590,895),title='BEFORE - production (v26.45.2-198e632), 6 Nov 2026, tab 1: Create Invoice on S2-918',
  boxes=[(1455,85,1571,123,RED,1,'below'),(1100,758,1500,890,RED,2)],
  notes=[(1,RED,'Create Invoice was clicked on S2-918 at the same moment as on S2-981 in a second tab (same customer, Ahsan).'),(2,RED,'S2-918 fails: "Ooooops! An error occurred". No invoice is made and the button is still there. Same result when the two requests were sent directly: 1 of 2 failed with a 500 both times.')])
b=panel('ev/prod-tab2-after.png',crop=(20,70,1590,660),title='BEFORE - production, tab 2 at the same moment: S2-981',
  boxes=[(216,264,424,287,GRN,1),(520,392,1380,428,GRN,2)],
  notes=[(1,GRN,'The other tab went through: S2-981 was invoiced and the payment window opened.'),(2,GRN,'So only one of the two invoices was made.')])
c=panel('ev/branch-tab1-after.png',crop=(20,70,1590,620),title='AFTER - QA branch sv6456 (v26.45.2-fa8d378), 6 Nov 2026: the same two-tab test',
  boxes=[(40,101,136,124,GRN,1),(216,289,424,312,GRN,2)],
  notes=[(1,GRN,'Create Invoice clicked on S2-16273 and S2-16271 (same customer, Los Lunas Diesel & Fleet Repair) at the same moment.'),(2,GRN,'Both tabs open the payment window: both invoices are made, no error. Sent directly in 13 more same-moment rounds (20 invoices, with and without deposits): every invoice made, none failed.')])
stack([a,b,c]).save('ev/jira/01-two-tabs-before-after.png')
