import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
fb=json.load(open('data/FU1E.json'))['field_box']
p1=panel('ev/FU1E-2-dialog.png',(395,255,1030,705),'Edit Catalog Part on QA-11669-FU-01 (Manufacturer was Dayco), after typing only spaces and pressing Tab',
 [(fb['x'],fb['y'],fb['x']+fb['w'],fb['y']+fb['h'],BLU,1,'right')],[(1,BLU,'The Manufacturer field now looks empty.')])
p1.save('ev/ticket/01-manufacturer-field-looks-empty-hd.png')
d=json.load(open('ev/det-branch-fu01.json'))['man']; e=json.load(open('ev/det-prod-pb02.json'))['man']
a=panel('ev/det-branch-fu01.png',(30,110,560,400),'QA branch sv11669, after Save: the part still shows Manufacturer: Dayco',[(d['x'],d['y'],d['x']+d['w'],d['y']+d['h'],RED,1,'right')],[(1,RED,'The old manufacturer was kept, although the field looked empty.')])
b=panel('ev/det-prod-pb02.png',(30,110,560,400),'Production today, same steps on QA-11669-PB-02: Manufacturer is empty',[(e['x'],e['y'],e['x']+e['w'],e['y']+e['h'],GRN,2,'right')],[(2,GRN,'Before this change, the same steps removed the manufacturer.')])
stack([a,b]).save('ev/ticket/02-old-manufacturer-kept-vs-production-hd.png')
from PIL import Image
for f in ['01-manufacturer-field-looks-empty-hd.png','02-old-manufacturer-kept-vs-production-hd.png']: im=Image.open('ev/ticket/'+f); print(f,im.size)
