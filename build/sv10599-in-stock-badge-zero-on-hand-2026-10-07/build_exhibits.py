import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from PIL import Image
from ticket_exhibit import panel, stack, RED, GRN
R='/home/user/Manual-test-Cases/build/sv10599-in-stock-badge-zero-on-hand-2026-10-07/ev/raw/'; O=R+'../'
bp=panel(R+'P1-picker.png',crop=(420,300,1300,515),
  title='BEFORE (production, build v26.40.8-1e8e914, 7 Oct 2026): work order S-961, Add Part on the line, part PERTAB-7001',
  boxes=[(481,392,991,498,RED,1)],notes=[(1,RED,'The part picker shows "Inventory Qty: 0 EA" - none on hand.')])
bl=panel(R+'P2-lines.png',crop=(320,320,1900,420),title='BEFORE: the same work order after the part is added',
  boxes=[(363,376,1876,411,RED,2),(1342,383,1405,404,RED,3)],
  notes=[(2,RED,'PERTAB-7001 (0 on hand) on the line.'),(3,RED,'It still says In Stock.')])
ap=panel(R+'A1-picker.png',crop=(420,300,1300,515),
  title='AFTER (QA branch sv10599, build v26.40.3-971d112, 7 Oct 2026): work order S10599-17580, Add Part on the line, part 448-4865',
  boxes=[(481,392,991,498,GRN,1)],notes=[(1,GRN,'The part picker shows "Inventory Qty: 0 ea" - none on hand.')])
al=panel(R+'B10.png',crop=(320,320,1900,490),title='AFTER: work order S10599-17581, a line with the same part (0 on hand) and three others',
  boxes=[(1343,383,1406,404,GRN,2),(363,411,1876,481,GRN,3)],
  notes=[(2,GRN,'FLAT HOOK WINCH STRAP has 10 on hand: In Stock still shows.'),
         (3,GRN,'Load Spring IHC (-3 on hand) and SPINDLE NUT KIT (0 on hand): no In Stock badge. Pick is still offered, as Chris ruled.')])
W=max(x.width for x in [bp,bl,ap,al])
stack([bp,bl,ap,al]).save(O+'01-before-vs-after-hd.png')
# other surfaces on the QA branch
p1=panel(R+'C2-parts.png',crop=(320,180,1900,400),title='QA branch, Parts tab, S10599-17582: MAT SENSOR (0 on hand) and its core',
  boxes=[(368,224,1890,280,GRN,1),(368,309,1890,365,GRN,2)],
  notes=[(1,GRN,'Main part, 0 on hand: nothing in the Status column (no In Stock badge). Pick is still offered.'),(2,GRN,'Its core row follows the main part: no badge either.')])
p2=panel(R+'C3-parts.png',crop=(320,180,1900,400),title='QA branch, same work order after the main part gets 3 in stock',
  boxes=[(1717,251,1780,272,GRN,1),(1717,336,1780,357,GRN,2)],
  notes=[(1,GRN,'Main part: In Stock shows again.'),(2,GRN,'Core row: In Stock shows again.')])
p3=panel(R+'PS1.png',crop=(320,150,1900,380),title='QA branch, part sale (authorized): CONNECTOR (14 on hand) and 401-10B (0 on hand)',
  boxes=[(1574,198,1637,219,GRN,1),(368,246,1895,360,GRN,2)],
  notes=[(1,GRN,'CONNECTOR, 14 on hand: In Stock.'),(2,GRN,'401-10B, 0 on hand: no In Stock badge. Pick is still offered.')])
stack([p1,p2,p3]).save(O+'02-parts-tab-core-part-sale-hd.png')
ph=panel(R+'B11.png',crop=(0,820,390,1105),title='QA branch, phone width (390), S10599-17581 line card',
  boxes=[(290,929,353,950,GRN,1),(270,958,372,1052,GRN,2)],
  notes=[(1,GRN,'Stocked part: In Stock.'),(2,GRN,'Load Spring IHC (-3 on hand) and SPINDLE NUT KIT (0 on hand): only Pick, no In Stock badge.')])
ph.save(O+'03-phone-hd.png')
for f in ['01-before-vs-after-hd.png','02-parts-tab-core-part-sale-hd.png','03-phone-hd.png']: print(f,Image.open(O+f).size)
