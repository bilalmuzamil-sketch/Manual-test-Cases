import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
a=panel('ev/staging-scroll-brake-bottom.png',crop=(300,360,1200,780),
 title='1. Staging, WITHOUT the SV-11413 fix (build v26.45.2-8a3ce52), Add Part, typed brake, scrolled to the end',
 boxes=[(426,421,946,760,RED,1)],
 notes=[(1,RED,'This is the end of the list (196 rows). DOT 3 BRAKE FLUID (PBFPS301C) is not in it, although it is an inventory part at this location and its name contains "brake".')])
b=panel('ev/branch-scroll-brake-bottom.png',crop=(300,330,1200,750),
 title='2. QA branch sv11413, WITH the fix (build v26.45.2-b07ae41), same search, scrolled to the end',
 boxes=[(426,387,946,727,RED,1)],
 notes=[(1,RED,'End of the list (215 rows). DOT 3 BRAKE FLUID is not in it here either.')])
c=panel('ev/branch-find-brakefluid.png',crop=(300,330,1200,750),
 title='3. QA branch sv11413, typed brake fluid',
 boxes=[(431,504,941,610,GRN,1)],
 notes=[(1,GRN,'With more of the name typed, DOT 3 BRAKE FLUID (PBFPS301C) appears. The part exists; a one-word search just never reaches it.')])
stack([a,b,c]).save('ev/jira/03-brake-list-limit.png'); print('ok')
