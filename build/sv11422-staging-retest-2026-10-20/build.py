import sys, json; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, GRN, BLK, GREY
from PIL import Image, ImageDraw
S=2
def panel(title,img,cap,W=1800):
    f=fnt(32,True); fc=fnt(26); d0=ImageDraw.Draw(Image.new('RGB',(10,10))); lines=wrap(d0,cap,fc,W-40)
    if img.width>W-40: img=img.resize((W-40,img.height*(W-40)//img.width))
    c=Image.new('RGB',(W,60+img.height+20+36*len(lines)+30),'white'); d=ImageDraw.Draw(c); d.text((20,12),title,font=f,fill=BLK); c.paste(img,(20,60)); d.rectangle((19,59,20+img.width,60+img.height),outline=(200,205,212),width=2)
    y=80+img.height
    for l in lines: d.text((20,y),l,font=fc,fill=GREY); y+=36
    return c
j=json.load(open('ev/walkC-S2-16688.json'))['D_regular']['row']
im=Image.open('ev/C-S2-16688-regular.png').convert('RGB'); d=ImageDraw.Draw(im)
d.rectangle((6,j['t']*S-6,1434*S,j['b']*S+6),outline=GRN,width=6)
A=im.crop((0,0,2880,560*2))
P=Image.new('RGB',(1800,10),'white')
out=[panel('BEFORE - Staging build v26.40.19-c850386, 19 October 2026',Image.open('ev/before-19oct.png').convert('RGB'),
   'Search S2-16688, Tech View, first Tab. 1 (red): the keyboard focus was on S2-16688 but the "Brandi Smith" heading covered the row and its focus ring. 2 (green): it only showed after pressing Up then Down.'),
     panel('AFTER - Staging build v26.40.20-9c75418, 20 October 2026, first Tab only',A,
   'Search S2-16688, Tech View, Regular spacing. Green box: after the first Tab the S2-16688 row sits just below the "Brandi Smith" heading, fully visible, with its blue focus ring. No arrow key was pressed.')]
W=1800; c=Image.new('RGB',(W,sum(o.height for o in out)+80),'white'); ImageDraw.Draw(c).text((20,20),'Tech View: the first Tab goes to a work order far down the list',font=fnt(40,True),fill=BLK); y=80
for o in out: c.paste(o,(0,y)); y+=o.height
c.save('sv11422-01-first-tab-before-after.png'); print(c.size)
