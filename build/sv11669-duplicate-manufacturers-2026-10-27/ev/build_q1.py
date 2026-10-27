import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN, BLU
from PIL import Image
fb=json.load(open('data/E3.json'))['field_box']
a=panel('ev/E3-2-dialog.png',(395,255,1030,705),'1. QA branch: Edit Catalog Part on QA-11669-06 (was Haldex), typed only spaces, pressed Tab',[(fb['x'],fb['y'],fb['x']+fb['w'],fb['y']+fb['h'],BLU,1,'right')],[(1,BLU,'The Manufacturer field now looks empty. Then Save.')])
d=json.load(open('ev/det-branch-06.json'))['man']
b=panel('ev/det-branch-06.png',(30,110,560,400),'2. QA branch after Save: the part still shows Haldex',[(d['x'],d['y'],d['x']+d['w'],d['y']+d['h'],RED,2,'right')],[(2,RED,'The screen said "empty" but the old manufacturer was kept.')])
e=json.load(open('ev/det-prod-pb02.json'))['man']
c=panel('ev/det-prod-pb02.png',(30,110,560,400),'3. Production, same steps on QA-11669-PB-02 (was Accuride)',[(e['x'],e['y'],e['x']+e['w'],e['y']+e['h'],GRN,3,'right')],[(3,GRN,'Production removes the manufacturer (the field is blank after Save).')])
W=a.width+b.width+c.width+60; H=max(a.height,b.height,c.height); o=Image.new('RGB',(W,H),(255,255,255)); x=0
for p in (a,b,c): o.paste(p,(x,0)); x+=p.width+30
o.save('ev/q1-edit-spaces-keeps-old.png'); print(o.size)
