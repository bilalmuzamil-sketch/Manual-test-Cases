import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import panel, stack, RED, GRN, BLU

B='/tmp/qa10586/'; P='/tmp/qa10586p/'
PROD='production app.shopview.com - build v26.40.0-515e092 - 1 Oct 2026'
BRCH='QA branch sv10586.qa.shopview.com - build v26.39.2-f170641 - 1 Oct 2026'
CROP=(240,60,1700,300)
CH=(664,1468); CHY=(84,119)

stack([
 panel(P+'prod-02-after-link.png', CROP,
   'BEFORE - the link mixes the clicked role into your saved filters',
   PROD + ' - saved view was Technician + Trucks Hill 2 + Department1, then the Admin Users count (8) was clicked',
   word=CH, tipy=CHY, c=RED,
   word_note='2 permission groups, and your Location and Department are still on'),
 panel(B+'ex-02-after-link.png', CROP,
   'AFTER - the link shows only the role you clicked',
   BRCH + ' - same saved view (Technician + a Location + a Department), same Admin Users count clicked',
   word=CH, tipy=CHY, c=GRN,
   word_note='Admin only, All locations, All departments'),
], 'The same journey on both builds. On the live build the list is Technicians and Admins inside one location and one department, '
   'so it cannot match the number you clicked. On the fix it is exactly the people in that role.'
).save('ev/01-before-after.png')

stack([
 panel(P+'prod-03-saved-overwritten.png', CROP,
   'BEFORE - your own saved filters have been overwritten',
   PROD + ' - after leaving Staff and coming back from the menu, having changed nothing',
   word=CH, tipy=CHY, c=RED,
   word_note='still 2 permission groups - the link changed what you had saved'),
 panel(B+'ex-03-saved-intact.png', CROP,
   'AFTER - your own saved filters are back',
   BRCH + ' - same thing: left Staff and came back from the menu, having changed nothing',
   word=CH, tipy=CHY, c=GRN,
   word_note='Technician, your Location and your Department, exactly as you left them'),
], 'This is the half that quietly costs people their settings. Just looking at the link used to re-save your Staff filters as the '
   'role you clicked plus whatever you already had. Now it leaves them alone.'
).save('ev/02-saved-filters-left-alone.png')

stack([
 panel(B+'ex-02-after-link.png', CROP, 'Arrive from the link - nothing is being saved yet',
   BRCH, word=CH, tipy=CHY, c=BLU, word_note='Admin only'),
 panel(B+'ex-04-first-change.png', CROP, 'Add a Location yourself, leave, come back - the whole view is saved',
   BRCH, word=CH, tipy=CHY, c=GRN, word_note='Admin + the Location you added; the old Technician and Department are gone'),
], 'Once you change a filter yourself, saving resumes and the whole view on screen is what gets saved - the role from the link '
   'plus your change. The previous Technician and Department are deliberately dropped. This matches the rule already used for shared links.'
).save('ev/03-your-first-change-is-saved.png')
print('built')
