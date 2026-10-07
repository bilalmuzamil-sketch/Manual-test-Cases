import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
R='/home/user/Manual-test-Cases/build/sv10323-note-attachment-org-check-2026-10-05/retest-2026-10-07/ev/raw/'; O=R+'../'
a=panel(R+'techview-edit-customer.png',crop=(300,200,1570,480),
  title='1. Customer West Mifflin Diesel Repair > Notes, signed in with a Tech View role that HAS Customers > Edit',
  boxes=[(357,332,607,435,RED,1)],
  notes=[(1,RED,'The file zz10323_customer.png shows, but there is no For Customer checkbox. The updated S10-R5b says it should show and work for this user.')])
b=panel(R+'salesrep-customer.png',crop=(300,200,1570,480),
  title='2. The same note, signed in as Sales Representative (Full View, Customers > Edit)',
  boxes=[(457,388,564,418,GRN,1)],
  notes=[(1,GRN,'The For Customer checkbox shows and can be ticked. This is what the Tech View user in picture 1 should also get.')])
c=panel(R+'technician-asset.png',crop=(280,135,1570,415),
  title='3. Asset Unit 24 / A1305B > Notes, signed in as Technician (Tech View, Customers > View only)',
  boxes=[(333,268,583,371,RED,1)],
  notes=[(1,RED,'No For Customer checkbox. The updated S10-R5b says a view-only user sees it greyed out.')])
stack([a,b,c]).save(O+'01-techview-customer-asset-hd.png')
from PIL import Image; print(Image.open(O+'01-techview-customer-asset-hd.png').size)
d=panel(R+'techview-edit-partsale-list.png',crop=(285,60,1575,340),
  title='4. Customer Bloomingdale Diesel Repair > Part Sales, signed in with a Tech View role that HAS Part Sales > Edit',
  boxes=[(337,250,1568,294,RED,1)],
  notes=[(1,RED,'Part sale P9667-368 is listed, but clicking it does not open it, so its notes and the For Customer checkbox can never be reached. Clicking Parts in the top menu does nothing either.')])
stack([d]).save(O+'02-techview-part-sale-hd.png'); print(Image.open(O+'02-techview-part-sale-hd.png').size)
e=panel(R+'technician-workorder.png',crop=(296,470,1575,990),
  title='Check 10: work order S2-17414 > Notes, signed in as Technician (Tech View, Work Orders > View only)',
  boxes=[(335,600,585,698,GRN,1),(335,878,585,976,GRN,2)],
  notes=[(1,GRN,'Work order line note: the file shows and there is no For Customer checkbox.'),
         (2,GRN,'Work order note: the file shows and there is no For Customer checkbox. Both match the S10-R5b exception (version 28).')])
stack([e]).save(O+'03-check10-technician-workorder-hd.png'); print(Image.open(O+'03-check10-technician-workorder-hd.png').size)
