import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
E='/home/user/Manual-test-Cases/build/sv12221-po-vendor-search-sort-2026-11-10/ev/'; O=E+'exhibits/'
a=panel(E+'P0-prod-list.png',(240,60,1600,800),'BEFORE (production, v26.45.2-107ad4b): "Delete Test" is shown in the Vendor column...',
 [(586,148,642,174,RED,1),(586,348,666,376,BLU,2),(586,602,682,630,BLU,2),(586,756,666,784,BLU,2)],
 [(1,RED,'The Vendor header has no sort arrow; clicking it does not change the order.'),(2,BLU,'Purchase orders with vendor "Delete Test" (14 on this list).')])
b=panel(E+'P1-prod-search.png',(240,60,1600,430),'...but searching "Delete Test" finds nothing',
 [(1098,82,1347,118,BLU,1),(760,336,1065,402,RED,2)],
 [(1,BLU,'Search: Delete Test.'),(2,RED,'"No orders match the search "Delete Test"."')])
stack([a,b]).save(O+'01-before-production.png')
c=panel(E+'B1-search-willoughby.png',(240,60,1600,800),'AFTER (sv12221, v26.45.2-411684a): searching "Willoughby" finds every purchase order whose Vendor column shows it',
 [(1098,82,1347,118,BLU,1),(631,194,792,326,GRN,2),(631,348,777,790,GRN,3)],
 [(1,BLU,'Search: Willoughby.'),(2,GRN,'Also found when Willoughby is a second vendor on the order (the "+1"/"+4" in the cell).'),(3,GRN,'Orders with Willoughby Mechanical Services (13 found = 13 shown in the Vendor column).')])
d=panel(E+'B-click1.png',(240,60,1600,470),'AFTER: click the Vendor header once - sorted A to Z',
 [(631,148,700,174,BLU,1),(631,194,800,470,GRN,2)],
 [(1,BLU,'Vendor header, arrow up.'),(2,GRN,"Akal's..., Amimi..., ... (orders with no vendor shown are listed last).")])
e=panel(E+'B-click2.png',(240,60,1600,470),'AFTER: click it again - sorted Z to A',
 [(631,148,700,174,BLU,1),(631,194,800,470,GRN,2)],
 [(1,BLU,'Vendor header, arrow down.'),(2,GRN,"Writes' Diesel Repair, Willoughby..., ... (orders with no vendor still last).")])
c.save(O+'02-after-search.png'); stack([d,e]).save(O+'03-after-sort.png')
from PIL import Image
for n in ['01-before-production','02-after-search','03-after-sort']: print(n, Image.open(O+n+'.png').size)
