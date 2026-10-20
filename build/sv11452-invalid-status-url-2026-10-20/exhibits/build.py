import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
E='/home/user/Manual-test-Cases/build/sv11452-invalid-status-url-2026-10-20/ev/'
O='/home/user/Manual-test-Cases/build/sv11452-invalid-status-url-2026-10-20/exhibits/'
# 1: unknown value
a=panel(E+'e-bogus-hover.png',crop=(540,60,1100,450),title='1. Link with an unknown status: .../workorders?status=bogus',
  boxes=[(741,87,850,115,RED,1),(587,324,855,349,RED,2)],
  notes=[(1,RED,'The Status button is highlighted blue as if a status is chosen, and pointing at it shows the clear X, but it names no status.'),
         (2,RED,'The list is empty: "No work orders match these filters".')])
b=panel(E+'d-bogus-menu.png',crop=(540,60,1100,560),title='2. Open the Status menu on the same page',
  boxes=[(741,121,941,534,RED,3,'right')],
  notes=[(3,RED,'Nothing is ticked, so there is no way to see what is filtering the list.')])
stack([a,b]).save(O+'sv11452-01-unknown-status.png')
# 2: capital letter
c=panel(E+'e-capital-hover.png',crop=(60,60,1100,350),title='3. Link with a capital letter: .../workorders?status=Approved',
  boxes=[(741,87,850,115,RED,4),(104,188,186,332,RED,5)],
  notes=[(4,RED,'The Status button is highlighted, and pointing at it shows the clear X, but it names no status.'),
         (5,RED,'Yet the list IS filtered: every row is Approved. The filter is working but cannot be seen.')])
d=panel(E+'d-capital-menu.png',crop=(540,60,1100,560),title='4. Its Status menu',
  boxes=[(741,169,941,209,RED,6)],
  notes=[(6,RED,'"Approved" is not ticked, although the list shows only Approved work orders.')])
stack([c,d]).save(O+'sv11452-02-capital-letter.png')
# 3: the app's own filter, for comparison
e=panel(E+'d-app-two.png',crop=(60,60,1100,350),title='5. For comparison: the same filter chosen in the Status menu (Approved + Estimate)',
  boxes=[(646,87,850,115,GRN,7)],
  notes=[(7,GRN,'The button names the filter: "Status: Approved, +1". The app writes the link as ?status=approved&status=estimate.')])
f=panel(E+'d-app-two-menu.png',crop=(540,60,1100,560),title='6. Its Status menu',
  boxes=[(741,129,941,209,GRN,8)],
  notes=[(8,GRN,'Estimate and Approved are ticked, so the user can see and change the filter.')])
stack([e,f]).save(O+'sv11452-03-how-it-looks-when-chosen-in-the-menu.png')
from PIL import Image
for n in ['01-unknown-status','02-capital-letter','03-how-it-looks-when-chosen-in-the-menu']: print(n,Image.open(O+'sv11452-'+n+'.png').size)
