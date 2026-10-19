import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
E='/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11422/ev/'
a=panel(E+'z22-T1-after.png',crop=(0,110,1100,330),title='1. Right after the first Tab (search S2-16688, Tech View)',
  boxes=[(40,208,1060,244,RED,1)],
  notes=[(1,RED,'The keyboard focus is on work order S2-16688, but the "Brandi Smith" heading is drawn on top of it, so the row and its blue focus ring cannot be seen.')])
b=panel(E+'z22-T-probe-after-updown.png',crop=(0,110,1100,330),title='2. After pressing the Up arrow and then the Down arrow',
  boxes=[(40,244,1060,280,GRN,2)],
  notes=[(2,GRN,'The page moves down one row and S2-16688 appears under the heading, with its blue focus ring.')])
stack([a,b]).save('/home/user/Manual-test-Cases/build/sv11466-11467-11422-2026-10-19/sv11422/exhibits/q-row-under-heading.png')
