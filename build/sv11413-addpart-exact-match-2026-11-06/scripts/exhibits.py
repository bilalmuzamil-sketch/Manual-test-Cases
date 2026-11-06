import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
a=panel('ev/prod-search-194.png',crop=(300,330,1200,780),
 title='BEFORE - production (build v26.45.2-198e632), work order S2-1943 > Add Part, typed 194',
 boxes=[(430,430,944,736,RED,1)],
 notes=[(1,RED,'The first three results only contain 194 (A194, A408 #1238194, Item-1944). The part numbered exactly 194 (Light Bulb) is 4th and is not visible without scrolling.')])
b=panel('ev/branch-check1-194-dropdown.png',crop=(300,330,1200,780),
 title='AFTER - QA branch sv11413 (build v26.45.2-b07ae41), work order S11413-17580 > Add Part, typed 194',
 boxes=[(430,396,944,488,GRN,1)],
 notes=[(1,GRN,'The part numbered exactly 194 (Light Bulb, in inventory) is the first result.')])
stack([a,b]).save('ev/jira/01-exact-194-before-after.png')
c=panel('ev/staging-scroll-brake-top.png',crop=(300,330,1200,780),
 title='Staging, without the fix (same parts as the QA branch), typed brake',
 boxes=[(430,430,944,524,GRN,1)],
 notes=[(1,GRN,'Parts with "brake" in the middle of the name are found, e.g. (30/30 LONG STROKE SPRING BRAKE CHAMBER, 4--FLT3030LCB20.')])
d=panel('ev/branch-scroll-brake-top.png',crop=(300,330,1200,780),
 title='QA branch sv11413 (build v26.45.2-b07ae41), typed brake (top of the list)',
 boxes=[(430,396,944,488,RED,1)],
 notes=[(1,RED,'Only parts whose name or number starts with "brake" come back. I scrolled through all 215 rows: SPRING BRAKE CHAMBER, the 3/8" X 18" AIRBRAKE hose and the SYNFLEX line never appear, though they are in stock here (typing "spring brake" finds the chamber).')])
stack([c,d]).save('ev/jira/02-brake-staging-vs-branch.png')
