import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
E='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11422/ev/'
O='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11422/exhibits/'
a=panel(E+'z22-B1-before.png',crop=(0,120,1440,420),title='Board View, search S2-16688: before the first Tab',
  boxes=[(17,201,303,254,BLU,1)],
  notes=[(1,BLU,'"Unassigned" is empty. The only card, S2-16688, is in Brandi Smith\'s column off to the right. On 18 October the first Tab landed on this "Unassigned" column header.')])
b=panel(E+'z22-B1-after.png',crop=(0,120,1440,520),title='After the first Tab',
  boxes=[(1149,262,1411,486,GRN,2)],
  notes=[(2,GRN,'The board scrolls sideways and the first Tab lands on the S2-16688 card, with the blue focus ring.')])
stack([a,b]).save(O+'sv11422-01-board-first-tab.png')
p1=panel(E+'x22-1-first.png',crop=(0,180,1100,330),title='1. Rows in Unassigned: first Tab',
  boxes=[(40,264,1060,300,GRN,1)],notes=[(1,GRN,'Lands on the first row, S2-37015.')])
p2=panel(E+'x22-3-collapsed.png',crop=(0,180,1100,330),title='2. Every group collapsed: first Tab',
  boxes=[(40,228,1060,264,GRN,2)],notes=[(2,GRN,'Lands on the first group heading, "Unassigned".')])
p3=panel(E+'x22-5-unassigned-collapsed.png',crop=(0,180,1100,520),title='3. "Unassigned" collapsed (search Truck): first Tab',
  boxes=[(40,444,1060,480,GRN,3)],notes=[(3,GRN,'Lands on S2-31594, the first technician\'s first row.')])
p4=panel(E+'x22-6-board-first.png',crop=(0,150,1100,500),title='4. Board View: first Tab',
  boxes=[(29,262,291,475,GRN,4)],notes=[(4,GRN,'Lands on the first card, S2-37015.')])
stack([p1,p2,p3,p4]).save(O+'sv11422-02-checks-still-passing.png')
