import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, jira_embed
R='/home/user/Manual-test-Cases/build/sv10323-note-attachment-org-check-2026-10-05/ev/'
CB=(428,370,550,414)
# 1. leaver: production before vs branch after
a=panel(R+'raw/prod-leaver-click.png',crop=(310,185,1585,470),
 title='BEFORE - production app.shopview.com (build v26.40.7-e1021b1), 5 Oct 2026',
 boxes=[(*CB,RED,1)],
 notes=[(1,RED,'The staff member who added this file has been removed. The admin clicks For Customer - the box stays empty, and after a reload it is still empty.')])
a2=panel(R+'raw/prod-leaver-click.png',crop=(1050,862,1515,1002),
 title='BEFORE - the messages shown on the same click',
 boxes=[(1093,870,1507,996,RED,2)],
 notes=[(2,RED,'"Attachment is not found - Please try to resolve this." and "Error updating attachment".')])
b=panel(R+'raw/branch-leaver-click.png',crop=(310,185,1585,470),
 title='AFTER - QA branch sv9667 (build v26.40.7-7ffda69), 5 Oct 2026',
 boxes=[(*CB,GRN,1)],
 notes=[(1,GRN,'Same situation: the staff member who added the file has been removed. The admin clicks For Customer - it ticks, no error, and it is still ticked after a reload.')])
stack([a,a2,b]).save(R+'01-staff-removed-before-after-hd.png')
# 2. view-only: production before vs branch after
c=panel(R+'raw/prod-viewonly-3.png',crop=(310,185,1585,470),
 title='BEFORE - production, user with Work Orders View only (Parts Technician role)',
 boxes=[(*CB,RED,1)],
 notes=[(1,RED,'This user can only view work orders, yet the For Customer box is clickable. It was ticked by this user and is still ticked after a reload.')])
d=panel(R+'raw/branch-salesrep-wo-click.png',crop=(310,380,1585,660),
 title='AFTER - QA branch, user with Work Orders View only (Sales Representative role)',
 boxes=[(428,558,550,602,GRN,1)],
 notes=[(1,GRN,'The For Customer box is greyed out. Clicking it does nothing and sends nothing. It still shows the file is shared with the customer.')])
stack([c,d]).save(R+'02-view-only-before-after-hd.png')
for f in ['01-staff-removed-before-after-hd.png','02-view-only-before-after-hd.png']: print(jira_embed(R+f))
