# Retest 28 Oct: picture for the QA-lead question (Description narrower than the design at 1024).
import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, BLU
a=panel('/tmp/qa11631/w/m-branch-p2109r/w1024.png',crop=(250,140,1010,770),title='P2-109 at 1024 wide, build v26.43.2-3ed5bdc: Description column is 88 px (the design and the 26 Oct build: 108 px)',
  boxes=[(361,148,449,186,BLU,1),(361,474,449,515,RED,2),(361,556,449,597,RED,3),(361,720,449,761,RED,4)],
  notes=[(1,BLU,'Description is now 88 px wide at 1024 and 768. R13 says "Description narrows (108px in the design)". Part Number grew from 114 to 124 px and Status from 64 to 81 px, which fixed R2 and R12.'),
         (2,RED,'"Bolt, M20" now shows as "Bolt, ..."; it showed in full on 26 October.'),(3,RED,'"Cotter Pin" is now cut the same way.'),(4,RED,'"Nut, M20" is now cut the same way. Pointing at each one still shows the full name, and Description to Sell Price still show without scrolling.')])
a.save('ev28/Q-description-88-vs-108.png'); print(a.size)
