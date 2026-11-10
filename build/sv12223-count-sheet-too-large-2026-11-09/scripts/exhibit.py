import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
E='/home/user/Manual-test-Cases/build/sv12223-count-sheet-too-large-2026-11-09/ev/'; O=E+'exhibits/'
a=panel(E+'B1-all-2-after.png',(240,60,1600,900),
 'Picture 1: whole inventory (7,018 lines) - Print now shows a clear message within about 1 second',
 [(1135,82,1172,118,BLU,1),(1100,768,1500,892,GRN,2)],
 [(1,BLU,'Parts > Inventory > ⋮ > Cycle count > the printer icon (Print), no search or filter.'),
  (2,GRN,'Red message: "This count sheet has 7,018 lines, which is too many to print at once (the limit is 500). Narrow it with search or a filter, such as Bin Location, and print it in parts." Before the fix this waited about 31 seconds and failed with a general error.')])
a.save(O+'01-whole-inventory-message.png')
b=panel(E+'B2-ring501-2-after.png',(240,60,1600,900),
 'Picture 2: search RING, one line over the limit (501 lines) - refused with the line count',
 [(420,83,645,112,BLU,1),(1318,78,1354,114,BLU,2),(1100,768,1500,892,GRN,3)],
 [(1,BLU,'Search: RING.'),(2,BLU,'Print.'),(3,GRN,'"This count sheet has 501 lines … (the limit is 500)". With one line fewer (500) the same search printed.')])
b.save(O+'02-501-lines-refused.png')
c=panel(E+'long-p1-01.png',(0,0,1287,910),
 'Picture 3: a 500-line sheet still prints - page 1 of 64 (the 500 parts with the longest descriptions and tags)',
 [],[],scale=1)
c.save(O+'03-500-lines-printed-p1.png')
from PIL import Image
for n in ['01-whole-inventory-message','02-501-lines-refused','03-500-lines-printed-p1']: print(n, Image.open(O+n+'.png').size)
