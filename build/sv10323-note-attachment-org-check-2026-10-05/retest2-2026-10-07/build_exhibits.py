import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from PIL import Image
from ticket_exhibit import panel, stack, RED, GRN
R='/home/user/Manual-test-Cases/build/sv10323-note-attachment-org-check-2026-10-05/retest2-2026-10-07/ev/raw/'; O=R+'../'; B='/home/user/Manual-test-Cases/build/sv10323-note-attachment-org-check-2026-10-05/retest-2026-10-07/ev/raw/'
def box(c,n,col): return (c[0]-6,c[1]-4,c[2]+6,c[3]+4,col,n)
# customer + asset
b1=panel(B+'techview-edit-customer.png',crop=(300,200,1570,480),title='BEFORE (QA branch, build v26.40.8-cf5b7ad, 7 Oct 2026 02:00 CDT): customer West Mifflin Diesel Repair > Notes, Tech View role with Customers > Edit',
  boxes=[(357,332,607,435,RED,1)],notes=[(1,RED,'The file zz10323_customer.png shows, but there is no For Customer checkbox.')])
a1=panel(R+'tvedit/customer-2-after-click.png',crop=(300,720,1580,1000),title='AFTER (build v26.40.8-129d22f, 7 Oct 2026): the same note, same role (ZZ10323 TechView edit)',
  boxes=[box([457,907,564,937],1,GRN)],notes=[(1,GRN,'The For Customer checkbox shows and can be ticked or cleared. The change is still there after reloading the page.')])
a2=panel(R+'tech/customer-1-before.png',crop=(300,720,1580,1000),title='AFTER: the same note, signed in as Technician (Tech View, Customers > View only)',
  boxes=[box([457,907,564,937],1,GRN)],notes=[(1,GRN,'The For Customer checkbox shows greyed out. Clicking it changes nothing.')])
b2=panel(B+'technician-asset.png',crop=(280,135,1570,415),title='BEFORE (build v26.40.8-cf5b7ad): asset Unit 24 / A1305B > Notes, signed in as Technician',
  boxes=[(333,268,583,371,RED,1)],notes=[(1,RED,'No For Customer checkbox.')])
a3=panel(R+'tvedit/vehicle-2-after-click.png',crop=(300,135,1580,415),title='AFTER: the same asset note, ZZ10323 TechView edit',
  boxes=[box([433,324,540,354],1,GRN)],notes=[(1,GRN,'The checkbox shows and works.')])
a4=panel(R+'tech/vehicle-1-before.png',crop=(300,135,1580,415),title='AFTER: the same asset note, Technician (Customers > View only)',
  boxes=[box([433,324,540,354],1,GRN)],notes=[(1,GRN,'The checkbox shows greyed out.')])
stack([b1,a1,a2,b2,a3,a4]).save(O+'01-customer-asset-before-after-hd.png')
# part sale
b3=panel(B+'techview-edit-partsale-list.png',crop=(285,60,1575,340),title='BEFORE (build v26.40.8-cf5b7ad): the Tech View test role without See Financial Data',
  boxes=[(337,250,1568,294,RED,1)],notes=[(1,RED,'Part sale P9667-368 would not open. Cause: the test role was missing See Financial Data, which the Part Sales spec requires to open a part sale.')])
a5=panel(R+'tvedit/part_sale-2-after-click.png',crop=(300,135,1580,415),title='AFTER (build v26.40.8-129d22f): part sale P9667-368 > Notes, ZZ10323 TechView edit (Part Sales > Edit, See Financial Data on)',
  boxes=[box([435,324,542,354],1,GRN)],notes=[(1,GRN,'The part sale opens, and the For Customer checkbox shows and works.')])
a6=panel(R+'tvview/part_sale-1-before.png',crop=(300,135,1580,415),title='AFTER: the same note, ZZ10323 TechView view-only (Part Sales > View, See Financial Data on)',
  boxes=[box([435,324,542,354],1,GRN)],notes=[(1,GRN,'The checkbox shows greyed out. Clicking it changes nothing.')])
stack([b3,a5,a6]).save(O+'02-part-sale-before-after-hd.png')
# rows 1-2
w1=panel(R+'r4-rows12-work_order_line.png',crop=(300,440,1580,720),title='Work order S2-17414 > Notes, Technician: the work order LINE note',
  boxes=[(335,572,585,672,GRN,1)],notes=[(1,GRN,'The file shows with no For Customer checkbox, as the S10-R5b exception says.')])
w2=panel(R+'r4-rows12-work_order.png',crop=(300,440,1580,720),title='Work order S2-17414 > Notes, Technician: the WORK ORDER note',
  boxes=[(335,573,585,673,GRN,1)],notes=[(1,GRN,'The file shows with no For Customer checkbox.')])
stack([w1,w2]).save(O+'03-work-order-notes-technician-hd.png')
for f in ['01-customer-asset-before-after-hd.png','02-part-sale-before-after-hd.png','03-work-order-notes-technician-hd.png']: print(f,Image.open(O+f).size)
