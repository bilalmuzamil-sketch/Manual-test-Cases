import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from qa_exhibits import fnt, wrap, RED, GRN, BLK, GREY
from PIL import Image, ImageDraw, ImageOps
def edge(src,side,H):
    im=Image.open(src).convert('RGB'); W=im.width
    x0=0 if side=='L' else W-56
    c=im.crop((x0,int(H*0.35),x0+56,int(H*0.35)+90)).convert('L')
    c=ImageOps.autocontrast(c,cutoff=0) if False else c.point(lambda v: max(0,min(255,int((v-215)*6.4))))  # stretch 215..255 to 0..255
    return c.convert('RGB').resize((56*5,90*5),Image.NEAREST)
def panel(title,img,cap,W=1800):
    f=fnt(32,True); fc=fnt(26); d0=ImageDraw.Draw(Image.new('RGB',(10,10))); lines=wrap(d0,cap,fc,W-40)
    if img.width>W-40: img=img.resize((W-40,img.height*(W-40)//img.width))
    c=Image.new('RGB',(W,60+img.height+20+36*len(lines)+30),'white'); d=ImageDraw.Draw(c); d.text((20,12),title,font=f,fill=BLK); c.paste(img,(20,60)); d.rectangle((19,59,20+img.width,60+img.height),outline=(200,205,212),width=2)
    y=80+img.height
    for l in lines: d.text((20,y),l,font=fc,fill=GREY); y+=36
    return c
def row(*ims,gap=30):
    W=sum(i.width for i in ims)+gap*(len(ims)-1); H=max(i.height for i in ims); c=Image.new('RGB',(W,H),'white'); x=0
    for i in ims: c.paste(i,(x,0)); x+=i.width+gap
    return c
def mark(im,boxes):
    im=im.copy(); d=ImageDraw.Draw(im)
    for (x0,y0,x1,y1,c) in boxes: d.rectangle((x0,y0,x1,y1),outline=c,width=5)
    return im
def stack(title,ps):
    W=max(p.width for p in ps); H=sum(p.height for p in ps)+80; c=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(c); d.text((20,20),title,font=fnt(40,True),fill=BLK); y=80
    for p in ps: c.paste(p,(0,y)); y+=p.height
    return c
Hb=502; Ha=466
B=Image.open('ev/before-19oct-hover.png').convert('RGB'); A=Image.open('ev/same-hover.png').convert('RGB')
# side bands boxed (left/right of card, middle height)
bx=lambda H,W:[(4,int(H*0.3)+40,38,int(H*0.8)+40,RED),(W-38,int(H*0.3)+40,W-4,int(H*0.8)+40,RED)]
Bm=mark(B,[(x0,y0,x1,y1,RED) for (x0,y0,x1,y1,_) in bx(Hb,B.width)]); Am=mark(A,[(x0,y0,x1,y1,GRN) for (x0,y0,x1,y1,_) in bx(Ha,A.width)])
E1=stack('Board View: hovering card S2-17495 (Unassigned column, light theme)',[
 panel('BEFORE - Staging build v26.40.19-31ad1e1, 19 October 2026',row(Bm,edge('ev/before-19oct-hover.png','L',Hb+80),edge('ev/before-19oct-hover.png','R',Hb+80)),
  'Left: the hovered card. The red boxes mark the strips just outside its left and right edges: the shadow shows below the card but nothing shows beside it. Right: those two edges magnified 5x with the contrast raised so the faint shadow is easy to see: the background next to the card stays flat.'),
 panel('AFTER - Staging build v26.40.20-9c75418, 20 October 2026',row(Am,edge('ev/same-hover.png','L',Ha+80),edge('ev/same-hover.png','R',Ha+80)),
  'Left: the same card hovered. The green boxes mark the same strips: a soft shadow now shows on the left and right as well as below. Right: the same 5x magnified, contrast-raised edges: the shadow fades out beside the card on both sides.'),
])
E1.save('sv11541-01-side-shadow-before-after.png')
BLU=(21,101,192)
def pair(rest,hov,cap,title):
    a=Image.open(rest).convert('RGB'); b=Image.open(hov).convert('RGB'); H=a.height
    a=mark(a,[(28,28,a.width-28,H-28,BLU)]); b=mark(b,[(28,28,b.width-28,H-28,GRN)])
    return panel(title,row(a,b),cap)
E2=stack('Staging v26.40.20-9c75418, 20 Oct 2026: at rest (left), hovered (right)',[
 pair('ev/same-rest.png','ev/same-hover.png','Light theme, Unassigned column (S2-17495): blue box: no shadow at rest. Green box: on hover a soft shadow on all sides and a darker border. The card stays the same size and in the same place.','Light theme, Unassigned column'),
 pair('ev/admin-light-regular-tech-col-rest.png','ev/admin-light-regular-tech-col-hover.png','Light theme, a technician column (S2-16176): the same - blue box at rest with no shadow, green box hovered with the shadow and a darker border.','Light theme, technician column'),
 pair('ev/admin-dark-regular-unassigned-1-rest.png','ev/admin-dark-regular-unassigned-1-hover.png','Dark theme, Unassigned column (S2-33692): blue box: no shadow at rest. Green box: on hover a soft dark shadow around the card and a lighter border. The card stays the same size and in the same place.','Dark theme, Unassigned column'),
])
E2.save('sv11541-02-rest-and-hover.png')
for f in ['sv11541-01-side-shadow-before-after.png','sv11541-02-rest-and-hover.png']: print(f,Image.open(f).size)
