import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
R='/home/user/Manual-test-Cases/build/sv10323-note-attachment-org-check-2026-10-05/ev/raw/'
O='/home/user/Manual-test-Cases/build/sv10323-note-attachment-org-check-2026-10-05/guide/'
# G1 where the feature is
g1=panel(R+'branch-leaver-click.png',crop=(20,70,1590,470),
 title='STEP 1 - Where this feature lives: Work Orders > open a work order > Notes tab',
 boxes=[(26,92,280,128,BLU,1),(492,84,566,116,BLU,2),(318,195,1571,465,BLU,3),(331,318,590,428,BLU,4),(428,370,550,414,GRN,5)],
 notes=[(1,BLU,'The work order (here S2-17414).'),(2,BLU,'The Notes tab. Staff write notes about the job here.'),
        (3,BLU,'One note. Its author is shown at the top (here a staff member).'),
        (4,BLU,'A file attached to the note (a photo, a PDF...).'),
        (5,GRN,'The For Customer checkbox. Ticked = the customer can see this file. Empty = only the shop sees it. THIS checkbox is what the ticket is about.')])
g1.save(O+'G1-where-the-feature-is.png'); stack([g1]).save(O+'G1-where-the-feature-is.png')
# G4 technician vs sales rep (branch)
t=panel(R+'branch-technician-wo.png',crop=(20,0,1590,470),
 title='STEP 4a - Signed in as a TECHNICIAN (Tech quick-login) on the QA branch: no checkbox at all',
 boxes=[(1536,8,1580,48,BLU,1),(400,84,472,118,BLU,2),(331,318,590,428,RED,3)],
 notes=[(1,BLU,'TS = Tech ShopView, whose role is Technician (can view work orders, cannot edit them).'),
        (2,BLU,'Same work order S2-17414, Notes tab.'),
        (3,RED,'The file shows, but there is NO For Customer checkbox under it. Production looks exactly the same.')])
s=panel(R+'branch-salesrep-wo-click.png',crop=(310,380,1585,660),
 title='STEP 4b - Signed in as a SALES REPRESENTATIVE (also view-only on work orders): checkbox shown greyed out',
 boxes=[(428,558,550,602,GRN,1)],
 notes=[(1,GRN,'The checkbox is there but greyed out - they can see the customer can see this file, but cannot change it. This is what the spec asks for.')])
stack([t,s]).save(O+'G4-technician-question.png')
# G5 other note types
c=panel(R+'branch-admin-customer.png',crop=(20,70,1590,600),
 title='STEP 5a - Customers > open a customer > Notes tab',
 boxes=[(728,84,792,118,BLU,1),(450,382,570,424,GRN,2)],
 notes=[(1,BLU,'Customer page, Notes tab.'),(2,GRN,'The same For Customer checkbox on a customer note.')])
a=panel(R+'branch-admin-asset.png',crop=(20,60,1590,420),
 title='STEP 5b - Customers > Assets > open an asset (truck) > Notes tab',
 boxes=[(426,318,546,360,GRN,1)],notes=[(1,GRN,'The same checkbox on an asset note.')])
p=panel(R+'branch-admin-partsale.png',crop=(20,60,1590,420),
 title='STEP 5c - Parts > Part Sales > open a part sale > Notes tab',
 boxes=[(428,318,548,360,GRN,1)],notes=[(1,GRN,'The same checkbox on a part sale note.')])
stack([c,a,p]).save(O+'G5-other-note-types.png')
